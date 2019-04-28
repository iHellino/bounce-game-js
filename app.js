import React, { Component } from 'react';
import Inputs from './inputs';
import { levels, charToObject } from './levels';
import Player from './player';
import GameObject from './gameobject';
import GUI from './gui';

const tileSize = 70;
const width = 21*tileSize;
const height = 12*tileSize;

class App extends Component {

  constructor() {
    super();
    this.system = { time: 0, sec: 0, fps: 0, width: width, height: height };
    this.state = { input: new Inputs(), context: null };
    this.level = { number: 0, stage: 1, obj: [], lastStage: 0 };
    this.player = null;
    this.lives = 2;
    
    this.timer = document.getElementById("time");
    this.gui = null;
  }

  componentDidMount() {
    this.state.input.bindKeys();
    const context = this.refs.canvas.getContext('2d');
    this.gui = new GUI( tileSize );
    this.setState({ context: context });
    this.startGame();
    this.system.time = new Date().getTime();
    requestAnimationFrame(() => { this.update(0); });
  }

  nextStage() {
    if ( this.level.stage < this.level.lastStage ) {
      this.setLevel( this.level.number, this.level.stage + 1, false );
    }
  }

  resetStage() { this.setLevel( this.level.number, this.level.stage, false ); }
  resetLevel() { this.setLevel( this.level.number, 1, true ); }

  setLevel( level, stage, reset ) {
    if ( reset ) {
      this.system.time = new Date().getTime();
      this.lives = 2;
    }
    this.level.number = level;
    this.level.stage = stage;
    this.level.obj = [];
    this.startGame();
  }

  startGame() { 
    let mapStages = levels()[ this.level.number ];
    let map = mapStages[ this.level.stage - 1 ];

    this.level.lastStage = mapStages.length;

    for ( let i = 0; i < map.length; i++ ) {
      for ( let j = 0; j < map[i].length; j++ ) {

        let objSettings = charToObject( map[i][j] );
        let obj = GameObject.initializeObject( objSettings, j, i, tileSize );
        
        if (obj !== null) {
          if (obj instanceof Player) this.player = obj;
          else this.level.obj.push(obj);
        }
      }
    }
  }

  systemUpdate( prevDelta ) {
    let currDelta = new Date().getTime();
    let s = parseInt((currDelta - this.system.time)/100)/10;
    if ( this.system.sec !== parseInt((currDelta - this.system.time)/1000) )
      this.system.fps = parseInt(1000/(currDelta - prevDelta));
    this.timer.innerHTML = "FPS: " + this.system.fps + "<br>Time: " + s;
    this.system.sec = parseInt((currDelta - this.system.time)/1000);
    return currDelta;
  }

  update( prevDelta ) {
    // SYSTEM
    let currDelta = this.systemUpdate( prevDelta );

    // GET KEYS
    const keys = this.state.input.keys;

    // GUI
    this.gui.unset();

    if ( this.level.number < 1 ) {
      this.state.input.guiIntro( this );
      this.gui.set('1');
    }
    else {
      if ( keys.escape ) this.setLevel(0,1,true);
    }

    // WIN - LOSE CONTROL
    if ( this.player.winner ) { 
      if ( this.level.stage === this.level.lastStage ) {
        this.gui.set('2');

      }
      else this.nextStage(); 
    }

    if ( !this.player.live ) {
      if ( this.lives > 0 ) { this.lives -= 1; this.resetStage(); }
      else { this.gui.set('3'); this.state.input.guiDead( this ); }
    }

    // CLEAR
    this.state.context.clearRect(0, 0, this.system.width, this.system.height);

    // UPDATE AND DRAW - PLAYER
    if ( this.player !== null ) {
      this.state.input.playerMove( this.player );
      this.player.update( this.level.obj );
      this.player.render( this.state );
    }

    // DRAW - GAME OBJECTS
    for ( let i = 0; i < this.level.obj.length; i++ ) {
      this.level.obj[i].render( this.state );
    }

    // DRAW - GUI
    this.gui.render( this.state.context );

    // UPDATE
    requestAnimationFrame(() => { this.update( currDelta ); });
  }  

  render() {
    return (
      <div className="App">
        <canvas ref="canvas" style={{width:"90%", maxWidth:"1260px", maxHeight:"720px"}}
          width={ this.system.width }
          height={ this.system.height }
        />
      </div>
    );
  }
}

export default App;

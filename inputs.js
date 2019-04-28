const KEY = { LEFT:  37, RIGHT: 39, UP: 38, SPACE: 32, ENTER: 13, ESC: 27 };

export default class Inputs {
    constructor() {
        this.keys = {};
    }

    handleKeys(value, e){
        switch (e.keyCode) {
            case KEY.LEFT: this.keys.left = value; break;
            case KEY.RIGHT: this.keys.right = value; break;
            case KEY.UP: case KEY.SPACE: this.keys.jump = value; break;
            case KEY.ENTER: this.keys.enter = value; break;
            case KEY.ESC: this.keys.escape = value; break;
            default: break;
        }
    }

    bindKeys() {
        window.addEventListener('keyup',   this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
    }

    unbindKeys() {
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
    }

    playerMove( player ) {
		if ( !player.live || player.winner ) return;

		if ( this.keys.right && player.speed < 10 ) player.speed += 1;
		else if ( player.speed > 0 ) player.speed -= 1;

		if ( this.keys.left && player.speed > -10 ) player.speed -= 1;
		else if ( player.speed < 0 ) player.speed += 1;

		if ( this.keys.jump && !player.jumpLock && player.stay ) {
			player.fall = 20;
			player.jumpLock = true;
		}
    }

    guiIntro( app ) {
        if ( this.keys.enter ) { app.setLevel(1,1,true); }
    }

    guiDead( app ) {
        if ( this.keys.enter ) { app.resetLevel(); }
    }
}
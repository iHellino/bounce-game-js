import GameObject from './gameobject';

export default class Player extends GameObject {
	constructor(args) {
		super({ ...args });

		this.jumpLock = false;
		this.stay = false;
		this.live = true;
		this.winner = false;

		this.imageDead = new Image();
		this.imageDead.src = "https://raw.githubusercontent.com/ihellino/bounce-game-js/master/img/" + 'game_ball_pop.png';
	}

	update( gameObjects ) {
		this.x = this.position.x / this.tileSize;
		this.y = this.position.y / this.tileSize;

		this.stay = false;
		for (let i = 0; i < gameObjects.length; i++) {
			let item = gameObjects[i];
			this.collisionsControl( item );
		}

		if ( this.live ){
			this.position.x += this.speed;

			this.position.x = parseInt(this.position.x);
			this.position.y = parseInt(this.position.y); 

			if ( this.fall >= -20 && (!this.stay || this.fall > 0) ) {
				this.position.y -= this.fall;
				if ( this.fall > -20 ) this.fall -= 1 ;
			}

			if ( this.stay && this.jumpLock ){
				this.jumpLock = false;
				this.fall = 0;
			}
		}
	}

	collisionsControl( i ) {
		if ( i.type === '#' ) { this.barrier(i, 1, 1, 1, 1); }

		if ( i.type === 'a' ) { this.pop(i, 1, 1, 1, 1); }
		if ( i.type === 'u' ) { this.barrier(i, 1, 1, 0, 1); this.pop(i, 0, 0, 1, 0); }
		if ( i.type === 'r' ) { this.barrier(i, 1, 1, 1, 0); this.pop(i, 0, 0, 0, 1); }
		if ( i.type === 'd' ) { this.barrier(i, 0, 1, 1, 1); this.pop(i, 1, 0, 0, 0); }
		if ( i.type === 'l' ) { this.barrier(i, 1, 0, 1, 1); this.pop(i, 0, 1, 0, 0); }
		
		if ( i.type === '!' ) { this.barrier(i, 1, 1, 0, 1); this.pump( i ); }

		if ( i.type === '0' ) { this.win(i, 0, 0, 1, 0); }

		if ( i.type === '1' ) { this.win(i, 0, 0, 0, 1); }
		if ( i.type === '2' ) { this.win(i, 0, 0, 1, 0); }
		if ( i.type === '3' ) { this.win(i, 0, 1, 0, 0); }

		if ( i.type === '4' ) { this.barrier(i, 1, 1, 1, 1); }
		if ( i.type === '5' ) { this.barrier(i, 1, 1, 1, 1); }
		if ( i.type === '6' ) { this.barrier(i, 1, 1, 1, 1); }
	}

	barrier( item, up, right, down, left ) {
		if ( up && this.collisionYU(item) ) { this.fall *= -1; }
		if ( right && this.collisionXR(item) ) { this.speed = 0; this.position.x = (parseInt(this.x) * this.tileSize) + 0; }
		if ( down && this.collisionYD(item) ) { this.position.y = parseInt(this.y) * this.tileSize; this.stay = true; }
		if ( left && this.collisionXL(item) ) { this.speed = 0; this.position.x = ((parseInt(this.x)+1) * this.tileSize) - 0; }
	}

	pop( item, up, right, down, left ) {
		if ( up && this.collisionYU(item) ) this.dead();
		if ( right && this.collisionXR(item) ) this.dead();
		if ( down && this.collisionYD(item) ) this.dead();
		if ( left && this.collisionXL(item) ) this.dead();
	}
	
	win( item, up, right, down, left ) {
		if ( up && this.collisionYU(item) ) this.winner = true;
		if ( right && this.collisionXR(item) ) this.winner = true;
		if ( down && this.collisionYD(item) ) this.winner = true;
		if ( left && this.collisionXL(item) ) this.winner = true;
	}

	pump( item ) { if ( this.collisionYD(item) ) this.fall = 24; this.jumpLock = true; }
	dead() { this.live = false; this.image = this.imageDead; }


}
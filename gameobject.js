export default class GameObject {
	constructor(args){
		this.position = args.position;
		this.type = args.type;
		this.tileSize = args.tileSize;

		this.speed = 0;
		this.fall = 0;

		this.x = args.x;
		this.y = args.y;

		this.image = new Image();
		this.image.src = "https://raw.githubusercontent.com/ihellino/bounce-game/master/public/img/" + args.imgName;
	}

	static initializeObject(objSettings, row, col, tileSize ) {
		if (objSettings.object !== null) {			
		  let posX = row * tileSize;
		  let posY = col * tileSize;
	
		  let newObj = new objSettings.object({
			x: row, y: col, type: objSettings.type, 
			position: { x: posX, y: posY }, imgName: objSettings.imgName, tileSize: tileSize
		  })
		  return newObj;
		  
		}
		return null;
	}

	collisionX ( item ) { return item.x === Math.round(this.x); }
	collisionY ( item ) { return item.y === Math.round(this.y); }
	collisionXL( item ) { return ( this.collisionY(item) && parseInt(this.x) === item.x ); }
	collisionXR( item ) { return ( this.collisionY(item) && parseInt(this.x + 0.99) === item.x ); }
	collisionYD( item ) { return ( this.collisionX(item) && this.fall <= 0 && parseInt(this.y + 1) === item.y ); }
	collisionYU( item ) { return ( this.collisionX(item) && this.fall > 0 && parseInt(this.y) === item.y ); }

	render(state) {
		state.context.drawImage(this.image, this.position.x, this.position.y, this.tileSize, this.tileSize);
	}
}
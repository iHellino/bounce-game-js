export default class GUI {
	constructor( tileSize ){
        this.arr = {};
        this.selected = null;
        this.tileSize = tileSize;
        this.setArr();
    }

    unset() { this.selected = null; }
    set( id ) { this.selected = this.arr[ id ]; }

    setArr() {  
        this.arr = {
            '1' : { img: this.loadImage('gui_intro.png'), col: 1, row: 1, colSize: 17, rowSize: 10 },
            '2' : { img: this.loadImage('gui_win.png'), col: 6, row: 3, colSize: 9, rowSize: 6 },
            '3' : { img: this.loadImage('gui_dead.png'), col: 6, row: 3, colSize: 9, rowSize: 6 }
        };
    }

    loadImage( img ) {
        let image = new Image();
        image.src = "https://raw.githubusercontent.com/ihellino/bounce-game/master/public/gui/" + img;
        return image;
    }

	render( context ) {
        if ( this.selected !== null ) {
            context.drawImage( 
                this.selected.img, 
                this.selected.col * this.tileSize, 
                this.selected.row * this.tileSize, 
                this.selected.colSize * this.tileSize, 
                this.selected.rowSize * this.tileSize
            );
        }
	}
}
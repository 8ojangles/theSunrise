var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
var randI = require('./mathUtils.js').mathUtils.randomInteger;
var rand = require('./mathUtils.js').mathUtils.random;

let theStars = {

	starsArr: [],

	config: {
		count: 3000
	},

	renderConfig: {
		canvas: null,
		ctx: null,
		x: 0,
		y: 0,
		w: 0,
		h: 0
	},

	getCanvas: function( canvas, ctx ) {
		let renderCfg = this.renderConfig;
		renderCfg.canvas = canvas;
		renderCfg.ctx = ctx;

		renderCfg.w = canvas.width;
		renderCfg.h = canvas.height;

	},

	setInitialConfig: function( sunCfg ) {

		let sunConfig = sunCfg;
		this.config.arcRadius = sunConfig.pivotPoint.r;
		this.config.totalClock = sunConfig.orbitTime;
		this.config.alphaClock = sunConfig.orbitClock;

		let tClock = this.config.totalClock;
		let tClockQ = tClock / 4;
		let tClockH = tClock / 2;

		this.config.alphaInterval = 1 / tClockQ;
		this.config.globalAlpha = 0;

		let aClock = this.config.alphaClock;
		let aInt = this.config.alphaInterval;

		if ( aClock < tClockQ ) {
			this.config.globalAlpha = aClock * aInt ;
		} else {

			if ( aClock < tClockH ) {
				this.config.globalAlpha = 1 - ( ( aClock - tClockQ ) * aInt ) ;
			} else {
				this.config.globalAlpha = 1
			}

		}


		this.config.pivot = {
			x: sunConfig.pivotPoint.x,
			y: sunConfig.pivotPoint.y,
			rVel: sunConfig.rVel
		}

		this.config.resetA = trig.angle( this.config.pivot.x, this.config.pivot.y, 0, this.renderConfig.h );
		console.log( 'this.config.resetA: ', this.config.resetA );
		console.log( 'this.config.pivot: ', this.config.pivot );
	},

	updateAlpha: function() {

		let tClock = this.config.totalClock;
		let tClockQ = tClock / 4;
		let tClockH = tClock / 2;
		let aClock = this.config.alphaClock;
		let aInt = this.config.alphaInterval;
		let gAlpha = this.config.globalAlpha;
		if ( aClock < tClockQ ) {

			if ( this.config.globalAlpha < 1 ) {
				this.config.globalAlpha += aInt;
			} else {
				this.config.globalAlpha = 1;
			}
			
		} else {

			if ( aClock < tClockH ) {

				if ( this.config.globalAlpha > aInt ) {
					this.config.globalAlpha -= aInt;
				} else {
					this.config.globalAlpha = 0;
				}

			} else {
				if ( aClock > tClockH ) {
					this.config.globalAlpha = 0;
				}
			}
			
		}

		if ( aClock === tClock ) {
			this.config.alphaClock = 0;
		} else {
			this.config.alphaClock++;
		}

	},

	populateArray: function() {

		let thisCount = this.config.count;
		let thisCanvas = this.renderConfig;
		let halfStageW =  thisCanvas.w / 2;
		let halfStageH =  thisCanvas.h / 2;
		let groupPivot = this.config.pivot;

		let distMax = trig.dist( 0, 0, groupPivot.x, groupPivot.y );
		let distMin = trig.dist( ( thisCanvas.w /2 ), thisCanvas.h, groupPivot.x, groupPivot.y );

		for (var i = thisCount - 1; i >= 0; i--) {

			let randPosition = trig.radialDistribution( groupPivot.x, groupPivot.y, randI( distMin, distMax ), rand( 0, Math.PI * 2) );		

			let randSize = randI( 0, 10 );

			let star = {
				x: randPosition.x,
				y: randPosition.y,
				r: randSize > 8 ? rand( 0.3, 3 ) : rand( 0.1, 1.5 ),
				color: {
					r: 255, g: 255, b: 255, a: 1
				}
			}

			star.d = trig.dist( star.x, star.y, this.config.pivot.x, this.config.pivot.y );
			star.a = trig.angle( star.x, star.y, this.config.pivot.x, this.config.pivot.y );
		
			this.starsArr.push( star );
		}

	},

	checkBounds: function( star ) {
		if ( star.x - star.r > this.renderConfig.w ) {
			return true;
		} else {
			return false;
		}
		
	},

	checkRenderBounds: function( star ) {
		if ( star.x - star.r > 0 ) {
			if ( star.x - star.r < this.renderConfig.w ) {
				if ( star.y - star.r > 0 ) {
					if ( star.y - star.r < this.renderConfig.h ) {
						return true;
					}
				}
			}
		}
		return false;
	},

	resetPosition: function( star ) {
		star.a = this.config.resetA;
	},

	render: function( star ) {

		c = this.renderConfig.ctx;
		c.globalAlpha = this.config.globalAlpha;
		c.fillStyle = 'white';
		c.fillCircle( star.x, star.y, star.r );
		c.globalAlpha = 1;
	},

	update: function() {

		let thisCount = this.config.count;
		let groupPivot = this.config.pivot;

		for ( let i = thisCount - 1; i >= 0; i-- ) {

			let star = this.starsArr[ i ];

			if( this.checkRenderBounds( star ) === true ) {
				this.render( star );
			}

			let newPos = trig.radialDistribution( groupPivot.x, groupPivot.y, star.d, star.a );
			

			star.x = newPos.x;
			star.y = newPos.y;

			star.a += groupPivot.rVel;

			// if( this.checkBounds( star ) === true ) {
			// 	this.resetPosition( star );
			// }

		}

		this.updateAlpha();

	}


}


module.exports = theStars;
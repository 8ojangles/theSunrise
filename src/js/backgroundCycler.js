let backgrounds = require( './backgrounds.js' );
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let backgroundData = {
	params: {},
	bgDataSet: []
};

function createBackgroundDataset() {

	backgroundData.params.len = backgrounds.length;

	for (var i = 0; i < backgroundData.params.len; i++) {
		let thisBg = backgrounds[ i ];
		backgroundData.bgDataSet.push( { len: thisBg.length } );
	}

};
createBackgroundDataset();


let backgroundCycler = {
	bgData: backgroundData,
	backgrounds: backgrounds,
	orbitCentreX: 0,
	orbitCentreY: 0,
	orbitRadius: 0,
	cycleData: {
		totalTime: 0,
		phaseTime: 0,
		remainingTime: 0,
		phaseClock: 0,
		phaseInterval: 0,
		alphaInterval: 0,
		currAlpha: 0,
		currUnderBg: 0,
		currOverBg: 0
	},
	renderParams: {},
	

	getRenderCanvas: function( canvas, context, orbitCoordinates ) {
		this.renderParams.canvas = canvas;
		this.renderParams.ctx = context;
		this.orbitCentreX = orbitCoordinates.x;
		this.orbitCentreY = orbitCoordinates.y;
		this.orbitCentreR = orbitCoordinates.r;
	},

	getCycleTime: function( cycleTime ) {
		this.cycleData.totalTime = cycleTime;
		this.cycleData.phaseTime = Math.floor( cycleTime / this.bgData.params.len );
		this.cycleData.remainingTime = cycleTime - ( this.cycleData.phaseTime * this.bgData.params.len  );
		this.cycleData.alphaInterval = 1 / this.cycleData.phaseTime;
	},


	setInitialState: function( curr ) {

		let currPhase = Math.floor( curr / this.cycleData.phaseTime );
		let phaseRemainder = curr - ( currPhase * this.cycleData.phaseTime );
		let tempCurrPhase = currPhase - 6 < 0 ? this.bgData.params.len + ( currPhase - 6 ) : currPhase - 6;
		this.cycleData.currUnderBg = tempCurrPhase === 0 ? this.bgData.params.len - 1 : tempCurrPhase - 1;
		this.cycleData.currOverBg = tempCurrPhase;
		this.cycleData.phaseClock = phaseRemainder;
		this.cycleData.phaseInterval = ( this.cycleData.totalTime / this.bgData.params.len  ) / this.cycleData.phaseTime;

	},
	
	resetCurrAlpha: function() {
		this.cycleData.currAlpha = 0;
	},
	
	updateCurrAlpha: function() {
		this.cycleData.currAlpha += this.cycleData.alphaInterval;
	},

	updatePhaseClock: function() {
		if ( this.cycleData.phaseClock > this.cycleData.phaseInterval ) {
			this.cycleData.phaseClock -= this.cycleData.phaseInterval;
			this.updateCurrAlpha();
		} else {

			this.cycleData.phaseClock = this.cycleData.phaseTime;
			this.updateBg();
			this.resetCurrAlpha();
		}
		// this.updateRemainingTime();
	},

	updateRemainingTime: function(){

		if ( this.cycleData.remainingTime === 0 ) {
			this.cycleData.remainingTime = this.cycleData.totalTime;
		} else {
			if ( this.cycleData.remainingTime >= this.cycleData.phaseTime ) {
				this.cycleData.remainingTime -= this.cycleData.phaseTime;
			}
		}

	},

	updateBg: function() {

		if ( this.cycleData.currUnderBg === this.bgData.params.len - 1 ) {
			this.cycleData.currUnderBg = 0;
		} else {
			this.cycleData.currUnderBg += 1;
		}

		if ( this.cycleData.currOverBg === this.bgData.params.len - 1 ) {
			this.cycleData.currOverBg = 0;
		} else {
			this.cycleData.currOverBg += 1;
		}

		if ( this.cycleData.currOverBg === this.bgData.params.len - 1 ) {
			this.cycleData.phaseClock = this.cycleData.phaseTime + this.cycleData.remainingTime;
		}
		// console.log( 'this.cycleData.phaseClock: ', this.cycleData.phaseClock );

	},

    render: function( sun ) {

        let c = this.renderParams.ctx;
        let canvas = this.renderParams.canvas;
        let currUnderBg = this.backgrounds[ this.cycleData.currUnderBg ];
        let currUnderBgData = this.bgData.bgDataSet[ this.cycleData.currUnderBg ].len;
        let currOverBg = this.backgrounds[ this.cycleData.currOverBg ];
        let currOverBgData = this.bgData.bgDataSet[ this.cycleData.currOverBg ].len;
        let radialDist = trig.dist( sun.x, sun.y, this.orbitCentreX, this.orbitCentreY ) * 2.5;

        c.globalCompositeOperation = 'source-over';
        c.globalAlpha = 1;

        // let underGradient = c.createLinearGradient(0, 0, 0, canvas.height );
        let underGradient = c.createRadialGradient( sun.x, sun.y, radialDist, sun.x, sun.y, 0 );

        // for (var i = 0; i < currUnderBgData; i++) {
        // 	underGradient.addColorStop( currUnderBg[ i ].pos, currUnderBg[ i ].colour );
        // }
        for (let i = currUnderBgData - 1; i >= 0; i--) {
        	underGradient.addColorStop( currUnderBg[ i ].pos, currUnderBg[ i ].colour );
        }

        c.fillStyle = underGradient;
        c.fillRect( 0, 0, canvas.width, canvas.height );

        c.globalAlpha = this.cycleData.currAlpha;

        // let overGradient = c.createLinearGradient(0, 0, 0, canvas.height );
        let overGradient = c.createRadialGradient( sun.x, sun.y, radialDist, sun.x, sun.y, 0 );
        // for (var i = 0; i < currOverBgData; i++) {
        // 	overGradient.addColorStop( currOverBg[ i ].pos, currOverBg[ i ].colour );
        // }
        for (let i = currOverBgData - 1; i >= 0; i--) {
        	overGradient.addColorStop( currOverBg[ i ].pos, currOverBg[ i ].colour );
        }
        c.fillStyle = overGradient;
        c.fillRect( 0, 0, canvas.width, canvas.height );

        c.globalAlpha = 1;
        let currBgHour = this.cycleData.currUnderBg - 1;
        let currHour = this.cycleData.currUnderBg > 12 ? true : false;
        let hourText = ( ( currHour === true ? currBgHour - 12 : currBgHour ) + 1) + ( currHour === true ? 'pm' : 'am' ); 

        c.fillStyle = 'red';
        c.font = '20px Tahoma';
        c.fillText( hourText, 100, 300 );


    
    },

    init: function( canvas, context, cycleTime, currPos, orbitData ) {
    	this.getRenderCanvas( canvas, context, orbitData );
    	this.getCycleTime( cycleTime );
    	this.setInitialState( currPos );
    }



}

module.exports = backgroundCycler;
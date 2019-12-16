// dependencies
// SP
// FIL15338+@

// NPM
    var LinkedList = require('dbly-linked-list');
    var objectPath = require("object-path");

// Custom Requires
    var mathUtils = require('./mathUtils.js').mathUtils;
    var trig = require('./trigonomicUtils.js').trigonomicUtils;
    require('./canvasApiAugmentation.js');
    var coloring = require('./colorUtils.js').colorUtils;
    var easing = require('./easing.js').easingEquations;
    var animation = require('./animation.js').animation;
    var debugConfig = require('./debugUtils.js');
    var debug = debugConfig.debug;
    var lastCalledTime = debugConfig.lastCalledTime;
    var environment = require('./environment.js').environment;
    var physics = environment.forces;
    var runtimeEngine = environment.runtimeEngine;
    
    require('./gears.js');
    
    var overlayCfg = require('./overlay.js').overlayCfg;

    var sunCorona = require('./sunCorona.js');
    var sunSpikes = require('./sunSpikes.js');
    var lensFlare = require('./lensFlare.js');
    var sineWave = require('./sineWaveModulator.js').sineWave;
    var proportionalMeasures = require('./proportionalMeasures.js');
    var bgCycler = require('./backgroundCycler.js');
    var theStars = require('./theStars.js');
    // var muscleModifier = require('./muscleModifier.js').muscleModifier;
    // var seq = require('./sequencer.js');
    // var seqList = seq.seqList;
    // var trackPlayer = require('./trackPlayer.js');

// base variables
    var mouseX = 0, 
        mouseY = 0, 
        lastMouseX = 0, 
        lastMouseY = 0, 
        frameRate = 60, 
        lastUpdate = Date.now(),
        mouseDown = false,
        runtime = 0,
        pLive = 0,
        globalClock = 0,
        counter = 0,
        displayOverlay = false;

// create window load function, initialise mouse tracking
    function init() {
        
        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
        window.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseUp()  ;});
        window.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
        
        // if(typeof window.setup == 'function') window.setup();
        // cjsloop();  
        
    }

    // window load function
    // includes mouse tracking
    window.addEventListener('load',init);

// static asset canvases
let staticAssetCanvas = document.createElement('canvas');
let staticAssetCtx = staticAssetCanvas.getContext("2d");
staticAssetCanvas.width = window.innerWidth * 2;
staticAssetCanvas.height = window.innerHeight * 2;

var staticAssetConfigs = {};
var imageAssetConfigs = {};

let secondaryStaticAssetCanvas = document.createElement('canvas');
let secondaryStaticAssetCtx = secondaryStaticAssetCanvas.getContext("2d");
secondaryStaticAssetCanvas.width = window.innerWidth * 2;
secondaryStaticAssetCanvas.height = window.innerHeight * 2;

let flareAssetCanvas = document.createElement('canvas');
let flareAssetCtx = flareAssetCanvas.getContext("2d");
flareAssetCanvas.width = window.innerWidth * 2;
flareAssetCanvas.height = window.innerHeight * 2;
flareAssetCanvas.id = 'flareAssetCanvas';

let bgGlareCanvas = document.createElement('canvas');
let bgGlareCtx = bgGlareCanvas.getContext("2d");
bgGlareCanvas.width = window.innerWidth;
bgGlareCanvas.height = window.innerHeight;

let lensFlareCanvas = document.createElement('canvas');
let lensFlareCtx = lensFlareCanvas.getContext("2d");



// standard canvas rendering
// canvas housekeeping

//// Screen Renderers

// face layer
var canvas = document.querySelector("#face-layer");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";

var flareLayer = document.querySelector("#flare-layer");
var flareLayerCtx = canvas.getContext("2d");

var coronaLayer = document.querySelector("#corona-layer");
var coronaLayerCtx = canvas.getContext("2d");


// cache canvas w/h
var canW = window.innerWidth;
var canH = window.innerHeight;
var canvasCentreH = canW / 2;
var canvasCentreV = canH / 2;

// set canvases to full-screen
canvas.width = canW;
canvas.height = canH;
flareLayer.width = canW;
flareLayer.height = canH;
coronaLayer.width = canW;
coronaLayer.height = canH;


// set base canvas config
var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};


// set buffer config for use in constrained canvas clear region
var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0
};

// set aperture sides fpor light effects across animation
let apertureSides = 6;

// set base config for sun
var theSun = {
    colours: {
        base: {
            red: '#aa0000',
            orange: '#FF9C0D',
            yellow: '#bbbb00',
            white: '#FFFFFF',
            whiteShadow: '#DDDDFF'
        },
        rgb: {
            orange: '255, 156, 13',
            whiteShadow: {
                r: 221,
                g: 221,
                b: 255
            }
        },
        rgba: {
            orangeShadow: 'rgba( 255, 156, 13, 0.3 )',
            orangeShadowLight: 'rgba( 255, 156, 13, 0.2 )',
            orangeShadowLightest: 'rgba( 255, 156, 13, 0.1 )',
            orangeShadowDarkLip: 'rgba( 255, 156, 13, 0.4 )',
            orangeShadowDark: 'rgba( 255, 156, 13, 1 )'
        },
        debug: {
            points: '#00aa00',
            handles: '#0000aa',
            lines: '#0055ff',
            orange: 'rgb( 255, 156, 13, 0.2 )',
            dimmed: 'rgba( 255, 150, 40, 0.2 )',
            fills: 'rgba( 255, 150, 40, 0.2 )',
            fillsTeeth: 'rgba( 255, 255, 255, 0.1 )'
        }
    },
    debug: {
        pointR: 4,
        handleR: 2
    },
    r: 30,
    x: 300,
    y: 850,
    rVel: 0,
    a: Math.PI / 1.2,
    fullRotation: Math.PI * 2,
    orbitSeconds: 30,
    orbitTime: 0,
    orbitClock: 0,
    localRotation: 0,
    lens: {},
    lensFlareOpacity: 0,
    lensFlareOpacityInterval: 0.02,
    indicatorParams: {
        r: 100,
        x: 150,
        y: 150
    },
    pivotPoint: {
        hMultiplier: 0.5,
        vMultiplier: 1
    },
    isVisible: false,

    getCanvasDimentions: function( canvas ) {

        this.canvas = {
            w: canvas.width,
            h: canvas.height,
            centreH: canvas.width / 2,
            centreV: canvas.height / 2
        }

        this.lens.radius = this.canvas.centreH;
        this.lens.maxD = trig.dist( 0, 0, this.canvas.w * 3, this.canvas.h * 3 );
        this.lens.sunLensIntersectingFlag = false;
        this.lens.currIntersectDist = 0;
        this.lens.currOverlap = 0;
        this.lens.currOverlapScale = 0;
        this.lens.sunLensTangentDist = 0;

    },

    calculateSunLensIntersectDist: function() {
        // console.log( 'this.x: ', this.x );
        // console.log( 'this.Y: ', this.Y );
        // console.log( 'this.x: ', this.x );
        // console.log( 'this.x: ', this.x );


        this.lens.currIntersectDist = trig.dist( this.x, this.y, this.canvas.centreH, this.canvas.centreV );
        if ( this.lens.currIntersectDist < this.r + this.lens.radius ) {
            this.lens.sunLensIntersectingFlag = true;
            this.lens.currOverlap = ( this.r + this.lens.radius ) - this.lens.currIntersectDist;
            if( this.lens.currOverlap >= 0 && this.lens.currOverlap < this.r ) {
                this.lens.currOverlapScale = this.lens.currOverlap / this.r;
            }

        } else {
            this.lens.sunLensIntersectingFlag = false;
        }

    },

    setInternalCoordinates: function() {

        let canvas = this.canvas;
        let pivot = this.pivotPoint;

        pivot.x = canvas.w * pivot.hMultiplier;
        pivot.y = canvas.h * pivot.vMultiplier;
        pivot.r = trig.dist( canvas.w / 3, canvas.h / 3, pivot.x, pivot.y );
        this.sunToStageCentreAngle = trig.angle( this.x, this.y, canvas.centreH, canvas.centreV );
        this.orbitTime = this.orbitSeconds * 60;
        this.orbitClock = Math.round( ( this.a / this.fullRotation ) * this.orbitTime );
        this.rVel = this.fullRotation / this.orbitTime;



    },

    setSunToStageCentreAngle: function() {

        let canvas = this.canvas;
        this.sunToStageCentreAngle = trig.angle( this.x, this.y, canvas.centreH, canvas.centreV );
    },

    updatePosition: function() {

        let pivot = this.pivotPoint;
        let newPos = trig.radialDistribution( pivot.x, pivot.y, pivot.r, this.a );
        this.localRotation = trig.angle( this.x, this.y, this.canvas.centreH, this.canvas.centreV );
        this.x = newPos.x;
        this.y = newPos.y;
        this.isVisible = this.checkIfVisible();
        this.a += this.rVel;
        this.calculateSunLensIntersectDist();

        if ( this.orbitClock < this.orbitTime ) {
            this.orbitClock++;
        } else {
            this.orbitClock = 0;
        }
    },

    checkIfVisible: function() {
        let isVisible = false;

        if ( this.x + this.r > 0 ) {
            if ( this.x - this.r < this.canvas.w ) {
                if ( this.y + this.r > 0 ) {
                    if ( this.y - this.r < this.canvas.h ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    indicatorCoordinates: {
        spokes: []
    },

    setindicatorCoordinates: function(){

        let self = this;
        let indParam = self.indicatorParams;
        let num = 24;

        let segment = ( Math.PI * 2 ) / num;
        let txtCounter = 18;
        for ( let i = 0; i < num; i++ ) {

            let startMultiplier = i % 6 === 0 ? 1.25 : 1.1;

            let startPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r / startMultiplier, segment * i );
            let endPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r, segment * i );

            let txtPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r * 1.2, segment * i );

            this.indicatorCoordinates.spokes.push(
                { start: startPoint, end: endPoint, txt: txtPoint, t: txtCounter }
            );

            if ( txtCounter === 23 ) {
                txtCounter = 0;
            } else {
                txtCounter++;
            }

        }

    },

    indicator: function( ctx ) {
        
        let self = this;
        let indParam = self.indicatorParams;
        let indicator = trig.radialDistribution( indParam.x, indParam.y, indParam.r, self.a );
        let indCoords = self.indicatorCoordinates;
        // console.log( 'indParam: ', indParam );
        ctx.fillStyle = 'red';
        
        ctx.lineWidth = 1;

        ctx.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';

        ctx.globalCompositeOperation = 'source-over';

        ctx.strokeStyle = 'rgba( 255, 0, 0, 0.2)';
        ctx.setLineDash( [] );
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.font = '16px Tahoma';

        for (var i = 0; i < 24; i++) {
            let thisSpoke = indCoords.spokes[ i ];
            ctx.beginPath();
            ctx.moveTo( thisSpoke.start.x, thisSpoke.start.y );
            ctx.lineTo( thisSpoke.end.x, thisSpoke.end.y );
            ctx.closePath();
            ctx.stroke();

            ctx.fillText( thisSpoke.t, thisSpoke.txt.x, thisSpoke.txt.y );
        }

        
        ctx.strokeStyle = 'red';

        ctx.strokeCircle( indParam.x, indParam.y, indParam.r );

        ctx.beginPath();
        ctx.moveTo( indParam.x, indParam.y );
        ctx.lineTo( indicator.x, indicator.y );
        ctx.closePath();
        ctx.stroke();

        ctx.fillCircle( indParam.x, indParam.y, 5 );
        ctx.fillCircle( indicator.x, indicator.y, 10 );

        ctx.strokeCircle( self.pivotPoint.x, self.pivotPoint.y, self.pivotPoint.r );

        ctx.fillStyle = 'red';
        ctx.font = '20px Tahoma';

        ctx.fillText( this.orbitClock+' / '+this.orbitTime, 100, 330 );

    },

    render: function() {

        var coronaGradient = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 2 );
            coronaGradient.addColorStop(0, "rgba( 255, 255, 180, 1 )");
            coronaGradient.addColorStop(0.3, "rgba( 255, 255, 180, 0.5 )");
            coronaGradient.addColorStop(1, "rgba( 255, 255, 180, 0 )");


        var coronaGradient2 = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 10 );
            coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
            coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

        var coronaGradient3 = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 5 );
            coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
            coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );
        
        if ( !overlayCfg.displayGlareSpikes ) {
            
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = coronaGradient2;
            ctx.fillCircle( this.x, this.y, this.r * 10 );
            
            ctx.fillStyle = coronaGradient3;
            ctx.fillCircle( this.x, this.y, this.r * 5 );

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = coronaGradient;
            ctx.fillCircle( this.x, this.y, this.r * 3 );


            ctx.translate( this.x, this.y );
            
            ctx.rotate( this.localRotation );
            ctx.globalCompositeOperation = 'lighter';
            sunSpikes.displayCorona( { xPos: 0, yPos: 0 } );

            // ctx.globalCompositeOperation = 'source-over';
            // ctx.globalCompositeOperation = 'lighten';
            var renderFlares = sunSpikes.displayCfg.flares;
            ctx.drawImage(
                sunSpikes.flareOptions.canvas,
                renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
                -(renderFlares.w / 2 ), -(renderFlares.h / 2 ), renderFlares.w, renderFlares.h
            );

            ctx.rotate( -this.localRotation );
            ctx.translate( -this.x, -this.y );

            // drawFeatures();
            if ( this.isVisible === true ) {
                if ( this.lensFlareOpacity < 1 ) {
                    this.lensFlareOpacity += this.lensFlareOpacityInterval;
                } else {
                    this.lensFlareOpacity = 1;
                }
            }

            if ( this.isVisible === false ) {
                if ( this.lensFlareOpacity > this.lensFlareOpacityInterval ) {
                    this.lensFlareOpacity -= this.lensFlareOpacityInterval;
                } else {
                    this.lensFlareOpacity = 0;
                }
            }
            // console.log( 'this.lensFlareOpacity: ', this.lensFlareOpacity );
            ctx.globalAlpha = this.lensFlareOpacity;

            lensFlare.setDisplayProps( theSun );
            lensFlare.displayFlares(  trig.dist( canvas.w / 2, canvas.h / 2, this.x, this.y ) );

            ctx.globalAlpha = 1;

            rainbowDot.render( this.x, this.y, this.lens, this.isVisible );

        }

    },

    init: function( canvas ) {
        this.getCanvasDimentions( canvas );
        this.setInternalCoordinates();
        this.setindicatorCoordinates();
        // sineWave.getClock( this.orbitTime, this.orbitClock );
    }
}

theSun.init( canvas );

bgCycler.init( canvas, ctx, theSun.orbitTime, theSun.orbitClock, theSun.pivotPoint );

theStars.getCanvas( canvas, ctx );
theStars.setInitialConfig( theSun );
theStars.populateArray();

let distToStageCentre = trig.dist( theSun.x, theSun.y, canvasCentreH, canvasCentreV );

function faceToStageCentreDebugLine( ctx ) {
    let currStroke = ctx.strokeStyle;
    let currFill = ctx.fillStyle;

    ctx.strokeStyle = 'rgba( 150, 150, 150, 0.6 )';
    ctx.fillStyle = 'rgba( 150, 150, 150, 1 )';

    ctx.translate( theSun.x, theSun.y );
    ctx.rotate( theSun.sunToStageCentreAngle );

    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( distToStageCentre, 0 );
    ctx.setLineDash( [5, 6] );
    ctx.stroke();
    ctx.setLineDash( [] );

    ctx.fillCircle( 0, 0, 5 );
    ctx.fillCircle( distToStageCentre, 0, 5 );

    ctx.rotate( -theSun.sunToStageCentreAngle );
    ctx.translate( -theSun.x, -theSun.y );

    let sunCtrTxt = 'Sun Centre X: '+theSun.x+' / Y: '+theSun.y;
    let stageCtrTxt = 'Stage Centre X: '+canvasCentreH+' / Y: '+canvasCentreV;

    ctx.fillText( sunCtrTxt, theSun.x + 20, theSun.y );
    ctx.fillText( stageCtrTxt, canvasCentreH + 20, canvasCentreV );

    ctx.strokeStyle = currStroke;
    ctx.fillStyle = currFill;
}

lensFlare.flareInit(
    { canvas: lensFlareCanvas, ctx: lensFlareCtx },
    { canvas: flareLayer, ctx: flareLayerCtx },
    { aperture: apertureSides }
);

lensFlare.setDisplayProps( theSun );

lensFlare.renderFlares();
// console.log( 'theSun.sunToStageCentreAngle: ', theSun.sunToStageCentreAngle );


sunSpikes.renderCfg.canvas = staticAssetCanvas;
sunSpikes.renderCfg.context = staticAssetCtx;
sunSpikes.renderCfg.debugCfg = overlayCfg;

sunSpikes.displayCfg.glareSpikesRandom.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikesRandom.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikesRandom.x = theSun.x;
sunSpikes.displayCfg.glareSpikesRandom.y = theSun.y;

sunSpikes.displayCfg.glareSpikes.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikes.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikes.x = theSun.x;
sunSpikes.displayCfg.glareSpikes.y = theSun.y;

sunSpikes.glareSpikeOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: 2,
    majorRayLen: 200,
    minorRayLen: 200,
    majorRayWidth: 0.0005,
    minorRayWidth: 0.00005,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0,
    count: apertureSides * 2,
    blur: 5
}

sunSpikes.glareSpikeRandomOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: theSun.r / 4,
    majorRayLen: theSun.r * 1,
    minorRayLen: theSun.r * 2,
    majorRayWidth: 0.0005,
    minorRayWidth: 0.005,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0,
    count: mathUtils.randomInteger( 20, 40 ),
    blur: 10
}

sunSpikes.flareOptions = {
    canvas: flareAssetCanvas,
    context: flareAssetCtx,
    x: flareAssetCanvas.width / 2,
    y: flareAssetCanvas.height / 2,
    r: theSun.r / 1.9,
    gradientWidth: theSun.r * 10,
    rayLen: theSun.r * 10,
    rayWidth: 0.08,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0.5,
    count: apertureSides,
    blur: 1
}

// console.log( 'sunSpikes.glareSpikeOptions.r: ', sunSpikes.glareSpikeOptions );
sunSpikes.initGlareSpikeControlInputs( canvas );

// console.log( 'sunSpikes.glareSpikeControlInputCfg: ', sunSpikes.glareSpikeControlInputCfg );

// sunSpikes.renderGlareSpikes();
// sunSpikes.renderGlareSpikesRandom();
// sunSpikes.renderFlares();

// set line widths for drawing based on scene size
theSun.lines = {
    outer: Math.floor( theSun.r / 20 ),
    inner: Math.floor( theSun.r / 40 )
}


// set corona system base size
sunCorona.rayBaseRadius = theSun.r * 1.2;


// set up proprtional measurements from face radius
var pm = proportionalMeasures.setMeasures( theSun.r );


let rainbowDot = {
    size: 100,
    x: 100 + ( 100 / 8 ),
    y: 100,
    introDotcount: 284,

    preRenderConfig: {
        canvas: secondaryStaticAssetCanvas,
        ctx: secondaryStaticAssetCtx
    },

    renderConfig: {
        canvas: canvas,
        ctx: ctx
    },

    preRender: function() {

        let c = this.preRenderConfig.ctx;
        let redX = -this.offset;
        let greenX = (this.size / 2) - this.offset;
        let blueX = this.size - this.offset;
        let groupY = this.y - ( this.size / 2 );

        c.translate( this.x, this.y );
        c.globalCompositeOperation = 'lighter';
        c.strokeStyle = 'red';

        let redGrad = c.createRadialGradient( redX, 0, 0, redX, 0, this.size );
        redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.8 )` );
        redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.8 )` );
        redGrad.addColorStop( 0.8,  `rgba( 255, 0, 0, 0.1 )` );
        redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );

        c.fillStyle = redGrad;
        c.fillCircle( redX, 0, this.size );
        // c.strokeCircle( redX, 0, this.size );

        let greenGrad = c.createRadialGradient( greenX, 0, 0, greenX, 0, this.size * 1.05 );
        greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.8 )` );
        greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.8 )` );
        greenGrad.addColorStop( 0.8,  `rgba( 0, 255, 0, 0.1 )` );
        greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );

        c.fillStyle = greenGrad; 
        c.fillCircle( greenX, 0, this.size * 1.1 );
        // c.strokeCircle( greenX, 0, this.size );

        let blueGrad = c.createRadialGradient( blueX, 0, 0, blueX, 0, this.size );
        blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.8 )` );
        blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.8 )` );
        blueGrad.addColorStop( 0.8,  `rgba( 0, 0, 255, 0.1 )` );
        blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );

        c.fillStyle = blueGrad; 
        c.fillCircle( blueX, 0, this.size );
        // c.strokeCircle( blueX, 0, this.size );

        c.translate( -this.x, -this.y );

        this.renderConfig.x = this.x - ( this.offset + this.size );
        this.renderConfig.y = this.y -this.size;
        this.renderConfig.w = this.size * 3;
        this.renderConfig.h = this.size * 2;

        // c.strokeRect( this.renderConfig.x, this.renderConfig.y, this.renderConfig.w, this.renderConfig.h );

    },

    render: function( x, y, lens, visible ) {
        let source = this.preRenderConfig.canvas;
        let renderConfig = this.renderConfig;
        let c = renderConfig.ctx;
        let count = this.introDotcount;
        let hScale = renderConfig.h;
        let lensCfg = lens;
        let lensScale = 0;
        let widthScale = 40;
        ;
        let rotationInterval = ( Math.PI * 2 ) / count;
        let opacityInterval = 1 / (count / 8);

        if ( lens.sunLensIntersectingFlag === true ) {
            lensScale = 1 - lensCfg.currOverlapScale;
            // console.log( 'lensScale: ', lensScale )
        } else {
            lensScale = 1;
        }

        let computedX = easing.easeInExpo( lensScale, 0, 1, 1 );
        let computedR = 1200 * computedX;
        // if ( visible === false ) {
            c.translate( x, y );
            c.scale( -1, 1 );
            let currRotation = 0;
            let currMix = c.globalCompositeOperation;
            c.globalCompositeOperation = 'lighter';


            // let opacityInterval = 1 / (count / 4);

            let currOpacity = 1;

            for (var i = count - 1; i >= 0; i--) {

                let currRotation = i * rotationInterval;

                if( i >= 0 && i < count / 8 ) {
                    currOpacity = 1 - ( i * opacityInterval );
                }

                if( i > count / 8 && i < count / 4  ) {
                    currOpacity = 0;
                }

                if( i >= ( (count / 4) + (count / 8) ) && i < ( count / 2 ) ) {
                    currOpacity = ( i - ( (count / 4) + (count / 8) ) ) * opacityInterval;
                }

                if( i >= ( count / 2 ) && i < ( count / 2 ) + ( count / 8 ) ) {
                    currOpacity = 1 - ( ( i - ( count / 2 ) ) * opacityInterval );
                }

                if( i > ( count / 2 ) + ( count / 8 )  && i > count - ( count / 8 ) ) {
                    currOpacity = 0;
                }

                if( i >= count - ( count / 8 ) && i < count ) {
                    currOpacity = ( i - ( count - ( count / 8 ) ) ) * opacityInterval;
                }

                c.globalAlpha = currOpacity;
                c.rotate( currRotation );
                c.drawImage(
                    source,
                    renderConfig.x, renderConfig.y, renderConfig.w, renderConfig.h,
                     100 + ( lens.maxD * computedX ), -( ( hScale * opacityInterval ) / 2 ), renderConfig.w * ( widthScale * opacityInterval ), ( hScale * opacityInterval )
                );
                

                c.globalAlpha = 1;
                

                c.rotate( -currRotation );

            }
            c.scale( -1, 1 );
            c.translate( -x, -y );
            c.globalCompositeOperation = currMix;


        // }

        
    }


}

rainbowDot.offset = rainbowDot.size / 8;

rainbowDot.preRender();

// let rainbowDotSize = 100;
// let rainbowX = 200;
// let rainbowY = 200;
// secondaryStaticAssetCtx.translate( rainbowDot.x, rainbowDot.y );
// // secondaryStaticAssetCtx.scale( 5, 1 );
// secondaryStaticAssetCtx.save();
// let offset = rainbowDotSize / 8;
// secondaryStaticAssetCtx.globalCompositeOperation = 'lighter';


// let redX = -offset;
// let redY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let greenX = (rainbowDotSize / 2) - offset;
// let greenY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let blueX = rainbowDotSize - offset;
// let blueY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let redGrad = secondaryStaticAssetCtx.createRadialGradient( redX, 0, 0, redX, 0, rainbowDot.size );
// redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.8 )` );
// redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.8 )` );
// redGrad.addColorStop( 0.8,  `rgba( 255, 0, 0, 0.1 )` );
// redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );

// secondaryStaticAssetCtx.fillStyle = redGrad; 
// secondaryStaticAssetCtx.fillCircle( redX, 0, rainbowDot.size );

// let greenGrad = secondaryStaticAssetCtx.createRadialGradient( greenX, 0, 0, greenX, 0, rainbowDot.size * 1.05 );
// greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.8 )` );
// greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.8 )` );
// greenGrad.addColorStop( 0.8,  `rgba( 0, 255, 0, 0.1 )` );
// greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );

// secondaryStaticAssetCtx.fillStyle = greenGrad; 
// secondaryStaticAssetCtx.fillCircle( greenX, 0, rainbowDot.size * 1.1 );

// let blueGrad = secondaryStaticAssetCtx.createRadialGradient( blueX, 0, 0, blueX, 0, rainbowDot.size );
// blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.8 )` );
// blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.8 )` );
// blueGrad.addColorStop( 0.8,  `rgba( 0, 0, 255, 0.1 )` );
// blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );

// secondaryStaticAssetCtx.fillStyle = blueGrad; 
// secondaryStaticAssetCtx.fillCircle( blueX, 0, rainbowDot.size );

// secondaryStaticAssetCtx.restore();



// set up modifier system and connect to proportional measurements
// var muscleModifiers = muscleModifier.createModifiers( pm );
// muscleModifier.setRangeInputs( muscleModifiers );


// init eye blink track
// trackPlayer.loadTrack( 5, 'blink', seq, muscleModifiers );


// expression events

    // $( '.expression-smile' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'smile', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'smile' );
    // } );

    // $( '.expression-smile-big' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'bigSmile', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'bigSmile' );
    // } );

    // $( '.expression-ecstatic' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'ecstatic', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'ecstatic' );
    // } );

    // $( '.expression-sad' ).click( function( e ){
    //     trackPlayer.loadTrack( 60, 'sad', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'sad' );
    // } );

    // $( '.expression-very-sad' ).click( function( e ){
    //     trackPlayer.loadTrack( 60, 'bigSad', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'bigSad' );
    // } );

    // $( '.expression-blink' ).click( function( e ){
    //     trackPlayer.loadTrack( 10, 'blink', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'blink' );
    // } );

    // $( '.expression-reset' ).click( function( e ){
    //     trackPlayer.loadTrack( 10, 'reset', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'reset' );
    // } );


// sequence button events

    // $( '.sequence-yawn' ).click( function( e ){
    //     trackPlayer.loadTrack( 300, 'yawn', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'yawn' );
    // } );


// control panel events
    

    // facial feature panel events
    // var $featurePageParent = $( '[ data-page="page-elements" ]');

    // var $featureInputs = $featurePageParent.find( '[ data-face ]' );
    // $featureInputs.on( 'input', function( e ) {
    //     var $self = $( this );
    //     var getModifier = $self.data( 'modifier' );
    //     var getMultiplier = $self.data( 'value-multiplier' );

    //     var result = parseFloat( $self.val() * getMultiplier );
    //     muscleModifiers[ getModifier ].curr = result;
    //     $self.closest( '.control--panel__item' ).find( 'output' ).html( result );
    // } );

    // spike Glare panel events

    let $spikeGlareElParent = $( '.js-glare-spike-effects' );
    let $spikeGlareInputs = $spikeGlareElParent.find( '.range-slider' );
    let spikeGlareControlInputLink = {
        spikeCountInput: 'count',
        spikeRadiusInput: 'r',
        spikeMajorSize: 'majorRayLen',
        spikeMinorSize: 'minorRayLen',
        spikeMajorWidth: 'majorRayWidth',
        spikeMinorWidth: 'minorRayWidth',
        spikeBlurAmount: 'blur'
    }

    $spikeGlareInputs.on( 'input', function( e ) {
        const $self = $( this )[ 0 ];
        
        const thisOpt = spikeGlareControlInputLink[ $self.id ];
        const thisOptCfg = sunSpikes.glareSpikeControlInputCfg[ thisOpt ];
        let $selfVal = parseFloat( $self.value );

        // console.log( '$selfVal: ', $selfVal );
        // console.log( '$self.id: ', $self.id );
        // console.log( 'thisOpt: ', thisOpt );
        // console.log( 'thisOptCfg: ', thisOptCfg );
        // console.log( 'thisOptCfg: ', result );

        sunSpikes.glareSpikeOptions[ thisOpt ] = $selfVal;
        sunSpikes.clearRenderCtx();
        sunSpikes.renderGlareSpikes();
    } );

// look target events
    // var $LookTargetInputs = $featurePageParent.find( '.range-slider[ data-control="look" ]' );
    // $LookTargetInputs.on( 'input', function( e ) {
    //     var $self = $( this );
    //     var getModifier = $self.data( 'modifier' );
    //     var getMultiplier = $self.data( 'value-multiplier' );
    //     var thisAxis = getModifier.indexOf( 'X' ) != -1 ? 'x' : getModifier.indexOf( 'Y' ) != -1 ? 'y' : getModifier.indexOf( 'Z' ) != -1 ? 'z' : false;
    //     // console.log( 'raw value: ', $self.val() );
    //     // console.log( 'getMultiplier: ', getMultiplier );
    //     // console.log( 'raw result: ', $self.val() * getMultiplier );

    //     if ( thisAxis === 'z' ) {
    //         aimConstraint.setCurrentSize();
    //     }
    //     var result = parseFloat( $self.val() * getMultiplier );
    //     aimConstraint.target.coords.curr[ thisAxis ] = result;
    //     $self.parent().find( 'output' ).html( result );
    //     // console.log( 'wrong one firing' );
    // } );


function drawOverlay() {

    if ( overlayCfg.displayOverlay ) {
        // draw reference points
        ctx.strokeStyle = theSun.colours.debug.lines;
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 6]);

        if ( overlayCfg.displayCentreLines ) {

            // draw centre lines
            ctx.line(
                theSun.x - ( theSun.r * 2 ), theSun.y,
                theSun.x + ( theSun.r * 2 ), theSun.y
            );


            ctx.line(
                theSun.x, theSun.y - ( theSun.r * 2 ),
                theSun.x, theSun.y + ( theSun.r * 2 )
            );

            ctx.setLineDash( [] );

        }



        if ( overlayCfg.displaySunToStage ) {
            faceToStageCentreDebugLine( ctx );
        }

    }
}





// sunSpikes.displayGlareSpikesRandom();



function drawtheSun() {
    ctx.lineWidth = theSun.lines.outer;
    
    theSun.render(); 
}

function updateCycle() {
    // drawFaceGimbleControl();

    // if ( mouseDown ) {
    //     if ( !aimConstraint.target.renderConfig.isHit ) {
    //         aimConstraint.checkMouseHit();
    //     }
        
    //     if ( aimConstraint.target.renderConfig.isHit ) {
    //         aimConstraint.mouseMoveTarget();
    //     }
    // }

    bgCycler.updatePhaseClock();
    bgCycler.render( theSun );
    theStars.update();

    drawtheSun();
    drawOverlay();
    sineWave.modulator();
    theSun.updatePosition();
    theSun.indicator( ctx );
    // trackPlayer.updateTrackPlayer( seq, muscleModifiers );

}

function clearCanvas(ctx) {
    // cleaning
    ctx.clearRect(0, 0, canW, canH);
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );

    // blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // mouse tracking
    lastMouseX = mouseX; 
    lastMouseY = mouseY; 

    // clean canvas
    clearCanvas( ctx );

    // updates
    updateCycle();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////

if (animation.state !== true) {
    animation.state = true;
    update();
}

$( '.js-attachFlareCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).remove( lensFlareCanvas );
    
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( lensFlareCanvas );
    
    }

} );

$( '.js-attachRainbowCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).remove( secondaryStaticAssetCanvas );
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( secondaryStaticAssetCanvas );
    
    }

} );

$( '.js-close-osc-canvas' ).click( function( event ){

    $( '.osc-canvas-display-btn' ).removeClass( 'is-active' );
    $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).find( 'canvas' ).remove();

} );

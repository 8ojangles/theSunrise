var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
let mathUtils = require('./mathUtils.js').mathUtils;
let easing = require('./easing.js').easingEquations;

let noiseGen = require('./noiseTextureGenerator.js'); 
let noiseCfg = require('./noiseConfig.js');

let noiseTexture = noiseGen( 256, noiseCfg );
noiseTextureW = noiseTexture.width;
noiseTextureH = noiseTexture.height;

let rand = mathUtils.random;
let randI = mathUtils.randomInteger;
let mCos = Math.cos;
let mSin = Math.sin;

var numFlares = randI( 10, 20 );
var flareSizeArr = [];

for (var i = numFlares - 1; i >= 0; i--) {

    let randomRandomiser = randI( 0, 100 );
    let smallThreshold = numFlares < 30 ? 60 : 75;
    let min = 15;
    let max = randomRandomiser < 50 ? 120 : 180;

    flareSizeArr.push(
        randI( min, max )
    );
}

var lensFlare = {
    config: {
        count: numFlares,
        sizeArr: flareSizeArr,
        flareArr: [],
        blur: 3
    },
    renderers: {
        render: {
            canvas: null,
            ctx: null,
            w: 2000,
            h: 2000,
            dX: 0,
            dY: 0,
            totTallest: 0,
            compositeArea: {
                x: 0, y: 0, w: 0, h: 0
            }
        },
        display: {
            canvas: null,
            ctx: null,
            x: 0, y: 0, w: 0, h: 0, a: 0, d: 0
        }
    },

    setRendererElements: function( renderOpts, displayOpts ) {
        let renderCfg = this.renderers.render;
        let displayCfg = this.renderers.display;

        renderCfg.canvas = renderOpts.canvas;
        renderCfg.ctx = renderOpts.ctx;
        renderCfg.canvas.width = renderCfg.w;
        renderCfg.canvas.height = renderCfg.h;

        displayCfg.canvas = displayOpts.canvas;
        displayCfg.ctx = displayOpts.ctx;
        displayCfg.w = displayCfg.canvas.width;
        displayCfg.h = displayCfg.canvas.height;
    },

    setDisplayProps: function( sun ) {
        let displayCfg = this.renderers.display;
        displayCfg.x = sun.x;
        displayCfg.y = sun.y;
        displayCfg.a = sun.localRotation;
        let sunPivot = sun.pivotPoint;
        // displayCfg.maxD = trig.dist( -( originR * 2 ), -( originR * 2 ), displayCfg.w + ( originR * 2 ), displayCfg.h + ( originR * 2 ) );
        displayCfg.maxD = displayCfg.w * 2;
        // console.log( 'displayCfg.maxD: ', displayCfg.maxD );
        displayCfg.d = ( trig.dist( displayCfg.x,  displayCfg.y, displayCfg.w / 2, displayCfg.h / 2 ) ) * 4;
        // console.log( 'displayCfg.d: ', displayCfg.d );
        displayCfg.scale = displayCfg.maxD / displayCfg.d;
        displayCfg.flareDistTotal = trig.dist( sunPivot.x,  sunPivot.y + sunPivot.r, displayCfg.w / 2, displayCfg.h / 2 );
        displayCfg.currFlareDist = trig.dist( sun.x,  sun.y, displayCfg.w / 2, displayCfg.h / 2 );
        // console.log( 'displayCfg.scale: ', displayCfg.scale );
    },

    createFlareConfigs: function( miscOpts ) {
        let cfg = this.config;
        this.config.opts = miscOpts;

        for (let i = cfg.count - 1; i >= 0; i--) {

            let thisTypeRandomiser = randI( 0, 100 );
            let thisType;

            // let thisType = thisTypeRandomiser < 10 ? 'spotShine' : thisTypeRandomiser < 55 ? 'poly' : 'circle';
            if ( i === 0 || i === 5 ) {
                thisType = 'renderRGBSpotFlare';
                cfg.sizeArr[ i ] = randI( 15, 100 );
                console.log( 'cfg.sizeArr[ i ]: ', cfg.sizeArr[ i ] );
            } else {
                thisType = thisTypeRandomiser < 8 ? 'spotShine' : 'poly';
            }
            
            let colRand = randI( 0, 100 );

            let r = colRand < 50 ? 255 : colRand < 60 ? 255 : colRand < 80 ? 200 : 200;
            let g = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 255 : 255;
            let b = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 200 : 255;

            let thisFlare = {
                color: {
                    r: r,
                    g: g,
                    b: b

                },
                type: thisType
            }

            if ( thisType === 'spotShine' ) {
                if ( colRand < 10 ) {
                    thisFlare.color = {
                        r: 255, g: 100, b: 100
                    }
                } else {
                    if ( colRand < 20 ) {
                        thisFlare.color = {
                            r: 100, g: 255, b: 100
                        }
                    } else {
                        thisFlare.color = {
                            r: 255, g: 255, b: 255
                        }
                    }
                }
                
            }

            thisFlare.size = thisFlare.type === 'spotShine' ? randI( 40, 80 ) : cfg.sizeArr[ i ];

            thisFlare.d = thisFlare.type === 'spotShine' ? parseFloat( rand( 0.3, 1 ).toFixed( 2 ) ) : parseFloat( rand( 0, 1 ).toFixed( 2 ) );

            thisFlare.hRand = parseFloat( rand( 1, 2 ).toFixed( 2 ) );
            cfg.flareArr.push( thisFlare );
        }
    },

    renderCircleFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let baseCfg = this.config;
        let flareCfg = cfg;
        let flareRandomiser = randI( 0, 100 );
        let flareRandomShift = randI( 20, 40 );
        let flareRandomEdge = randI( 0, 10 );
        let randomFill = randI( 0, 100 ) < 20 ? true : false;
        let grad = c.createRadialGradient( 0 - ( flareRandomShift * 3 ), 0, 0, 0, 0, flareCfg.size );
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

            // grad.addColorStop( 0, `rgba( ${ rgbColorString } 0.6 )` );
            // grad.addColorStop( 0.7,  `rgba( ${ rgbColorString } 0.8 )` );
            // grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.7 )` );

        if ( flareRandomEdge > 5 ) {
            if ( randomFill === true ) {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            } else {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.8,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            }
            
            grad.addColorStop( 0.97, `rgba( ${ rgbColorString } 0.8 )` );
            grad.addColorStop( 0.99, `rgba( ${ rgbColorString } 0.3 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0 )` );
        } else {
            grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.2 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0.3 )` );
        }
            
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderSpotFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.2,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.4,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0 )` );
        
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderRGBSpotFlare: function( x, y, cfg ) {
        console.log( 'yay rendered renderRGBSpotFlare' );
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let curComp = c.globalCompositeOperation;
        c.globalCompositeOperation = 'lighten';

        let redGrad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.5 )` );
        redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.5 )` );
        redGrad.addColorStop( 0.6,  `rgba( 255, 0, 0, 0.1 )` );
        redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );
        
        c.fillStyle = redGrad; 
        c.fillCircle( 0, 0, flareCfg.size );

        let greenGrad = c.createRadialGradient( flareCfg.size / 4 , 0, 0, flareCfg.size / 4 , 0, flareCfg.size );
        greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.5 )` );
        greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.5 )` );
        greenGrad.addColorStop( 0.6,  `rgba( 0, 255, 0, 0.1 )` );
        greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );
        
        c.fillStyle = greenGrad; 
        c.fillCircle( flareCfg.size / 4 , 0, flareCfg.size );

        let blueGrad = c.createRadialGradient( flareCfg.size / 2, 0, 0, flareCfg.size / 2, 0, flareCfg.size );
        blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.5 )` );
        blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.5 )` );
        blueGrad.addColorStop( 0.6,  `rgba( 0, 0, 255, 0.1 )` );
        blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );
        
        c.fillStyle = blueGrad; 
        c.fillCircle( flareCfg.size / 2, 0, flareCfg.size );

        c.globalCompositeOperation = curComp;

    },

    renderPolyFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let flareSize = flareCfg.size;
        let flareRandomShift = randI( 0, 40 );

        let flareRandomEdge = randI( 0, 10 );

        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.2 )` );
        
        let sides = this.config.opts.aperture;

        c.save();
        
        // c.beginPath();
        // for (let i = 0; i < sides; i++) {
        //     let alpha = twoPi * ( i / sides );
        //     if ( i === 0 ) {
        //         c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
        //     } else {
        //         c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
        //     }
        // }
        // c.closePath();
        // c.clip();

        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();

        c.fillStyle = grad; 
        c.fill();
        
        c.translate( 0, -100000 );
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        flareRandomShift = randI( 0, 5 );
        c.strokeStyle = 'red';
        c.shadowColor = `rgba( ${ rgbColorString } 0.05 )`;
        c.shadowBlur = 5;
        c.shadowOffsetX = 0 - flareRandomShift;
        c.shadowOffsetY = 100000;
        c.lineWidth = 2;
        c.stroke();
        c.shadowBlur = 0;

        if ( flareRandomEdge > 5 ) {
            c.beginPath();
            for (let i = 0; i < sides; i++) {
                let alpha = twoPi * ( i / sides );
                if ( i === 0 ) {
                    c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                } else {
                    c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                }
            }
            c.closePath();
            c.strokeStyle = 'red';
            c.shadowColor = `rgba( ${ rgbColorString } 0.05 )`;
            c.shadowBlur = 3;
            c.shadowOffsetX = 0 - flareRandomShift;
            c.shadowOffsetY = 100000;
            c.lineWidth = 2;
            c.stroke();
            c.shadowBlur = 0;
        }

        c.translate( 0, 100000 );

        c.restore();

    },

    getCleanCoords: function( flare ) {
        
        let renderCfg = this.renderer.render;
        let blur = this.config.blur;
        let blur2 = blur * 2;
        let flareS = flare.size;
        let flareS2 = flareS * 2;
        let totalS = flareS2 + blur2;
        let cleanX = renderCfg.dX;
        let cleanY = renderCfg.dY;
    },

    renderFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let compositeArea = renderer.compositeArea;
        let c = renderer.ctx;
        let cW = renderer.w;
        let cH = renderer.h;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let blur = baseCfg.blur;
        let blur2 = blur * 2;

        let currX = 0;
        let currY = 0;
        let currTallest = 0;

        let blurStr = 'blur('+blur.toString()+'px)';
        c.filter = blurStr;
        let polyCount = 0;

        // sort flares based on size - decending order to map to reverse FOR loop ( so loop starts with smallest ) 
        flares.sort( function( a, b ) {
                return b.size - a.size
            }
        );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let flareSize = thisFlare.size;
            let flareSize2 = flareSize * 2;
            let totalFlareW = flareSize2 + blur2;
            let totalFlareH = flareSize2 + blur2;

            totalFlareH > currTallest ? currTallest = totalFlareH : false;

            if ( currX + totalFlareW + blur > cW ) {
                currX = 0;
                currY += currTallest;
                currTallest = totalFlareH;
            }

            let transX = currX + flareSize + blur;
            let transY = currY + flareSize + blur;

            c.translate( transX, transY );

            if ( thisFlare.type === 'spotShine' ) {
                c.globalAlpha = 1;
                this.renderSpotFlare( 0, 0, thisFlare );
            }

            if ( thisFlare.type === 'renderRGBSpotFlare' ) {
                c.globalAlpha = 1;
                this.renderRGBSpotFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'poly' ) {
                c.globalAlpha = 1;
                this.renderPolyFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'circle' ) {
                c.globalAlpha = parseFloat( rand( 0.5, 1 ).toFixed( 2 ) );
                this.renderCircleFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }


            // c.strokeStyle = 'red';
            // c.lineWidth = 1;
            // c.strokeRect( -( flareSize + blur ), -( flareSize + blur ), totalFlareW, totalFlareH );
            // c.stroke();

            c.translate( -transX, -transY );

            thisFlare.renderCfg = {
                x: currX,
                y: currY,
                w: totalFlareW * ( thisFlare.type === 'renderRGBSpotFlare' ? 1.5 : 1 ),

                h: totalFlareH
            }

            currX += totalFlareW * ( thisFlare.type === 'renderRGBSpotFlare' ? 1.5 : 1 );

            if ( i === 0 ) {
                compositeArea.x = 0;
                compositeArea.y = currY + totalFlareH;
                compositeArea.w = cW;
                compositeArea.h = totalFlareH;
            }

        }

        c.filter = 'blur(0px)';

        // let currMix = c.globalCompositeOperation;
        // c.globalCompositeOperation = 'lighten';

        // for (let i = flareCount - 1; i >= 0; i--) {

        //     let thisFlare = flares[ i ];
        //     flareCfg = thisFlare.renderCfg;
        //     if ( thisFlare.type === 'poly' || thisFlare.type === 'circle' ) {
        //         let noiseSize = flareCfg.w;
        //         c.drawImage(
        //             noiseTexture,
        //             0, 0, noiseTextureW, noiseTextureH,
        //             flareCfg.x, flareCfg.y, noiseSize, noiseSize
        //         );
        //     }
        // }

        // c.globalCompositeOperation = currMix;
    },


    displayFlares: function() {

        let baseCfg = this.config;
        let renderC = this.renderers.render.canvas;
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;
        let thisEase = easing.easeInQuart;
        
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;

        let scale = displayCfg.scale / 2;
        let invScale = 1 - scale;
        // console.log( 'scale: ', scale );
        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * invScale;
            let scaledW = thisFlareCfg.w * 0.8;
            let scaledH = thisFlareCfg.h * 0.8;
            let scaledX = displayCfg.d * thisFlare.d;
            // let inverseScale = 1 - ( scaledX / displayCfg.d );
            // let scaleMultiplier = thisEase( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );

            if ( thisFlare.type === "renderRGBSpotFlare" || thisFlare.type === "spotShine") {
                let scaledSize = thisFlareCfg.w * (scale / 2);
                let scaledCoords = scaledSize / 2;
                let scaledX = displayCfg.d * thisFlare.d;
                let scaleMultiplier = easing.easeInCubic( displayCfg.currFlareDist, 1, 10, displayCfg.flareDistTotal );
                c.drawImage(
                    renderC,
                    thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                    scaledX, -scaledCoords, scaledSize * scaleMultiplier , scaledSize
                );
            } else {
                c.drawImage(
                    renderC,
                    thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                    scaledX, -( scaledH / 2), scaledW, scaledH
                );
            }


        }

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    

    

    update: function() {
        this.compositeFlares();
        this.displayComposite();
        this.clearCompositeArea();

    },

    flareInit: function( renderOpts, displayOpts, miscOpts ) {
        self = this;
        self.setRendererElements( renderOpts, displayOpts );
        self.createFlareConfigs( miscOpts );
    }
}

module.exports = lensFlare;
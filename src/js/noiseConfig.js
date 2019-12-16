let noiseConfig = {
	baseColor: [ 0, 0, 0, 125 ], 
	noise: [
		{
			color: [ 255, 255, 255, 255 ], 
			attenuation: 1.5, 
			roughness: 2,
			numOctaves: 4,
			startingOctave: 2
		},
		{
			color: [ 0, 0, 0, 0 ], 
			attenuation: 1.5, 
			roughness: 6,
			numOctaves: 4,
			startingOctave: 5
		}			
	]
};

module.exports = noiseConfig;
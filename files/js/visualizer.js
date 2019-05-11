var visualizer = {};
visualizer.running = false;

/*
 * Initialize
 */
visualizer.init = function (circle) {

	// setup canvas
	visualizer.width = window.innerWidth;
	visualizer.height = window.innerHeight;
	var c = document.getElementById(circle);
	c.width = visualizer.width;
	c.height = visualizer.height;

	// create the variables
	visualizer.circle = {
		radius: properties.options.radius,
		speed: 0.3,
		x: visualizer.width / 2,
		y: visualizer.height / 2,
		rotation: 0,
		fade: 1,
		bass: 0
	};
	visualizer.functions = {
		drawLine: function (stage, line, width, color) {
			var l = new createjs.Shape();
			l.graphics.setStrokeStyle(width, "round");
			l.graphics.beginStroke(color);
			l.graphics.moveTo(line.from.x, line.from.y);
			l.graphics.lineTo(line.to.x, line.to.y);
			stage.addChild(l);
		},
		getPointOnCircle: function (center, radius, angle) {
			return {
				x: center.x + (Math.cos(toRadium(angle)) * radius),
				y: center.y + (Math.sin(toRadium(angle)) * radius)
			};

			function toRadium(degree) {
				return degree * Math.PI / 180;
			}
		},
		getNextIndex: function (i, max) {
			if (i < max - 1) {
				return i + 1;
			} else {
				return 0;
			}
		},
		rgbToHex: function (rgb) {
			var x = rgb.toString().split(","),
				r = Math.round(parseInt(x[0])),
				g = Math.round(parseInt(x[1])),
				b = Math.round(parseInt(x[2]));
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
	};

	// stage setup
	visualizer.circle.stage = new createjs.Stage(circle);
	visualizer.circle.stage.snapToPixel = true;
	visualizer.circle.stage.snapToPixelEnabled = true;

	// audio data
	visualizer.data();

	// create the particles
	visualizer.createParticles();

	// apply some of the properties
	properties.apply();

	// update
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", visualizer.update);
};

/*
 * Update function
 */
visualizer.update = function () {
	visualizer.drawCircle();
	visualizer.updateParticles();
	visualizer.updateLogo();
	visualizer.updateBackground();
};

/*
 * Draw the circle
 */
visualizer.drawCircle = function () {

	// vars from visualizer
	var audio = visualizer.audioData;
	var circle = visualizer.circle;
	var stage = visualizer.circle.stage;
	var f = visualizer.functions;

	// variables
	var color = properties.colors.accent;
	var lineWidth = 2;
	var lineWidthSmall = 1;
	var lineHeightMultiplier = 100;
	var spacing = 360 / audio.length;
	var radius = circle.radius;
	var bass = visualizer.circle.bass;
	if (properties.options.invertedmovement) bass *= -1;
	switch (properties.movement.circle) {
		case 2: radius *= (1 + bass / 2); break; // scale
		case 3: break; // move (move missing)
		case 4: radius *= (1 + bass / 2); break; // both (move missing)
	}

	// only draw when there's audio
	if (visualizer.circle.hasAudio) {

		// clear stage
		stage.removeAllChildren();

		// fade in
		fade("in");

		// rotate the circle
		if (properties.options.rotate) {
			circle.rotation += circle.speed;
		}

		// loop through audio
		for (var i = 0; i < audio.length; i++) {

			// get the lines
			var currentLine = getLine(i);
			var nextLine = getLine(f.getNextIndex(i, audio.length));

			// draw the lines
			f.drawLine(stage, currentLine, lineWidth, "rgb(" + color + ")");
			for (var j = 0; j < currentLine.connections.length; j++) {
				f.drawLine(
					stage, {
						from: currentLine.connections[j],
						to: nextLine.connections[j]
					},
					lineWidthSmall,
					"rgba(" + color + ",0.66)"
				);
			}
		}
	} else {

		// fade out
		fade("out");
	}

	// update
	stage.update();

	// get the line points
	function getLine(i) {
		var angle = i * spacing;
		var length = audio[i] * lineHeightMultiplier;
		return {
			from: f.getPointOnCircle(circle, radius - length * 0.33, angle + circle.rotation),
			to: f.getPointOnCircle(circle, radius + length * 0.66, angle + circle.rotation),
			connections: [
				f.getPointOnCircle(circle, radius - length * 0.33, angle + circle.rotation),
				f.getPointOnCircle(circle, radius - length * 0.22, angle + circle.rotation),
				f.getPointOnCircle(circle, radius - length * 0.11, angle + circle.rotation),
				f.getPointOnCircle(circle, radius + length * 0.66, angle + circle.rotation),
				f.getPointOnCircle(circle, radius + length * 0.33, angle + circle.rotation),
				f.getPointOnCircle(circle, radius + length * 0.44, angle + circle.rotation),
				f.getPointOnCircle(circle, radius + length * 0.55, angle + circle.rotation),
				f.getPointOnCircle(circle, radius + length * 0.66, angle + circle.rotation)
			]
		};
	}

	// fade in or out
	function fade(c) {

		var fade = visualizer.circle.fade;

		// increase or decrease the value
		switch (c) {
			case "in":
				if (fade < 1) fade += 0.01;
				break;
			case "out":
				if (fade > 0) fade -= 0.01;
				break;
		}

		// fix the fade value
		fade = Math.round(fade * 100) / 100;

		// apply the fade
		stage.alpha = fade;
		visualizer.circle.fade = fade;
		if (fade === 0) {
			stage.removeAllChildren();
		}
	}
};

/*
 * Update all the particles (speed, color...)
 */
visualizer.updateParticles = function () {
	var p = window.pJSDom[0].pJS;
	var c = properties.colors.accent.toString();
	p.particles.move.speed = Math.pow(3, Math.pow(visualizer.circle.bass + 1, 4));
	p.particles.color.rgb = {
		r: c.split(",")[0],
		g: c.split(",")[1],
		b: c.split(",")[2]
	};
};

/*
 * Update the logo
 */
visualizer.updateLogo = function () {
	var x = document.getElementById("logo");

	if (properties.images.logo !== "") {

		var bass = visualizer.circle.bass;
		if (properties.options.invertedmovement) bass *= -1;
		var size = visualizer.circle.radius * (1 + bass / 2) / 350 * properties.options.logosize;
		size = Math.round(size * 10) / 10;

		switch (properties.movement.logo) {
			case 1: // none
				x.style.width = visualizer.circle.radius * 1.75 + "px";
				break;
			case 2: // scale
				x.style.width = size * 1.75 + "px";
				break;
			case 3: // move (move missing)
				x.style.width = visualizer.circle.radius * 1.75 + "px";
				break;
			case 4: // both (move missing)
				x.style.width = size * 1.75 + "px";
				break;
		}
	} else {
		x.style.width = "0";
		//x.style.height = "0";
	}
};

/*
 * Update the logo
 */
visualizer.updateBackground = function () {
	var x = document.getElementById("backgroundimage");

	if (properties.images.background !== "") {

		switch (properties.movement.background) {
			case 1: // none
				x.style.transform = "";
				break;
			case 2: // scale
				x.style.transform = "scale(" + (1 + visualizer.circle.bass / 10) + ")";
				break;
			case 3: // move (move missing)
				x.style.transform = "";
				break;
			case 4: // both (move missing)
				x.style.transform = "scale(" + (1 + visualizer.circle.bass / 10) + ")";
				break;
		}
	} else {
		x.style.width = "0";
		x.style.height = "0";
	}
};

/*
 * The audio data
 */
visualizer.data = function () {

	// audio variable & average calculation
	visualizer.audioData = [];

	// audio listener
	if (window.wallpaperRegisterAudioListener) {

		// wallpaper engine audio
		window.wallpaperRegisterAudioListener(function (data) {
			var audio = merge(data);

			// the bass
			if (audio.length !== 0) {
				var sum = 0;
				for (var i = 0; i < 7; i++) {
					sum += audio[i];
				}
				visualizer.circle.bass = sum / 16;
				visualizer.circle.bass = Math.round(visualizer.circle.bass * 1000) / 1000;
			} else {
				visualizer.circle.bass = 0;
			}

			// if there is audio
			var average = 0;
			audio.forEach(function (v) {
				average += v;
			});
			average /= audio.length;
			visualizer.circle.hasAudio = (average > 0.001);

			// transition audio data
			if (visualizer.audioData.length === audio.length) {
				createjs.Tween.get(visualizer.audioData, {
					override: true
				}).to(audio, 50);
			} else {
				visualizer.audioData = audio;
			}
		});
	} else {

		// fake debugging audio
		setInterval(function () {
			visualizer.audioData = [];
			for (var x = 0; x < 128; x++) {
				visualizer.audioData.push(Math.random());
			}
		}, 75);
	}

	function merge(array) {
		var a = array.slice(0, array.length / 2);
		var b = array.slice(array.length / 2, array.length);
		var r = [];
		for(var x = 0; x < array.length / 2; x++) {
			r.push((a[x] + b[x]) / 2);
		}
		return r;
	}
};

/*
 * Reset the particles
 */
visualizer.resetParticles = function() {
	window.pJSDom[0].pJS.fn.vendors.destroypJS();
	visualizer.createParticles();
};

/*
 * Create the particles with the particles.js library
 */
visualizer.createParticles = function () {
	var val = properties.options.particles;
	if (properties.options.mirrored) val = val / 2;
	particlesJS("particles-js", {
		"particles": {
			"number": {
				"value": val,
				"density": {
					"enable": true,
					"value_area": 800
				}
			},
			"color": {
				"value": visualizer.functions.rgbToHex(properties.colors.accent)
			},
			"opacity": {
				"value": 0.75,
				"random": true
			},
			"size": {
				"value": 5,
				"random": true
			},
			"move": {
				"enable": true,
				"speed": 3,
				"direction": "bottom-right",
				"random": false,
				"straight": false
			},
			"mirrored": properties.options.mirrored
		},
		"interactivity": {
			"detect_on": "window",
			"events": {
				"onhover": true,
				"resize": true
			},
			"bubble": {
				"distance": 300,
				"size": 4,
				"duration": 0.3,
				"opacity": 1,
				"speed": 3
			}
		},
		"retina_detect": true
	});
};

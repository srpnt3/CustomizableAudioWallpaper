var properties = {
	colors: {
		background: "0,0,0",
		accent: "240,52,52",
		text: "255,255,255"
	},
	images: {
		background: "",
		logo: ""
	},
	options: {
		rotate: true,
		particles: 150,
		radius: 350,
		logosize: 250,
		mirrored: true,
		invertedmovement: false,
	},
	movement: {
		logo: 1,
		circle: 1,
		background: 1
	},
	position: {
		circle: 2,
		clock: 1
	},
	apply: function () {
		// bg color
		document.body.style.backgroundColor = "rgb(" + properties.colors.background + ")";
		// bg image
		document.getElementById("backgroundimage").style.backgroundImage = "url('" + properties.images.background + "')";
		// logo image
		document.getElementById("logo").setAttribute("src", properties.images.logo);
		// clock colors
		var clock = document.getElementById("clock");
		clock.style.color = "rgb(" + properties.colors.text + ")";
		clock.style.borderColor = "rgb(" + properties.colors.accent + ")";
		// radius
		visualizer.circle.radius = this.options.radius;
		// clock position
		switch (properties.position.clock) {
			case 1 : clock.className = "corner"; clock.style.left = ""; break;
			case 2: clock.className = "centered"; break;
		}
		// circle position
		var n = 25 * properties.position.circle;
		visualizer.circle.x = n / 100 * visualizer.width;
		Array.prototype.forEach.call(document.getElementsByClassName("centered"), function(v) { v.style.left = n + "%" });
	}
};

// add the property listener
window.wallpaperPropertyListener = {
	applyUserProperties: function (p) {

		// colors
		if (p.schemecolor) {
			var schemecolor = p.schemecolor.value.split(" ");
			schemecolor = schemecolor.map(function (c) {
				return Math.ceil(c * 255);
			});
			properties.colors.background = schemecolor;
		}
		if (p.accentcolor) {
			var accentcolor = p.accentcolor.value.split(" ");
			accentcolor = accentcolor.map(function (c) {
				return Math.ceil(c * 255);
			});
			properties.colors.accent = accentcolor;
		}
		if (p.textcolor) {
			var textcolor = p.textcolor.value.split(" ");
			textcolor = textcolor.map(function (c) {
				return Math.ceil(c * 255);
			});
			properties.colors.text = textcolor;
		}

		// images
		if (p.backgroundimage) {
			var background = "";
			if (p.backgroundimage.value !== "") background = "file:///";
			background += p.backgroundimage.value;
			properties.images.background = background;
		}
		if (p.logo) {
			var logo = "";
			if (p.logo.value !== "") logo = "file:///";
			logo += p.logo.value;
			properties.images.logo = logo;
		}

		// options
		if (p.mirrored) {
			properties.options.mirrored = p.mirrored.value;
			if (visualizer.running) {
				visualizer.resetParticles();
			}
		}
		if (p.rotate) {
			properties.options.rotate = p.rotate.value;
		}
		if (p.particlenumber) {
			properties.options.particles = p.particlenumber.value;
			if (visualizer.running) {
				visualizer.resetParticles();
			}
		}
		if (p.circleradius) {
			properties.options.radius = p.circleradius.value;
		}
		if (p.logosize) {
			properties.options.logosize = p.logosize.value;
		}
		if (p.invertedmovement) {
			properties.options.invertedmovement = p.invertedmovement.value;
		}

		// movement
		if (p.logomovement) {
			if (p.logomovement.value) {
				properties.movement.logo = p.logomovement.value;
			}
		}
		if (p.circlemovement) {
			if (p.circlemovement.value) {
				properties.movement.circle = p.circlemovement.value;
			}
		}
		if (p.backgroundmovement) {
			if (p.backgroundmovement.value) {
				properties.movement.background = p.backgroundmovement.value;
			}
		}

		// positions
		if (p.circleposition) {
			if (p.circleposition.value) {
				properties.position.circle = p.circleposition.value;
			}
		}
		if (p.clockposition) {
			if (p.clockposition.value) {
				properties.position.clock = p.clockposition.value;
			}
		}

		// start the visualizer
		if (!visualizer.running) {
			visualizer.running = true;
			visualizer.init("circle");
		}

		// apply some of the properties
		properties.apply();
	}
};

// wallpaper is viewed from the browser
document.addEventListener("DOMContentLoaded", function () {
	if (!window.wallpaperRegisterAudioListener) {
		visualizer.init("circle");
		properties.apply();
	}
});
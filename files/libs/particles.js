/* -----------------------------------------------
/* Author : Vincent Garreau  - vincentgarreau.com
/* MIT license: http://opensource.org/licenses/MIT
/* Demo / Generator : vincentgarreau.com/particles.js
/* GitHub : github.com/VincentGarreau/particles.js
/* How to use? : Check the GitHub README
/* v2.0.0
/* ----------------------------------------------- */

var pJS = function (tag_id, params) {

	var canvas_el = document.querySelector('#' + tag_id + ' > .particles-js-canvas-el');

	/* particles.js variables with default values */
	this.pJS = {
		canvas: {
			el: canvas_el,
			w: canvas_el.offsetWidth,
			h: canvas_el.offsetHeight
		},
		particles: {
			number: {
				value: 400,
				density: {
					enable: true,
					value_area: 800
				}
			},
			color: {
				value: '#fff'
			},
			opacity: {
				value: 1,
				random: false
			},
			size: {
				value: 20
			},
			move: {
				enable: true,
				speed: 2,
				direction: 'none',
				random: false,
				straight: false
			},
			mirrored: false,
			array: []
		},
		interactivity: {
			detect_on: 'canvas',
			events: {
				onhover: true,
				resize: true
			},
			bubble: {
				distance: 200,
				size: 80,
				duration: 0.4
			},
			mouse: {}
		},
		retina_detect: false,
		fn: {
			interact: {},
			modes: {},
			vendors: {}
		},
		tmp: {}
	};

	var pJS = this.pJS;

	/* params settings */
	if (params) {
		Object.deepExtend(pJS, params);
	}

	pJS.tmp.obj = {
		size_value: pJS.particles.size.value,
		move_speed: pJS.particles.move.speed,
		bubble_distance: pJS.interactivity.bubble.distance
	};

	pJS.fn.retinaInit = function () {

		if (pJS.retina_detect && window.devicePixelRatio > 1) {
			pJS.canvas.pxratio = window.devicePixelRatio;
			pJS.tmp.retina = true;
		}
		else {
			pJS.canvas.pxratio = 1;
			pJS.tmp.retina = false;
		}

		pJS.canvas.w = pJS.canvas.el.offsetWidth * pJS.canvas.pxratio;
		pJS.canvas.h = pJS.canvas.el.offsetHeight * pJS.canvas.pxratio;

		pJS.particles.size.value = pJS.tmp.obj.size_value * pJS.canvas.pxratio;
		pJS.particles.move.speed = pJS.tmp.obj.move_speed * pJS.canvas.pxratio;
		pJS.interactivity.bubble.distance = pJS.tmp.obj.bubble_distance * pJS.canvas.pxratio;

	};


	/* ---------- pJS functions - canvas ------------ */

	pJS.fn.canvasInit = function () {
		pJS.canvas.ctx = pJS.canvas.el.getContext('2d');
	};

	pJS.fn.canvasSize = function () {

		pJS.canvas.el.width = pJS.canvas.w;
		pJS.canvas.el.height = pJS.canvas.h;

		if (pJS && pJS.interactivity.events.resize) {

			window.addEventListener('resize', function () {

				pJS.canvas.w = pJS.canvas.el.offsetWidth;
				pJS.canvas.h = pJS.canvas.el.offsetHeight;

				/* resize canvas */
				if (pJS.tmp.retina) {
					pJS.canvas.w *= pJS.canvas.pxratio;
					pJS.canvas.h *= pJS.canvas.pxratio;
				}

				pJS.canvas.el.width = pJS.canvas.w;
				pJS.canvas.el.height = pJS.canvas.h;

				/* repaint canvas on anim disabled */
				if (!pJS.particles.move.enable) {
					pJS.fn.particlesEmpty();
					pJS.fn.particlesCreate();
					pJS.fn.particlesDraw();
					pJS.fn.vendors.densityAutoParticles();
				}

				/* density particles enabled */
				pJS.fn.vendors.densityAutoParticles();

			});

		}

	};


	pJS.fn.canvasPaint = function () {
		pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);
	};

	pJS.fn.canvasClear = function () {
		pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);
	};


	/* --------- pJS functions - particles ----------- */

	pJS.fn.particle = function (color, opacity, position) {

		/* size */
		this.radius = (pJS.particles.size.random ? Math.random() : 1) * pJS.particles.size.value;

		/* position */
		this.x = position ? position.x : Math.random() * pJS.canvas.w;
		this.y = position ? position.y : Math.random() * pJS.canvas.h;

		/* check position  - into the canvas */
		if (this.x > pJS.canvas.w - this.radius * 2) this.x = this.x - this.radius;
		else if (this.x < this.radius * 2) this.x = this.x + this.radius;
		if (this.y > pJS.canvas.h - this.radius * 2) this.y = this.y - this.radius;
		else if (this.y < this.radius * 2) this.y = this.y + this.radius;

		/* color */
		this.color = {};
		if (typeof(color.value) == 'object') {

			if (color.value instanceof Array) {
				var color_selected = color.value[Math.floor(Math.random() * pJS.particles.color.value.length)];
				this.color.rgb = hexToRgb(color_selected);
			} else {
				if (color.value.r != undefined && color.value.g != undefined && color.value.b != undefined) {
					this.color.rgb = {
						r: color.value.r,
						g: color.value.g,
						b: color.value.b
					}
				}
				if (color.value.h != undefined && color.value.s != undefined && color.value.l != undefined) {
					this.color.hsl = {
						h: color.value.h,
						s: color.value.s,
						l: color.value.l
					}
				}
			}

		}
		else if (color.value == 'random') {
			this.color.rgb = {
				r: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
				g: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
				b: (Math.floor(Math.random() * (255 - 0 + 1)) + 0)
			}
		}
		else if (typeof(color.value) == 'string') {
			this.color = color;
			this.color.rgb = hexToRgb(this.color.value);
		}

		/* opacity */
		this.opacity = (pJS.particles.opacity.random ? Math.random() : 1) * pJS.particles.opacity.value;

		/* animation - velocity for speed */
		var velbase = {}
		switch (pJS.particles.move.direction) {
			case 'top':
				velbase = {x: 0, y: -1};
				break;
			case 'top-right':
				velbase = {x: 0.5, y: -0.5};
				break;
			case 'right':
				velbase = {x: 1, y: -0};
				break;
			case 'bottom-right':
				velbase = {x: 0.5, y: 0.5};
				break;
			case 'bottom':
				velbase = {x: 0, y: 1};
				break;
			case 'bottom-left':
				velbase = {x: -0.5, y: 1};
				break;
			case 'left':
				velbase = {x: -1, y: 0};
				break;
			case 'top-left':
				velbase = {x: -0.5, y: -0.5};
				break;
			default:
				velbase = {x: 0, y: 0};
				break;
		}

		if (pJS.particles.move.straight) {
			this.vx = velbase.x;
			this.vy = velbase.y;
			if (pJS.particles.move.random) {
				this.vx = this.vx * (Math.random());
				this.vy = this.vy * (Math.random());
			}
		} else {
			this.vx = velbase.x + Math.random() - 0.5;
			this.vy = velbase.y + Math.random() - 0.5;
		}

		// var theta = 2.0 * Math.PI * Math.random();
		// this.vx = Math.cos(theta);
		// this.vy = Math.sin(theta);

		this.vx_i = this.vx;
		this.vy_i = this.vy;
	};

	/*pJS.fn.mirroredParticle = function (p) {

		/!* size *!/
		this.radius = p.radius;

		/!* position *!/
		this.x = pJS.canvas.w - p.x;
		this.y = p.y;

		/!* color *!/
		this.color = p.color;

		/!* opacity *!/
		this.opacity = p.opacity;

		/!* animation - velocity for speed *!/
		this.vx = -p.vx;
		this.vy = p.vy;

		this.vx_i = this.vx;
		this.vy_i = this.vy;

		/!* draw *!/
		this.draw = p.draw;
	};*/


	pJS.fn.particle.prototype.draw = function () {

		var p = this;

		if (p.radius_bubble != undefined) {
			var radius = p.radius_bubble;
		} else {
			var radius = p.radius;
		}

		if (p.opacity_bubble != undefined) {
			var opacity = p.opacity_bubble;
		} else {
			var opacity = p.opacity;
		}

		if (p.color.rgb) {
			var color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + opacity + ')';
		} else {
			var color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + opacity + ')';
		}

		pJS.canvas.ctx.fillStyle = color_value;
		pJS.canvas.ctx.beginPath();
		pJS.canvas.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
		pJS.canvas.ctx.closePath();
		pJS.canvas.ctx.fill();

	};

	pJS.fn.particle.prototype.drawMirrored = function () {

		var p = this;

		if (p.radius_bubble_mirror != undefined) {
			var radius = p.radius_bubble_mirror;
		} else {
			var radius = p.radius;
		}

		if (p.opacity_bubble_mirror != undefined) {
			var opacity = p.opacity_bubble_mirror;
		} else {
			var opacity = p.opacity;
		}

		if (p.color.rgb) {
			var color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + opacity + ')';
		} else {
			var color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + opacity + ')';
		}

		pJS.canvas.ctx.fillStyle = color_value;
		pJS.canvas.ctx.beginPath();
		pJS.canvas.ctx.arc(pJS.canvas.w - p.x, p.y, radius, 0, Math.PI * 2, false);
		pJS.canvas.ctx.closePath();
		pJS.canvas.ctx.fill();

	};


	pJS.fn.particlesCreate = function () {
		for (var i = 0; i < pJS.particles.number.value; i++) {
			pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value));
		}
	};

	pJS.fn.particlesUpdate = function () {

		for (var i = 0; i < pJS.particles.array.length; i++) {

			/* the particle */
			var p = pJS.particles.array[i];

			/* move the particle */
			if (pJS.particles.move.enable) {
				var ms = pJS.particles.move.speed / 2;
				p.x += p.vx * ms;
				p.y += p.vy * ms;
			}

			/* change particle position if it is out of canvas */
			var new_pos = {
				x_left: -p.radius,
				x_right: pJS.canvas.w + p.radius,
				y_top: -p.radius,
				y_bottom: pJS.canvas.h + p.radius
			}

			if (p.x - p.radius > pJS.canvas.w) {
				p.x = new_pos.x_left;
				p.y = Math.random() * pJS.canvas.h;
			}
			else if (p.x + p.radius < 0) {
				p.x = new_pos.x_right;
				p.y = Math.random() * pJS.canvas.h;
			}
			if (p.y - p.radius > pJS.canvas.h) {
				p.y = new_pos.y_top;
				p.x = Math.random() * pJS.canvas.w;
			}
			else if (p.y + p.radius < 0) {
				p.y = new_pos.y_bottom;
				p.x = Math.random() * pJS.canvas.w;
			}

			/* events */
			if (pJS.interactivity.events.onhover) {
				pJS.fn.modes.bubbleParticle(p);
				if (pJS.particles.mirrored) pJS.fn.modes.bubbleParticleMirrored(p);
			}
		}

	};

	pJS.fn.particlesDraw = function () {

		/* clear canvas */
		pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

		/* update each particles param */
		pJS.fn.particlesUpdate();

		/* draw each particle */
		for (var i = 0; i < pJS.particles.array.length; i++) {
			var p = pJS.particles.array[i];
			p.draw();
			if (pJS.particles.mirrored) p.drawMirrored();
		}

	};

	pJS.fn.particlesEmpty = function () {
		pJS.particles.array = [];
	};

	pJS.fn.particlesRefresh = function () {

		/* init all */
		cancelRequestAnimFrame(pJS.fn.checkAnimFrame);
		cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
		pJS.tmp.source_svg = undefined;
		pJS.tmp.img_obj = undefined;
		pJS.tmp.count_svg = 0;
		pJS.fn.particlesEmpty();
		pJS.fn.canvasClear();

		/* restart */
		pJS.fn.vendors.start();

	};

	/* ---------- pJS functions - modes events ------------ */

	pJS.fn.modes.pushParticles = function (nb, pos) {

		pJS.tmp.pushing = true;

		for (var i = 0; i < nb; i++) {
			pJS.particles.array.push(
				new pJS.fn.particle(
					pJS.particles.color,
					pJS.particles.opacity.value,
					{
						'x': pos ? pos.pos_x : Math.random() * pJS.canvas.w,
						'y': pos ? pos.pos_y : Math.random() * pJS.canvas.h
					}
				)
			);
			if (i == nb - 1) {
				if (!pJS.particles.move.enable) {
					pJS.fn.particlesDraw();
				}
				pJS.tmp.pushing = false;
			}
		}

	};


	pJS.fn.modes.removeParticles = function (nb) {

		pJS.particles.array.splice(0, nb);
		if (!pJS.particles.move.enable) {
			pJS.fn.particlesDraw();
		}

	};

	pJS.fn.modes.bubbleParticle = function (p) {

		var dx_mouse = p.x - pJS.interactivity.mouse.pos_x,
			dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
			dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
			ratio = 1 - dist_mouse / pJS.interactivity.bubble.distance;

		function init() {
			p.opacity_bubble = p.opacity;
			p.radius_bubble = p.radius;
		}

		/* mousemove - check ratio */
		if (dist_mouse <= pJS.interactivity.bubble.distance) {

			if (ratio >= 0 && pJS.interactivity.status == 'mousemove') {

				/* size */
				if (pJS.interactivity.bubble.size != pJS.particles.size.value) {

					if (pJS.interactivity.bubble.size > pJS.particles.size.value) {
						var size = p.radius + (pJS.interactivity.bubble.size * ratio);
						if (size >= 0) {
							p.radius_bubble = size;
						}
					} else {
						var dif = p.radius - pJS.interactivity.bubble.size,
							size = p.radius - (dif * ratio);
						if (size > 0) {
							p.radius_bubble = size;
						} else {
							p.radius_bubble = 0;
						}
					}

				}

				/* opacity */
				if (pJS.interactivity.bubble.opacity != pJS.particles.opacity.value) {

					if (pJS.interactivity.bubble.opacity > pJS.particles.opacity.value) {
						var opacity = pJS.interactivity.bubble.opacity * ratio;
						if (opacity > p.opacity && opacity <= pJS.interactivity.bubble.opacity) {
							p.opacity_bubble = opacity;
						}
					} else {
						var opacity = p.opacity - (pJS.particles.opacity.value - pJS.interactivity.bubble.opacity) * ratio;
						if (opacity < p.opacity && opacity >= pJS.interactivity.bubble.opacity) {
							p.opacity_bubble = opacity;
						}
					}

				}

			}

		} else {
			init();
		}


		/* mouseleave */
		if (pJS.interactivity.status == 'mouseleave') {
			init();
		}
	};

	pJS.fn.modes.bubbleParticleMirrored = function (p) {

		var dx_mouse = pJS.canvas.w - p.x - pJS.interactivity.mouse.pos_x,
			dy_mouse = p.y - pJS.interactivity.mouse.pos_y,
			dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
			ratio = 1 - dist_mouse / pJS.interactivity.bubble.distance;

		function init() {
			p.opacity_bubble_mirror = p.opacity;
			p.radius_bubble_mirror = p.radius;
		}

		/* mousemove - check ratio */
		if (dist_mouse <= pJS.interactivity.bubble.distance) {

			if (ratio >= 0 && pJS.interactivity.status == 'mousemove') {

				/* size */
				if (pJS.interactivity.bubble.size != pJS.particles.size.value) {

					if (pJS.interactivity.bubble.size > pJS.particles.size.value) {
						var size = p.radius + (pJS.interactivity.bubble.size * ratio);
						if (size >= 0) {
							p.radius_bubble_mirror = size;
						}
					} else {
						var dif = p.radius - pJS.interactivity.bubble.size,
							size = p.radius - (dif * ratio);
						if (size > 0) {
							p.radius_bubble_mirror = size;
						} else {
							p.radius_bubble_mirror = 0;
						}
					}

				}

				/* opacity */
				if (pJS.interactivity.bubble.opacity != pJS.particles.opacity.value) {

					if (pJS.interactivity.bubble.opacity > pJS.particles.opacity.value) {
						var opacity = pJS.interactivity.bubble.opacity * ratio;
						if (opacity > p.opacity && opacity <= pJS.interactivity.bubble.opacity) {
							p.opacity_bubble_mirror = opacity;
						}
					} else {
						var opacity = p.opacity - (pJS.particles.opacity.value - pJS.interactivity.bubble.opacity) * ratio;
						if (opacity < p.opacity && opacity >= pJS.interactivity.bubble.opacity) {
							p.opacity_bubble_mirror = opacity;
						}
					}

				}

			}

		} else {
			init();
		}


		/* mouseleave */
		if (pJS.interactivity.status == 'mouseleave') {
			init();
		}
	};

	/* ---------- pJS functions - vendors ------------ */

	pJS.fn.vendors.eventsListeners = function () {

		/* events target element */
		if (pJS.interactivity.detect_on == 'window') {
			pJS.interactivity.el = window;
		} else {
			pJS.interactivity.el = pJS.canvas.el;
		}


		/* detect mouse pos - on hover */
		if (pJS.interactivity.events.onhover) {

			/* el on mousemove */
			pJS.interactivity.el.addEventListener('mousemove', function (e) {

				if (pJS.interactivity.el == window) {
					var pos_x = e.clientX,
						pos_y = e.clientY;
				}
				else {
					var pos_x = e.offsetX || e.clientX,
						pos_y = e.offsetY || e.clientY;
				}

				pJS.interactivity.mouse.pos_x = pos_x;
				pJS.interactivity.mouse.pos_y = pos_y;

				if (pJS.tmp.retina) {
					pJS.interactivity.mouse.pos_x *= pJS.canvas.pxratio;
					pJS.interactivity.mouse.pos_y *= pJS.canvas.pxratio;
				}

				pJS.interactivity.status = 'mousemove';

			});

			/* el on onmouseleave */
			pJS.interactivity.el.addEventListener('mouseleave', function (e) {

				pJS.interactivity.mouse.pos_x = null;
				pJS.interactivity.mouse.pos_y = null;
				pJS.interactivity.status = 'mouseleave';

			});

		}
	};

	pJS.fn.vendors.densityAutoParticles = function () {

		if (pJS.particles.number.density.enable) {

			/* calc area */
			var area = pJS.canvas.el.width * pJS.canvas.el.height / 1000;
			if (pJS.tmp.retina) {
				area = area / (pJS.canvas.pxratio * 2);
			}

			/* calc number of particles based on density area */
			var nb_particles = area * pJS.particles.number.value / pJS.particles.number.density.value_area;

			/* add or remove X particles */
			var missing_particles = pJS.particles.array.length - nb_particles;
			if (missing_particles < 0) pJS.fn.modes.pushParticles(Math.abs(missing_particles));
			else pJS.fn.modes.removeParticles(missing_particles);

		}

	};


	pJS.fn.vendors.checkOverlap = function (p1, position) {
		for (var i = 0; i < pJS.particles.array.length; i++) {
			var p2 = pJS.particles.array[i];

			var dx = p1.x - p2.x,
				dy = p1.y - p2.y,
				dist = Math.sqrt(dx * dx + dy * dy);

			if (dist <= p1.radius + p2.radius) {
				p1.x = position ? position.x : Math.random() * pJS.canvas.w;
				p1.y = position ? position.y : Math.random() * pJS.canvas.h;
				pJS.fn.vendors.checkOverlap(p1);
			}
		}
	};

	pJS.fn.vendors.destroypJS = function () {
		cancelAnimationFrame(pJS.fn.drawAnimFrame);
		canvas_el.remove();
		window.pJSDom = [];
	};

	pJS.fn.vendors.draw = function () {

		pJS.fn.particlesDraw();
		if (!pJS.particles.move.enable) cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
		else pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);

	};


	pJS.fn.vendors.checkBeforeDraw = function () {
		pJS.fn.vendors.init();
		pJS.fn.vendors.draw();
	};


	pJS.fn.vendors.init = function () {

		/* init canvas + particles */
		pJS.fn.retinaInit();
		pJS.fn.canvasInit();
		pJS.fn.canvasSize();
		pJS.fn.canvasPaint();
		pJS.fn.particlesCreate();
		pJS.fn.vendors.densityAutoParticles();

	};


	pJS.fn.vendors.start = function () {
		pJS.fn.vendors.checkBeforeDraw();
	};


	/* ---------- pJS - start ------------ */


	pJS.fn.vendors.eventsListeners();

	pJS.fn.vendors.start();


};

/* ---------- global functions - vendors ------------ */

Object.deepExtend = function (destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor &&
			source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
};

window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = (function () {
	return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout
})();

function hexToRgb(hex) {
	// By Tim Down - http://stackoverflow.com/a/5624139/3493650
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
};

function clamp(number, min, max) {
	return Math.min(Math.max(number, min), max);
};

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}


/* ---------- particles.js functions - start ------------ */

window.pJSDom = [];

window.particlesJS = function (tag_id, params) {

	/* no string id? so it's object params, and set the id with default id */
	if (typeof(tag_id) != 'string') {
		params = tag_id;
		tag_id = 'particles-js';
	}

	/* no id? set the id to default id */
	if (!tag_id) {
		tag_id = 'particles-js';
	}

	/* pJS elements */
	var pJS_tag = document.getElementById(tag_id),
		pJS_canvas_class = 'particles-js-canvas-el',
		exist_canvas = pJS_tag.getElementsByClassName(pJS_canvas_class);

	/* remove canvas if exists into the pJS target tag */
	if (exist_canvas.length) {
		while (exist_canvas.length > 0) {
			pJS_tag.removeChild(exist_canvas[0]);
		}
	}

	/* create canvas element */
	var canvas_el = document.createElement('canvas');
	canvas_el.className = pJS_canvas_class;

	/* set size canvas */
	canvas_el.style.width = "100%";
	canvas_el.style.height = "100%";

	/* append canvas */
	var canvas = document.getElementById(tag_id).appendChild(canvas_el);

	/* launch particle.js */
	if (canvas != null) {
		pJSDom.push(new pJS(tag_id, params));
	}

};

window.particlesJS.load = function (tag_id, path_config_json, callback) {

	/* load json config */
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path_config_json);
	xhr.onreadystatechange = function (data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var params = JSON.parse(data.currentTarget.response);
				window.particlesJS(tag_id, params);
				if (callback) callback();
			} else {
				console.log('Error pJS - XMLHttpRequest status: ' + xhr.status);
				console.log('Error pJS - File config not found');
			}
		}
	};
	xhr.send();

};
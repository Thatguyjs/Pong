const Gfx = {
	canvas: null,
	context: null,

	// Use canvas element for drawing
	useCanvas: function(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
	},

	// Resize active canvas
	resizeCanvas: function(width, height) {
		if(!width && width !== 0) width = window.innerWidth;
		if(!height && height !== 0) height = window.innerHeight;

		this.canvas.width = width;
		this.canvas.height = height;
	},

	// Clear canvas
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},


	// Return a color string from values
	color: function(r, g, b, a) {
		if(!r && r !== 0) r = 0;
		if(!g && g !== 0) g = r, b = r;
		if(!b && b !== 0) a = g, g = r, b = r;
		if(!a && a !== 0) a = 1;

		return `rgba(${r}, ${g}, ${b}, ${a})`;
	},


	// Set the fill color
	fill: function(r, g, b, a) {
		this.context.fillStyle = this.color(r, g, b, a);
	},

	// Remove fill color
	noFill: function() {
		this.context.fillStyle = "rgba(0, 0, 0, 0)";
	},


	// Set the stroke color
	stroke: function(r, g, b, a) {
		this.context.strokeStyle = this.color(r, g, b, a);
	},

	// Remove stroke color
	noStroke: function() {
		this.context.strokeStyle = "rgba(0, 0, 0, 0)";
	},

	// Set stroke thickness
	strokeWeight: function(weight) {
		this.context.lineWidth = weight;
	},


	// Set the background color
	background: function(r, g, b, a) {
		let color = this.context.fillStyle;

		this.fill(r, g, b, a);
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.fillStyle = color;
	},

	// Draw a rectangle
	rect: function(x, y, w, h) {
		this.context.beginPath();
		this.context.rect(x, y, w, h);
		this.context.fill();
		this.context.stroke();
	},

	// Draw a circle
	circle: function(x, y, r) {
		this.context.beginPath();
		this.context.arc(x, y, r, 0, 2*Math.PI);
		this.context.fill();
		this.context.stroke();
	}
};

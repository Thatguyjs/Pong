// A small library to render vertexes as a font

const FontReader = function() {
	if(!this.__proto__.isNew) throw new TypeError("Constructor FontReader requires 'new'");

	this.data = "";

	this.settings = new Map([
		["SCALE", null],
		["NAME", ""],
		["DESCRIPTION", ""],
		["SPACEWIDTH", 1],
		["TABWIDTH", 2]
	]);

	this.charSettings = [
		"WIDTH", "HEIGHT",
		"WEIGHT"
	];

	this.chars = {};

	this.error = false;
}
FontReader.prototype = {
	isNew: true,

	parseSetting: function(setting) {
		let value = this.data.slice(this.data.indexOf(setting)+setting.length);
		value = value.slice(1, value.indexOf('\r\n'));

		if(!!Number(value) || Number(value) === 0) {
			value = Number(value);
		}

		this.settings.set(setting, value);
	},

	parseChar: function(char) {
		this.chars[char] = {
			data: []
		};

		// Settings
		let settings = this.data.slice(this.data.indexOf('{')+1, this.data.indexOf('}'));
		settings = settings.replace(/\r|\n/g, ' ');

		for(let s in this.charSettings) {
			let match = settings.includes(this.charSettings[s]);

			if(match) {
				match = this.charSettings[s];

				let value = settings.slice(settings.indexOf(match)+match.length+1);
				if(value.includes(' ')) value = value.slice(0, value.indexOf(' '));

				this.chars[char][match.toLowerCase()] = Number(value);
			}
		}

		this.data = this.data.slice(this.data.indexOf('}')+1);

		// Vertexes (data)
		let data = this.data.slice(this.data.indexOf('{')+1, this.data.indexOf('}'));
		data = data.trim().replace(/\[|\]|\,/g, ' ').replace(/\s+/g, ' ').trim();

		this.chars[char].data = data.split(' ').map(function(item) {
			return Number(item);
		});

		this.chars[char].vertexes = this.chars[char].data.length/2;

		// Advance in data string
		this.data = this.data.slice(this.data.indexOf('}')+1);
	},

	read: function(string) {
		this.data = string;
		delete string;

		let keys = Array.from(this.settings.keys());

		for(let k in keys) {
			if(this.data.includes(keys[k])) {
				this.parseSetting(keys[k]);
			}
		}

		// Go to body
		this.data = this.data.slice(this.data.indexOf('\r\n\r\n')+4);
		this.data = this.data.replace(/\s+/, '');

		while(!this.error && !!this.data) {
			this.parseChar(this.data[0]);
			this.data = this.data.trim();
		}

		if(this.error) {
			return {error: true};
		}

		return {
			settings: this.settings,
			chars: this.chars
		};
	}
};

let Text = function() {
	this.font = {
		name: "",
		description: "",
		size: 16
	};

	this.letters = {};

	this.align = { x: "LEFT", y: "BOTTOM" };
	this.offset = { x: 0, y: 0 };

	this.context = null;
}
Text.prototype = {

	// Set font to be used
	loadFont: function(font) {
		if(typeof font === 'string') {
			let reader = new FontReader();
			reader = reader.read(font);

			for(let [key, value] of reader.settings) {
				this.font[key.toLowerCase()] = value;
			}

			this.letters = reader.chars;
		}
	},

	// Set context to be rendered to
	setContext: function(context) {
		this.context = context;
	},


	// Sets alignment (offset) of text
	setAlign: function(xalign, yalign) {

	},

	// Set font size
	fontSize: function(size) {
		if(typeof size !== 'number') {
			throw new Error("fontSize only accepts numbers");
		}

		this.font.size = size;
	},

	// Render a string at an x and y value
	render: function(string, x, y) {
		string = string.toString();

		// ERROR CATCHING

		if(!this.context) {
			throw new Error("No drawing context set!");
		}

		if(!Object.keys(this.letters).length) {
			throw new Error("No font loaded!");
		}

		// SETTINGS

		let pastStyle = this.context.strokeStyle;
		let pastWidth = this.context.lineWidth;

		this.context.strokeStyle = this.context.fillStyle;

		// RENDERING

		let width = 0;

		for(let c in string) {
			if(string[c] === ' ') {
				width += this.font.size * this.font.spacewidth * 1.2;
				continue;
			}
			else if(string[c] === '\t') {
				width += this.font.size * this.font.tabwidth * 1.2;
				continue;
			}

			if(!this.letters[string[c]]) {
				console.info(`The letter '${string[c]}' is not supported by the current font`);
				continue;
			}

			this.context.lineWidth = this.font.size * this.letters[string[c]].weight;

			let charSize = {
				x: this.font.size * this.letters[string[c]].width,
				y: this.font.size * this.letters[string[c]].height
			};

			let vertexes = this.letters[string[c]].data;

			this.context.beginPath();
			this.context.moveTo(vertexes[0]*charSize.x + x+width, vertexes[1]*charSize.y + y - charSize.y/2);
			for(let v = 1; v < this.letters[string[c]].vertexes; v++) {
				this.context.lineTo(vertexes[v*2]*charSize.x + x+width, vertexes[v*2+1]*charSize.y + y - charSize.y/2);
			}
			this.context.stroke();

			width += (charSize.x + this.context.lineWidth) * 1.2;
		}

		// RESTORE SETTINGS

		this.context.strokeStyle = pastStyle;
		this.context.lineWidth = pastWidth;
	}
};

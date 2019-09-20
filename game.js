class GameObject {
	constructor(winScore=10) {
		this.winningScore = winScore;

		this.players = [
			new Player(100, window.innerHeight/2, {
				up: 87,
				down: 83
			}),
			new Player(window.innerWidth-100, window.innerHeight/2, {
				up: 38,
				down: 40
			})
		];

		this.balls = [
			new Ball(window.innerWidth/2, window.innerHeight/2)
		];

		this.launch = {
			xmin: 4,
			xmax: 7,
			ymin: -3,
			ymax: 3
		};

		this.text = new Text();

		this.moveKeys = null;

		this.paused = false;
		this.finished = false;
	}


	/*
		INITIALIZE & SCORING
	*/

	init() {
		for(let b in this.balls) {
			this.balls[b].onscore = this.score;

			if(Math.random() < 0.5) {
				this.balls[b].launch(
					-this.launch.xmin, -this.launch.xmax,
					this.launch.ymin, this.launch.ymax
				);
			}
			else {
				this.balls[b].launch(
					this.launch.xmin, this.launch.xmax,
					this.launch.ymin, this.launch.ymax
				);
			}
		}

		// Load font
		this.text.setContext(Gfx.context);
		this.text.loadFont(FONT);

		// Setup (pause)
		this.pause(true);

		window.onload = function() {
			if(typeof Game.onload === 'function') Game.onload();
		}
	}

	// Score (Ball = parent)
	score(side) {
		this.reset(window.innerWidth/2, Math.random()*window.innerHeight);

		if(side === 'left') {
			Game.players[0].score++;
			this.launch(
				-Game.launch.xmin, -Game.launch.xmax,
				Game.launch.ymin, Game.launch.ymax
			);
		}
		else if(side === 'right') {
			Game.players[1].score++;
			this.launch(
				Game.launch.xmax, Game.launch.xmin,
				Game.launch.ymin, Game.launch.ymax
			);
		}
	}


	/*
		KEY HANDLING
	*/

	setKeys(keys) {
		this.moveKeys = keys;
	}

	keyPressed(key) {
		if(this.moveKeys.get(key.which) === false) {
			this.moveKeys.set(key.which, true);
		}
	}

	keyReleased(key) {
		if(this.moveKeys.get(key.which)) {
			this.moveKeys.set(key.which, false);
		}
	}


	/*
		UPDATING & RENDERING & PAUSING
	*/

	update() {
		for(let p in this.players) {
			if(this.players[p].score >= this.winningScore) {
				this.pause(true);

				this.finished = Number(p);
				this.text.fontSize(50);
				break;
			}
		}
	}

	render() {
		Gfx.clear();
		Gfx.background(0);

		for(let p in this.players) {
			this.players[p].move(this.moveKeys);
			this.players[p].render();
		}

		let lineScale = window.innerHeight/32;

		Gfx.fill(60);
		for(let l = 0; l < 16; l++) {
			Gfx.rect(window.innerWidth/2-2, l*lineScale*2, 4, lineScale);
		}

		Gfx.fill(255);
		this.text.fontSize(70);
		this.text.render(this.players[0].score, Gfx.canvas.width/3-40, 100);
		this.text.render(this.players[1].score, Gfx.canvas.width/1.5, 100);

		for(let b in this.balls) {
			this.balls[b].render(this.players);
		}

		if(this.finished !== false) {
			this.displayWin(this.finished);
		}
		else if(this.paused) {
			Gfx.fill(50);
			this.text.fontSize(30);
			this.text.render("PAUSED", window.innerWidth/2-60, window.innerHeight-100);
		}
	}

	pause(paused) {
		this.paused = paused;

		for(let p in this.players) {
			this.players[p].paused = paused;
		}
		for(let b in this.balls) {
			this.balls[b].paused = paused;
		}
	}


	/*
		WIN STATE
	*/

	displayWin(player) {
		this.text.fontSize(60);
		this.text.render(`PLAYER ${player+1} WINS`, window.innerWidth/2-280, window.innerHeight/2);
	}
}

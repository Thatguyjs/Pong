class Ball {
	constructor(x, y, id) {
		this.reset(x, y);

		this.maxVel = {
			x: 50,
			y: 14
		};

		this.paused = false;
		this.onscore = function() {};
	}

	reset(x, y) {
		this.x = x;
		this.y = y;
		this.size = 10;

		this.vel = {x: 0, y: 0};
	}

	launch(xmin, xmax, ymin, ymax) {
		this.vel.x = Math.random()*(xmax-xmin)+xmin;
		this.vel.y = Math.random()*(ymax-ymin)+ymin;
	}

	update(players) {
		if(this.paused) return;

		if(this.vel.x > this.maxVel.x) this.vel.x = this.maxVel.x;
		else if(this.vel.x < -this.maxVel.x) this.vel.x = -this.maxVel.x;

		if(this.vel.y > this.maxVel.y) this.vel.y = this.maxVel.y;
		else if(this.vel.y < -this.maxVel.y) this.vel.y = -this.maxVel.y;

		this.x += this.vel.x;
		this.y += this.vel.y;

		// Bounce off top / bottom
		if(this.y-this.size/2 < 0) {
			this.y = this.size/2;
			this.vel.y = -this.vel.y;
		}
		else if(this.y+this.size/2 > window.innerHeight) {
			this.y = window.innerHeight-this.size/2;
			this.vel.y = -this.vel.y;
		}

		// Hit paddle (Smart collisions: cast)
		for(let p in players) {
			if(this.y+this.size/2 > players[p].y-players[p].height/2-players[p].vel.y/2 &&
				this.y-this.size/2 < players[p].y+players[p].height/2-players[p].vel.y/2) {

				let next = {
					x: this.x + this.vel.x,
					y: this.y + this.vel.y
				};

				let min = {
					x: Math.min(this.x, next.x),
					y: Math.min(this.y, next.y)
				};

				let max = {
					x: Math.max(this.x, next.x),
					y: Math.max(this.y, next.y)
				};

				if(players[p].x > min.x && players[p].x < max.x) {
					this.x = players[p].x;
					this.vel.x = -this.vel.x*1.2;

					this.vel.y += players[p].vel.y/3;
					break;
				}
			}
		}

		// Score
		if(this.x < 0) this.onscore('right');
		else if(this.x > window.innerWidth) this.onscore('left');
	}

	render(players) {
		this.update(players);

		Gfx.fill(255);
		Gfx.rect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
	}
}

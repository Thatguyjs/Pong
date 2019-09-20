class Player {
	constructor(x, y, keys) {
		this.x = x;
		this.y = y;
		this.width = 8;
		this.height = 80;

		this.vel = {x: 0, y: 0};
		this.maxVel = 12;

		this.keys = keys;
		this.paused = false;
		this.moving = false;

		this.score = 0;
	}

	move(keyList) {
		if(this.paused) return;

		if(keyList.get(this.keys.up)) {
			this.moving = true;
			this.vel.y -= this.maxVel/8;
		}
		if(keyList.get(this.keys.down)) {
			this.moving = true;
			this.vel.y += this.maxVel/8;
		}

		if(this.vel.y > this.maxVel) this.vel.y = this.maxVel;
		else if(this.vel.y < -this.maxVel) this.vel.y = -this.maxVel;
	}

	update() {
		if(this.paused) return;

		this.x += this.vel.x;
		this.y += this.vel.y;

		if(this.moving) this.moving = false;
		else {
			this.vel.x /= 1.1;
			this.vel.y /= 1.1;
		}

		if(Math.abs(this.vel.x) < 0.1) this.vel.x = 0;
		if(Math.abs(this.vel.y) < 0.1) this.vel.y = 0;

		if(this.y < this.height/2) {
			this.y = this.height/2;
			this.vel.y = 0;
		}
		else if(this.y > window.innerHeight-this.height/2) {
			this.y = window.innerHeight-this.height/2;
			this.vel.y = 0;
		}
	}

	render() {
		this.update();

		Gfx.fill(255);
		Gfx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
	}
}

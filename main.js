// Setup canvas and Gfx library
Gfx.useCanvas(document.getElementById("cnv"));
Gfx.resizeCanvas();
Gfx.noStroke();


// Create & setup game
const Game = new GameObject(10);

Game.init();

Game.setKeys(new Map([
	[87, false],
	[83, false],
	[38, false],
	[40, false]
]));


// Updating and rendering
function update() {
	Game.update();
	Game.render();

	window.requestAnimationFrame(update);
}

Game.onload = function() {
	window.requestAnimationFrame(update);
}


// Key events
document.onkeydown = function(key) {
	// Prevent window from reloading
	if(key.which === 82 && key.ctrlKey) {
		key.preventDefault();
	}

	// Pause / unpause
	if(key.which === 32) {
		if(Game.finished !== false) {
			window.location.reload();
		}
		else {
			Game.pause(!Game.paused);
		}
		return;
	}

	Game.keyPressed(key);
}
document.onkeyup = function(key) {
	Game.keyReleased(key);
}

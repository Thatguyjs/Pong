const http = require("http");
const fs = require("fs");

function handler(req, res) {
	let data = "";

	try {
		data = fs.readFileSync('.' + req.url);
	}
	catch(err) {
		res.writeHead(404);

		res.write("404 Not Found");
		res.end();

		return;
	}

	res.writeHead(200);

	res.write(data);
	res.end();
}

const server = http.createServer(handler);

server.listen(8080, "127.0.0.1", function() {
	console.log("Listening!");
});

const express = require("express");
const fs = require("fs");
const musicmetadata = require("music-metadata");

const app = express();

app.get("/music", (req,res) => {
	// File to be served

	const fileId = req.query.id;
	const type = req.query.type;
	const file = __dirname + "/../public/music/" + fileId;

	fs.exists(file,function(exists){
		if(exists) {
			const rstream = fs.createReadStream(file);
			switch (type) {
				case "stream":
					rstream.pipe(res);

					break;

				case "meta":
					res.setHeader("Access-Control-Allow-Origin", "*");
					res.setHeader("Content-type", "application/json");

					const parser = musicmetadata.parseStream(rstream).then( (metadata) => {
						res.send(metadata);
						res.end();
					//	rstream.close();
					}).catch(err => {
						console.error(err);
						res.send(err);
						res.end();
					});

					break;

				default:
					res.setHeader("Content-disposition", "attachment; filename=" + fileId);
					rstream.pipe(res);
			}

		} else {
			res.send("Its a 404");
			res.end();
		}

	});
});

app.use(express.static(__dirname + "/../public/"));

app.listen(8000, () => console.log("App listening on port 8000!") );

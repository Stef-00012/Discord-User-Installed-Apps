const mongoose = require("mongoose");

module.exports = (client) => {
	mongoose
		.connect(client.config.mongo)
		.then(() => {
			console.log(
				"\x1b[33mSuccessfully connected to the database (MongoDB)\x1b[0m",
			);
		})
		.catch((err) => {
			console.log(
				err,
				"\x1b[31mThere was an error while connecting to the database (MongoDB)\x1b[0m",
			);
		});
};

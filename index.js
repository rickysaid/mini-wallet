var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var sqlite = require("sqlite3");
var env = require("dotenv").config();
var port = process.env.PORT || 8080;

var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

require("./routes/routes")(app);

const { Sequelize } = require("sequelize");

// models
var models = require("./models");

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

models.sequelize
	.sync()
	.then(function () {
		console.log("connected to database");
	})
	.catch(function (err) {
		console.log(err);
	});

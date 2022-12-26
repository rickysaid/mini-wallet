const jwt = require("jsonwebtoken");
const config = require("../config/config");
const db = require("../models");
const UserAuthenticate = db.UserAuthenticate;
const User = db.user;

function verifyToken(req, res, next) {
	let token = req.headers["authorization"];

	if (!token) {
		return res.status(403).send({
			message: "No token provided!",
		});
	}

	token = token.split(" ")[1];

	UserAuthenticate.findAll({ where: { token: token } })
		.then((data) => {
			if (data.length != 0) {
				// TODO: checks for token expiration date
				req.user_id = data[0]["user_id"];
				next();
			} else {
				res.status(403).send({
					data: {
						error: {
							Authorization: ["Token not found or Expired"],
						},
					},
					status: "fail",
				});
			}
		})
		.catch((err) => {
			res.status(403).send({
				data: {
					error: {
						Authorization: ["Token not found or Expired"],
					},
				},
				status: "fail",
			});
		});
}

module.exports = { verifyToken };

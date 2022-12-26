const config = require("../config/config");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Wallet = db.Wallet;
const UserAuthenticate = db.UserAuthenticate;
const uuid = require("uuid");

function createWallet(req, res) {
	Wallet.create({
		id: uuid.v4(),
		owner: req.body.customer_xid,
		enabled: false,
	}).catch((err) => {
		res.status(500).send({ message: err.message });
	});
}

function createToken(req, res) {
	let token = jwt.sign({ id: req.body.customer_xid }, config.auth.secret, {
		expiresIn: 86400, // 24 hours
	});
	UserAuthenticate.create({
		token: token,
		user_id: req.body.customer_xid,
	}).catch((err) => {
		res.status(500).send({ message: err.message });
	});
	return token;
}

function signup(req, res) {
	// Validate request
	if (!req.body.customer_xid) {
		res.status(400).send({
			data: {
				error: {
					customer_xid: ["Missing data for required field."],
				},
			},
			status: "fail",
		});
		return;
	}

	User.create({
		customer_xid: req.body.customer_xid,
	})
		.then((user) => {
			// create wallet
			createWallet(req, res);
			token = createToken(req, res);
			res.send({
				data: { token: token },
				status: "success",
			});
		})
		.catch((err) => {
			res.status(500).send({
				data: {
					error: {
						customer_xid: ["Missing data for required field."],
					},
				},
				status: "fail",
			});
		});
}

module.exports = { signup };

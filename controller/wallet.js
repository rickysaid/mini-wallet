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

async function enable(req, res) {
	Wallet.update(
		{ enabled: true, enabled_at: new Date() },
		{
			where: { owner: req.user_id },
		}
	)
		.then(async function (data) {
			// TODO: need to refactor the callback hell
			Wallet.findAll({ where: { owner: req.user_id } })
				.then((data) => {
					res.send({
						data: {
							wallet: {
								id: data[0]["id"],
								owned_by: data[0]["owner"],
								status: "enabled",
								enabled_at: data[0]["enabled_at"],
								balance: data[0]["enabled_at"],
							},
						},
						status: "success",
					});
				})
				.catch((err) => {
					res.status(400).send({
						data: {
							error: "Wallet not Found",
						},
						status: "fail",
					});
				});
		})
		.catch((err) => {
			res.status(400).send({
				data: {
					error: "Already enabled",
				},
				status: "fail",
			});
		});
}

function disable(req, res) {
	Wallet.update(
		{ enabled: false, disabled_at: new Date() },
		{
			where: { owner: req.user_id },
		}
	)
		.then((data) => {
			// TODO: need to refactor the callback hell
			Wallet.findAll({ where: { owner: req.user_id } })
				.then((data) => {
					res.send({
						data: {
							wallet: {
								id: data[0]["id"],
								owned_by: data[0]["owner"],
								status: "disabled",
								disabled_at: data[0]["disabled_at"],
								balance: data[0]["enabled_at"],
							},
						},
						status: "success",
					});
				})
				.catch((err) => {
					res.status(400).send({
						data: {
							error: "Wallet not Found",
						},
						status: "fail",
					});
				});
		})
		.catch((err) => {
			res.status(400).send({
				data: {
					error: "Already disabled",
				},
				status: "fail",
			});
		});
}

function wallet_balance(req, res) {
	Wallet.findAll({ where: { owner: req.user_id } })
		.then((data) => {
			if (data.length != 0) {
				res.send({
					data: {
						wallet: {
							id: data[0]["id"],
							owned_by: data[0]["owner"],
							status: "enabled",
							enabled_at: data[0]["enabled_at"],
							balance: data[0]["enabled_at"],
						},
					},
					status: "success",
				});
			} else {
				res.status(400).send({
					data: {
						error: "Wallet not found",
					},
					status: "fail",
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				data: {
					error: "Wallet not found",
				},
				status: "fail",
			});
		});
}

module.exports = { enable, disable, wallet_balance };

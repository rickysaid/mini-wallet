const db = require("../models");
const Wallet = db.Wallet;

function verifyDisable(req, res, next) {
	Wallet.findAll({ where: { owner: req.user_id } })
		.then((data) => {
			if (data.length != 0) {
				enabled = data[0]["enabled"];
				if (!enabled) {
					next();
					return;
				}
			}
			res.status(400).send({
				data: {
					error: "Already enabled",
				},
				status: "fail",
			});
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

function verifyEnable(req, res, next) {
	Wallet.findAll({ where: { owner: req.user_id } })
		.then((data) => {
			if (data.length != 0) {
				enabled = data[0]["enabled"];
				if (enabled) {
					next();
					return;
				}
			}
			res.status(400).send({
				data: {
					error: "Already disabled",
				},
				status: "fail",
			});
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

// TODO: merge verifyEnable & verifyEnableAPI into 1 (similar function)
function verifyEnableAPI(req, res, next) {
	Wallet.findAll({ where: { owner: req.user_id } })
		.then((data) => {
			if (data.length != 0) {
				enabled = data[0]["enabled"];
				if (enabled) {
					next();
					return;
				}
			}
			res.status(400).send({
				data: {
					error: "Wallet is disabled",
				},
				status: "fail",
			});
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

module.exports = { verifyEnable, verifyDisable, verifyEnableAPI };

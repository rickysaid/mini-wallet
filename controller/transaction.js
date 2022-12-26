const db = require("../models");
const Wallet = db.Wallet;
const Transaction = db.Transaction;
const uuid = require("uuid");

function createTransaction(req, res, status) {
	transactionAmount = req.body.amount;

	if (status == "withdraw") transactionAmount *= -1;

	transaction_data = Transaction.create({
		id: uuid.v4(),
		reference_id: req.body.reference_id,
		wallet_id: req.wallet_id,
		deposited_by: req.user_id,
		amount: transactionAmount,
		status: status,
	})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return false;
		});

	return transaction_data;
}

function findWallet(req, res) {
	walletData = Wallet.findAll({ where: { owner: req.user_id } })
		.then((data) => {
			if (data.length != 0) return data;
			return;
		})
		.catch((err) => {
			return;
		});
	return walletData;
}

async function deposit(req, res) {
	// get wallet & create transaction
	walletData = await findWallet(req, res);
	if (!walletData) {
		res.status(400).send({
			data: {
				error: "Wallet not found",
			},
			status: "fail",
		});
		return;
	}
	req.wallet_id = walletData[0]["id"];

	createTrans = await createTransaction(req, res, "deposit");
	if (!createTrans) {
		res.status(400).send({
			data: {
				transaction: "reference_id already used",
			},
			status: "fail",
		});
		return;
	}

	// update wallet balance
	Wallet.update(
		{
			balance:
				parseFloat(walletData[0]["balance"]) + parseFloat(req.body.amount),
		},
		{
			where: { id: walletData[0]["id"] },
		}
	).catch((err) => {
		res.status(400).send({
			data: {
				error: "Wallet not found",
			},
			status: "fail",
		});
		return;
	});

	//get transaction for return data
	Transaction.findAll({ where: { reference_id: req.body.reference_id } })
		.then(async function (data) {
			if (data.length != 0) {
				res.send({
					data: {
						deposit: {
							id: data[0]["id"],
							deposited_by: data[0]["deposited_by"],
							status: "success",
							deposited_at: data[0]["created_at"],
							amount: data[0]["amount"],
							reference_id: data[0]["reference_id"],
						},
					},
					status: "success",
				});
			} else {
				res.status(400).send({
					data: {
						error: "Transaction not found",
					},
					status: "fail",
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				data: {
					error: "Transaction not found",
				},
				status: "fail",
			});
		});
}

async function withdraw(req, res) {
	// get wallet & create transaction
	walletData = await findWallet(req, res);
	if (!walletData) {
		res.status(400).send({
			data: {
				error: "Wallet not found",
			},
			status: "fail",
		});
		return;
	}
	req.wallet_id = walletData[0]["id"];

	if (parseFloat(walletData[0]["balance"]) - parseFloat(req.body.amount) < 0) {
		//cannot withdraw, not enough fund
		res.status(400).send({
			data: {
				error: "Cannot withdraw, not enough balance",
			},
			status: "fail",
		});
		return;
	}
	// create transaction withdraw
	createTrans = await createTransaction(req, res, "withdraw");
	if (!createTrans) {
		res.status(400).send({
			data: {
				transaction: "reference_id already used",
			},
			status: "fail",
		});
		return;
	}

	// update wallet balance
	Wallet.update(
		{
			balance:
				parseFloat(walletData[0]["balance"]) - parseFloat(req.body.amount),
		},
		{
			where: { id: walletData[0]["id"] },
		}
	).catch((err) => {
		res.status(400).send({
			data: {
				error: "Wallet not found",
			},
			status: "fail",
		});
		return;
	});

	//get transaction for return data
	Transaction.findAll({ where: { reference_id: req.body.reference_id } })
		.then(async function (data) {
			if (data.length != 0) {
				res.send({
					data: {
						withdrawal: {
							id: data[0]["id"],
							withdrawn_by: data[0]["deposited_by"],
							status: "success",
							withdrawn_at: data[0]["created_at"],
							amount: data[0]["amount"] * -1,
							reference_id: data[0]["reference_id"],
						},
					},
					status: "success",
				});
			} else {
				res.status(400).send({
					data: {
						error: "Transaction not found",
					},
					status: "fail",
				});
			}
		})
		.catch((err) => {
			res.status(400).send({
				data: {
					error: "Transaction not found",
				},
				status: "fail",
			});
		});
}

module.exports = { deposit, withdraw };

const loginAuth = require("../middlewares/authorization");
const walletAuth = require("../middlewares/wallet");

const user = require("../controller/user");
const transaction = require("../controller/transaction");
const wallet = require("../controller/wallet");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);

		next();
	});

	app.get("/", (req, res) => {
		res.json({ message: "Hi there, welcome to this mini wallet." });
	});

	// create account
	app.post("/api/v1/init", function (req, res) {
		user.signup(req, res);
	});

	// enable wallet, wallet gave to be disabled before
	app.post(
		"/api/v1/wallet",
		[loginAuth.verifyToken, walletAuth.verifyDisable],
		wallet.enable
	);

	// get wallet balance
	app.get(
		"/api/v1/wallet",
		[loginAuth.verifyToken, walletAuth.verifyEnableAPI],
		wallet.wallet_balance
	);

	// deposit money to wallet
	app.post(
		"/api/v1/wallet/deposits",
		[loginAuth.verifyToken, walletAuth.verifyEnableAPI],
		transaction.deposit
	);

	// use virtual money
	app.post(
		"/api/v1/wallet/withdrawals",
		[loginAuth.verifyToken, walletAuth.verifyEnableAPI],
		transaction.withdraw
	);

	// disable wallet
	app.patch(
		"/api/v1/wallet",
		[loginAuth.verifyToken, walletAuth.verifyEnable],
		wallet.disable
	);
};

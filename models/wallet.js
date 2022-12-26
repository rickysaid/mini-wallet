module.exports = function (sequelize, Sequalize) {
	var WalletSchema = sequelize.define(
		"Wallet",
		{
			id: {
				type: "UUID",
				primaryKey: true,
			},
			owner: Sequalize.UUID,
			enabled: Sequalize.BOOLEAN,
			enabled_at: {
				type: "TIMESTAMP",
				allowNull: true,
			},
			disabled_at: {
				type: "TIMESTAMP",
				allowNull: true,
			},
			balance: {
				type: "DECIMAL",
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			timestamps: true,
		}
	);
	return WalletSchema;
};

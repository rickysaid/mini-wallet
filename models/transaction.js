module.exports = function (sequelize, Sequalize) {
	var TransactionSchema = sequelize.define(
		"Transaction",
		{
			id: {
				type: "UUID",
				primaryKey: true,
			},
			wallet_id: Sequalize.UUID,
			reference_id: {
				type: "UUID",
				allowNull: false,
				unique: true,
			},
			deposited_by: {
				type: "UUID",
				allowNull: false,
			},
			created_at: {
				type: "TIMESTAMP",
				defaultValue: Sequalize.NOW,
				allowNull: false,
			},
			amount: Sequalize.DECIMAL,
			status: Sequalize.STRING,
		},
		{
			timestamps: false,
		}
	);
	return TransactionSchema;
};

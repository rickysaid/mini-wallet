module.exports = function (sequelize, Sequalize) {
	var UserSchema = sequelize.define(
		"User",
		{
			customer_xid: {
				type: Sequalize.UUID,
				primaryKey: true,
			},
		},
		{
			timestamps: true,
		}
	);
	return UserSchema;
};

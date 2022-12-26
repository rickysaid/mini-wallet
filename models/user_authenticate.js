module.exports = function (sequelize, Sequalize) {
	var UserAuthenticateSchema = sequelize.define(
		"UserAuthenticate",
		{
			user_id: Sequalize.UUID,
			token: Sequalize.STRING,
		},
		{
			timestamps: true,
		}
	);
	return UserAuthenticateSchema;
};

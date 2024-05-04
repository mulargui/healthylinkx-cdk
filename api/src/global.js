
const awssecrets = require('@aws-sdk/client-secrets-manager');

//============ auxiliary functions ===================
//Datastore secrets
const dbSecrets = {
	host: null,
	user: null,
	password: null,
	database: null,
	async populate(){
		// only call once
		if (this.host != null) return;

		const client = new awssecrets.SecretsManagerClient();
		const response = await client.send(
		  new awssecrets.GetSecretValueCommand({"SecretId": "db-master-user-secret"})
		);

		const dbSecret= JSON.parse(response.SecretString);
		this.host = dbSecret.host;
		this.user = dbSecret.username;
		this.password = dbSecret.password;
		this.database = dbSecret.dbname;
	}
};

function ServerReply (code, message){
	if (code != 200) message = [];
	return {
		"statusCode": code,
		"headers": {
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "OPTIONS,GET"
		},
		"body": JSON.stringify(message)
	};
}

module.exports = { dbSecrets, ServerReply };

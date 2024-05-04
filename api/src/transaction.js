const mysql = require('mysql2/promise');
const {dbSecrets, ServerReply} = require('./global.js');

//============= business logic =============
async function Transaction(id) {

 	//check params
 	if(!id) return ServerReply (204, {"error": "no transaction id"});

	try {
		await dbSecrets.populate();
		const connection = await mysql.createConnection({
			host: dbSecrets.host,
			user: dbSecrets.user,
			password: dbSecrets.password,
			database: dbSecrets.database
		});
		await connection.connect();

		//retrieve the providers
		var query = "SELECT * FROM transactions WHERE (id = '"+id+"')";
		var [rows,fields] = await connection.query(query);

		if (rows.length <= 0){
			await connection.end();
			return ServerReply (204, {"error": query});
		}

		//get the providers
		var npi1 = rows[0].NPI1;
		var npi2 = rows[0].NPI2;
		var npi3 = rows[0].NPI3;

		//get the details of the providers
		query = "SELECT NPI,Provider_Full_Name,Provider_Full_Street, Provider_Full_City, Provider_Business_Practice_Location_Address_Telephone_Number FROM npidata2 WHERE ((NPI = '"+npi1+"')";
		if(npi2) query += "OR (NPI = '"+npi2+"')";
		if(npi3) query += "OR (NPI = '"+npi3+"')";
		query += ")";

		[rows,fields] = await connection.query(query);
		await connection.end();
		return ServerReply (200, rows);
	} catch(err) {
		return ServerReply (500, {"error": query + '#' + err});
	} 
}

//============= lambda code =============
exports.handler = async (event) => {

	if (!event.queryStringParameters)
		return ServerReply (204, {"error": 'not params!'});

	var id = event.queryStringParameters.id;

	// separating from lambda code
	return await Transaction(id);
};

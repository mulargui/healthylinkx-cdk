const mysql = require('mysql2/promise');
const {dbSecrets, ServerReply} = require('./global.js');

//============= business logic =============
async function Shortlist(npi1, npi2, npi3) {

 	//check params
 	if(!npi1)
		return ServerReply (204, {"error": "no NPI requested"});

	try {
		await dbSecrets.populate();
		const connection = await mysql.createConnection({
			host: dbSecrets.host,
			user: dbSecrets.user,
			password: dbSecrets.password,
			database: dbSecrets.database
		});
		await connection.connect();

		//save the selection
		var query = "INSERT INTO transactions VALUES (DEFAULT,DEFAULT,'"+ npi1 +"','"+ npi2 +"','"+npi3 +"')";
		var [rows,fields] = await connection.query(query);

		//keep the transaction number
		var transactionid= rows.insertId;
			
		//return detailed data of the selected providers
		query = "SELECT NPI,Provider_Full_Name,Provider_Full_Street, Provider_Full_City, Provider_Business_Practice_Location_Address_Telephone_Number FROM npidata2 WHERE ((NPI = '"+npi1+"')";
		if(npi2) query += "OR (NPI = '"+npi2+"')";
		if(npi3) query += "OR (NPI = '"+npi3+"')";
		query += ")";
		[rows,fields] = await connection.query(query);
		await connection.end();

		return ServerReply (200, {"providers": rows, "Transaction": transactionid});
	} catch(err) {
		return ServerReply (500, {"error": query + '#' + err});
	} 
}

//============= lambda code =============
exports.handler = async (event) => {

	if (!event.queryStringParameters)
		return ServerReply (204, {"error": 'not params!'});

	var npi1 = event.queryStringParameters.NPI1;
	var npi2 = event.queryStringParameters.NPI2;
	var npi3 = event.queryStringParameters.NPI3;

	// separating from lambda code
	return await Shortlist(npi1, npi2, npi3);
};


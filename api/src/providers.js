const mysql = require('mysql2/promise');
const {dbSecrets, ServerReply} = require('./global.js');

//============= business logic =============
async function Providers(gender, lastname1, lastname2, 
	lastname3, specialty, distance,zipcode){

 	//check params
 	if(!zipcode && !lastname1 && !specialty)
		return ServerReply (204, {"error": 'not enought params!'});
	
	//normalize gender
	if (gender){
		if (gender === 'male') gender = 'M';
		if (gender === 'm') gender = 'M';
		if (gender !== 'M') gender = 'F';
	}

	var query = "SELECT Provider_Full_Name,Provider_Full_Street,Provider_Full_City,Classification FROM npidata2 WHERE (";
 	if(lastname1)
 		query += "((Provider_Last_Name_Legal_Name = '" + lastname1 + "')";
 	if(lastname2)
 		query += " OR (Provider_Last_Name_Legal_Name = '" + lastname2 + "')";
 	if(lastname3)
 		query += " OR (Provider_Last_Name_Legal_Name = '" + lastname3 + "')";
 	if(lastname1)
 		query += ")";
 	if(gender)
 		if(lastname1)
 			query += " AND (Provider_Gender_Code = '" + gender + "')";
 		else
 			query += "(Provider_Gender_Code = '" + gender + "')";
 	if(specialty)
 		if(lastname1 || gender)
 			query += " AND (Classification = '" + specialty + "')";
 		else
 			query += "(Classification = '" + specialty + "')";

	if(zipcode)
		if(lastname1 || gender || specialty)
			query += " AND (Provider_Short_Postal_Code = '"+ zipcode + "')";
		else
			query += "(Provider_Short_Postal_Code = '" + zipcode + "')";
	query += ") limit 3";

	try {
		await dbSecrets.populate();
		const connection = await mysql.createConnection({
			host: dbSecrets.host,
			user: dbSecrets.user,
			password: dbSecrets.password,
			database: dbSecrets.database
		});
		await connection.connect();
		const [rows,fields] = await connection.query(query);
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

	var gender = event.queryStringParameters.gender;
	var lastname1 = event.queryStringParameters.lastname1;
	var lastname2 = event.queryStringParameters.lastname2;
	var lastname3 = event.queryStringParameters.lastname3;
	var specialty = event.queryStringParameters.specialty;
	var distance = event.queryStringParameters.distance;
	var zipcode = event.queryStringParameters.zipcode;

	// separating from lambda code
	return await Providers(gender, lastname1, lastname2, 
		lastname3, specialty, distance,zipcode);
};

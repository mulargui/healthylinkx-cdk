const mysql = require('mysql2/promise');
const {dbSecrets, ServerReply} = require('./global.js');

//============= business logic =============
async function Taxonomy() {
	
	var query = "SELECT * FROM taxonomy";
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

	// separating from lambda code
	return await Taxonomy();
};

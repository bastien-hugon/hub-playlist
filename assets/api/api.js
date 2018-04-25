var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


/**
 * Initialisation de la base de donnée
 * Création des tables:
 * users -> contient : _id, mail, password, date_creation
 * token -> contient : _id, fk_id_user, token, date_creation
 */
MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	var dbo = db.db("simply");
	/*
	dbo.collection("users").remove({}, function(){
		dbo.collection("tokens").remove({}, function(){ */
			dbo.createCollection("users_password", function(err, res) {
				if (err) throw err;
				dbo.createCollection("users", function(err, res) {
					if (err) throw err;
					dbo.createCollection("tokens", function(err, res) {
						if (err) throw err;
						db.close();
					});
				});
			});
		/*		});
	});*/
});

/**
 * Chiffre le mdp
 */
function encrypt(password, hash){
	var cipher = crypto.createCipher('aes-256-ctr', hash)
	var crypted = cipher.update(password,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

/**
 * Déchiffre le mdp
 */
function decrypt(password, hash){
	var decipher = crypto.createDecipher('aes-256-ctr', hash)
	var dec = decipher.update(password,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

/**
 * Génération de token
 */
function generateToken(user, callback) {
	if (user[0] === undefined) {
		callback(false);
		return false;
	}
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("simply");
		var token = crypto.randomBytes(64).toString('hex');
		dbo.collection("token").insertOne({fk_id_user: user[0]._id, token: token, date_creation: Date.now()}, function(err, res){
			if (err) throw err;
			callback(token);
			db.close();
		});
	});
}

/**
 * API Socket.IO 
 */
io.on('connection', function (socket) {
	var ip = socket.handshake.headers["x-real-ip"];
	var port = socket.handshake.headers["x-real-port"];
	console.log("Connection from: " + ip + ":" + port);

	/**
	 * Requete de login
	 */
	socket.on('login', function(mail, pwd){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("simply");
			var hash = crypto.createHash('sha256').update(pwd).digest('base64');
			dbo.collection("users").find({ mail: mail, password: hash }).toArray(function(err, res) {
				if (err) throw err;
				generateToken(res, function(token){
					var result = {success: (res[0] !== undefined) ? (true) : (false), data: res[0], token: token};
					db.close();
					socket.emit('login', result);
				});
			});
		});
	});

	/**
	 * Enregistrement d'un utilisateur
	 */
	socket.on('register', function(mail, pwd){
		if (mail === undefined || pwd === undefined)
			return false;
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("simply");
			var hash = crypto.createHash('sha256').update(pwd).digest('base64');
			dbo.collection("users").find({ mail: mail }).toArray(function(err, res) {
				if (err) throw err;
				if (res[0] !== undefined){
					db.close();
					socket.emit('register', {success: false, message: "Compte déjà existant."});
				}else{
					dbo.collection("users").insertOne({mail: mail, password: hash, date_creation: Date.now()}, function(err, res){
						if (err) throw err;
						db.close();
						socket.emit('register', {success: true, message: "Compte créé avec succès."});
					});
				}
			});
		});
	});

	/**
	 * Vérification de token
	 */
	socket.on('verifToken', function(token){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("simply");
			dbo.collection("token").find({ token: token }).toArray(function(err, res) {
				if (err) throw err;
				var result = (res[0]) ? (true) : (false);
				db.close();
				socket.emit('verifToken', result);
			});
		});
	});

	/**
	 * Récupère l'identifiant à partir du Token et de l'url
	 */
	socket.on('getID', function(token, dir){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("simply");
			dbo.collection("token").find({ token: token }).toArray(function(err, res) { // Récupération de l'id relié au token
				if (err) throw err;
				if (res[0] === undefined) {
					socket.emit('getID', false);
					db.close();
				}else {
					dbo.collection("token").find({ fk_id_user: res[0].fk_id_user }).toArray(function(err, res) { // Récupération du premier token trouvé
						if (err) throw err;
						if (res[0] === undefined) {
							socket.emit('getID', false);
							db.close();
						} else {
							var key = res[0].token;
							dbo.collection("users_password").find({ fk_id_user: res[0].fk_id_user, url: dir }).toArray(function(err, res) { // Récupération des id dans la bd
								if (err) throw err;
								if (res[0] === undefined) {
									socket.emit('getID', false);
									db.close();
								}else {
									res[0].password = decrypt(res[0].password, key);
									socket.emit('getID', res[0]);
								}
							});
						}
					});
				}
			});
		});
	});

	/**
	 * Sauvegarde l'identifiant à partir du Token et de l'url
	 */
	socket.on('saveID', function(token, dir, login, pass){
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("simply");
			dbo.collection("token").find({ token: token }).toArray(function(err, res) { // Récupération de l'id relié au token
				if (err) throw err;
				if (res[0] === undefined) {
					socket.emit('saveID', false);
					db.close();
				}else {
					dbo.collection("token").find({ fk_id_user: res[0].fk_id_user }).toArray(function(err, res) { // Récupération du premier token trouvé
						if (err) throw err;
						if (res[0] === undefined) {
							socket.emit('saveID', false);
							db.close();
						} else {
							var key = res[0].token;
							dbo.collection("users_password").insertOne({ fk_id_user: res[0].fk_id_user, url: dir, login: login, password: encrypt(pass, key) }, function(err, res) {
								if (err) throw err;
								socket.emit('saveID', res[0]);
							});
						}
					});
				}
			});
		});
	});
});
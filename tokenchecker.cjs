const jwt = require('jsonwebtoken');
const tokenChecker = function(req, res, next) {
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// if there is no token
	if (!token) {
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});
	}

	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
		if (err) {
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			req.loggedUser = decoded;
			next();
		}
	});
	
};



function TokenGen(email) {
    const payload = { email };
    const options = { expiresIn: '1h' };
    const secret = process.env.SUPER_SECRET || 'niente'; // Usa una variabile d'ambiente sicura!
    return jwt.sign(payload, secret, options);
}

function st(token) {
	const decoded = jwt.decode(token);
	// Stampa le informazioni decodificate (visibili per debugs)
	console.log('Decoded Token:', decoded);
}


module.exports = {
	tokenChecker,
	TokenGen,
	st,
};
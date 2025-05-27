const jwt = require('jsonwebtoken');

function tokenChecker(accessType) {
    return function(req, res, next)  {
        //console.log('Checking token...');
        const token=req.headers['x-access-token'] || req.query.token || req.body.token;
        //console.log('Token received:', token);
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided.' });
        }
        console.log('Token provided:', token);
        jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
            console.log('Verifying token...');
            if (err) {
                console.log('Token verification failed:');
                return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
            }
            //gestione casi di ereditarietà nelle pagine
            if (!decoded || decoded.aut !== accessType) {
            if (
            (decoded.aut == 'Venditore' && (accessType == 'Imprenditore' || accessType == 'Cliente')) ||
            (decoded.aut == 'Imprenditore' && accessType == 'Cliente')
            ) {
             return next();
            } else {
            console.log('Unauthorized: invalid account type.');
            return res.status(403).json({ success: false, message: 'Unauthorized: invalid account type.' });
            }
    }
            console.log('Token is valid!!!');
            next();
        });
    }
}



function TokenGen(email) {
	var aut='Cliente';
    const payload = { email, aut };
    const options = { expiresIn: '1h' };
    const secret = process.env.SUPER_SECRET || 'niente'; 
    return jwt.sign(payload, secret, options);
}

function TokenGenEnt(email) {
	var aut='Imprenditore';
	const payload = { email, aut };
	const options = { expiresIn: '1h' };
	const secret = process.env.SUPER_SECRET || 'niente'; 
	return jwt.sign(payload, secret, options);
}
function TokenGenVend(email) {
	var aut='Venditore';
	const payload = { email, aut };
	const options = { expiresIn: '1h' };
	const secret = process.env.SUPER_SECRET || 'niente'; 
	return jwt.sign(payload, secret, options);
}

function st(token) {
	const decoded = jwt.decode(token);
	console.log('Decoded Token:', decoded);
	
	
}


module.exports = {
	tokenChecker,
	TokenGen,
	TokenGenEnt,
	TokenGenVend,
	st,
};
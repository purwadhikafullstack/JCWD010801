const jwt = require("jsonwebtoken");

module.exports = {
	verifyToken: (req, res, next) => {
		try {
			let token = req.headers.authorization;

			if (!token) {
				throw {
					status: 401,
					message: "Token missing.",
				};
			}
			token = token.split(" ")[1];

            let verifiedUser;
            try {
                verifiedUser = jwt.verify(token, process.env.KEY_JWT);
            } catch (error) {
                error.statusCode = 401;
                if (error.name === 'TokenExpiredError') {
                    error.message = 'Token expired.';
                } else if (error.name === 'JsonWebTokenError') {
                    error.message = 'Malformed token.';
                } else {
                    error.message = 'Unauthorized request.';
                }
                throw error;
            };
            req.user = verifiedUser;
            next();
        } catch (error) {
            res.status(400).send({
                status: 400,
                message: error
            });
        }
    },
    checkAdmin: (req, res, next) => {
        console.log(req.user)
        if (req.user.RoleId >= 2) {
            return next();
        };

        res.status(403).send({
            status: 403,
            message: "Forbidden! You are not an administrator."
        });
    },
    checkSuperAdmin: (req, res, next) => {
        if (req.user.RoleId === 3) {
            return next();
        };

        res.status(403).send({
            status: 403,
            message: "Forbidden! You are not a super administrator."
        });
    },
    checkUser: (req, res, next) => {
        if (req.user.RoleId === 1) {
            return next()
        };
        
        res.status(403).send({
            status: 403,
            message: "Forbidden! You are not a user."
        });
    }
};

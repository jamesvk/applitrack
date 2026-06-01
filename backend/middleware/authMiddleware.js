const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "No token, not authorized"})
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({message: "Not authorized, invalid token"})
        }
    })
}

module.exports = protect;
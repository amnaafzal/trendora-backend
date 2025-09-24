const jwt = require('jsonwebtoken')


const SECRET_KEY = process.env.SECRET_KEY;


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ message: "invalid token" })
        }

        const decoded = jwt.verify(token, SECRET_KEY)

        if (!decoded) {
            return res.status(401).json({ message: "invalid token" })
        }


        req.userId = decoded.userId;
        req.role = decoded.role

        console.log(decoded.role, decoded.userId)

         next()
       
    } catch (error) {
         return res.status(401).json({message: "error found", error: error.message})
    }


   

}

module.exports = verifyToken;
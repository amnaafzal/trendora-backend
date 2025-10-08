const jwt = require('jsonwebtoken')


const SECRET_KEY = process.env.SECRET_KEY;


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    // const token = req.headers.authorization?.split(" ")[1];  //for postman we need to do this bcoz postman can't verify admin through cookies

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
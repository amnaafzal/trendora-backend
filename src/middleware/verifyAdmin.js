const verifyAdmin = (req, res, next) =>{
    if(req.role !== "admin"){
        res.status(500).send({message: "only admin can perform this operation"});
    }
    else{
        next();
    }
}

module.exports = verifyAdmin;
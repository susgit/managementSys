const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")

const generateToken = (username) => {
    return new Promise((resolve, reject) => {
        let cert = fs.readFileSync(path.resolve(__dirname, "../key/rsa_private_key.pem"))
        //载荷，私钥，算法，回调
        jwt.sign({ username }, cert, { algorithm: 'RS256' ,expiresIn:'24h' }, function (err, token) {
            resolve(token)
        });
    })
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        let cert = fs.readFileSync(path.resolve(__dirname, "../key/rsa_public_key.pem"))

        jwt.verify(token, cert, function (err, decoded) {
            resolve(decoded)
        });
    })
}
module.exports = {
    generateToken,
    verifyToken
}
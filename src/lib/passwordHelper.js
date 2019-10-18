
let bcrypt = require('bcrypt-nodejs');


exports.hashPassword = (user) => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return reject(err);
            user.password = hash;
            return resolve(user)
        })
    })
})

exports.comparePassword = (user, candidatePassword) => new Promise((resolve,  reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if(err) return reject(err);
        return resolve(isMatch);
    })
})
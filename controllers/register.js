const handleRegister = (pg, bcrypt, saltRounds) => ( req, res) => {
    const {name, email, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
        pg.transaction(trx=>{
            trx.insert({
                hash,
                email
            })
            .into('login')
            .returning('email')
            .then(loginEmail=>{
                return trx('users')
                .returning('*')
                .insert({
                    name,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .then(user=> {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'));
    });
}

module.exports = {handleRegister}
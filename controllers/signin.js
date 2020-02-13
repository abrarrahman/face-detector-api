const signinHandler = (req,res,pg,bcrypt) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission');
    }
    // Load hash from your password DB.
    pg('login').where({email}).select('hash')
    .then(data=>{
        if(data.length){
            const hash = data[0].hash;
            bcrypt.compare(password, hash, function(err, isValid) {
                if(isValid){
                    pg('users').where({email}).select('*')
                    .then(data=>{
                        res.json(data[0]);
                    })
                }else{
                    res.status(400).json('error logging in');
                }
            })
        }else{
            res.status(400).json('unable to login')
        }
    })
    
}
module.exports = {
    signinHandler
}
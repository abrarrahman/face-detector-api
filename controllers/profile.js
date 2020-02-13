const getProfile = (pg) => (req,res) => {
    const {id}=req.params;
    pg('users').where({id}).select('*')
        .then(user=>{
            user.length? 
                res.json(user): 
                res.status(400).json('profile not found')
        })
        .catch(err=>res.status(400).json('unable to get user'));
}  
module.exports = {getProfile};
const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: 'c1275aa28fca4cacaee76c02bde34807'
});

const handleClarifaiCall = (req, res) => {
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        req.body.url
    )
    .then(data => res.json(data))
    .catch(err=>res.status(400).json('unable to work with API'))
}

const handleEntry = (pg) => (req,res) => {
    const {id}=req.body;
    pg('users').where({id})
        .increment('entries',1)
        .returning('entries')
        .then(entries=> {
            entries.length?
            res.json(entries[0]):
            res.status(400).json('unable to get entries')
        })
        .catch(err => res.status(400).json('unable to get entries'));
}
module.exports = {handleEntry,handleClarifaiCall};
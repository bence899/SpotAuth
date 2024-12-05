const express =  require('express');
const router = express.Router();


//Dummy Users
const users = [
    {id: 1, name: 'uploader1', key: 'key123'},
    {id: 2, name: 'uploader2', key: 'key456'},
];

//Mock Uploader Authentication
router.post('/', (req,res) =>{
    const {name, key} = req.body;
    const user = users.find(u => u.name === name && u.key === key);
    if (user) return res.status(200).json({success: true, user});
    return res.status(403).json({success: false, message: 'Invalid credentials'});
})

module.exports = router;
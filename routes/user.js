const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;


router.get('/updateProfile', async (req, res) => {
    try {
        let id = '61a7ea01a7e4d0fd6a34d230';
        const result = await userData.getUser(id);
        //sconsole.log(result.products) 
        res.render('posts/updateprofile',{
            user : result.user,
            products : result.products})   
    } catch (e) {
        console.log(e)
        res.json(e)
    }
})
router.post('/updateProfile', async (req, res) => {
    try{
    let input = req.body
       let {Name,Email,password,Address,phone} = input
       let id = '61a7ea01a7e4d0fd6a34d230';
        let updateUser = await userData.updateProfile(Name,Email,password,Address,phone,id);
        res.redirect('/user/updateProfile') 
    }
    catch (e){
        res.json(e)
    }
})

module.exports = router;
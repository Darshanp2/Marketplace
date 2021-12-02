const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.product;

router.get('/:id', async(req, res) => {
    if (!req.params.id) {
        res.status(404).json({ error: ' No input' });
        return;

    }

    if (typeof req.params.id !== 'string' || !req.params.id.replace(/\s/g, '').length) {
        res.status(400).json({ error: 'Input is not a string or is an empty string' });
        return;

    }
    // if (ObjectId.isValid(req.params.id) != true) {
    //     res.status(400).json({ error: 'Input is not a valid ObjectId' });
    //     return;

    // }
    try {
        const prod = await productData.get(req.params.id);
        let comments=prod.comments
        

        res.status(200).render('post/product', { title: "Product Details", prod: prod, comments: comments });
    } catch (e) {
        

        res.status(404).json({ message: 'Restaurant not found' });
    }
});

router.post('/:id', async(req, res) => {
    
    if(!req.body.phrase){
        res.status(400).render('post/product',{error: 'No input provided'})
    }

    if(typeof req.body.phrase !== 'string'){
        res.status(400).render('post/product' ,{ error: 'Input is not a string' })
    }
    try {
        //const { username, password } = usersData;
        const newcomment = await productData.createcomment(req.params.id, req.body.phrase);
        if (newcomment) {
            return res.redirect(`/product/${req.params.id}`);
        }
    } catch (e) {
        console.log(e)
        res.status(e.error2 || 500).render('post/product')
    }
});

router.get('/delete/:id',async (req,res) => {
    let id = req.params.id;
    const removeProduct = await productData.deleteProduct(id)
    let userID = req.session.userID
    if(removeProduct){
        res.redirect('/user/updateProfile')
    }

})

module.exports = router;


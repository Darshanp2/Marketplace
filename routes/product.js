const mongoCollections = require('../config/mongoCollections');
const express = require('express');
const router = express.Router();
const data = require('../data');
const productData = data.product;
const multer = require("multer");
const product = mongoCollections.product;
const { ObjectId } = require('bson');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.get('/productdetails/:id', async(req, res) => {
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
      console.log(req.session.userId)
        const prod = await productData.getProduct(req.params.id);
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
            return res.redirect(`/productdetails/${req.params.id}`);
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

});

router.get('/advertisement', async (req, res) => {
    try{ 
      if(req.session.user){
      res.render('posts/advertisement', { title: 'Post' });

      }
      else{
        res.render('posts/landingpage',{error: 'You need to login first'})
      }
      return;
    }
    catch (e) {
      res.status(400).json("Error");
    }
  });
  
  router.post('/advertisement/upload', upload.single("productImg"), async (req, res) => {
    try{
      const params = req.body;
      let imagex = "../../"+ req.file.path;
      
      // if(!params)
      // {
      //   res.status(400).render('posts/advertisement', {hasErrors: true,error: 'Input not provided',title: 'Post'});
      //   return
      // }
      // if(!params.productName || !params.productName.trim())
      // {
      //   res.status(400).render('posts/advertisement', {hasErrors: true,error: 'Product Name not provided',title: 'Post'});
      //   return
      // }
    //   let checkname = parseInt(params.name);
    //   let checkDescription = parseInt(params.description);
    //   console.log(checkname);
    //   console.log(checkDescription);
    //   console.log(typeof checkname);
    //   console.log(typeof checkDescription);
    //   console.log(isNaN(checkname));
    //   console.log(isNaN(checkDescription));
  
      // if(isNaN(checkname))
      // {
      //   const flagForname = 1;
      // }
      // if(!params.description || !params.description.trim())
      // {
      //   res.status(400).render('posts/advertisement', {hasErrors: true,error: 'Product Description not provided',title: 'Post'});
      //   return
      // }
      // if(!params.price)
      // {
      //   res.status(400).render('posts/advertisement', {hasErrors: true,error: 'Product price not provided',title: 'Post'});
      //   return
      // } 
      // if(flagForname===0)
      // {
      //   res.status(400).render('product/advertisement', {hasErrors: true,error: 'Integer provided',title: 'Post'});
      //   return
      // } 
      const { productName, description, price} = params;
      if(req.session.user){
        console.log('111')
        let userID=req.session.user
        console.log(userID)

      
        let newProduct = await productData.create( productName, description, price, imagex,userID);
          res.render("posts/landingpage");
          return;
      }
        else{
          res.status(400).render('posts/landingpage', {title: "Product Posted"});
          return;
        }
      } catch (e) {
          if (typeof e == 'object') {
            if (e[1]) {
              res.status(400).render('posts/advertisement', {hasErrors: true,error: e[1],title: 'Post'});
              return;
            }
            else {
              res.status(500).render('posts/advertisement', {hasErrors: true,error: 'Internal Server Error',title: 'Post'});
              return;
            }
          }
        }
  });
  
  // router.get('/:id', async (req, res) => {
  //     try {
  //       let product = await productData.get(req.params.id);
  //       res.status(200).json(product);
  //     } catch (e) {
  //       res.status(e[0]).json({ error: e[1] });
  //     }
  
  // });
  
  router.get('/exploreproduct', async (req,res) => {
      try{
        if(req.session.user){
        let productList = await productData.getAll();
        res.render('posts/explore', { title: 'Explore',partial: 'products-list-script', productList: productList});
        }
        else{
          res.render('posts/landingpage',{error: 'You need to login first'})
        }
      }
      catch(e){
        res.status(e[0]).json({ error: e[1] });
      }
  });
  
  router.post('/exploreproduct', async (req,res) => {
    try{
      const params = req.body;
      if(!params)
      {
        res.status(400).render('posts/explore', {hasErrors: true,error: 'Input not provided for search',title: 'Explore'});
        return
      }
      if(!params.search)
      {
        res.status(400).render('posts/explore', {hasErrors: true,error: 'Input not provided for search',title: 'Explore'});
        return
      }
      const { search} = params;
  
      }catch(e){
        res.status(e[0]).json({ error: e[1] });
    }
  });
  
  
  router.put('/update', async (req, res) => {
      const rest = req.body;
      if(!rest)
      {
        res.status(400).json({error: 'No Input'});
        return
      }
      if(!rest.productName)
      {
        res.status(400).json({error: 'Product Name Missing'});
        return
      }
      if(!rest.description)
      {
        res.status(400).json({error: 'Description Missing'});
        return
      }
      if(!rest.price)
      {
        res.status(400).json({error: 'Price Missing'});
        return
      }
      
      try {
          const { productName, description, price} = rest;
          let updatedProduct = await productData.update( req.params.id, productName, description, price);
          res.status(200).json(updatedProduct);
      } catch (e) {
        res.status(e[0]).json({ error: e[1] });
      }
    });

module.exports = router;


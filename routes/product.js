const mongoCollections = require("../config/mongoCollections");
const express = require("express");
const router = express.Router();
const data = require("../data");
const productData = data.product;
const multer = require("multer");
const product = mongoCollections.product;
const { ObjectId } = require("bson");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

router.get("/productdetails/:id", async (req, res) => {
  if(res.session.user){
    validateId(id)
  try {

    const prod = await productData.getProduct(req.params.id);
    let comments = prod.comments;

    res.status(200).render("post/product", {
      title: "Product Details",
      prod: prod,
      comments: comments,
    });
  } catch (e) {
    res.status(e[0]).render('posts/error',{ error: e[1] });
  }
}
});

router.post("/:id", async (req, res) => {
  if(res.session.user){
validateId(id)
  try {
    //const { username, password } = usersData;
    const newcomment = await productData.createcomment(
      req.params.id,
      req.body.phrase,
      req.session.user
    );
    res.redirect(`/product/productdetails/${req.params.id}`);
  } catch (e) {
    res.status.e[0].render('posts/error',{error: e[1]});
  }
}
else{
  res.redirect('/')
}
});

router.get("/delete/:id", async (req, res) => {
  if(res.session.user){

  try{
  let id = req.params.id;
  const removeProduct = await productData.deleteProduct(id);
  if (removeProduct) {
    res.redirect("/user/updateProfile");
  }
}
catch(e){
  res.status(e[0]).render('post/error',{error: e[1]})
}
}
else{
  res.redirect('/')
}
});

router.get("/advertisement", async (req, res) => {
  if(res.session.user){
  try{
      res.render("posts/advertisement", { title: "Post" });
  }
    catch (e) {
    res.status(e[0]).render("posts/error",{error: e[1]});
  }
}
else{
  res.render("posts/landingpage", { error1: "You need to login first" });
}
});

router.post(
  "/advertisement/upload",
  upload.single("productImg"),
  async (req, res) => {
    if(res.session.user){

    
    try {
      const params = req.body;
     
      let imagex = "../../" + req.file.path;
      if (!price) throw[400,"You must provide with all the details"];
      if (!productName) throw [400,"You must provide with all the details"];
      if (!description) throw [400,"You must provide with all the details"];
      if (!price) throw [400,"You must provide with all the details"];
      if(!category) throw [400,"You must provide with all the details"]
      if(!img) throw [400,"You must provide with all the details"]
      if (typeof productName!='string') throw[400,"You must provide string for product Name"];
      if(typeof productName!=='string' || typeof description!=='string') throw [400,'Input must be a string'];
      if(typeof price!=='number')
      if(!/[a-zA-Z0-9]/.test(productName)) throw [400,'Product Name should only contain numbers and alphabets']
      var res = productName.replace(/ /g, "");
      if(res==0) throw[400,"Invalid Product Name"];
      if (typeof description!='string') throw[400,"You must provide string for description"];
      res = description.replace(/ /g, "");
      if(res==0) throw[400,"Invalid Description"];
      if (price < 1) throw[400,"You must provide valid price"];
    
      const { productName, description,category, price,img} = params;
      if (req.session.user) {
        let userID = req.session.user;
        let newProduct = await productData.create(
          productName,
          description,
          price,
          category,
          imagex,
          userID
        );
        res.render("posts/landingpage");
        return;
      } else {
        res
          .status(400)
          .render("posts/landingpage", { title: "Product Posted" });
        return;
      }
    } catch (e) {
      res.render("posts/landingpage", {title: 'Post an Advertisement'});
      return;  
    }
  }
}
);



router.get("/exploreproduct", async (req, res) => {
  if(res.session.user){
  try {
  
      let productList = await productData.getAll();
      
      console.log(productList)
      res.render("posts/explore", {
        title: "Explore",
        partial: "products-list-script",
        productList: productList,
      });
      res.render("posts/landingpage", { error2: "You need to login first" });
    }
   catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
}
else{
  res.redirect('/')
}
});

router.post("/exploreproduct", async (req, res) => {
  if(res.session.user){
  try {
    const params = req.body;
    if (!params) {
      res.status(400).render("posts/explore", { error: "Input not provided for search",title: "Explore"});
      return;
    }
    if (!params.search) {
      res.status(400).render("posts/explore", {error: "Input not provided for search",title: "Explore"});
      return;
    }
  } catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
}
else{
  res.redirect('/')
}
});

router.get("/updateProduct/:id", async (req, res) => {
  if(req.session.user){
  try {
    let id = req.params.id;
    console.log(id)
    const result = await productData.getProductById(id);
    res.render("posts/updateProduct", {product: result});
  } catch (e) {
    console.log(e);
    res.json(e);
  }
}
else{
  res.redirect('/')
}
});
router.post("/updateproducts/:id",upload.single("productImg"), async (req, res) => {
  if(res.session.user){

  
  const rest = req.body;
 if(productName && productName.trim().length == 0) throw [400,"Enter Product Name"]
 else if(productName && !/[a-zA-Z0-9]/.test(productName)) [400,"Product Name should only contain numbers and alphabets"]
 if(description && description .trim().length == 0) throw [400,"Enter description"]
  try {
      let imagex = "../../" + req.file.path;
    const { productName, description, price,category} = rest;
    let updatedProduct = await productData.updateProduct(
      
      productName,
      description,
      price,
      category,
      imagex,
      req.params.id
    );
      res.render("posts/landingpage");
  } catch (e) {
    res.status(e[0]).render("posts/updateProduct",{ error: e[1] });
  }
}
else{
  res.redirect('/')
}
});



function validateId(id){
  if(typeof id !== "string") throw [405,"invalid URL"]
  if (!id || id.trim().length ==0) throw [405,"invalid URL"]
  if(!/^[0-9A-Fa-f]{24}$/.test(id)) throw [405,"invalid URL"]
}

module.exports = router;

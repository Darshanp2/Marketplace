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
  if (!req.params.id) {
    res.status(404).json({ error: " No input" });
    return;
  }

  if (
    typeof req.params.id !== "string" ||
    !req.params.id.replace(/\s/g, "").length
  ) {
    res
      .status(400)
      .json({ error: "Input is not a string or is an empty string" });
    return;
  }
  // if (ObjectId.isValid(req.params.id) != true) {
  //     res.status(400).json({ error: 'Input is not a valid ObjectId' });
  //     return;

  // }
  try {
    const prod = await productData.getProduct(req.params.id);
    let comments = prod.comments;

    res.status(200).render("post/product", {
      title: "Product Details",
      prod: prod,
      comments: comments,
    });
  } catch (e) {
    res.status(404).json({ message: "Restaurant not found" });
  }
});

router.post("/:id", async (req, res) => {
  if (!req.body.phrase) {
    res.status(400).render("post/product", { error: "No input provided" });
  }

  if (typeof req.body.phrase !== "string") {
    res.status(400).render("post/product", { error: "Input is not a string" });
  }
  try {
    //const { username, password } = usersData;
    const newcomment = await productData.createcomment(
      req.params.id,
      req.body.phrase,
      req.session.user
    );
    res.redirect(`/product/productdetails/${req.params.id}`);
  } catch (e) {
    res.redirect(`/product/productdetails/${req.params.id}`);
  }
});

router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  const removeProduct = await productData.deleteProduct(id);
  let userID = req.session.user;
  if (removeProduct) {
    res.redirect("/user/updateProfile");
  }
});

router.get("/advertisement", async (req, res) => {
  try {
    if (req.session.user) {
      res.render("posts/advertisement", { title: "Post" });
    } else {
      res.render("posts/landingpage", { error1: "You need to login first" });
      // res.render("posts/landingpage");
      //res.send(<script>alert("your alert message")</script>);
    }

    return;
  } catch (e) {
    res.status(400).json("Error");
  }
});

router.post(
  "/advertisement/upload",
  upload.single("productImg"),
  async (req, res) => {
    try {
      const params = req.body;
      console.log(req.body)
      let imagex = "../../" + req.file.path;
    
      const { productName, description,category, price} = params;
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
      if (typeof e == "object") {
        if (e[1]) {
          res.status(400).render("posts/advertisement", {
            hasErrors: true,
            error: e[1],
            title: "Post",
          });
          return;
        } else {
          res.status(500).render("posts/advertisement", {
            hasErrors: true,
            error: "Internal Server Error",
            title: "Post",
          });
          return;
        }
      }
    }
  }
);

// router.get('/:id', async (req, res) => {
//     try {
//       let product = await productData.get(req.params.id);
//       res.status(200).json(product);
//     } catch (e) {
//       res.status(e[0]).json({ error: e[1] });
//     }

// });

router.get("/exploreproduct", async (req, res) => {
  try {
    if (req.session.user) {
      let productList = await productData.getAll();
      console.log(productList)
      res.render("posts/explore", {
        title: "Explore",
        partial: "products-list-script",
        productList: productList,
      });
    } else {
      res.render("posts/landingpage", { error: "You need to login first" });
    }
  } catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
});

router.post("/exploreproduct", async (req, res) => {
  try {
    const params = req.body;
    if (!params) {
      res.status(400).render("posts/explore", {
        hasErrors: true,
        error: "Input not provided for search",
        title: "Explore",
      });
      return;
    }
    if (!params.search) {
      res.status(400).render("posts/explore", {
        hasErrors: true,
        error: "Input not provided for search",
        title: "Explore",
      });
      return;
    }
    const { search } = params;
  } catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
});

router.put("/update", async (req, res) => {
  const rest = req.body;
  if (!rest) {
    res.status(400).json({ error: "No Input" });
    return;
  }
  if (!rest.productName) {
    res.status(400).json({ error: "Product Name Missing" });
    return;
  }
  if (!rest.description) {
    res.status(400).json({ error: "Description Missing" });
    return;
  }
  if (!rest.price) {
    res.status(400).json({ error: "Price Missing" });
    return;
  }

  try {
    const { productName, description, price } = rest;
    let updatedProduct = await productData.update(
      req.params.id,
      productName,
      description,
      price
    );
    res.status(200).json(updatedProduct);
  } catch (e) {
    res.status(e[0]).json({ error: e[1] });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;

router.get("/updateProfile", async (req, res) => {
  try {
    const result = await userData.getUser(id);
    //sconsole.log(result.products)
    res.render("posts/updateprofile", {
      user: result.user,
      products: result.products,
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
// router.post("/", async (req, res) => {
  
//   try{
//       res.redirect("/");
//     }
//   catch (e) {
//     res.status(500).json({ error: e });
//   }
// }),
router.post("/updateProfile", async (req, res) => {
  try {
    let input = req.body;
    let { Name, Email, password, Address, phone } = input;
  
    let updateUser = await userData.updateProfile(
      Name,
      Email,
      password,
      Address,
      phone,
      id
    );
    res.redirect("/user/updateProfile");
  } catch (e) {
    res.json(e);
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.session.user) {
      console.log(req.session.user)
      res.render("posts/landingpage" ,{user:req.session.user});
      return;
    } else {
      res.render("posts/landingpage");
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});



router.get("/signup", async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).redirect("/private");
    }
    res.status(200).render("posts/signup", {
      title: "Sign up",
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  console.log(address)
  const phoneNumber = req.body.phoneNumber;

  const email = req.body.email;
  //.toString().toLowerCase().trim();

  const password = req.body.password.toString();
  //.trim().replace(/\s/g, "");

  if (!email || !password) {
    res.status(400).render("posts/signup", {
      error: " HTTP 400 Error: Invalid input. All fields must be supplied.",
      partial: "signup",
    });
    return;
  }

  try {
    let newUser = await userData.createUser(name,address,phoneNumber,email,password)
    if (newUser.userInserted == true) {
      res.redirect("/");
    } else {
      res.render("posts/signup", { error: "email already exists" });
    }
    return;
  } catch (e) {
    // res.json(error);
    res.status(500).status(400).render("posts/signup", {
      title: "Error",
      status: "404",
    });
  }
});

router.get("/private", async (req, res) => {
  const email = req.body.email;
  const name = req.body.name;

  if (!req.session.userId) {
    res.redirect("/");
    return;
  }
  res.render("posts/private", {
    email: email,
    name: name,
  });
});

router.post("/login", async (req, res) => {
  const email = req.body.email.toString().toLowerCase().trim();
  const password = req.body.password.toString().trim();

  if (!email || !password) {
    res.status(401).render("posts/landingpage", {
      error: "Missing email or password.",
    });
    return;
  }

  // Retrieve user from file
  try {
    let newUser1 = await userData.checkUser(email, password);
    if (newUser1.authenticated == true) {
      req.session.user = newUser1.userId;
      res.redirect("/");
    } else {
      res.status(401).render("posts/landingpage", {
        error: "Wrong email or password.",
        email: email,
      });
    }
    // return to main page?
  } catch (e) {
    res.status(401).render("posts/landingpage", {
      hasErrors: true,
      error: "You did not provide a valid email and/or password.",
      title: "Login",
      email: email,

      partial: "signup",
    });
  }
});
router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  res.clearCookie("Build Session");
  req.session.destroy();
  res.render("posts/landingpage");
});

module.exports = router;

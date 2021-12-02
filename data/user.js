const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
let { ObjectId } = require("mongodb");

const bcrypt = require("bcryptjs");
//const utils = require("./utils");

const saltRounds = 1;

async function getUser(id) {
  const userCollection = await user();
  const prodCollection = await product();

  let objectID = ObjectId(id);
  const userModel = await userCollection.findOne({ _id: objectID });
  const productRes = await prodCollection.find({ sellerID: id }).toArray();
  let result = {
    user: userModel,
    products: productRes,
  };
  return result;
}

function removeObjectFromId(obj) {
  obj["_id"] = obj["_id"].toString();
  return obj;
}

async function updateProfile(name, email, Password, address, phone, id) {
  let objectID = ObjectId(id);
  const userCollection = await user();
  console.log(name + " " + email + " " + Password + " " + address);
  const updatedInfo = await userCollection.updateOne(
    { _id: objectID },
    {
      $set: {
        name: name,
        address: address,
        phoneNumber: phone,
        email: email,
        password: Password,
      },
    }
  );
  if (updatedInfo.modifiedCount === 0) return false;
  return true;
}

async function createUser(name, address, phoneNumber, email, password) {
    console.log("inside CreateUSer");
  for (let i of email) {
    if (i == " ") throw `email has empty spaces`;
  }
  for (let i of password) if (i == " ") throw `password has empty spaces`;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
console.log("inside create user")
  /*if (await utils.emailExists(email)) {
    return "email already taken";
  }*/

  const userCollection = await user();
  let newUser = {
    name: name,
    address: address,
    phoneNumber: phoneNumber,
    email: email,
    hashedPassword: hashedPassword,
    activeCart: [],
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Failed to create a new user.";

  return { userInserted: true };
}
async function checkUser(email, password) {
  const userCollection = await user();

  const res = await userCollection.findOne({
    email: email,
  });
  if (res == null) {
    throw `error`;
  }
  if (await bcrypt.compare(password, res.hashedPassword)) {
    return { userId: res._id, authenticated: true };
  } else {
    throw `Password not match`;
  }
}
module.exports = {
  updateProfile,
  getUser,
  createUser,
  checkUser,
};

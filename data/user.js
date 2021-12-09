const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
let { ObjectId } = require("mongodb");

const bcrypt = require("bcryptjs");

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
  email = email.toString().toLowerCase();
  password = password.toString();
  for (let i of email) {
    if (i == " ") throw `email has empty spaces`;
  }
  let check0 = phone;
  let result = check0.slice(0, 1);
  if (result == 0) {
    throw `first digit is 0`;
  }
  for (let i of password) if (i == " ") throw `password has empty spaces`;
  const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  const phoneCheck = phoneNoCheck.test(phone);
  if (phoneCheck == false) throw "Wrong Phone no. format";

  if (email && name && password) {
    if (password.length < 6) throw `Password has less than 6 characters `;
  }
  if (name.length < 4) {
    throw `Name has less than 4 characters`;
  }

  let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
  if (!name.match(nameCheck)) {
    throw `Name is not a valid input`;
  }

  let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!email.match(emailCheck)) {
    throw `Email is not valid `;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const updatedInfo = await userCollection.updateOne(
    { _id: objectID },
    {
      $set: {
        name: name,
        address: address,
        phoneNumber: phone,
        email: email,
        password: hashedPassword,
      },
    }
  );
  if (updatedInfo.modifiedCount === 0) return false;
  return true;
}

async function createUser(name, address, phoneNumber, email, password) {
  console.log("inside CreateUSer");
  email = email.toString().toLowerCase();
  password = password.toString();
  console.log("inside CreateUSer");
  for (let i of email) {
    if (i == " ") throw `email has empty spaces`;
  }
  let check0 = phoneNumber;
  let result = check0.slice(0, 1);
  if (result == 0) {
    throw `first digit is 0`;
  }

  for (let i of password) if (i == " ") throw `password has empty spaces`;
  const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  const phoneCheck = phoneNoCheck.test(phoneNumber);
  if (phoneCheck == false) throw "Wrong Phone no. format";

  if (email && name && password) {
    if (password.length < 6) throw `Password has less than 6 characters `;
  }
  if (name.length < 4) {
    throw `Name has less than 4 characters`;
  }

  let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
  if (!name.match(nameCheck)) {
    throw `Name is not a valid input`;
  }

  let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  ///(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!email.match(emailCheck)) {
    throw `Email is not valid `;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("inside create user");
  if (await emailExists(email)) {
    return "email already taken";
  }

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

async function emailExists(email) {
  email = email.toLowerCase();

  const loginCollection = await user();

  return (await loginCollection.findOne({ email: email })) !== null;
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
    return { userId: removeObjectFromId(res)._id, authenticated: true };
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

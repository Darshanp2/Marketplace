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

async function updateName(id, newName) {
  if (newName && newName.length < 6) throw "Name is too short.";
  let nameCheck = /(?:[\w\s][^!@#$%^&*()?//><,.;:'"\{\}\[\]=+~`\-_|\\0-9]+)/;
  if (!newName.match(nameCheck)) {
    throw `Name is not a valid input`;
  }
  console.log("inside update name");
  if (!id || typeof id != "string")
    throw "Id should be provied and it is a string.";
  if (id.trim() === "") throw "The input is an empty string.";
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId.";
  let parsedId = ObjectId(id);
  if (!newName || typeof newName != "string" || newName.trim() == "")
    throw "No first name provided.";
  const newInfo = newName.trim();
  if (await nameExists(newName)) {
    return "same as old name", console.log("same as old name");
  }
  const userCollection = await user();
  return await userCollection
    .updateOne({ _id: parsedId }, { $set: { name: newInfo } })
    .then(async function () {
      return await module.exports.getUser(id);
    });
}
async function updateAddress(id, address) {
  console.log("inside update address");
  if (!id || typeof id != "string")
    throw "Id should be provied and it is a string.";
  if (id.trim() === "") throw "The input is an empty string.";
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId.";
  let parsedId = ObjectId(id);
  if (!address || typeof address != "string" || address.trim() == "")
    throw "No first address provided.";
  const newInfo = address.trim();

  const userCollection = await user();
  return await userCollection
    .updateOne({ _id: parsedId }, { $set: { address: newInfo } })
    .then(async function () {
      return await module.exports.getUser(id);
    });
}
async function updateEmail(id, email) {
  let emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!email.match(emailCheck)) {
    throw `Email is not valid `;
  }
  console.log("inside update email");
  email = email.toString().toLowerCase();
  password = password.toString();
  for (let i of email) {
    if (i == " ") throw `email has empty spaces`;
  }
  if (!id || typeof id != "string")
    throw "Id should be provied and it is a string.";
  if (id.trim() === "") throw "The input is an empty string.";
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId.";
  let parsedId = ObjectId(id);
  if (!email || typeof email != "string" || email.trim() == "")
    throw "No first name provided.";
  const newInfo = email.trim();
  if (await emailExists(email)) {
    return "email already exists or same as previous email";
  }

  const userCollection = await user();
  return await userCollection
    .updateOne({ _id: parsedId }, { $set: { email: newInfo } })
    .then(async function () {
      return await module.exports.getUser(id);
    });
}
async function updatePhone(id, phoneNumber) {
  console.log("inside update email");
  let check0 = phoneNumber;
  let result = check0.slice(0, 1);
  if (result == 0) {
    throw `first digit is 0`;
  }
  for (let i of password) if (i == " ") throw `password has empty spaces`;
  const phoneNoCheck = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/;
  const phoneCheck = phoneNoCheck.test(phoneNumber);
  if (phoneCheck == false) throw "Wrong Phone no. format";

  if (!id || typeof id != "string")
    throw "Id should be provied and it is a string.";
  if (id.trim() === "") throw "The input is an empty string.";
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId.";
  let parsedId = ObjectId(id);
  if (!phoneNumber || typeof phoneNumber != "string")
    throw "No first name provided.";
  const newInfo = phoneNumber.trim();

  const userCollection = await user();
  return await userCollection
    .updateOne({ _id: parsedId }, { $set: { phoneNumber: newInfo } })
    .then(async function () {
      return await module.exports.getUser(id);
    });
}

async function updatePassword(id, password) {
  if (!id || typeof id != "string")
    throw "Id should be provied and it is a string.";
  if (id.trim() === "") throw "The input is an empty string.";
  if (!ObjectId.isValid(id)) throw "Invalid ObjectId.";
  let parsedId = ObjectId(id);
  if (!password || typeof password != "string" || password.trim() == "")
    throw "No password provided.";
  if (password && password.length < 6)
    throw "Password is too long or too short.";

  const newInfo = await bcrypt.hash(password.trim(), saltRounds);

  const userCollection = await user();
  return await userCollection
    .updateOne({ _id: parsedId }, { $set: { hashedPassword: newInfo } })
    .then(async function () {
      return await module.exports.getUser(id);
    });
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

async function nameExists(name) {
  name = name.toLowerCase();

  const loginCollection = await user();

  return (await loginCollection.findOne({ name: name })) !== null;
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
  // updateProfile,
  getUser,
  createUser,
  checkUser,
  updateName,
  updatePassword,
  updatePhone,
  updateAddress,
  updateEmail,
};

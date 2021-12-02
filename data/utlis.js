const mongoCollections = require("../config/mongoCollections");
const user = mongoCollections.user;

async function emailExists(email) {
  email = email.toLowerCase();

  const loginCollection = await users();

  return (await loginCollection.findOne({ email: email })) !== null;
}

module.exports = { emailExists };
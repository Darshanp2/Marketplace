const mongoCollections = require('../config/mongoCollections.js');
const user = mongoCollections.user
const product = mongoCollections.product
let { ObjectId } = require('mongodb');


async function getUser(id){

    const userCollection = await user()
    const prodCollection = await product()

    let objectID = ObjectId(id)
    const userModel = await userCollection.findOne({_id: objectID})
    const productRes = await prodCollection.find({sellerID : id}).toArray();
    let result = {
        user : userModel,
        products : productRes
    }
    return result
}

function removeObjectFromId(obj){
    obj["_id"] = obj["_id"].toString()
    return obj
}

async function updateProfile(name,email,Password,address,phone,id){
    let objectID = ObjectId(id)
    const userCollection = await user()
    console.log(name+ " " + email+ " " +Password+ " " +address)
    const updatedInfo = await userCollection.updateOne(
        {_id: objectID},
        { $set: { 
            name: name,
            address: address,
            phoneNumber: phone,
            email: email,
            password: Password,
        }}
    )
    if (updatedInfo.modifiedCount === 0) return false
    return true
}

module.exports = {
    updateProfile,getUser
}

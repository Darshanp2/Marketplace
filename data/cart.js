const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
const cart = mongoCollections.cart;


async function getUserCart(id){

    //find cart with user id and purchased false
    const cartCol = await cart()
    const prodCol = await product()
    let userCart = await cartCol.findOne({userId : id , purchased : false})
    if (userCart == null) return null
    let prodList = userCart.products
    let productModelList = []
    for(let prod of prodList) {
        const productModel = removeObjectFromId(await prodCol.findOne({_id : ObjectId(prod)}))
        productModelList.push(productModel)
    };
    let cartData = {
        products : productModelList,
        totalPrice : userCart.totalPrice
    }
    return cartData
}

async function addToCart(userId,prodId){

    //find cart with user id and purchased false
    const cartCol = await cart()
    const userCOl = await user()
    let userCart = await cartCol.findOne({userId : userId , purchased : false})
    if(userCart == null){
        let products = []
        products.push(prodId)
        let totalPrice  = await calculateToTalPrice(products)
        let newCart = {
            products : products,
            purchased : false,
            datePurchased : null,
            userId : userId,
            totalPrice : totalPrice
        }
        let insertedInfo = await cartCol.   insertOne(newCart)
        let updatedInfo = await userCOl.updateOne({_id : ObjectId(userId)},
        {
            $set : {
                activeCart : userId
            }
        })
        return true
    }
    else{
    let products = userCart.products
    products.push(prodId)
    let totalPrice  = await calculateToTalPrice(products)
    const updatedInfo = cartCol.updateOne({_id : userCart._id},
    {
        $set : {
            products : products,
            totalPrice : totalPrice
        }
    })
    if (updatedInfo.modifiedCount === 0) return false;
    return true;
}
}

async function removeFromCart(userId,prodId){
    const cartCol = await cart()
    const prodCol = await product()
    let userCart = await cartCol.findOne({userId : userId , purchased : false})
    let prodList = userCart.products
    let newList = []
    for(let id of prodList) {
        if(id != prodId) newList.push(id)
    };
    let totalPrice  = await calculateToTalPrice(newList)
    const updatedInfo = cartCol.updateOne({_id : userCart._id},
    {
        $set : {
            products : newList,
            totalPrice : totalPrice
        }
    })
    if (updatedInfo.modifiedCount === 0) return false;
    return true;
}

async function calculateToTalPrice(products){
    const prodCol = await product()
    let totalPrice = 0 
    for(let prodid of products){
        let product = await prodCol.findOne({_id : ObjectId(prodid)})
        totalPrice += product.price
    }
    return totalPrice
}

function removeObjectFromId(obj) {
    obj["_id"] = obj["_id"].toString();
    return obj;
  }

module.exports = {
    getUserCart,addToCart,removeFromCart
}
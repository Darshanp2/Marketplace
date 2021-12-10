const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections.js");
const user = mongoCollections.user;
const product = mongoCollections.product;
const cart = mongoCollections.cart;


async function getUserCart(id) {

    //find cart with user id and purchased false
    const cartCol = await cart()
    const prodCol = await product()
    let userCart = await cartCol.findOne({ userId: id, purchased: false })
    if (userCart == null) return null
    let prodList = userCart.products
    let productModelList = []
    for (let prod of prodList) {
        const productModel = removeObjectFromId(await prodCol.findOne({ _id: ObjectId(prod) }))
        productModelList.push(productModel)
    };
    let cartData = {
        products: productModelList,
        totalPrice: userCart.totalPrice
    }
    return cartData
}

async function addToCart(userId, prodId) {

    //find cart with user id and purchased false
    const cartCol = await cart()
    const userCOl = await user()
    const prodCol = await product()
    let userCart = await cartCol.findOne({ userId: userId, purchased: false })
    if (userCart == null) {
        let products = []
        products.push(prodId)
        let totalPrice = await calculateToTalPrice(products)
        let newCart = {
            products: products,
            purchased: false,
            datePurchased: null,
            userId: userId,
            totalPrice: totalPrice
        }
        let insertedInfo = await cartCol.insertOne(newCart)
        let cartid = insertedInfo.insertedId
        let updatedInfo = await userCOl.updateOne({ _id: ObjectId(userId) },
            {
                $set: {
                    activeCart: userId
                }
            })
        let productModel = await prodCol.findOne({ _id: ObjectId(prodId) })
        let carts = productModel.activeCarts
        carts.push(cartid.toString())
        let prodUpdatedInfo = await prodCol.updateOne({ _id: ObjectId(prodId) },
            {
                $set: {
                    activeCarts: carts
                }
            })
        return true
    }
    else {
        let products = userCart.products
        products.push(prodId)
        let totalPrice = await calculateToTalPrice(products)
        const updatedInfo = cartCol.updateOne({ _id: userCart._id },
            {
                $set: {
                    products: products,
                    totalPrice: totalPrice
                }
            })
        if (updatedInfo.modifiedCount === 0) return false;
        let productModel = await prodCol.findOne({ _id: ObjectId(prodId) })
        let carts = productModel.activeCarts
        carts.push(userCart._id.toString())
        let prodUpdatedInfo = await prodCol.updateOne({ _id: ObjectId(prodId) },
        {
            $set: {
                activeCarts: carts
            }
        })
        return true;
    }
}

async function removeFromCart(userId, prodId) {
    const cartCol = await cart()
    const prodCol = await product()
    let userCart = await cartCol.findOne({ userId: userId, purchased: false })
    let prodList = userCart.products
    let newList = []
    for (let id of prodList) {
        if (id != prodId) newList.push(id)
    };
    let totalPrice = await calculateToTalPrice(newList)
    const updatedInfo = cartCol.updateOne({ _id: userCart._id },
        {
            $set: {
                products: newList,
                totalPrice: totalPrice
            }
        })
    if (updatedInfo.modifiedCount === 0) return false;
    return true;
}

async function placeOrder(userId) {
    const cartCol = await cart()
    const userCol = await user()
    let cartid = await userCol.findOne({ _id: ObjectId(userId) }).activeCart
    let cartUpdate = await cartCol.updateOne({ _id: ObjectId(cartid) }, { $set: { purchased: true, datePurchased: new Date().toUTCString } })
    let userUpdate = await userCol.updateOne({ _id: ObjectId(userId) }, { $set: { activeCart: null } })
    let products = await cartCol.findOne({ _id: ObjectId(cartid) }).products
    for (let prod of products) {
        const prodCol = await product()
        let carts = await prodCol.findOne({ _id: ObjectId(prod) }).activeCarts
        for (let cart_ of carts) {
            let cartModel = await cartCol.findOne({ _id: ObjectID(cart_) })
            let products = cartModel.products
            let newList = []
            for (let prod of products) {
                if (prod != prodId) newList.push(prod)
            }
            let updatedInfo = await cartCol.updateOne({ _id: ObjectId(userId) },
                {
                    $set: {
                        products: newList
                    }
                }
            )
        }
    }
}

async function fetchOrders(userId){
    const cartCol = await cart()
    let orders = await cartCol.find({userId: userId,purchased:true}).toArray()
    return orders
}

async function calculateToTalPrice(products) {
    const prodCol = await product()
    let totalPrice = 0
    for (let prodid of products) {
        let productModel = await prodCol.findOne({ _id: ObjectId(prodid)})
        totalPrice += productModel.price
    }
    return totalPrice
}

function removeObjectFromId(obj) {
    obj["_id"] = obj["_id"].toString();
    return obj;
}

module.exports = {
    getUserCart, addToCart, removeFromCart, placeOrder
}
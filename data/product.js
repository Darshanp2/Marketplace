// const mongoCollections = require('../config/mongoCollections.js');
// const cart = mongoCollections.cart;
// const product = mongoCollections.product;
// let { ObjectId } = require('mongodb');
// const { ObjectID } = require('bson');


// async function deleteProduct(id){
//     const prodCollection = await product()
//     let prodID = new ObjectId(id)
//     const deleteInfo = await prodCollection.deleteOne({_id : prodID})
//     updateCarts(prodID)
//     return true
// }

// async function updateCarts(prodID){
//     const cartCollection = await cart()
//     const carts = await cartCollection.find()
//     carts.forEach(obj => {
//         let products = obj.products;
//         let newProducts = [];
//         products.forEach(prod => {
//             if(prod._id != new ObjectID(prodID)){
//                 newProducts.push(prod._id)
//             }
//         });
//         const update = await cartCollection.updateOne({_id : obj._id}, {$addToSet : {products :newProducts}} 
//         )
//     });
// }


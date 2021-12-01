<<<<<<< Updated upstream
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

=======
const mongoCollections = require('../config/mongoCollections');
const product = mongoCollections.product;
const { ObjectId } = require('bson');



async function create(name, description, price) {
    const productsCollection = await product();
    let newproduct = {
        //_id: ObjectId, 
        name: name,
        description: description,
        sellerId: null,
        purchased: false,
        price: price,
        comments: []
    }



    const insertInfo = await productsCollection.insertOne(newproduct);
    let newid = insertInfo.insertedId
    if (insertInfo.insertedCount === 0) throw 'Unable to add Product'

    let a = await productsCollection.findOne(newid);

    a._id = (a._id).toString();
    return a

}





async function get(id) {


    if (!id) {
        throw 'Error: No input'
    }

    if (typeof id !== 'string' || !id.replace(/\s/g, '').length) {
        throw 'Error: Input is not a string or is an empty string'
    }

    if (ObjectId.isValid(id) != true) {
        throw 'Error: Input is not a valid ObjectId'
    }
    const productsCollection = await product();

    let objid = ObjectId(id)
    let pro = await productsCollection.findOne({ _id: objid });
    if (pro == null) {
        throw 'Error: No product with that id';
    }
    pro._id = (pro._id).toString();


    return pro;
}

async function createcomment(productId,comment){

    if(typeof comment !=='string'){
        throw 'Error: The input is not a string'
    }
        

    const productsCollection = await product();
    let objid=  ObjectId(productId)
    
    


let newcomment={ 
    username: 'username',
    comment:comment
  }

const z = await productsCollection.updateOne({_id:objid},{$addToSet:{comments: newcomment}});
let userInserted=true

if (z.insertedCount === 0){
    userInserted=false;
     throw 'Insert failed!';
}
let prod= await productsCollection.findOne({ _id: objid });
if (prod === null){ 
    throw 'Error: No product with that id create comment';
}


 
return true
    }




module.exports = {
    create,
    get,
    createcomment
}
>>>>>>> Stashed changes

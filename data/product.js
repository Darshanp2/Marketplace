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

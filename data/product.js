const mongoCollections = require("../config/mongoCollections");
const product = mongoCollections.product;
const user = mongoCollections.user;
const cart = mongoCollections.cart;
const { ObjectId } = require('bson');

async function create(productName, description,price,category,img,sellerID) {

    if (!productName) throw [400,"You must provide with all the details"];
    if (!description) throw[400,"You must provide with all the details"];
    if (!price) throw[400,"You must provide with all the details"];

    if (typeof productName!='string') throw[400,"You must provide string for product Name"];
    var res = productName.replace(/ /g, "");
    if(res==0) throw[400,"Invalid Product Name"];

    if (typeof description!='string') throw[400,"You must provide string for description"];
    res = description.replace(/ /g, "");
    if(res==0) throw[400,"Invalid Description"];

    if (price < 0) throw[400,"You must provide valid price"];
    
    const usersCollection=await user()
    const productCollection = await product();

    let newProduct = {
        productName: productName,
        description: description,
        image: img,
        sellerId: sellerID,
        category: category,
        purchased: false,
        price: price,
        comments: [],
        activeCarts: []
    };
      
    const insertInfo = await productCollection.insertOne(newProduct);
    const newId = insertInfo.insertedId;
    const productList = await this.getProduct(newId);
    productList["_id"] = productList["_id"].toString();
    return productList;

}

async function getProduct(id) {
  if (!id) throw [400, "You must provide an id to search for"];

  if (typeof id != "object" && typeof id != "string")
    throw [400, "Error: You must provide an id in string"];

  //if(ObjectId.isValid(id)==false)  throw[400,"Invalid ObjectId"];

  let parsedId = ObjectId(id);

  const productCollection = await product();
  const products = await productCollection.findOne({ _id: parsedId });

  if (products === null) throw [404, "Product Not found"];
  products["_id"] = products["_id"].toString();

  return products;
}
async  function getAll(){
    const productCollection = await product();
    const productList = await productCollection.find({purchased:false}).toArray();
    return productList;
}

async function createcomment(productId, comment, userid) {
  let result = true;
  const productsCollection = await product();
  const userCol = await user();
  let userModel = await userCol.findOne({ _id: ObjectId(userid) });
  let objid = ObjectId(productId);
  comment = comment.toString();
  comment = userModel.name + "  :  " + comment;
  let newcomment = {
    comment: comment,
  };
  const z = await productsCollection.updateOne(
    { _id: objid },
    { $addToSet: { comments: newcomment } }
  );
  let userInserted = true;
  if (z.insertedCount === 0) result = false;
  return result;
}

async function deleteProduct(prodId){

  const prodCol = await product()
  let productModel = await prodCol.findOne({_id : ObjectId(prodId)})
  let carts = productModel.activeCarts
  if(carts != null){ 
    const cartCol = await cart()
    for(let cartId of carts){
      let cartModel = await cartCol.findOne({_id: ObjectId(cartId)})
      let products = cartModel.products
      let newList = []
      for(let prod of products){
          if(prod != prodId) newList.push(prod)
      }
      let updatedInfo = await cartCol.updateOne({_id : ObjectId(cartId)},
      {
          $set : {
              products : newList
          }
      })
  }
}
let deletedInfo = await prodCol.deleteOne({_id: ObjectId(prodId)})
if(deletedInfo.deletedCount == 0) return false
return true
}

module.exports = {
  create,
  getProduct,
  getAll,
  createcomment,
  deleteProduct
};

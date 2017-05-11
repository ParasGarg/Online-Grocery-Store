/* Products Collection
 * Products Controllers *
 * Data Access Object *
 * Products Controllers for DAO actions *

 * Controllers Index: 
        =========================================================================
        | S.No. |   Function Call   |                Description                |
        =========================================================================
        |   1.  | getProductsById   | Search infomation for an existing product |
        -------------------------------------------------------------------------
        |   2.  | addNewProduct     | Add new product record in the collection  |
        -------------------------------------------------------------------------
*/

/* importing required files and packages */
const uuid = require('uuid');
const xss = require('xss');
const mongoDbCollection = require('../config/mongodb-collection');
const products = mongoDbCollection.products;

/* exporting controllers apis */
module.exports = productsControllers = {

    //------------------------ fetch a product information by email id
    getProductById: (id) => {
        return products().then((productsCollection) => {  // returning a found json document else returning null
            return productsCollection.findOne({ _id:id });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },

    //------------------------ insert/create a new product record
    addNewProduct: (title, description, category, expDate, mfdDate, size, price, stock, images, suggestion, allegations) => {
        return products().then((productsCollection) => {
            
            // new product object
            let newProduct = {
                _id: uuid.v4(),
                title: xss(title),
                description: xss(description),
                category: xss(category),
                expDate: xss(expDate),
                mfdDate: xss(mfdDate),
                size: xss(size),
                price: xss(price),
                stock: xss(stock),
                images: images,
                suggestion: suggestion,
                allegations: allegations
            }

            // adding a record in to the collection
            return productsCollection.insertOne(newProduct)
                .then((newProductInformation) => {
                    return newProductInformation.insertedId;
                })
                .then((newProductId) => {  // returning created product document
                    return productsControllers.getUserById(newProductId);
                })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },
};
/* Products Collection
 * Products Controllers *
 * Data Access Object *
 * Products Controllers for DAO actions *

 * Controllers Index: 
        ==========================================================================
        | S.No. |    Function Call   |                Description                |
        ==========================================================================
        |   1.  | getProductsById    | Search infomation by a product id         |
        --------------------------------------------------------------------------
        |   2.  | getProductBySearch | Search infomation from a sting            |
        --------------------------------------------------------------------------
        |   3.  | getAllProducts     | Search all product items infomation       |
        --------------------------------------------------------------------------
        |   4.  | addNewProduct      | Add new product record in the collection  |
        --------------------------------------------------------------------------
        
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

    //------------------------ fetch a product information by email id
    getProductByCategory: (category) => {
        return products().then((productsCollection) => {  // returning a found json document else returning null
            return productsCollection.find({ category: { $regex : `.*${category}.*`, $options : 'i' } }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },

    //------------------------ fetch a product information by search string
    getProductBySearch: (keyword) => {
        return products().then((productsCollection) => {  // returning a found json document else returning null

            let query = [ 
                { _id:keyword }, 
                { title: { $regex : `.*${keyword}.*`, $options : 'i' } }, 
                { category: { $regex : `.*${keyword}.*`, $options : 'i' } },
                { description: { $regex : `.*${keyword}.*`, $options : 'i' } }                  
            ];

            return productsCollection.find({ $or: query }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },

    //------------------------ fetch a product information by search string
    getProductBySearchFilter: (keyword, startRange, endRange) => {
        return products().then((productsCollection) => {  // returning a found json document else returning null

            let query = [ 
                { _id:keyword }, 
                { title: { $regex : `.*${keyword}.*`, $options : 'i' } }, 
                { category: { $regex : `.*${keyword}.*`, $options : 'i' } },
                { description: { $regex : `.*${keyword}.*`, $options : 'i' } }                  
            ];

            return productsCollection.find({ $or: query, price: { $gte: startRange, $lte: endRange } }, { _id:1, title:1, category:1, price:1, images:1 }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },

    //------------------------ fetch a product information by filter string
    getProductByFilter: (category, startRange, endRange) => {
        return products().then((productsCollection) => {
            return productsCollection.find({ category: { $regex : `.*${category}.*`, $options : 'i' }, price: { $gte: startRange, $lte: endRange } }, { _id:1, title:1, category:1, price:1, images:1 }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },
// 
    //------------------------ fetch all product information
    getAllProducts: () => {
        return products().then((productsCollection) => {  // returning a found json document else returning null
            return productsCollection.find({ }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },

    //------------------------ insert/create a new product record
    addNewProduct: (title, description, category, brand, expDate, mfdDate, size, price, stock, images, suggestion, allegations) => {
        return products().then((productsCollection) => {
            
            // new product object
            let newProduct = {
                _id: uuid.v4(),
                title: xss(title),
                description: xss(description),
                category: xss(category),
                brand: brand,
                expDate: xss(expDate),
                mfdDate: xss(mfdDate),
                size: xss(size),
                price: parseFloat(xss(price)),
                stock: xss(stock),
                images: images,
                suggestion: suggestion,
                allegations: allegations
            }

            // adding a record in to the collection
            return productsCollection.insertOne(newProduct)
                .then((newProductInformation) => {
                    return newProductInformation.insertedId;
                });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'products' collection.");
        });
    },
};
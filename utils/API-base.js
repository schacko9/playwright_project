const base = require('@playwright/test');


exports.apitest = base.test.extend({

    loginPayLoad :   {userEmail: "slomochacko244@gmail.com",userPassword: "Ygtrece#13"}, 
    orderPayLoad : {orders: [{country: "United States",productOrderedId: "6262e95ae26b7e1a10e89bf0"}]},
    fakeOrdersPayLoad : {data:[],message:"No Orders"},

    productItem : {
        _id: "62bcfad0e26b7e1a10ef3be0",
        product: {
            _id: "6262e990e26b7e1a10e89bfa",
            productName: "adidas original",
            productCategory: "fashion",
            productSubCategory: "shirts",
            productPrice: 31500,
            productDescription: "adidas original",
            productImage: "https://rahulshettyacademy.com/api/ecom/uploads/productImage_1650649488046.jpg",
            productRating: "0",
            productTotalOrders: "0",
            productStatus: true,
            productFor: "men",
            productAddedBy: "admin@gmail.com",
            __v: 0
        }
    },

    productDisplay : {
        data: [
            {
            _id: "6262e9d9e26b7e1a10e89c04",
            productName: "iphone 13 pro",
            productCategory: "electronics",
            productSubCategory: "shirts",
            productPrice: 231500,
            productDescription: "iphone 13 pro",
            productImage: "https://rahulshettyacademy.com/api/ecom/uploads/productImage_1650649561326.jpg",
            productRating: "0",
            productTotalOrders: "0",
            productStatus: true,
            productFor: "men",
            productAddedBy: "admin@gmail.com",
            __v: 0
            }
        ],
        count: 1,
        message: "All Products fetched Successfully"   
    },





})





const { expect } = require("@playwright/test");

class APIUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data: this.loginPayLoad,
        })

        expect(loginResponse.status()).toEqual(200)
        expect(loginResponse.ok()).toBeTruthy()

        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token
    }

    async addToCart(productItem) {
        let token = await this.getToken();
        let productJSON = JSON.parse(JSON.stringify(productItem))
        let ID = {};
        ID.orderID = productJSON._id 
        ID.productID = productJSON.product._id 

        const cartResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/user/add-to-cart",
        {
            data: JSON.stringify(productItem),
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });
        expect(cartResponse.status()).toEqual(200)
        expect(cartResponse.ok()).toBeTruthy()

        const cartResponseJSON = await cartResponse.json();
        expect(cartResponseJSON.message).toEqual("Product Added To Cart")
        return ID
    }

    async removeFromCart(ID) {
        let token = await this.getToken();
        const deleteResponse = await this.apiContext.delete("https://rahulshettyacademy.com/api/ecom/user/remove-from-cart/"+ID.orderID+"/"+ID.productID+"",
        {
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        })

        expect(deleteResponse.status()).toEqual(200)
        const deleteResponseJSON = await deleteResponse.json();
        expect(deleteResponseJSON.message).toEqual("Product Removed from cart")
    }

    async createOrder(orderPayLoad) {
        let token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: JSON.stringify(orderPayLoad),
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        })

        expect(orderResponse.status()).toEqual(201)
        expect(orderResponse.ok()).toBeTruthy()

        const orderResponseJson = await orderResponse.json();
        return orderResponseJson.orders[0];
    }

    async deleteOrder(orderID) {
        let token = await this.getToken();
        const deleteResponse = await this.apiContext.delete("https://rahulshettyacademy.com/api/ecom/order/delete-order/"+orderID+"",
        {
            headers: {
                Authorization: token,
            },
        })

        expect(deleteResponse.status()).toEqual(200)
        expect(deleteResponse.ok()).toBeTruthy()

        const deleteResponseJSON = await deleteResponse.json();
        expect(deleteResponseJSON.message).toEqual("Orders Deleted Successfully")
    }



    async imagesAbortRoute(page) {
        await page.route('**/*', (route) => {
            return route.request().resourceType() === 'image'
                ? route.abort()
                : route.continue()
        });
    }

    async productDisplayRoute(page, productDisplay) {
        await page.route('https://rahulshettyacademy.com/api/ecom/product/get-all-products', async (route) => {
            const response =  await page.request.fetch(route.request());
            route.fulfill(
                {
                    response,
                    body: JSON.stringify(productDisplay),
                })
        })
    }

    async removeOrdersRoute(page, removeordersPayLoad) {
        await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62bcfad0e26b7e1a10ef3be0', async (route) => {
            const response =  await page.request.fetch(route.request());
            route.fulfill(
                {
                    response,
                    body: JSON.stringify(removeordersPayLoad),
                })
        })
    }

    async alterOrdersRoute(page, orderID) {
        await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id="+orderID+"",route => 
            route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'})
        )
    }

}
module.exports = {APIUtils};

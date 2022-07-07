const {LoginPage} = require('./LoginPage');
const {ProductPage} = require('./ProductPage');
const {CartPage} = require('./CartPage');
const {OrdersHistoryPage} = require('./OrdersHistoryPage');


class POManager{

    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.productPage = new ProductPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    }

    getLoginPage(){
        return this.loginPage;
    }
    getCartPage(){
        return this.cartPage;
    }
    getProductPage(){
        return this.productPage;
    }
    getOrdersHistoryPage(){
        return this.ordersHistoryPage;
    }
    
}
module.exports = {POManager};
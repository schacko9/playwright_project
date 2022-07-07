const {expect} = require("@playwright/test");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class ProductPage
{
    constructor(page){
        this.page = page;
        this.title = page.locator(".left");
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.productsText1 = page.locator(".card-body b").first();
        this.cart =  page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
        this.signOut = page.locator("li:nth-child(5) button.btn");

    }

    async wait(){
        await this.page.waitForLoadState('networkidle');
        await this.productsText1.waitFor()
        expect(await this.title.textContent()).toContain("Automation Practice")
    }

    async addToCart(ProductList){
        const count = await this.products.count();
        for(let i =0; i < count; ++i){
            if(ProductList.includes(await this.products.nth(i).locator("b").textContent())){
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
    }
    async getSignOut(){
        await this.signOut.click()
        await this.page.waitForLoadState('networkidle');
        await delay(2000)
    }

    async navigateToOrders(){
        await this.orders.click();
        await this.page.waitForLoadState('networkidle');
        await delay(2000)
    }


    async navigateToCart(){
        await this.cart.click();
        await this.page.waitForLoadState('networkidle');
        await delay(2000)
    }

}
module.exports = {ProductPage};
const { test, expect, request } = require("@playwright/test");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


class CartPage
{
    constructor(page){
        this.page = page;
        this.header = page.locator("div.heading h1");
        this.cart = page.locator(".cart");
        this.table = page.locator("div li").first();
        this.cartBody = page.locator(".items div div:nth-child(1)");
        this.cartTitle = page.locator(".items div div:nth-child(1) h3");
        this.priceBody = page.locator(".items div div:nth-child(2)");
        this.subtotal = page.locator("span.value").first();
        this.cart =  page.locator("[routerlink*='cart']");
        this.home = page.locator("button[routerlink*='/dashboard/']");
        this.orders = page.locator("button[routerlink*='/dashboard/myorders']");
        this.checkout = page.locator("text=Checkout");
        
        this.noProducts = page.locator("div.ng-star-inserted h1")

        this.home1 = page.locator("button.btn-custom").first()
        this.products = page.locator("div.card").first()
    }

    async wait(){
        await this.page.waitForLoadState('networkidle');
        await this.header.waitFor();
        expect(await this.header.textContent()).toContain("My Cart")
        try {
            await this.cart.waitFor();
        } catch (error) {
            
        }
    }

    async expectProductDisplayed(productList){
        let cartCount = 0;
        for(let i=0; i < await this.cartBody.count(); i++){
            if(productList.includes(await this.cartBody.nth(i).locator('h3').textContent())){
                cartCount += 1;
            }
        }
        expect(cartCount).toEqual(productList.length)
    }

    async expectProductDisplayedAPI(productItem){
        for(let i=0; i < await this.cartBody.count(); i++){
            let cardTitle = await this.cartBody.nth(i).locator('h3').textContent()
            if(cardTitle === productItem){
                expect(await this.cartTitle).toEqual(productItem)
                break
            }
        }
    }
    
    async expectPrices(){   
        let subtotal = Number((await this.subtotal.textContent()).toString().split("$")[1]);
        let sum = 0;
        for(let i=0; i < await this.priceBody.count(); i++){
            let p = await this.priceBody.nth(i).textContent()
            let price = p.toString().split(" ")[1]
            sum += Number(price)
        }
        expect(sum).toEqual(subtotal)
    }

    async expectNoProducts(){
        await this.page.waitForLoadState('networkidle');
        expect(await this.noProducts.textContent()).toEqual("No Products in Your Cart !")
    }

    async getCheckout(){
        await this.checkout.click();
        await this.page.waitForLoadState('networkidle');
        await delay(2000)
    }

    async navigateToHome(){
        await this.home1.click();
        await this.page.waitForLoadState('networkidle');
        await this.products.waitFor()
        await delay(2000)
    }

}
module.exports = {CartPage};
const { expect } = require("@playwright/test");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


class OrdersHistoryPage {
    
    constructor(page) {
        this.page = page;
        this.backToCart = page.locator(".offset-md-4");
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderdIdDetails = page.locator(".col-text");
        this.viewOrders = page.locator("div.-teal");


        this.noOrdersText = page.locator("div.mt-4");
        this.securityText = page.locator(".blink_me");

        this.home1 = page.locator("button.btn-custom").first()
        this.products = page.locator("div.card").first()
    }

    async wait(){
        await this.page.waitForLoadState('networkidle');
        await this.backToCart.waitFor()
    }

    async verifyOrderIdExist(orderId) {
        await this.ordersTable.waitFor();

        for (let i=0; i < (await this.rows.count()); i++) {
            const rowOrderId = await this.rows.nth(i).locator("th").textContent();
            if (orderId === rowOrderId) {
                await this.rows.nth(i).locator("button").first().click();
                await this.page.waitForLoadState('networkidle');
                expect(await this.orderdIdDetails.textContent()).toEqual(orderId)
                await this.viewOrders.click()
                await this.page.waitForLoadState('networkidle');
                break;
            }
        }
    }

    async verifyOrderIdAlter(orderId) {
        await this.ordersTable.waitFor();

        for (let i=0; i < (await this.rows.count()); i++) {
            const rowOrderId = await this.rows.nth(i).locator("th").textContent();
            if (orderId === rowOrderId) {
                await this.rows.nth(i).locator("button").first().click();
                await this.page.waitForLoadState('networkidle');
                expect(await this.securityText.textContent()).toEqual("You are not authorize to view this order")
                break;
            }
        }
    }

    async verifyOrderIdDoesntExist(orderId) {
        await this.ordersTable.waitFor();

        for (let i=0; i < (await this.rows.count()); i++) {
            const rowOrderId = await this.rows.nth(i).locator("th").textContent();
            if (orderId === rowOrderId) {
                expect(orderId === rowOrderId).toBeFalsy()
            }
        }
    }

    async verifyNoOrders(){
        await this.page.waitForLoadState('networkidle');
        expect(await this.noOrdersText.textContent()).toContain(" You have No Orders to show at this time.")
    }

    async navigateToHome(){
        await this.home1.click();
        await this.page.waitForLoadState('networkidle');
        await this.products.waitFor()
        await delay(2000)
    }
    
}
module.exports = { OrdersHistoryPage };

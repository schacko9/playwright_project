const { test, expect, request } = require("@playwright/test");
const {POManager} = require('../pageobjects/POManager');
const {APIUtils} = require('../utils/APIUtils');
const {apitest} = require('../utils/API-base');
let token;
let orderID;
let ID;

 

apitest.describe.configure({mode:'parallel'})
apitest.beforeAll(async ({loginPayLoad}) => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  token = await apiUtils.getToken();
});

apitest("Login Test -- @Smoke @Regression", async ({ page }) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client");
  await product.wait();
});

apitest("Add to Cart -- @Smoke @Regression ", async ({ page, loginPayLoad, productItem}) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const cart = poManager.getCartPage(); 

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  ID = await apiUtils.addToCart(productItem);

  await page.goto("https://rahulshettyacademy.com/client");

  // Product Page
  await product.wait()
  await product.navigateToCart()

  // Cart Page
  await cart.wait();
  await cart.expectProductDisplayedAPI(productItem);
  await cart.expectPrices();
  await cart.getCheckout();
  await cart.navigateToHome();

  // Sign Out
  await product.getSignOut();
});

apitest("Add to Cart: Remove from Cart  -- @Regression", async ({ page, loginPayLoad, productItem}) => {
    const poManager = new POManager(page);
    const product = poManager.getProductPage();
    const cart = poManager.getCartPage(); 
  
    page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, token);
  
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    ID = await apiUtils.addToCart(productItem);
  
    await page.goto("https://rahulshettyacademy.com/client");
  
    // Product Page
    await product.wait()
    await product.navigateToCart()
  
    // Cart Page
    await cart.wait();
    await cart.expectProductDisplayedAPI(productItem);
    await cart.expectPrices();
    await apiUtils.removeFromCart(ID)
    await cart.expectNoProducts();
    await cart.navigateToHome();
  
    // Sign Out
    await product.getSignOut();
});

apitest("Creating Order:  -- @Smoke @Regression", async ({ page, loginPayLoad, orderPayLoad }) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const history = poManager.getOrdersHistoryPage();
  
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  orderID = await apiUtils.createOrder(orderPayLoad);

  await page.goto("https://rahulshettyacademy.com/client");

  // Product Page
  await product.wait()
  await product.navigateToOrders()

  // Order History Page
  await history.wait()
  await history.verifyOrderIdExist(orderID)
  await history.navigateToHome()

  // Sign Out
  await product.getSignOut()
});

apitest("Creating Order: Blocking Image Load -- @Regression", async ({ page, loginPayLoad, orderPayLoad }) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const history = poManager.getOrdersHistoryPage();

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  orderID = await apiUtils.createOrder(orderPayLoad);
  
  await apiUtils.imagesAbortRoute(page)

  await page.goto("https://rahulshettyacademy.com/client");

  // Product Page
  await product.wait()
  await product.navigateToOrders()

  // Order History Page
  await history.wait()
  await history.verifyOrderIdExist(orderID)
  await history.navigateToHome()

  // Sign Out
  await product.getSignOut()
});

apitest("Creating Order: Deleting Order  -- @Regression", async ({ page, loginPayLoad, orderPayLoad }) => {
    const poManager = new POManager(page);
    const product = poManager.getProductPage();
    const history = poManager.getOrdersHistoryPage();
    
    page.addInitScript((value) => {
      window.localStorage.setItem("token", value);
    }, token);
  
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayLoad);
    orderID = await apiUtils.createOrder(orderPayLoad);
  
    await page.goto("https://rahulshettyacademy.com/client");
  
    // Product Page
    await product.wait()
    await product.navigateToOrders()
  
    // Order History Page
    await history.wait()
    await history.verifyOrderIdExist(orderID)
    await apiUtils.deleteOrder(orderID)
    await history.verifyOrderIdDoesntExist(orderID)
    await history.navigateToHome()
  
    // Sign Out
    await product.getSignOut()
});

apitest("Security Test: Products Dislayed Alteration  -- @Regression", async ({ page, loginPayLoad, productDisplay }) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const history = poManager.getOrdersHistoryPage();

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad)

  await page.goto("https://rahulshettyacademy.com/client")
  
  // Product Page
  await product.wait();
  await product.navigateToOrders();

  await apiUtils.productDisplayRoute(page, productDisplay)
 
  // Order History Page
  await history.wait()
  await history.navigateToHome();

  // Sign Out
  await product.getSignOut()
});

apitest("Security Test: Removing all Order Data  -- @Regression", async ({ page , loginPayLoad, fakeOrdersPayLoad}) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const history = poManager.getOrdersHistoryPage();
  
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);
  
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad)

  await page.goto("https://rahulshettyacademy.com/client");
  
  await apiUtils.removeOrdersRoute(page, fakeOrdersPayLoad)

  // Product Page
  await product.wait()
  await product.navigateToOrders()

  // Order History Page
  await history.wait()
  await history.verifyNoOrders()
  await history.navigateToHome();

  // Sign Out
  await product.getSignOut()
});

apitest("Security Test: Altering Order Data  -- @Regression", async ({ page, loginPayLoad, orderPayLoad }) => {
  const poManager = new POManager(page);
  const product = poManager.getProductPage();
  const history = poManager.getOrdersHistoryPage();

  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  orderID = await apiUtils.createOrder(orderPayLoad);

  await apiUtils.alterOrdersRoute(page, orderID)

  await page.goto("https://rahulshettyacademy.com/client");
  
  // Product Page
  await product.wait()
  await product.navigateToOrders()

  // Order History Page
  await history.wait()
  await history.verifyOrderIdAlter(orderID)
  await history.navigateToHome();

  // Sign Out
  await product.getSignOut()
});
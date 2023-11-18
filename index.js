const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();
const ecommerceScrap = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(process.env.URI, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);
  await page.click("._30XB9F");

  const searchInputEl = await page.$(".Pke_EE");
  await searchInputEl.type("mobile");
  await searchInputEl.press("Enter");
  await page.waitForSelector("._1AtVbE");
  const products = await page.evaluate(() => {
    const productDetails = document.querySelectorAll("._2kHMtA");
    return Array.from(productDetails).map((product) => {
      const title = product.querySelector("._4rR01T").innerText;
      const price = product.querySelector("._30jeq3").innerText;
      const desc = product
        .querySelector("._1xgFaf")
        .innerText.replace(/\s+/g, " ");
      const image = product.querySelector("._396cs4").getAttribute("src");
      const rating = product.querySelector("._2_R_DZ").innerText;
      return { title, price, desc, image, rating };
    });
  });
  fs.writeFile(`produtsData.json`, JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Data  of  Page Scraped`);
    }
  });
};
ecommerceScrap();

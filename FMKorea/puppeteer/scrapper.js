const { extractData } = require("./actions");
const puppeteer = require("puppeteer");

const scrapFKByKeyword = async (keyword, maxPage) => {
  let result = [];
  const browser = await puppeteer.launch({ headless: false });
  const mainpage = await browser.newPage();

  for (let i = 1; i <= maxPage; i++) {
    result = result.concat(await extractData(browser, mainpage, keyword, i));
  }
  console.log(result);
  browser.close();
  //return result
};
scrapFKByKeyword("애플워치", 2);

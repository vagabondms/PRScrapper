const puppeteer = require("puppeteer");

const getView = async (browser, contentUrl) => {
  const contentPage = await browser.newPage();
  await contentPage.goto(`https://www.fmkorea.com${contentUrl}`, {
    waitUntil: "domcontentloaded",
  });

  const view = await contentPage.$eval(".side.fr", (node) =>
    node.children[0].textContent.slice(5)
  );
  await contentPage.close();
  return view;
};

const extractData = async (keyword, page) => {
  let result = [];
  const browser = await puppeteer.launch({ headless: true });
  const curPage = await browser.newPage();
  await curPage.goto(
    `https://www.fmkorea.com/?vid=&mid=best&category=&listStyle=webzine&search_keyword=${encodeURI(
      keyword
    )}&search_target=title_content&page=${page}`
  );
  const lists = await curPage.$$(".li_best2_pop0");

  for (let i of lists) {
    const title = await i.$eval("a.hotdeal_var8", (node) =>
      node.textContent.trim()
    );
    const date = await i.$eval("span.regdate", (node) =>
      node.textContent.trim()
    );
    const author = await i.$eval("span.author", (node) =>
      node.textContent.slice(3)
    );
    const contentUrl = await i.$eval(".hotdeal_var8", (node) =>
      node.getAttribute("href")
    );
    const view = await getView(browser, contentUrl);

    result.push({ title, date, author, view });
  }
  await browser.close();
  return result;
};

module.exports = {
  extractData,
};

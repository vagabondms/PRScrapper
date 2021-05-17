const { extractData } = require("./actions");

const scrapFKByKeyword = async (keyword, maxPage) => {
  let result = [];
  for (let i = 1; i <= maxPage; i++) {
    result.push(...(await extractData(keyword, i)));
  }
  console.log(result);
  //return result
};
scrapFKByKeyword("애플워치", 1);

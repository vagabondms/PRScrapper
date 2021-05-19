const { extractData } = require("./actions");
const { request, setOption } = require("./helper");

const scrapClienByKeyword = async (keyword, maxPage) => {
  try {
    let result = [];
    for (let page = 0; page < maxPage; page++) {
      const option = setOption(keyword, page);
      const $ = await request(option);
      result = result.concat(await extractData($));
    }
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

scrapClienByKeyword("애플워치", 10);

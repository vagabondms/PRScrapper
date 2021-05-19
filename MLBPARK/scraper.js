const { extractData } = require("./actions");
const { request, setOption } = require("./helper");

const scrapMPByKeyword = async (keyword, maxPage) => {
  try {
    let result = [];
    for (let page = 0; page < maxPage; page++) {
      const option = setOption(keyword, page * 30 + 1);
      const $ = await request(option);
      result = result.concat(await extractData($));
    }
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

scrapMPByKeyword("애플워치", 1);

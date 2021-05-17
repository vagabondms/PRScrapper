const { extractData } = require("./actions");
const { request, setOption } = require("./helper");

const scrapMPByKeyword = async (keyword, maxPage) => {
  try {
    let result = [];
    for (let page = 0; page < maxPage; page++) {
      //i는 page 값으로 넘어가는 것임.
      //시작은 0page 부터

      const option = setOption(keyword, page * 30 + 1);
      const $ = await request(option);
      result.push(...(await extractData($)));
    }
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

scrapMPByKeyword("애플워치", 1);

const { extractData } = require("./actions");
const { request, setOption } = require("./helper");

const scrapFKByKeyword = async (keyword, maxPage) => {
  try {
    let result = [];
    for (let i = 1; i <= maxPage; i++) {
      //i는 page 값으로 넘어가는 것임.
      //시작은 1page 부터
      const option = setOption(keyword, i);
      const $ = await request(option);
      result.push(...(await extractData($)));
    }
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

scrapFKByKeyword("애플워치", 2);

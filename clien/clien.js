const { extractData } = require("./actions");
const { request, setOption } = require("./help");

const scrapClienByKeyword = async (keyword, maxPage) => {
  try {
    let result = [];
    for (let i = 0; i < maxPage; i++) {
      //i는 page 값으로 넘어가는 것임.
      //시작은 0page 부터
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

scrapClienByKeyword("애플워치", 1);

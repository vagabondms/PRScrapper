const cheerio = require("cheerio");
const request = require("requestretry");

const scrapClienByKeyword = async (keyword, maxPage) => {
  try {
    let options = [];
    for (let page = 0; page < maxPage; page++) {
      const option = setOption(keyword, page);
      options.push(option);
    }

    let responses = await Promise.all(
      options.map((option) => {
        return request(option);
      })
    );
    let result = [];
    responses.forEach((html) => (result = result.concat(extractData(html))));
  } catch (e) {
    console.log(e);
  }
};

const extractData = (html) => {
  const $ = cheerio.load(html.body);
  let result = [];
  $(".list_item.symph_row.jirum").each((idx, el) => {
    let obj = {
      title: $(el).find("a.subject_fixed").attr("title"),
      date: $(el).find(".timestamp").text().split(" ")[0].replace(/-/g, "."),
      author: $(el).find(".nickname>img").attr("alt")
        ? $(el).find(".nickname>img").attr("alt")
        : $(el).find(".nickname>span").text(),
      view: refineNum($(el).find("span.hit").text()),
    };
    result.push(obj);
  });
  return result;
};

const setOption = (keyword, page) => {
  return {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0",
    },
    url: `https://www.clien.net/service/search?q=${encodeURI(
      keyword
    )}&sort=recency&p=${page}&boardCd=&isBoard=false`,
  };
};

const refineNum = (string) => {
  const splittedString = string.split(" ");
  return splittedString.length === 2
    ? String(Number(splittedString[0]) * 1000)
    : splittedString[0];
};

scrapClienByKeyword("애플워치", 50);

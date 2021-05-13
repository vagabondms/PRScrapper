const request = require("requestretry");
const cheerio = require("cheerio");

module.exports = {
  setOption: (keyword, page) => {
    const url = `https://www.clien.net/service/search?q=${encodeURI(
      keyword
    )}&sort=recency&p=${page}&boardCd=&isBoard=false`;

    return {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0",
      },
      url,
    };
  },

  request: async (options) => {
    const html = await request(options);
    return cheerio.load(html.body);
  },

  refineNum: (string) => {
    const splittedString = string.split(" ");
    return splittedString.length === 2
      ? String(Number(splittedString[0]) * 1000)
      : splittedString[0];
  },
};

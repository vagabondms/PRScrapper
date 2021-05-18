const request = require("requestretry");
const cheerio = require("cheerio");

module.exports = {
  setOption: (keyword, page) => {
    const url = `https://www.fmkorea.com/?vid=&mid=best&category=&listStyle=webzine&search_keyword=${encodeURI(
      keyword
    )}&search_target=title_content&page=${page}`;

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
};

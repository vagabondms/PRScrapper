const request = require("requestretry");
const cheerio = require("cheerio");

module.exports = {
  setOption: (string, method) => {
    let url;
    if (method === "keyword") {
      url = `https://www.fmkorea.com/?mid=best&search_keyword=${encodeURI(
        string
      )}&search_target=title_content`;
    } else if (method === "href") {
      url = `https://www.fmkorea.com${string}`;
    } else {
      throw new Error();
    }

    return {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0",
      },
      url: url,
    };
  },

  request: async (options) => {
    const html = await request(options);
    return cheerio.load(html.body);
  },
};

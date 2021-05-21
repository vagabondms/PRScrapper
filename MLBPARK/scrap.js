const cheerio = require("cheerio");
const request = require("requestretry");

const scrapMLBByKeyword = async (keyword, maxPage) => {
  try {
    let options = [];
    for (let page = 0; page < maxPage; page++) {
      const option = setOption(keyword, page * 30 + 1);
      options.push(option);
    }

    let responses = await Promise.all(
      options.map((option) => {
        return request(option);
      })
    );

    let result = [];
    responses.forEach((html) => (result = result.concat(extractData(html))));
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const extractData = (html) => {
  const $ = cheerio.load(html.body);
  let result = [];
  $("tbody>tr").each((idx, el) => {
    if ($(el).find("td").filter(":first").text() !== "BULLPEN") {
      return true;
    }
    let obj = {
      title: $(el).find(".txt").attr("alt"),
      date: $(el).find(".date").text().replace(/-/g, "."),
      author: $(el).find(".nick").text(),
      view: $(el).find(".viewV").text(),
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
    url: `http://mlbpark.donga.com/mp/b.php?p=${page}&select=sct&m=search&b=bullpen&query=${encodeURI(
      keyword
    )}`,
  };
};

scrapMLBByKeyword("애플워치", 50);

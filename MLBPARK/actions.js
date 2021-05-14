const { setOption, request } = require("./helper");

const getContent = async (href) => {
  try {
    const options = setOption(href, null);
    const $$ = await request(options);
    return $$("#contentDetail").text();
  } catch (e) {
    console.log(e);
  }
};

// html 값을 넣어주면 해당 페이지에서 내용 추출함
const extractData = async ($) => {
  const result = [];
  for (let el of $("tbody>tr").toArray()) {
    if ($(el).find("td").filter(":first").text() !== "BULLPEN") {
      continue;
    }

    let obj = {
      title: $(el).find(".txt").attr("alt"),
      date: $(el).find(".date").text(),
      author: $(el).find(".nick").text(),
      view: $(el).find(".viewV").text(),
      content: await getContent($(el).find(".txt").attr("href")),
    };
    result.push(obj);
  }
  return result;
};

module.exports = {
  getContent,
  extractData,
};

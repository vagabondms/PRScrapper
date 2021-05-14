const { refineNum, setOption, request } = require("./helper");

const getView = async (href) => {
  try {
    const options = setOption(href, null);
    const $$ = await request(options);
    return $$("#content").attr("value");
  } catch (e) {
    console.log(e);
  }
};

// html 값을 넣어주면 해당 페이지에서 내용 추출함
const extractData = async ($) => {
  const result = [];
  for (let el of $(".list_item.symph_row.jirum").toArray()) {
    let obj = {
      title: $(el).find("a.subject_fixed").attr("title"),

      date: $(el).find(".timestamp").text(),

      author: $(el).find(".nickname>img").attr("alt")
        ? $(el).find(".nickname>img").attr("alt")
        : $(el).find(".nickname>span").text(),

      view: refineNum($(el).find("span.hit").text()),

      content: await getView($(el).find("a.subject_fixed").attr("href")),
    };
    result.push(obj);
  }
  return result;
};

module.exports = {
  getView,
  extractData,
};

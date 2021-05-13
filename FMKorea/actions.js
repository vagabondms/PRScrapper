const { setOption, request } = require("./help");

const getView = async ($, href) => {
  try {
    const options = setOption(href, "href");
    const sub$ = await request(options);
    const view = sub$(".side.fr b")[0];
    return $(view).text();
  } catch (e) {
    console.log(e);
  }
};

// html 값을 넣어주면 해당 페이지에서 내용 추출함
const extractData = async ($) => {
  const result = [];
  for (let el of $(".li_best2_pop0").toArray()) {
    //document_srl이라는 부분을 분리

    let obj = {
      title: $(el).find("a.hotdeal_var8").text().trim(),
      date: $(el).find("span.regdate").text().trim(),
      author: $(el).find("span.author").text().slice(3),

      //view를 제외하면 모든 페이지가 잘 불러와짐
      //depth를 하나 들어가면 바로 멈춰짐
      // view: await getView($, $(el).find(".hotdeal_var8").attr("href")),
    };
    result.push(obj);
  }
  return result;
};

module.exports = {
  getView,
  extractData,
};

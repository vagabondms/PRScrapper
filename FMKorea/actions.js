const { setOption, request } = require("./help");

const getView = async ($, href) => {
  const options = setOption(href, "href");
  const sub$ = await request(options);
  const view = sub$(".side.fr b")[0];
  return $(view).text();
};

const extractData = async ($) => {
  return await Promise.all(
    $(".li_best2_pop0")
      .toArray()
      .map((el) => {
        return {
          title: $(el).find("a.hotdeal_var8").text().trim(),
          date: $(el).find("span.regdate").text().trim(),
          author: $(el).find("span.author").text().slice(3),
        };
      })
  );
};

module.exports = {
  getView,
  extractData,
};

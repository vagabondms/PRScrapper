const cheerio = require("cheerio");
const request = require("requestretry");
let query = encodeURI("q=애플워치");
// console.log(query);
const options = {
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
  },
  url: `https://bbs.ruliweb.com/`,
};
const getHtml = async () => {
  try {
    let ulList = [];
    // console.log(options);
    let html = await request(options);
    // console.log(html.body);
    const $ = cheerio.load(html.body);
    const $tits = $("div.header_search_wrapper").html();
    console.log($tits);
    // .map(function (i, element) {
    //   console.log(element.text());
    //   // ulList[i] = {
    //   //   title: $(element).find("a.tit_txt").text(),
    //   //   url: $(element).find("a.tit_txt").attr("href"),
    //   //   // content:,
    //   //   // views:,
    //   //   date: $(element).find("span.date_time").text(),
    //   //   // nickname:
    //   // };
    // });
    // const result = await Promise.all(
    //   ulList.map((el, i) => {
    //     // console.log(i);
    //     const contentOptions = {
    //       method: "GET",
    //       headers: {
    //         "User-Agent":
    //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
    //       },
    //       url: el.url,
    //     };
    //     return request(contentOptions);
    //   })
    // );
    // // 여기서는 출력된다. promise all 사용 >>> 배열 내의 모든 Promise 가 통과될 때까지 기다리는 Promise 를 반환한다
    // // 배열 내의 모든 Promise 를 중간에 거부(reject or Exception)가 발생하더라도 다 실행한다
    // // console.log(result[0].body);
    // result.map((content, i) => {
    //   const $$ = cheerio.load(content.body);
    //   const $view = $$("div.gall_writer div.fr span.gall_count")
    //     .text()
    //     .slice(3);
    //   const $content = $$("div.write_div div").text();
    //   const $nickname = $$("div.fl span.nickname em").text();
    //   ulList[i].views = $view;
    //   ulList[i].content = $content;
    //   ulList[i].nickname = $nickname;
    //   // return ulList;
    // });
    // // 여기서 출력
    // console.log(ulList);
  } catch (error) {
    console.error(error);
  }
};
getHtml();

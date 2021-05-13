const { extractData } = require("./actions");
const { request, setOption } = require("./help");

const scrapFKByKeyword = async (keyword) => {
  try {
    const options = setOption(keyword, "keyword");
    const $ = await request(options);

    //검색하면 전면에 뜨는 페이지를 스크래핑
    const curPage = await getMainPageContents($);

    //나머지 페이지 스크래핑

    const otherPages = await Promise.all(
      $("fieldset > a")
        .toArray()
        .map((el) => {
          const page = getOtherPagesContents($(el).attr("href"));
          return page;
        })
    );

    // // 전면 페이지와 나머지 페이지를 하나의 배열로 합침

    const result = curPage.concat(...otherPages);
    console.log(result);

    // return result;
  } catch (e) {
    console.log(e);
  }
};

const getMainPageContents = async ($) => {
  try {
    return await extractData($);
  } catch (error) {
    console.error(error);
  }
};

const getOtherPagesContents = async (string) => {
  //method는 "keyword"와 "href"이 있음. 검색어로 나온 첫번째 페이지는 keyword로, 나머지 page들은 url을 사용해서 긁어오기
  try {
    const options = setOption(string, "href");
    const $ = await request(options);
    return await extractData($);
  } catch (error) {
    console.error(error);
  }
};
scrapFKByKeyword("애플워치");

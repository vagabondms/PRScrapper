const cheerio =require('cheerio');
const request = require('requestretry');
// for(let i = 1; i <= 10; i++){}
const options = {
    method: 'POST',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "www.bobaedream.co.kr",
        "Origin": "https://www.bobaedream.co.kr",
        "Referer": "https://www.bobaedream.co.kr/search"
    },
    formData : {
      keyword: '애플워치6',
      sort: 'RANK',
      page:1,
      searchField:"ALL",
      colle:"community",
      startDate:""
    },
    url:`https://www.bobaedream.co.kr/search`,
};
let res = [];
let hrefList = []
const getHtml = async () => {
  try {
      let html = await request(options)
      let $ = cheerio.load(html.body);
      let rows = $(".search_Community li");
      for(let i=0; i<rows.length; i++){
        let row = $(rows).eq(i);
        // let title = row.find("a").text();
        let href = row.find("a").attr("href")
        // console.log(title, href);
        hrefList.push(href)
      }
    //   console.log(hrefList)
    const result = await Promise.all(
            hrefList.map(el => {
          const option = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6",
                "Cache-Control": "max-age=0",
                "Connection": "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": "www.bobaedream.co.kr",
                "Referer": "https://www.bobaedream.co.kr/search"
            },
            url: `https://www.bobaedream.co.kr/${el}`,
        };
        return request(option)
      })
    );
    // console.log(result)
    result.map((content, i) => {
      const $ = cheerio.load(content.body);
      const $title = $(".writerProfile strong").text().split("[")[0]
      const $nickname = $(".nickName").text() || "보배드림"
      const $content = $(".bodyCont").text()
      const $view = $(".countGroup .txtType:nth-of-type(1)").text()
      const $date = $(".countGroup").text().split("|")[2]
      // console.log($nickname)
      res.push({
        title:$title, 
        nickname:$nickname,
        content:$content,
        views:$view,
        date:$date
      })
    })
    // 한페이지 성공
    console.log(res)
  } catch (error) {
      console.error(error);
  }
};
getHtml();
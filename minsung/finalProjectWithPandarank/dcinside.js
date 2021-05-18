const cheerio =require('cheerio');
const request = require('requestretry');
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
      keyword: '애플워치',
      sort: 'RANK',
      page:1,
      searchField:"ALL",
      colle:"community",
      startDate:""
    },
    url:`https://www.bobaedream.co.kr/search`,
};
const getHtml = async () => {
  try {
      let html = await request(options)
      let $ = cheerio.load(html.body);
      let rows = $(".search_Community li");
      for(let i=0; i<rows.length; i++){
        let row = $(rows).eq(i);
        let title = row.find("a").text();
        console.log(title);
      }
  } catch (error) {
      console.error(error);
  }
};
getHtml();
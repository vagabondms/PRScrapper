const cheerio = require("cheerio");
const request = require("requestretry");

let res = [];
// !!!!!!!!!!!! 저에게 맞게 이것 저것 고치긴 했지만 딱히,, 고칠 것이 없어 보입니다
const getHtml = async (options) => {
  let keyword = options.formData.keyword
  
  try {
    let hrefList = [];
    let html = await request(options);
    let $ = cheerio.load(html.body);
    let rows = $(".search_Community li");
    for (let i = 0; i < rows.length; i++) {
      let row = $(rows).eq(i);
      let href = row.find("a").attr("href");
      hrefList.push(href);
    }
    
    const result = await Promise.all(
      hrefList.map((el) => {
        const option = {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "Accept":
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "www.bobaedream.co.kr",
            "Referer": "https://www.bobaedream.co.kr/search",
          },
          url: `https://www.bobaedream.co.kr/${el}`,
        };
        return request(option);
      })
    );
    
    result.map((content, i) => {
      try {
        const $ = cheerio.load(content.body);
        const $title = $(".writerProfile strong").text().split("[")[0].trim();
        const $nickname = $(".nickName").text().trim() || "보배드림";
        const $content = $(".bodyCont").text().trim();
        const $view = Number($(".countGroup .txtType:nth-of-type(1)").text().trim().replace(/,/gi,""));
        const $date = new Date($(".countGroup").text().split("|")[2].trim().substr(0,10));
        
        if($view>10000){
          res.push({
            keyword,
            title: $title,
            nickname: $nickname,
            description: $content,
            hit: $view,
            published_dt: $date,
            source:'bobaedream',
            url:content.request.href
          });
        }
      } catch (error) {
        // !!!!!!!!!!!! 맵에서 오류난 경우, 그냥 패스 continue와 동일 -> 중간에 오류나면 가져와진 데이터들도 망쳐버릴 수 있어서 처리
        console.error(error);
        return false;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

// !!!!!!!!!!!! for문을 안으로 집어 넣었음.
const getData = async (keyword) => {
  let optionsList = [];
  for (let i = 1; i <= 5; i++) {
    const options = {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "www.bobaedream.co.kr",
        "Origin": "https://www.bobaedream.co.kr",
        "Referer": "https://www.bobaedream.co.kr/search",
      },
      formData: {
        keyword,
        sort: "RANK",
        page: i,
        searchField: "ALL",
        colle: "community",
        startDate: "",
      },
      url: `https://www.bobaedream.co.kr/search`,
    };
    optionsList.push(options);
  }
  await Promise.all(optionsList.map((el) => getHtml(el)));
  // 10개 페이지 데이터 출력 완료
  console.log(res);
}

getData("여자친구");
// options의 page 값을 변경하면 가능하다..

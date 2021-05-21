const cheerio = require("cheerio");
const request = require("requestretry");

const extractData = async ($,url,keyword) => {
  const result = [];
  let rows = $(".list_item.symph_row.jirum").toArray();
  for (let i=0; i<rows.length; i++) {
    let el = rows[i];
    let splittedString = $(el).find("span.hit").text().split(" ");
    let obj = {
      title: $(el).find("a.subject_fixed").attr("title"),
      published_dt: new Date($(el).find(".timestamp").text().split(" ")[0].replace(/-/g, ".")),
      nickname: $(el).find(".nickname>img").attr("alt")
        ? $(el).find(".nickname>img").attr("alt")
        : $(el).find(".nickname>span").text(),
      hit: splittedString.length===2 ? Number(splittedString[0]) * 1000 : Number(splittedString[0]),
      url,
      description:$(el).find(".preview").text().trim(),// 미리보기 데이터
      keyword,
      source:'clien'
    };
    
    result.push(obj);
  }
  return result;
}

const scrapClienByKeyword = async (keyword, maxPage) => {
  let result = [];
  let option = {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0",
    }
  }
  // !!!!!!!!!!!! for문 밖을 try catch로 감싸면, 오류가나면 전체가 다 빠져나가게 됨.
  for (let page = 0; page < maxPage; page++) {
    // !!!!!!!!!!!! option에 값을 바꿔가며 사용하기 위해 let으로 선언
    option.url = `https://www.clien.net/service/search?q=${encodeURI(keyword)}&sort=accuracy&p=${page}&boardCd=&isBoard=false`;
    try {
      const ret = await request(option);
      let $ = cheerio.load(ret.body);
      // !!!!!!!!!!!! 나머지 매개변수들은 그냥 제가 필요해서 넣었어요,,
      result = result.concat(await extractData($,ret.request.href,keyword));  
    } catch (error) {
      console.log(error);
    }
  }
  return result;
}




scrapClienByKeyword("여자친구", 10);

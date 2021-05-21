const cheerio = require('cheerio');
const request = require('requestretry');
const iconv = require('iconv-lite');
let query = encodeURI('여진구');

// !!!!!!!!!!!! 코드가 직관적으로 보기 좋았으나, 닉네임을 포기하고 그냥, 리소스를 아끼기로 결정
const options = {
  method: 'GET',
  url: `http://www.ppomppu.co.kr/search_bbs.php?search_type=sub_memo&page_no=1&keyword=${query}&page_size=50&bbs_id=&order_type=date&bbs_cate=2`,
  encoding: null,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
  },
}
// !!!!!!!!!!!! live크롤러쪽에는 for문으로 page_no에 관한 경우 추가했음(여긴 안넣음,,)
const getData = async () => {
  let html = await request(options);
  const $ = cheerio.load(iconv.decode(html.body, 'euc-kr'));
  const $list = $('.results_board .conts');
  const result = [];
  // !!!!!!!!!!!! 이부분 추가
  $list.map((index, el)=>{
    try {
      let title = $(el).find(".title a")[0].children[0].data;
      let url = $(el).find(".title a")[0].attribs;
      let hit = Number($(el).find(".desc span")[1].children[0].data.replace("조회수:","").trim());
      let date = new Date($(el).find(".desc span")[2].children[0].data);
      let description = $(el).find("p a").text().trim();
      result.push({title,url,hit,date,description});
    } catch (error) {
      // !!!!!!!!!!!! 맵에서 오류난 경우, 그냥 패스 continue와 동일 -> 중간에 오류나면 가져와진 데이터들도 망쳐버릴 수 있어서 처리
      return false;
    }
  });
  // !!!!!!!!!!!! 나머지 지움
};

getData();

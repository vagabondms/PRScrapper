const cheerio = require('cheerio');
const request = require('requestretry');
const iconv = require('iconv-lite');
let query = encodeURI('파이썬');

const communityurl = 'http://www.ppomppu.co.kr/';

const getData = async () => {
  let page = 1;
  const listRequest = [];
  const result = [];

  // 전체 페이지 리스트 구하기
  while (true) {
    const options = {
      method: 'GET',
      url: `http://www.ppomppu.co.kr/search_bbs.php?search_type=sub_memo&page_no=${page}&keyword=${query}&page_size=20&bbs_id=&order_type=date&bbs_cate=2`,
      encoding: null,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      },
    };
    let html = await request(options);
    const $ = cheerio.load(iconv.decode(html.body, 'euc-kr'));
    const $list = $('.results_board .conts');
    if ($list.length < 1) break;
    listRequest.push($);
    page++;
  }

  // 페이지별 데이터 구하기
  listRequest.map(async (item, i) => {
    const $ = item;
    const $list = $('.results_board .conts');

    const requestData = await Promise.all(
      $list.map((index, el) => {
        return request({
          method: 'GET',
          url: communityurl + $(el).find('.content .title a').attr('href'),
          encoding: null,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
          },
        });
      })
    );
    requestData.map((el, i) => {
      const $$ = cheerio.load(iconv.decode(el.body, 'euc-kr'));
      let obj = {};
      obj.title = $$('.info_bg .view_title2').text();
      obj.writer = $$('.info_bg .view_name').text();
      obj.url = communityurl + el.req.path.slice(1);

      const datetemp = $$('.info_bg .sub-top-text-box')
        .text()
        .trim()
        .indexOf('등록일: ');
      obj.date = $$('.info_bg .sub-top-text-box')
        .text()
        .trim()
        .slice(datetemp + 5, datetemp + 15);
      const viewtemp1 = $$('.info_bg .sub-top-text-box')
        .text()
        .trim()
        .indexOf('조회수: ');
      const viewtemp2 = $$('.info_bg .sub-top-text-box')
        .text()
        .trim()
        .indexOf('/ 추천수');
      obj.views = $$('.info_bg .sub-top-text-box')
        .text()
        .trim()
        .slice(viewtemp1 + 5, viewtemp2 - 1);
      // console.log(obj);
      result.push(obj);
    });
  });

  // console.log(result);
  // console.log(result.length);
};

getData();

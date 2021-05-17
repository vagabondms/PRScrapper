const cheerio = require('cheerio');
const request = require('requestretry');
let query = encodeURI('애플워치');

const communityurl = 'https://www.instiz.net/';

const getData = async () => {
  let page = 1;
  const listRequest = [];
  const result = [];

  // 전체 페이지 리스트 구하기
  while (true) {
    const options = {
      method: 'GET',
      url: `https://www.instiz.net/bbs/list.php?id=pt&stype=9&k=${query}&page=${page}`,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      },
    };
    let html = await request(options);
    const $ = cheerio.load(html.body);
    const $list = $('#mainboard > tbody > tr');
    if ($list.length < 5) break;
    listRequest.push($);
    page++;
  }

  // 페이지별 데이터 구하기
  listRequest.map(async (item, i) => {
    const $ = item;
    const $list = $('#mainboard > tbody > tr');
    for (let row of $list) {
      let obj = {};
      if ($(row).attr('id') === 'topboard') continue;
      obj.title = $(row).find('#subject').text();
      obj.writer = $(row).find('.listnm').text();
      let temp = $(row).find('#subject > a').attr('href').indexOf('?');
      obj.url =
        communityurl + $(row).find('#subject > a').attr('href').slice(3, temp);
      obj.views = $(row).children().eq(5).text();
      result.push(obj);
    }
    const post = await Promise.all(
      result.map(async (el, i) => {
        const postOptions = {
          method: 'GET',
          url: el.url,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
          },
        };
        return request(postOptions);
      })
    );
    post.map((el, i) => {
      const $$ = cheerio.load(el.body);
      let temp = $$('.tb_left').children().eq(2).attr('title').split(' ');
      result[i].date = temp[0];
    });
  });
  console.log(result.length);
  // console.log(result);
  return;
};

getData();

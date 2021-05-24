const cheerio = require('cheerio');
const request = require('requestretry');
const iconv = require('iconv-lite');
const buffer = iconv.encode('배떡', 'euc-kr');
const query = escape(buffer.toString('binary'));

const communityurl = 'http://web.humoruniv.com/';

const getData = async () => {
  let page = 1;
  let listRequest = [];
  let result = [];

  // 전체 페이지 리스트 구하기
  while (true) {
    const options = {
      method: 'GET',
      url: `http://web.humoruniv.com/search/search.html?search_text=${query}&search_type=&x=0&y=0&page=${page}`,
      encoding: null,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
      },
    };
    let html = await request(options);
    const $ = cheerio.load(iconv.decode(html.body, 'euc-kr'));
    listRequest.push($);
    page++;
    const max_page = parseInt($('.paging').next().text().split('/')[1]);
    if (page > max_page) break;
    console.log(page);
  }

  // 페이지별 데이터 구하기
  for (let row of listRequest) {
    const $ = row;
    const $list = $('table div').eq(1).find('table');

    for (let item of $list) {
      if (!$(item).find('a').attr('href')) continue;
      else result.push({ url: $(item).find('a').attr('href') });
    }
    const requestData = await Promise.all(
      result.map((el, i) => {
        const postOptions = {
          method: 'GET',
          url: el.url,
          encoding: null,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
          },
        };
        return request(postOptions);
      })
    );

    requestData.forEach((el, i) => {
      const $$ = cheerio.load(iconv.decode(el.body, 'euc-kr'));

      result[i].title = $$('#ai_cm_title').text();
      result[i].writer = $$('.hu_nick_txt').eq(0).text();
      result[i].date = $$('#if_date > span').text().trim().split(' ')[0];
      result[i].views = $$('#if_date').prev().text();
    });
  }

  console.log(result);
  console.log(result.length);
};

getData();

const cheerio = require('cheerio');
const request = require('requestretry');
// let query = encodeURI('애플워치');
const iconv = require('iconv-lite');
const buffer = iconv.encode('애플워치', 'euc-kr');
const query = escape(buffer.toString('binary'));

const communityurl = 'http://web.humoruniv.com/';

const options = {
  method: 'GET',
  url: `http://web.humoruniv.com/search/search.html?search_text=${query}&search_type=&x=0&y=0`,
  encoding: null,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
  },
};

const getData = async () => {
  let html = await request(options);
  const $ = cheerio.load(iconv.decode(html.body, 'euc-kr'));
  const $list = $('table div').eq(1).find('table');
  const result = [];

  for (let row of $list) {
    if (!$(row).find('a').attr('href')) continue;
    else result.push({ url: $(row).find('a').attr('href') });
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

  console.log(result);
};

getData();

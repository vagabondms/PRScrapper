const puppeteer = require('puppeteer');
let query = encodeURI('파이썬');

const getData = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const result = [];
  let count = 1;
  await page.setViewport({
    width: 1200,
    height: 900,
  });

  while (true) {
    await page.goto(
      `https://www.instiz.net/bbs/list.php?id=pt&stype=9&k=${query}&page=${count}`
    );
    try {
      await page.waitForSelector('#mainboard > tbody > tr');
      let rows = await page.$$('#mainboard > tbody > tr');
      if (rows.length < 5) break;

      for (let row of rows) {
        let temp = await (await row.getProperty('id')).jsonValue();
        if (temp === 'topboard') continue;

        const aTag = await row.$$('a');
        const href = await (await aTag[0].getProperty('href')).jsonValue();
        // 제목
        const titleTag = await row.$$('#subject a');
        const title = await (
          await titleTag[0].getProperty('textContent')
        ).jsonValue();
        // 작성자
        const writerTag = await row.$$('.listnm a');
        const writer = await (
          await writerTag[0].getProperty('textContent')
        ).jsonValue();
        // 조회수
        const viewsTag = await row.$$('.listno');
        const views = await (
          await viewsTag[2].getProperty('textContent')
        ).jsonValue();

        const postPage = await browser.newPage();
        await postPage.setViewport({
          width: 1200,
          height: 900,
        });
        await postPage.goto(`${href.split('?')[0]}`);

        // 날짜
        const dateTag = await postPage.$$('.tb_left span');
        const date = await (await dateTag[2].getProperty('title')).jsonValue();
        console.log(date);

        result.push({
          title: title,
          writer: writer,
          views: views,
          date: date.split(' ')[0],
          url: href.split('?')[0],
        });
        console.log({
          title: title,
          writer: writer,
          views: views,
          date: date.split(' ')[0],
          url: href.split('?')[0],
        });

        await postPage.close();
      }
    } catch (error) {
      console.log(error);
      break;
    }
    count++;
  }

  await browser.close();
  console.log(result.length);
};

getData();

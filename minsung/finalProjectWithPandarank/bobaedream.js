const puppeteer = require("puppeteer");
// let query = encodeURI("q=애플워치");
let query = "애플워치";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let result = [];
  await page.setViewport({
    width: 1200,
    height: 900,
  });
  await page.goto(`https://www.bobaedream.co.kr/board/bbs.php`);
  try {
    let searchButton = await page.$(".btn-search");
    await searchButton.click();
    await page.type("#keyword", query);
    let clickButton = await page.$(".btn-submit");
    await clickButton.click();
    const earnData = async() => {
      await page.waitForSelector(".search_Community ul li");
      let ulList = await page.$$(".search_Community ul li");
      for (row of ulList) {
      let aTag = await row.$$("a");
      let href = await (await aTag[0].getProperty("href")).jsonValue();
        // console.log(href);
        const newPage = await browser.newPage();
        await newPage.setViewport({
          width: 1920,
          height: 1080,
        });
        await newPage.goto(`${href}`);
        //제목
        let title = await (
          await (await newPage.$(".writerProfile dl dt")).getProperty("title")
        ).jsonValue();
        // console.log(title);
        //닉네임
        let nickname = await (
          await (await newPage.$(".nickName")).getProperty("textContent")
        ).jsonValue();
        // console.log(nickname);
        //조회수
        let views = await (
          await (
            await newPage.$(".countGroup .txtType")
          ).getProperty("textContent")
        ).jsonValue();
        // console.log(views);
        // 글내용
        await newPage.waitForSelector(".bodyCont");
        let contents = await newPage.$$(".bodyCont");
        let text = "";
        for (el of contents) {
          let article = await el.$("article");
          if (article) {
            text = await (await article.getProperty("textContent")).jsonValue();
            // console.log("article text", text);
          } else {
            text = await (await el.getProperty("textContent")).jsonValue();
            // console.log("bodyCont text", text);
          }
        }
        // console.log(text);
        // 작성 시간
        let date = await (
          await (await newPage.$(".countGroup")).getProperty("textContent")
        ).jsonValue();
        // console.log(date.split("|")[2]);
        result.push({
          title: title,
          nickname: nickname,
          views: views,
          content: text,
          date: date.split("|")[2],
        });
        await newPage.close();
      }
    // let nextButton = await(await (await page.$(".paginate a.next")).getProperty("href")).jsonValue();
    // // 반복문으로 다음 버튼이 없을 때 까지 아래 함수 2줄을 실행하면 이론상으로 모든 페이지의 값을 가져올 수 있따.
    // if(nextButton){
    //   await earnData();
    //   await page.click(".paginate a.next")
    // }else{
    //   return
    // }
  };
  await earnData()
  await page.click(".paginate a.next")
  } catch (error) {
    console.log(error);
  }
  // await page.close();
  console.log(JSON.stringify(result));
})();

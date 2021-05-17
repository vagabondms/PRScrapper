const puppeteer = require("puppeteer");
let query = encodeURI("q=애플워치");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let result = [];
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  for (let i = 0; i < 10; i++) {
    await page.goto(
      `https://bbs.ruliweb.com/search?${query}#gsc.tab=0&gsc.${query}&gsc.page=${
        i + 1
      }`
    );
    try {
      // 페이지 안 컨텐츠가 다 로딩될 때까지 기다린다 (예. 싱글페이지 어플리케이션)
      // 쓰면 안되는 경우: 유투브 (영상 다 로딩되기까지 기다리면 한참 걸림)
      // networkidle2와 차이가 뭘까
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      let rows = await page.$$(
        "#board_search .search_result .search_result_list li"
      );
      for (let row of rows) {
        let aTag = await row.$$(".title");
        let href = await (await aTag[0].getProperty("href")).jsonValue();
        const newPage = await browser.newPage();
        await newPage.setViewport({
          width: 1920,
          height: 1080,
        });
        await newPage.goto(`${href}`);
        //제목
        let title = await (
          await (
            await newPage.$(".subject_inner_text")
          ).getProperty("textContent")
        ).jsonValue();
        //닉네임
        let nickname = await (
          await (await newPage.$(".nick")).getProperty("textContent")
        ).jsonValue();
        //조회수
        let views = await (
          await (
            await newPage.$(".user_info p:nth-of-type(5)")
          ).getProperty("textContent")
        ).jsonValue();
        views = views.split("조회 ")[1].split("|")[0];
        // 글내용
        let content = await (
          await (
            await newPage.$(".view_content div")
          ).getProperty("textContent")
        ).jsonValue();
        // 작성 시간
        let date = await (
          await (await newPage.$(".regdate")).getProperty("textContent")
        ).jsonValue();
        result.push({
          title: title,
          nickname: nickname,
          views: views,
          content: content,
          date: date,
        });
        // console.log(title, nickname, views, content, date);
        await newPage.close();
      }
    } catch (error) {
      console.log(error);
    }
  }
  await page.close();
  console.log(JSON.stringify(result));
})();

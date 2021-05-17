const puppeteer = require("puppeteer");
let query = encodeURI("애플워치");

(async () => {
  const browser = await puppeteer.launch(/*{ headless: false }*/);
  const page = await browser.newPage();
  let result = [];
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  // 100페이지는 노트북이 구져서 그런지 몰라도 요청시간 초과된다.
  // 5페이지까지는 잘된다.
  for (let i = 0; i < 5; i++) {
    await page.goto(
      `https://search.dcinside.com/post/p/${i + 1}/sort/latest/q/${query}`
    );
    try {
      // 페이지 안 컨텐츠가 다 로딩될 때까지 기다린다 (예. 싱글페이지 어플리케이션)
      // 쓰면 안되는 경우: 유투브 (영상 다 로딩되기까지 기다리면 한참 걸림)
      // networkidle2와 차이가 뭘까
      // await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      let rows = await page.$$(
        ".sch_result_list li"
      );
      for (let row of rows) {
        let aTag = await row.$$(".tit_txt");
        let href = await (await aTag[0].getProperty("href")).jsonValue();
        const newPage = await browser.newPage();
        await newPage.setViewport({
          width: 1920,
          height: 1080,
        });
        await newPage.goto(`${href}`);
        await newPage.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        //제목
        let title = await (
          await (
            await newPage.$(".title_subject")
          ).getProperty("textContent")
        ).jsonValue();
        //닉네임
        let nickname = await (
          await (await newPage.$(".nickname")).getProperty("textContent")
        ).jsonValue();
        //조회수
        let views = await (
          await (
            await newPage.$(".gall_count")
          ).getProperty("textContent")
        ).jsonValue();
        views = views.split("조회 ")[1].split("|")[0];
        // 글내용
        let content = await (
          await (
            await newPage.$(".write_div")
          ).getProperty("textContent")
        ).jsonValue();
        // 작성 시간
        let date = await (
          await (await newPage.$(".gall_date")).getProperty("textContent")
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

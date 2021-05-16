const puppeteer = require('puppeteer');


(async() => {

    // 브라우저 실행
    const browser = await puppeteer.launch({
        headless: false // what is headless??
    })

    // 페이지 오픈
    const page = await browser.newPage()

    // 페이지 크기 설정
    await page.setViewport({
        width: 1366,
        height : 768
    })

    // 인벤 페이지 접속
    let query = await encodeURI('애플워치')

    await page.goto(`http://www.inven.co.kr/search/webzine/article/${query}`)

    
    let lastList = await getLast(page)


    let resultList = []


    //리스트 탐색하는 반복문
    for(let i = 1; i <=lastList; i++){
        await page.goto(`http://www.inven.co.kr/search/webzine/article/${query}/${i}`)

        let linkList = await getList(page)

        resultList = resultList.concat(await getAll(page,linkList)) 
    }

    console.log(resultList)
    
    
    browser.close();
})()


// 마지막 목록 찾는 함수 
async function getLast(page){
        
    const lastList = await page.$$eval( ".isearch_paging > span > a", datas => datas.map(data => data.textContent))
    
    return lastList[lastList.length-1]
}



// 현재 페이지의 각 컨텐츠 접근 링크를 배열로 리턴하는 함수 
async function getList(page){
        
    const number = await page.$$eval( ".item > h1 > .name", datas => datas.map(data => data.href))
    // number 는 각 링크가 담겨있는 배열
    
    return number
}


// 접근한 컨텐츠에서 필요한 데이터 탐색 후 객체로 리턴하는 함수  
async function getOne(page){

    const cotentTitle = await page.$eval( ".articleTitle > h1", data => data.textContent)
    const cotentDate = await page.$eval( ".articleDate ", data =>  data.textContent)
    const cotentWriter = await page.$eval( ".articleWriter > span", data =>  data.textContent)
    const cotentView = await page.$eval( ".articleHit ", data =>  data.textContent)
    const cotents = await page.$eval( ".powerbbsContent > div ", data=>  data.textContent)
    

        let input = {}
        input.title = cotentTitle
        input.date = cotentDate
        input.writer = cotentWriter
        input.view = cotentView
        input.contents = cotents

        return input
}


// 현재 페이지의 모든 컨텐츠 접근 후 받은 데이터 객체를 종합하는 함수 ( 매개 변수로 링크 배열 필요 )
async function getAll(page, linkList){

    let list = []

    //각 컨텐츠 접근하는 반복문
    for(let i = 0; i < linkList.length; i++){
        await page.goto(`${linkList[i]}`) //
        list.push(await getOne(page))
        }
    
    // 모든 컨텐츠의 데이터를 모은 list 
    return list 
}







// 참고 https://velog.io/@jeffyoun/Puppeteer%EB%A1%9C-%ED%95%99%EA%B5%90-%EA%B3%B5%EC%A7%80-%EA%B8%80-%ED%81%AC%EB%A1%A4%EB%A7%81-%ED%95%98%EA%B8%B0
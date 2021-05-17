const cheerio =require('cheerio');
const request = require('requestretry');


const query = encodeURI('애플워치')

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
    },
    url:`http://www.inven.co.kr/search/webzine/article/${query}`,
};






const getData = async (options) =>{

    let resultList = []

    await getLast(options).then(async lastList => {
        for(let i = 1; i <=10; i++){ // 500개 까지 가능하지만 그이상은 요청시간 초과
            await getList(i).then(async linkList =>{
                await getAll(linkList).then(async res => {
                    resultList = await resultList.concat(res)
                })
            })
        }
    })
    return resultList

}



// 현재 페이지의 각 컨텐츠 접근 링크를 배열로 리턴하는 함수 

const getList = async (pageNumber) => {

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`http://www.inven.co.kr/search/webzine/article/${query}/${pageNumber}`,
    };
    
        
    let html = await request(options)
        var $ = cheerio.load(html.body)
        let linkList = []
        $(".item > h1 > .name").each(function(){
            eachLink = $(this).attr('href')
            linkList.push(eachLink)
        })
        return linkList

    
}


// getLast(options).then(res => console.log(res))




// 마지막 목록 찾는 함수 

const getLast = async (options) => {
    
        
    let html = await request(options)
    var $ = cheerio.load(html.body)
    let lastList = $('.pg:last').text()
    // number 는 각 링크가 담겨있는 배열
    
    return lastList
}

// getLast(options).then(res => console.log(res))


// 접근한 컨텐츠에서 필요한 데이터 탐색 후 객체로 리턴하는 함수
async function getOne(link){

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`${link}`,
    };
    

    let html = await request(options)
    var $ = cheerio.load(html.body)

    const cotentTitle = $(".articleTitle > h1").text()
    const cotentDate = $(".articleDate").text()
    const cotentWriter = $(".articleWriter > span").text()
    const cotentView = +$(".articleHit").text().split(" ")[1].match(/\d+/)
    const cotents = $("#powerbbsContent > div").text()
    

        let input = {}
        input.title = cotentTitle
        input.date = cotentDate
        input.writer = cotentWriter
        input.view = cotentView
        input.contents = cotents

        return input
}

// getOne('http://www.inven.co.kr/board/lol/4625/2987410').then(res => console.log(res))

// 현재 페이지의 모든 컨텐츠 접근 후 받은 데이터 객체를 종합하는 함수 ( 매개 변수로 링크 배열 필요 )
async function getAll(linkList){

    let list = []

    //각 컨텐츠 접근하는 반복문
    for(let i = 0; i < linkList.length; i++){
        await getOne(linkList[i]).then(res => list.push(res))
        }
    
    // 모든 컨텐츠의 데이터를 모은 list 
    return list 
}

// getAll(list).then(res => console.log(res))



getData(options).then(res => console.log(JSON.stringify(res)))
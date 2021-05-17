const cheerio =require('cheerio');
const request =require('requestretry');


const query = encodeURI('애플워치')

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
    },
    url:`https://pann.nate.com/search/fantalk?q=${query}`,
};




const getData = async (options) =>{

    let resultList = []
    try{
    await getLast(options).then(async lastList => {
        for(let i = 1; i <=10; i++){ // 검색횟수 제한 인벤과 마찬가지로 일정 데이터 초과 시 요청 시간 초과
            //  페이지 넘버 매개 변수로 전달 
            await getList(i).then(async linkList =>{
                await getAll(linkList).then(async res => {
                    resultList = await resultList.concat(res)
                })
            })
        }
    })
    return resultList
    }
    catch(error){
        console.error(error);
    }

}



// 현재 페이지의 각 컨텐츠 접근 링크를 배열로 리턴하는 함수 

const getList = async (pageNumber) => {
    // 페이지 이동을 위한 options 설정
    try{
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`https://pann.nate.com/search/fantalk?q=${query}&page=${pageNumber}`,
    };
    
        
    let html = await request(options)
        var $ = cheerio.load(html.body)
        let linkList = []
        $(".subject").each(function(){
            eachLink = $(this).attr('href')
            linkList.push(eachLink)
        })
        return linkList
    }
    catch(error){
        console.error(error);
    }
    
}


// 마지막 목록 찾는 함수 

const getLast = async (options) => {
    
    try{    
    let html = await request(options)
    var $ = cheerio.load(html.body)
    let lastList = Math.ceil(Number($('.count').text().split(" ")[1])/10)
    // number 는 각 링크가 담겨있는 배열
    
    return lastList
    }
    catch(error){
        console.error(error);
    }

}


// 접근한 컨텐츠에서 필요한 데이터 탐색 후 객체로 리턴하는 함수
async function getOne(link){
    try{
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`https://pann.nate.com${link}`,
    };
    

    let html = await request(options)
    var $ = cheerio.load(html.body)

    const cotentTitle = $("h4").text()
    const cotentDate = $(".date").text()
    const cotentWriter = $(".writer").text()
    const cotentView = Number($(".tit").parent('.count').text().slice(2).replace(/\,/g,''))
    const cotents = $("#contentArea").not("img").text().replace(/[\t\n]/g,'')
    

        let input = {}
        input.title = cotentTitle
        input.date = cotentDate
        input.writer = cotentWriter
        input.view = cotentView
        input.contents = cotents

        return input
    }
    catch(error){
        console.error(error);
    }

}


// 현재 페이지의 모든 컨텐츠 접근 후 받은 데이터 객체를 종합하는 함수 ( 매개 변수로 링크 배열 필요 )
async function getAll(linkList){
    try{
    let list = []

    //각 컨텐츠 접근하는 반복문
    for(let i = 0; i < linkList.length; i++){
        await getOne(linkList[i]).then(res => list.push(res))
        }
    
    // 모든 컨텐츠의 데이터를 모은 list 
    return list 
    }
    catch(error){
        console.error(error);
    }
}



getData(options).then(res => console.log(JSON.stringify(res)))
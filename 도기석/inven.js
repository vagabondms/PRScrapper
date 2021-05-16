const cheerio =require('cheerio');
const request = require('requestretry');

const query = encodeURI('애플워치')




// 목록개수 탐색
const searchList = async ()=> {

    let options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`http://www.inven.co.kr/search/webzine/article/${query}`,
    };

    let result = await request(options)
    var $ = cheerio.load(result.body)
    return $('.pg:last').text()
        
    
}



// 각 컨텐츠의 링크 탐색
const gotoContents = async(listNumber)=>{
    let options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`http://www.inven.co.kr/search/webzine/article/${query}/${listNumber}`,
    };

    let result = await request(options)
    var $ = cheerio.load(result.body)

    let contentLinkList = []

    $(".name[target='_blank']").each(function(){
        let eachLink = $(this).attr('href')
        contentLinkList.push(eachLink)
    })

    return contentLinkList // 링크 리스트 return 
}


const getData = async () => {
    let options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        url:`http://www.inven.co.kr/search/webzine/article/${query}`,
    };

    let result1 = await request(options)
    var $ = cheerio.load(result1.body)

    let linkList = []
    $(".name[target='_blank']").each(function(){
        let eachLink = $(this).attr('href')
        linkList.push(eachLink)
    }) 
    // searchList().then(res => {
        // for(let i = 1; i <= 10; i++){
        //     gotoContents(i).then(res => {
        //         res.forEach(async function(el){

        let resultArr = []
        for(let i=0; i<linkList.length; i++){
                    let options2 = {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
                        },
                        url:`${linkList[i]}`,
                    };
                    let result2 = await request(options2)
                    var $ = cheerio.load(result2.body)
                    
                    var title = $(".articleTitle > h1").text()
                    var date = $(".articleDate").text()
                    var count = $(".articleHit").not("STRONG").text()
                    var writer =$(".articleWriter > span").text()
                    // $(".name[target='_blank']")
                    // console.log(title)
                    let resultdata = { title, date, count, writer }
                    resultArr.push(resultdata)
                }
                return resultArr
                // })
        // } )
    }
// })
// }


getData().then(res=>console.log(res))






// const searchContenList = ()=>{
    
//     let result = searchList()
//     console.log(result)

//     await searchList().then(async res =>  {
//         console.log(res)
//         for(let i =1; i<=res; i++){
//             let options = {
//                 method: 'GET',
//                 headers: {
//                     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
//                 },
//                 url:`http://www.inven.co.kr/search/webzine/article/${query}/${i}`,
//             };

//             let contentList =[]
//             let result = await request(options)
//             var $ = cheerio.load(result.body)

//             for(let i=0; i < 20 ; i++){
//                 var title = $(".name[target='_blank']").eq(i).text()
//                 var content = $('.caption').eq(i).text()
//                 var date = $('.date').eq(i).text()
//                 let contents = {title, content, date}

//                 contentList.push(contents)
//             }
//             console.log(contentList)
//         }

//         return contentList
//     })
// }


// searchContenList()

// 함수 3개 


// 게시물 수 탐색
// 각 개시물에서 필요한 데이터 탐색



const cheerio =require('cheerio');
const request = require('requestretry');

const query = encodeURI('q=유튜브')

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
    },
    url:`https://pann.nate.com/search?${query}`,
};


request(options, function (error, response, html){
    var $ = cheerio.load(html);

    let linkList = []
    $(".subject").each(function(){
        eachLink = $(this).attr('href')
        linkList.push(eachLink)
    }) // href 링크만 가져와서 배열화 

        const getData = async ()=>{
            let resultArr = []
            for(let i=0; i<linkList.length; i++){ // href 링크 배열 반복문을 통해 접근 후 데이터 요청
            let options2 = {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
                },
                url:`https://pann.nate.com${linkList[i]}`,
            };
            let result = await request(options2)
            var $ = cheerio.load(result.body);
            var count = Number($(".tit").parent('.count').text().slice(2).replace(/\,/g,'')) // count가 부모인 class='tit'의 데이터 // 숫자에 , 있을 경우 숫자 변환 NaN replace로 , 삭제
            var title = $("h4").text()
            var content = $("#contentArea").not("img").text() // id='contentArea'의 자식 <p> 의 데이터 
            var writer = $(".writer").text()
            var date = $(".date").text()
            let resData = {count, title, content, writer, date}
            resultArr.push(resData)
        }
        return JSON.stringify(resultArr)
        }

    
    
    getData().then(res=>console.log(res)) // 콘솔은 동기적 처리

});

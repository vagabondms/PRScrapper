const cheerio =require('cheerio');
const request =require('requestretry');

// !!!!!!!!!!!! var->let then->await로 바꾼 것 말고는 딱히 고친게 없습니다

const getData = async (keyword) =>{
    let resultList = []
    try{
        for(let i = 1; i <=5; i++){ // 검색횟수 제한 인벤과 마찬가지로 일정 데이터 초과 시 요청 시간 초과
            //  페이지 넘버 매개 변수로 전달 
            let linkList = await getList(keyword,i);
            let res = await getAll(keyword,linkList);
            resultList = await resultList.concat(res);
        }
        return resultList;
    }
    catch(error){
        console.error(error);
    }
}



// 현재 페이지의 각 컨텐츠 접근 링크를 배열로 리턴하는 함수
const getList = async (keyword,pageNumber) => {
    try{
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
            url:`https://pann.nate.com/search/talk?q=${encodeURI(keyword)}&page=${pageNumber}`,
        };
        
        let html = await request(options);
        let $ = cheerio.load(html.body);
        let linkList = [];
        $(".subject").each(function(){
            linkList.push($(this).attr('href'));
        })
        return linkList;
    }
    catch(error){
        console.error(error);
    }
}


// 현재 페이지의 모든 컨텐츠 접근 후 받은 데이터 객체를 종합하는 함수 ( 매개 변수로 링크 배열 필요 )
let getAll = async (keyword,linkList) => {
    try{
        let list = []
        let results = await Promise.all(linkList.map(link=>{
            const options = {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
                },
                url:`https://pann.nate.com${link}`,
            };
            
            return request(options);
        }));

        results.map((ret)=>{
            try {
                let $ = cheerio.load(ret.body);
    
                const title = $("h4").eq(0).text().trim();
                const cotentDate = $(".date").text();
                const nickname = $(".writer").text().trim();
                const hit = Number($(".tit").parent('.count').text().slice(2).replace(/\,/g,''));
                const description = $("#contentArea").not("img").text().trim();//$("#contentArea").not("img").text().replace(/[\t\n]/g,'');
            
                if(hit>10000){
                    list.push({
                        keyword,
                        title,
                        published_dt:new Date(cotentDate),
                        nickname,
                        description,
                        hit,
                        source:'natepann',
                        url:ret.request.href
                    });
                }
            } catch (error) {
                // !!!!!!!!!!!! 맵에서 오류난 경우, 그냥 패스 continue와 동일 -> 중간에 오류나면 가져와진 데이터들도 망쳐버릴 수 있어서 처리
                console.log(error);
                return false;
            }
        });
        return list;
    }
    catch(error){
        console.error(error);
    }
}



getData("여자친구")
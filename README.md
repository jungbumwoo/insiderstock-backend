# 미국 내부자 주식 거래 정보 제공 반응형 웹

 회사 임원이 회사의 주식을 매도하는 이유는 다양하지만 매수하는 이유는 단 하나입니다. 오를 것이라는 것이죠.
 미국 주식의 내부자 거래 중 매수하는 정보를 모아 제공합니다.

## 크롤링

 [Gurufocus](https://www.gurufocus.com/insider/summary) 에서 하루 3번 Cron으로 매수/ 매도 정보를 크롤링하여
주식 정보를 가져옵니다.
매수 정보는 db에 저장하며 매도 정보중 유저가 보유하고 있는 항목은 따로 저장 후 유저에게 알려줍니다.

[Insiderstock 바로가기](https://insiderstock-frontend.firebaseapp.com) 


``` javascript
/* For get Data */
const rule = new schedule.RecurrenceRule();
rule.hour = [ 04, 18 ]; // 스케줄링 시간 설정함
rule.minute = 30;
rule.tz = 'Asia/Seoul';

schedule.scheduleJob(rule, async() => {
    try {
        await collectData();  // 크롤링 시작
      	console.log("✅ executed Collect schedule Func");
        await deleteData(); // 
    } catch(err) {
        console.log(err);
    }
});
```

---

### api

- GET `/stock?page=${params}`  : pagination 되어 있는 페이지의 내부자 거래 목록을 가져옴
- GET `/interest?page=${params}` : 유저의 관심목록 주식을 페이지 단위로 가져옴
- POST `/addinterest` : 해당 주식을 유저의 관심목록에 추가함
- POST `/delete/interest` : 해당 주식을 유저의 관심목록에서 삭제함

- GET `/onboard?page=${pagenumber}`: 해당 유저가 매수한 주식 리스트를 가져옴 (페이지 단위)
- POST `/add/onboard`: 해당 주식을 유저의 매수 목록에 추가
- POST `/delete/onboard`: 해당 주식을 유저의 매수 목록에서 삭제함

- GET `/getnotinterest?page=${params}` :  유저의 관심없는 주식 항목을 페이지 단위로 조회함
- PUT `/addnotinterest` : 해당 주식을 유저의 무관심 항목에 추가함. 이후 해당 주식은 해당 유저에게서 1주일 간 조회되지 않음 
- PUT `/delete/notinterest` : 해당 주식을 유저의 무관심 항목에서 삭제함

- GET `/addban` : 해당 주식을 유저의 차단 항목에 추가함. 이후 해당 주식은 해당 유저의 내부자 거래 목록에서 조회되지 않음
- GET `/ban?page=${params}` :  유저가 차단한 주식 항목을 페이지 단위로 조회함
- POST `/ban/delete` :  해당 주식을 유저의 차단 항목에서 삭제함

유저관련

- PUT `/auth/kakao/signup` : Oauth 2.0, JWT를 이용한 회원가입
- PUT `/auth/kakao/login` : Oauth 2.0, JWT를 이용한 로그인
- GET `/auth/signout`: 로그아웃


## 서비스 종료 이유:

- 지인 및 홍보도 해보았지만 쓰는 유저가 나밖에 없다..
- 수익률 악화 - 본 웹을 이용하여 10여건의 투자를 집행했으나 약 1년간 지속적으로 수익률이 악화되며 약 -70% 의 수익률..

- 의존성 : 서비스가 Guru Focus(https://www.gurufocus.com/) 의 데이터를 크롤링 해와서 운영된다. 로그인 - 탭 이동 - 팝업 창 닫기 - 페이지 순회하기 의 과정을 거쳐서 데이터를 스크롤링을 하게 되는데,
GuruFocus에서 DOM에 변경사항을 주거나, 로그인 이후 팝업창을 띄우는지 안띄우는지의 여부 등 Guru Focus에 의존성이 너무 높다. Guru 에서 프로모션을 하거나 조금만 변경사항이 생기면
같이 업데이트를 해줘야함..

``` javascript
await page.goto('https://www.gurufocus.com/forum/login.php?0');
        
        // Login
        await page.waitForSelector('#txt-username');
        await page.type('#txt-username', process.env.GURU_ID);
        await page.type('#txt-password', process.env.GURU_PASSWORD);

        //submit
        await page.click('#login_form > div > table > tbody > tr:nth-child(3) > td > input');
        console.log("Login GURU submit");
		// 팝업 창 닫기
        await page.waitForSelector('#menu > li:nth-child(5) > div > div > ul > li:nth-child(1) > a');	// 데이터 찾아가기
        await page.evaluate(() => document.querySelector('#menu > li:nth-child(5) > div > div > ul > li:nth-child(1) > a').click());

```

``` javascript 
// go to next page 페이지 순환
            console.log("if nextpage");
            let changedUrl = '';
            if(pageNum < 10) {
                console.log(`pageNum`, pageNum);
                changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(${pageNum})`;
                console.log(`changedUrl`, changedUrl);
            } else {
                console.log(`pageNum`, pageNum);
                changedUrl = `#components-root > div > div.insider-page > div.aio-tabs.hide-on-print.hidden-sm-and-down > div.el-pagination.el-pagination--small > ul > li:nth-child(6)`;
                console.log(`changedUrl`, changedUrl);
            }

            await page.evaluate(x => {
                return document.querySelector(x).click();
            }, changedUrl);
            
            await page.waitForTimeout(10000);

```

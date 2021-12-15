# 미국 내부자 주식 거래 정보 제공 반응형 웹

 회사 임원이 회사의 주식을 매도하는 이유는 다양하지만 매수하는 이유는 단 하나입니다. 오를 것이라는 것이죠.
 미국 주식의 내부자 거래 중 매수하는 정보를 모아 제공합니다.

## 크롤링

 [Gurufocus](https://www.gurufocus.com/insider/summary) 에서 하루 3번 Cron으로 매수/ 매도 정보를 크롤링하여
주식 정보를 가져옵니다.
매수 정보는 db에 저장하며 매도 정보중 유저가 보유하고 있는 항목은 따로 저장 후 유저에게 알려줍니다.

[Insiderstock 바로가기](https://insiderstock-frontend.firebaseapp.com) 

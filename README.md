# [멜론 플레이리스트 유튜브 뮤직으로 옮기기](https://mag1c.tistory.com/506)

`정상동작하지 않는다면 해당 포스팅에 댓글 혹은 이슈를 남겨주세요 !!!`

유튜브 프리미엄과 멜론 이용료의 지속적인 인상으로, 유튜브 프리미엄을 포기할 수 없어 10년넘게 모아둔 멜론 플레이리스트들을 유튜브 뮤직으로 갈아타기 위해 제작되었습니다.

멜론 로그인은 멜론 / 카카오 계정을 이용하여 로그인하실 수 있습니다. 카카오의 경우 2차인증은 직접 진행해주시면 되겠습니다.

구글 로그인은 ID / PW를 직접 입력할 경우에만 동작하게 되어있으며, 2차인증은 현재 로그인 URL에선 작동하지 않아 생략했습니다.

<br />

## 사용방법
1. 소스코드를 가져온다.
2. 콘솔에 멜론 ID / PW를 입력하는 게 마음에 들지 않는다면 변수에 ID / PW 세팅을 한다.
3. 시작
```
npm start / node index.js
```

<br />

## 주의사항
1. ${\textsf{\color{red}2024년 04월}}$ 기준 작성된 코드입니다. 웹의 UI가 변하면 코드가 동작하지 않을 수 있습니다.
2. 구글 로그인 로직은 ID / PW를 입력하게 되어 있는 경우만 개발되어 있습니다. 완전 자동화가 필요 시 문의주세요. <br /> 로그인이 되어있다면 로그인 과정을 생략합니다. 필자는 로그인 후 진행했습니다.
3. ${\textsf{\color{yellow}유튜브 재생목록은 최상위 목록에 저장되게 구현되어 있습니다.}}$
4. 검색 시 '노래' 탭의 가장 위 요소를 플레이리스트에 담게 되어있습니다. 100% 정확할 줄 알았는데 100% 정확하지가 않습니다.
```
export const setupChromeDriver = async () => {
  try {  
    const yourChromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    const yourChromeCookiePath = 'C:/Selenium/ChromeData';
    const chromeCommand = ` ${yourChromePath} --remote-debugging-port=9222 --user-data-dir=${yourChromeCookiePath}`;
    (...생략...)
  }
  catch (e) {
  }
};
```


## 사용 꿀팁
멜론 플레이리스트 파싱용도로 사용하시고 [soundiiz](https://soundiiz.com/)에서 파싱된 플리를 csv포맷팅 하셔서 이용하시는게 더 편할 수도 있습니다. ([관련링크](https://earthconquest.tistory.com/429))

<br />

## 사용 영상

https://github.com/mag123c/from-Melon-to-YTMusic/assets/120711308/e18c42aa-5b1d-4823-a3d7-045ccb0eb029

<br />




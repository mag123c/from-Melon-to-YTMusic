import promptSync from 'prompt-sync';
import { Browser, Builder } from "selenium-webdriver";
import { melonActions } from "./app/melon.js";
import { sendErrorMsg, sendProcessMsg } from './app/sendToClient.js';
import { windowHandlesStack } from "./app/windowHandles.js";

//Your Login Type
let loginType;
let yourId;
let password;
let playListNo;

const prompt = promptSync({ sigint: true });


/** APPLICATION 실행 */
const run = async () => {
    try {
        sendProcessMsg('프로그램을 시작합니다.');

        //로그인 정보를 입력받습니다. 입력하기 껄끄러우시면, 직접 코드를 수정하셔도 됩니다.
        //로그인 정보 입력 시 아래 ★★부분까지 주석 처리해 주세요.
        loginType = prompt('[프로그램 메세지] 로그인 방식을 입력해주세요. 1: 카카오, 2: 멜론. 1 또는 2를 입력해주세요.: ') == "1" ? 'kakao' : 'melon';
        yourId = prompt('[프로그램 메세지] 아이디를 입력해주세요: ');
        password = prompt('[프로그램 메세지] 비밀번호를 입력해주세요. 비밀번호는 자동으로 암호화됩니다.: ', { echo: '*' });
        playListNo = prompt('[프로그램 메세지] 가져올 플레이리스트 번호를 입력해주세요: ');
        sendProcessMsg(`[프로그램 메세지] ${loginType == 'kakao' ? '카카오' : '멜론'} 계정으로 시작합니다.`);
        sendProcessMsg('프로그램을 3초 후에 시작합니다.')

        await new Promise(resolve => setTimeout(resolve, 1000));
        sendProcessMsg(3);
        await new Promise(resolve => setTimeout(resolve, 1000));
        sendProcessMsg(2);
        await new Promise(resolve => setTimeout(resolve, 1000));
        sendProcessMsg(1);
        //★★


        let driver = await new Builder().forBrowser(Browser.CHROME).build();

        //Initialize windowHandlesStack
        windowHandlesStack.init(driver);

        const melonPlayList = await melonActions(driver, loginType, yourId, password, playListNo);
        sendProcessMsg('플레이리스트 가져오기 완료');

        await driver.quit();
        sendProcessMsg('프로그램을 종료합니다.');
    }
    catch (e) {
        sendErrorMsg('[에러 메세지] 에러가 발견되어 프로그램을 종료합니다. 관리자에게 문의해주세요.')
    }

}

run();

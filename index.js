import promptSync from 'prompt-sync';
import { setupChromeDriver } from './app/driver.js';
import { melonActions } from './app/melon.js';
import { countDown, sendErrorMsg, sendProcessMsg } from './app/sendToClient.js';
import { windowHandlesStack } from './app/windowHandles.js';
import { ytMusicActions } from './app/ytMusic.js';

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

        await countDown(3);
        //★★


        // let driver = await new Builder().forBrowser(Browser.CHROME).build();
        let driver = await setupChromeDriver();
        windowHandlesStack.init(driver);

        await driver.sleep(2000);

        const melonPlayList = await melonActions(driver, loginType, yourId, password, playListNo);
        const result = await ytMusicActions(driver, melonPlayList);

        result ? sendProcessMsg('프로그램을 종료합니다.') : sendErrorMsg('플레이리스트를 재생목록으로 옮겨 작업을 완료해주세요.');
    }
    catch (e) {
        console.error(e)
        sendErrorMsg('[에러 메세지] 에러가 발견되어 프로그램을 종료합니다. 관리자에게 문의해주세요.')
    }

}

run();

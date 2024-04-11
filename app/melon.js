import { By, until } from "selenium-webdriver";
import { implicitWait, waitForKakaoSecondAuthentication, waitForNewWindow } from "./driver.js";
import { sendErrorMsg, sendProcessMsg } from './sendToClient.js';
import { windowHandlesStack } from "./windowHandles.js";

const login = async (driver, loginType, yourId, password) => {
    await driver.findElement({ className: "btn_login" }).click();
    await implicitWait(driver, 2000);

    if (loginType === 'kakao') {
        await kakaoLogin(driver, yourId, password);
    }

    else {
        await melonLogin(driver, yourId, password);
    }
}

const kakaoLogin = async (driver, yourId, password) => {
    try {
        await driver.findElement({ className: "btn_gate kakao" }).click();
        await waitForNewWindow(driver, 10000);

        //카카오 로그인 시 팝업 핸들링
        await windowHandlesStack.push();
        await windowHandlesStack.switchToLastWindow();

        //로그인창 -> 로그인 정보 입력
        await driver.findElement({ id: "loginId--1" }).sendKeys(yourId);
        await driver.findElement({ id: "password--2" }).sendKeys(password);
        await driver.sleep(500);
        await driver.findElement({ className: "btn_g highlight submit" }).click();

        //카카오 2단계 인증
        await waitForKakaoSecondAuthentication(driver, 30000);

        await driver.close();
        windowHandlesStack.pop();
        await windowHandlesStack.switchToLastWindow();
    }
    catch (e) {
        throw new Error('카카오 로그인 실패');
    }

}

const melonLogin = async (driver, yourId, password) => {
    try {
        await driver.findElement({ className: "btn_gate melon" }).click();
        await implicitWait(driver, 2000);

        await driver.findElement({ id: "id" }).sendKeys(yourId);
        await driver.findElement({ id: "pwd" }).sendKeys(password);
        await driver.findElement({ id: "btnLogin" }).click();
    }
    catch (e) {
        throw new Error('멜론 로그인 실패');
    }

}

const afterLoginPopupQuit = async (driver) => {
    try {
        await driver.sleep(500);
        const mainWindowHandle = await driver.getWindowHandle();
        const allHandles = await driver.getAllWindowHandles();

        for (let handle of allHandles) {
            if (handle !== mainWindowHandle) {
                await driver.switchTo().window(handle);
                await driver.close();
            }
        }

        await driver.switchTo().window(mainWindowHandle);
    }
    catch (e) {
        sendErrorMsg('광고 팝업 제거 실패. 프로세스에는 지장 없습니다.');
    }

}

const goToPlayList = async (driver, playListNo) => {
    try {
        //마이페이지로 이동
        await driver.findElement(By.xpath('//*[@id="gnb_menu"]/ul[2]/li/a')).click();
        await implicitWait(driver, 2000);
        await driver.sleep(500);

        //플레이리스트 이동        
        await driver.findElement(By.xpath('//*[@id="conts"]/div[1]/ul/li[3]/a')).click();
        await implicitWait(driver, 2000);

        //선핵한 플레이리스트 넘버로 이동        
        let playListAll;
        let totalPlayList = 0;

        while (true) {
            //현재 페이지의 플레이리스트 목록 개수 조회
            const pl = await driver.findElement({ id: 'pageList' });
            const tbody = await pl.findElement({ tagName: 'tbody' });
            const trElements = await tbody.findElements({ tagName: 'tr' });
            totalPlayList += trElements.length;

            if (totalPlayList >= playListNo) {
                playListAll = trElements;
                break;
            }

            const lastBtn = await driver.findElement({ className: 'btn_last' });

            if ((await lastBtn.getAttribute('class')).indexOf('disabled') > -1) {
                throw new Error('플레이리스트 번호가 존재하지 않습니다. 프로그램을 종료합니다.');
            }

            await driver.findElement(By.css('.page_num > strong + a')).click();
            await driver.wait(until.elementLocated(By.css('#pageList tbody')), 10000);
        }

        await implicitWait(driver, 2000);

        //플레이리스트 클릭해서 이동 (플레이리스트는 한페이지 20개기준으로 제작되었습니다.)
        const playList = playListAll[(playListNo - 1) % 20];
        await driver.sleep(500);
        const tdElements = await playList.findElements({ tagName: 'td' });        
        await tdElements[1].findElement({ tagName: 'a' }).click();        
    }
    catch (e) {
        throw e;
    }

}

const parsePlayList = async (driver) => {
    try {
        await implicitWait(driver, 2000);

        const playList = [];
        const trElements = await driver.findElements({ css: '#frm table tbody tr' });

        for (let tr of trElements) {
            const tdElements = await tr.findElements({ tagName: 'td' });
            const title = await tdElements[2].getText();
            const artist = await tdElements[3].getText();

            playList.push({ title, artist });
        }

        return playList;
    }
    catch (e) {
        throw new Error('플레이리스트 파싱 실패');
    }


}

export const melonActions = async (driver, loginType, yourId, password, playListNo) => {
    try {
        sendProcessMsg('멜론에 접속합니다.');
        await driver.get("https://www.melon.com/");
        await windowHandlesStack.push();
        await implicitWait(driver, 2000);

        //로그인 페이지로 이동해서 로그인 작업
        sendProcessMsg('로그인 페이지로 이동합니다.')
        await login(driver, loginType, yourId, password);
        await afterLoginPopupQuit(driver);

        sendProcessMsg('로그인 완료');
        //로그인 시 나타나는 팝업 제거
        await windowHandlesStack.push();
        await windowHandlesStack.switchToLastWindow();

        //플리로 이동
        await goToPlayList(driver, playListNo);
        await implicitWait(driver, 2000);

        //플리 파싱해서 리턴
        return await parsePlayList(driver);
    }
    catch (e) {
        console.error(e);
        sendErrorMsg(e.message);
        throw e;
    }
    finally {
        driver.quit();
    }

    return playList;
}
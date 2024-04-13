import promptSync from 'prompt-sync';
import { By, Key } from 'selenium-webdriver';
import { explicateWaitForCss, implicitWait } from "./driver.js";
import { sendErrorMsg, sendProcessMsg } from "./sendToClient.js";

const prompt = promptSync({ sigint: true });

/** ID / PW 입력란이 있는 로그인만 구현되어있습니다. 2차 인증 및 다른 로그인과정에 대한 개발은 되어있지 않습니다. */
const login = async (driver) => {
    try {
        await driver.findElement({ xpath: `//*[@id="buttons"]/ytd-button-renderer/yt-button-shape/a` }).click();
        await implicitWait(driver, 2000);

        const { yourId, password } = await getLoginInfo();
        await driver.findElement({ id: "identifierId" }).sendKeys(yourId);
        await driver.findElement({ id: "identifierNext" }).click();
        await implicitWait(driver, 10000);

        await driver.findElement({ xpath: `//*[@id="password"]/div[1]/div/div[1]/input` }).sendKeys(password);
        await driver.findElement({ id: "passwordNext" }).click();
    }
    catch (e) {
        console.error(e);
    }

}

/** 해당 함수부분의 prompt부분 싹다 날리고 직접 아이디 비밀번호 입력하셔도 됩니다. */
const getLoginInfo = async () => {
    // const yourId = '아이디 입력';
    // const password = '비밀번호 입력';
    const yourId = prompt('[프로그램 메세지] 아이디를 입력해주세요: ');
    const password = prompt('[프로그램 메세지] 비밀번호를 입력해주세요. 비밀번호는 자동으로 암호화됩니다.: ', { echo: '*' });
    return { yourId, password };
}

const addPlayList = async (driver, melonPlayList) => {
    try {
        for (let song of melonPlayList) {
            await search(driver, song);
            await songAdd(driver);
        }
        sendProcessMsg('유튜브 뮤직으로의 플레이리스트 이동이 완료되었습니다.')
    }
    catch (e) {

    }

}

/** URL로 핸들링하는 게 더 좋을 수 있습니다.
 * 현재는 검색창에 입력하는 방식으로 구현되어 있습니다.
 * (driver.get('https://music.youtube.com/search?q=' + params) 
 */
const search = async (driver, params) => {
    const inputField = await driver.findElement(By.css('input#input.style-scope.ytmusic-search-box'));
    await inputField.click();
    await inputField.sendKeys(Key.CONTROL, 'a');
    await inputField.sendKeys(Key.BACK_SPACE);

    await inputField.sendKeys(params, Key.ENTER);
    await driver.sleep(1000);
}

const songAdd = async (driver, song) => {
    try {
        const songDiv = await explicateWaitForCss(driver, "div#contents.style-scope.ytmusic-shelf-renderer", 5000);
        const song = await songDiv.findElement(By.css(":first-child"));
        const action = driver.actions({ bridge: true });
        await action.move({ origin: song }).perform();
        await song.findElement({ className: "menu style-scope ytmusic-responsive-list-item-renderer" }).click();
        await implicitWait(driver, 2000);
        await driver.findElement({ className: "icon style-scope ytmusic-menu-service-item-renderer" }).click();
        await implicitWait(driver, 2000);
    }
    catch (e) {
        console.error(e);
        sendErrorMsg(`곡을 찾을 수 없습니다. 다음 곡으로 이동합니다. (${song})`);
    }

}

const createPlayList = async (driver) => {
    try {
        //현재 재생목록 클릭해서 창 띄우기
        await driver.findElement({ className: 'middle-controls style-scope ytmusic-player-bar' }).click();
        await implicitWait(driver, 2000);

        //재생목록 저장버튼 클릭
        await driver.findElement(By.css("div#buttons.style-scope.ytmusic-queue-header-renderer")).click();
        await implicitWait(driver, 2000);

        //최상위 재생목록 클릭
        const playList = await driver.findElement(By.css("div#playlists.scroller.style-scope.ytmusic-add-to-playlist-renderer"));
        await playList.findElement(By.css(":first-child")).click();
        await implicitWait(driver, 2000);

        sendErrorMsg('플레이리스트를 재생목록으로 만드는 데 성공했습니다..');

        await driver.sleep(10000);
        await driver.quit();

        return true;
    }
    catch (e) {
        console.error(e);
        sendErrorMsg('플레이리스트를 재생목록으로 만드는 데 실패했습니다. 플레이리스트에서 수동으로 작업을 완료해주세요.');
        return false;
    }

}

export const ytMusicActions = async (driver, melonPlayList) => {
    sendProcessMsg('유튜브 뮤직으로의 플레이리스트 이동을 시작합니다.')
    await driver.get('https://music.youtube.com/');

    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl != 'https://music.youtube.com/') {
        sendProcessMsg('유튜브 뮤직 로그인을 시작합니다.');
        await login(driver);
    }

    await addPlayList(driver, melonPlayList);

    sendProcessMsg('유튜브 재생목록에 추가합니다. 가장 최상위 재생목록을 선택합니다.')
    const result = await createPlayList(driver);

    return result;
}
import { exec } from 'child_process';
import { Browser, Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import { ELEMENT_NOT_FOUND, KAKAO_AUTHENTICATION_TIMEOUT, WINDOW_NOT_FOUND } from './errorMessage.js';
import { sendErrorMsg, sendProcessMsg, silentCount } from './sendToClient.js';

export const implicitWait = async (driver, time) => {
    try {
        await driver.manage().setTimeouts({ implicit: time });
    } catch (e) {
        sendErrorMsg(ELEMENT_NOT_FOUND);
        throw new Error(ELEMENT_NOT_FOUND);
    }

}

export const explicateWait = async (driver, className, time) => {
    try {
        const element = until.elementLocated(By.className(className));
        return await driver.wait(element, time);
    }
    catch (e) {
        sendErrorMsg(ELEMENT_NOT_FOUND);
        throw new Error(ELEMENT_NOT_FOUND);
    }
}

export const explicateWaitForCss = async (driver, style, time) => {
    try {
        const element = until.elementLocated(By.css(style));
        return await driver.wait(element, time);
    }
    catch (e) {
        sendErrorMsg(ELEMENT_NOT_FOUND);
        throw new Error(ELEMENT_NOT_FOUND);
    }
}

export const explicateWaitForXpath = async (driver, style, time) => {
    try {
        const element = until.elementLocated(By.xpath(style));
        return await driver.wait(element, time);
    }
    catch (e) {
        sendErrorMsg(ELEMENT_NOT_FOUND);
        throw new Error(ELEMENT_NOT_FOUND);
    }
}

export const explicateWaitForTagName = async (driver, tagName, time) => {
    try {
        const element = until.elementLocated({ tagName: tagName });
        return await driver.wait(element, time);
    }
    catch (e) {
        sendErrorMsg(ELEMENT_NOT_FOUND);
        throw new Error(ELEMENT_NOT_FOUND);
    }
}

export const waitForNewWindow = async (driver, timeout) => {
    let end = Date.now() + timeout;
    let currentHandles = await driver.getAllWindowHandles();
    let newHandleCount = currentHandles.length + 1;
    while (Date.now() < end) {
        const handles = await driver.getAllWindowHandles();
        if (handles.length === newHandleCount) {
            return;
        }
        await driver.sleep(500);
    }
    sendErrorMsg(WINDOW_NOT_FOUND);
    throw new Error(WINDOW_NOT_FOUND);
};

export const waitForKakaoSecondAuthentication = async (driver, timeout) => {
    try {
        sendProcessMsg('카카오 2단계 인증을 기다리는 중...');
        const agreeBtn = await explicateWait(driver, "btn_agree", timeout);
        await agreeBtn.click();
    }
    catch (e) {
        sendErrorMsg(KAKAO_AUTHENTICATION_TIMEOUT);
        throw new Error(KAKAO_AUTHENTICATION_TIMEOUT)
    }

}

// export const waitForGoogleSecondAuthentication = async (driver, timeout) => {
//     try {
//         sendProcessMsg('카카오 2단계 인증을 기다리는 중...');
//         const agreeBtn = await explicateWait(driver, "btn_agree", timeout);
//         await agreeBtn.click();
//     }
//     catch (e) {
//         sendErrorMsg(KAKAO_AUTHENTICATION_TIMEOUT);
//         throw new Error(KAKAO_AUTHENTICATION_TIMEOUT)
//     }

// }

export const setupChromeDriver = async () => {
    try {
        const yourChromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
        const yourChromeCookiePath = 'C:/Selenium/ChromeData';
        const chromeCommand = ` ${yourChromePath} --remote-debugging-port=9222 --user-data-dir=${yourChromeCookiePath}`;

        exec(chromeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
        });

        sendProcessMsg('로딩중입니다. 잠시만 기다려주세요.')
        silentCount(5);

        const chromeOptions = new Options();
        chromeOptions.addArguments("--remote-allow-origins=*");
        chromeOptions.addArguments(`--user-data-dir=${yourChromeCookiePath}`);
        chromeOptions.addArguments("--remote-debugging-port=9222");        
        chromeOptions.setPageLoadStrategy('none');

        let driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(chromeOptions)
            .build();

        driver.manage().setTimeouts({ implicit: 30000 });

        return driver;
    }
    catch (e) {
        console.error(e);
        throw e;
    }

};
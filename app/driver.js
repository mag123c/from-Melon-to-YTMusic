import { By, until } from 'selenium-webdriver';
import { ELEMENT_NOT_FOUND, KAKAO_AUTHENTICATION_TIMEOUT, WINDOW_NOT_FOUND } from './errorMessage.js';
import { sendErrorMsg, sendProcessMsg } from './sendToClient.js';

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
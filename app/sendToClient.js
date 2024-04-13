export const sendProcessMsg = async (message) => {
    console.log('[프로그램 메세지]', message);
    return;
}

export const sendErrorMsg = async (message) => {
    console.log('[에러 메세지]', message);
    return;
}

export const countDown = async (seconds) => {
    for (let i = seconds; i > 0; i--) {
        sendProcessMsg(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

export const silentCount = async (seconds) => {
    for (let i = seconds; i > 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
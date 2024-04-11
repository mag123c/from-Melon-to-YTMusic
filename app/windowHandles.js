//Selenium WEB driver handles
export const windowHandlesStack = {
    stack: [],
    driver: null,

    init(driver) {
        this.driver = driver;
    },

    async push() {
        const currentHandles = await this.driver.getAllWindowHandles();
        const newHandles = currentHandles.filter(handle => !this.stack.includes(handle));
        
        this.stack.push(...newHandles);
    },

    async pop() {
        return this.stack.length > 0 ? this.stack.pop() : null;
    },

    //Switch to the last window
    current() {
        const data =this.stack[this.stack.length - 1];
        return data;
        
    },

    async switchToLastWindow() {
        const currentWindowHandle = this.current();
        if (currentWindowHandle) {
            await this.driver.switchTo().window(currentWindowHandle);
        }
    },
};

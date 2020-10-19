export class Presentation {
    constructor(code) {
        this.code = code;

        const ScreenW = window.screen.width; // Screen width;
        const ScreenH = window.screen.height; // Screen height;

        this.windowW = ScreenW * 0.5;
        this.windowH = ScreenH * 0.5;

        this.centerX = ScreenW / 2 - this.windowW / 2;
        this.centerY = ScreenH / 2 - this.windowH / 2;

        console.log(`Screen resolution is ${ScreenW}x${ScreenH}`);

        console.log(`Presenter has been binded to code '${this.code}'`);
    }

    PresentInNewWindow() {

        //sessionStorage.setItem("present_code", this.code);

        const Existing = window.open("", "BigScreen");
        Existing.close(); // Close any other big screen window

        const Presenter = window.open("/screen", "BigScreen", `height=${this.windowH},width=${this.windowW},left=${this.centerX},top=${this.centerY}`);

        return Presenter;
    }
}
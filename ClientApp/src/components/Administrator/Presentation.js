export class Presentation {
    constructor(code) {
        this.code = code;

        let screenW = window.screen.width; // Screen width;
        let screenH = window.screen.height; // Screen height;

        this.windowW = screenW * 0.75;
        this.windowH = screenH * 0.75;

        this.centerX = screenW / 2 - this.windowW / 2;
        this.centerY = screenH / 2 - this.windowH / 2;

        console.log(`Screen resolution is ${screenW}x${screenH}`);

        console.log(`Presentor has been binded to code '${this.code}'`);
    }

    PresentInNewWindow() {
        //sessionStorage.setItem("present_code", this.code);

        var existing = window.open("", "Bigscreen");
        existing.close(); // Close any other big screen window

        var presenter = window.open("/screen", "Bigscreen", `height=${this.windowH},width=${this.windowW},left=${this.centerX},top=${this.centerY}`);

        return presenter;
    }
}
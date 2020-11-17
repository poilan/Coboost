export class SSE {
    constructor(address)
    {
        this.address = address;
        this.open = false;

        this.log(`SSE instantiated for '${address}'`);

        this.eventSource = undefined;
    }


    log = (msg) => { console.log(`SSE: ${msg}`); }


    addListener = (type, callback) => {
        if (this.open === true)
            this.eventSource.addEventListener(type, (e) => { callback(e); }, false);
    }


    startEventSource = (callback) => {
        if (this.eventSource !== undefined)
            this.eventSource.close();

        this.eventSource = new EventSource(this.address);
        this.open = true;

        this.addListener("error", (e) => {
            if (e.readyState === EventSource.CLOSED)
            {
                this.log(`Error. connection has been closed (${e})`);
                this.startEventSource(callback);
            }
        });

        this.addListener("open", () => { this.log("SSE has started."); });

        callback(this.eventSource);
    }
};
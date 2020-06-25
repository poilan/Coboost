export default class SSE {
    constructor(address) {
        this.address = address;
        this.open = false;

        this.log(`SSE instantiated for '${address}'`);

        this.eventSource = undefined;
    }

    log = (msg) => {
        console.log(`SSE: ${msg}`);
    }

    addListener = (type, callback) => {
        if (this.open !== true) {
            this.log(`Unable to add an event listener for type '${type}' because the event source is not active.`);
            return;
        }

        this.log(`Registered an event listener on '${type}'`);
        this.eventSource.addEventListener(type, (e) => {
            this.log(`Got input from listener on '${type}'`);
            callback(e.data);
        }, false);
    }


    startEventSource = (callback) => {
        if (this.eventSource !== undefined)
            this.eventSource.close();
        console.log("Attempting to start event source");
        this.eventSource = new EventSource(this.address);
        this.open = true;

        this.addListener("error", (e) => {
            if (e.eventPhase === EventSource.CLOSED) {
                this.log(`Error. connection has been closed (${e})`);
            }
        });

        this.addListener("open", (e) => {
            this.log("SSE has started.");
        });

        callback(this.eventSource);
    }
}
import {ScaleSettings} from "./config/scaleSettings";
import fs = require('fs');
import ph = require('path');

export class FileWatch {

    constructor(private scaleSettings: ScaleSettings, private callback: () => void) { }

    watch() {
        let path = this.path();
        fs.watchFile(path, (prev, next) => {
            this.callback();
        });
    }

    path(): string {
        return ph.join(this.scaleSettings.pathPrefix!!, this.scaleSettings.input)
    }
}

// @ts-ignore
import psd = require("psd");
import ph = require('path');
import {ScaleSettings} from "./config/scaleSettings";

export class PsdConverter {
    constructor(private settings: ScaleSettings) {}

    convert() {
        return new Promise<string>((resolve, reject) => {
            let path = ph.join(this.settings.pathPrefix || '', this.settings.input);
            psd.open(path)
                .then((psdFile: any) => {
                    let pngFile = path.replace("\.psd", "-imgscale\.png");
                    psdFile.image.saveAsPng(pngFile)
                        .then(() => {
                            resolve(pngFile);
                        })
                })
        })
    }
}

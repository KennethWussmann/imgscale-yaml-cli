import fs = require('fs');
import {ScaleSettings} from "./config/scaleSettings";
import yaml = require('js-yaml');

export class YamlLoader {

    constructor(private path: string, private file: string) { }

    load(): Promise<ScaleSettings> {
        return new Promise<ScaleSettings>((resolve, reject) => {
            fs.readFile(this.file, (err, data) => {
                if (err) {
                    reject(`✗  Failed to load YAML ${this.file}: ${err}`);
                    return;
                }
                let settings = yaml.safeLoad(data.toString()) as ScaleSettings;
                settings.pathPrefix = this.path;
                resolve(settings)
            });
        });
    }
}

import {ScaleSettings} from "./config/scaleSettings";
import {ScaleOutput} from "./config/scaleOutput";
import chalk = require("chalk");
import sharp = require("sharp");
import ph = require('path');
import fs = require('fs');

export class ImgScale {

    constructor(private settings: ScaleSettings, private output: ScaleOutput) { }

    scaleAndSave(inputFile: string | undefined = this.settings.input): Promise<string> {
        return new Promise<string>((resolve, _) => {
            let input = ph.join(this.settings.pathPrefix!!, inputFile);
            let outputFolder = ph.join(this.settings.pathPrefix!!, this.output.folder);
            let file = ph.join(outputFolder, this.filename() + "." + this.output.format);
            fs.mkdirSync(outputFolder, { recursive: true });
            sharp(input)
                .resize(this.output.height!, this.output.width!)
                .toFile(file, (err: any, _: any) => {
                    if (err) {
                        console.error(chalk.red(`  ✗ Failed to scale and save ${chalk.bold(file)}:`, err));
                        return;
                    }
                    console.log(chalk.green(`  ✓ Saved ${file}`));
                    resolve(inputFile);
                });
        });
    }

    filename(): string {
        return this.settings.name
            .replace("$height", this.output.height.toString())
            .replace("$width", this.output.width.toString());
    }
}

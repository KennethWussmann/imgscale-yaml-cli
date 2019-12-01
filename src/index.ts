#!/usr/bin/env node
import fs = require('fs');
import ph = require('path');
import glob = require("glob");
import yaml = require('js-yaml');
import chalk = require("chalk");
import figlet = require("figlet");
import {ScaleSettings} from "./config/scaleSettings";
import {ImgScale} from "./imgScale";
import {YamlLoader} from "./yamlLoader";
import {FileWatch} from "./fileWatch";
import {PsdConverter} from "./psdConverter";

function resize(settings: ScaleSettings) {
    if (settings.input.toLowerCase().endsWith(".psd")) {
        console.log(chalk.yellow(`  ! Pre-converting PSD to PNG ...`));
        new PsdConverter(settings)
            .convert()
            .then((png) => {
                settings.output.forEach(output => {
                    new ImgScale(settings, output).scaleAndSave(png).then(() => {});
                });
            })
    } else {
        settings.output.forEach(output => {
            new ImgScale(settings, output).scaleAndSave().then(() => {});
        });
    }
}

function initScaleYaml() {
    let exampleScaleFile = "./scale.yml";
    if (fs.existsSync(exampleScaleFile)) {
        console.error(chalk.red(`✗  There already is a scale.yml. I'll not override that!\n`));
        return;
    }
    fs.writeFile(exampleScaleFile, yaml.safeDump({
        name: "Example_$height_$width",
        input: "files/My_Image.png",
        output: [
            {
                folder: "out/",
                width: 100,
                height: 100,
                format: "jpeg"
            },
            {
                folder: "out/",
                width: 200,
                height: 200,
                format: "png"
            }
        ]
    } as ScaleSettings), (err) => {
        if (err) {
            console.error(chalk.red(`✗  Failed to initialize example scale.yml\n`, err));
        } else {
            console.log(chalk.green(`🚀  Created`, ph.join(__dirname, "scale.yml")));
            console.log(chalk.green(`    Run 'imgscale watch' in a folder or sub-folders with a scale.yml to watch for file changes`));
            console.log(chalk.green(`    Use 'imgscale' to scale once and exit based on the current folders or sub-folders scale.yml\n`));
        }
    });
}

(async () => {
    let watch = false;
    let init = false;
    if (process.argv.length >= 3) {
        watch = process.argv[2].toLowerCase() === "watch";
        init = process.argv[2].toLowerCase() === "init";
    }
    console.log(
        chalk.blue(
            figlet.textSync('imgscale', { horizontalLayout: 'full' })
        ), chalk.green("\n                         Auto-resize images on change\n")
    );
    let found = false;

    if (init) {
        initScaleYaml();
        return;
    }

    [
        "**/scale.yml",
        "**/scale.yaml",
        "**/scale_*.yml",
        "**/scale_*.yaml"
    ].forEach((inputGlob) => {
        glob(inputGlob, function (err: any, files: Array<string>) {
            if (err) {
                console.log(chalk.red(`✗  Failed to scan for ${chalk.bold(inputGlob)}:`, err));
                process.exit(1);
            }
            if (files.length > 0) {
                found = true;
            }
            files.forEach(file => {
                new YamlLoader(ph.dirname(file), file)
                    .load()
                    .then(settings => {
                        if (watch) {
                            console.log(chalk.yellow("🔎  Watching", chalk.bold(ph.join(settings.pathPrefix!!, settings.input)), "..."));
                            new FileWatch(settings, () => {
                                console.log(chalk.yellow("⚙️  Re-scaling ..."));
                                resize(settings);
                            }).watch();
                        }
                        resize(settings);
                    });
            })
        });
    });
    setTimeout(() => {
        if (!found) {
            console.log(chalk.red("🔎  No scale.yml files found. Create one using", chalk.bold("imgscale init"), "\n"));
        }
    }, 1500);
})();

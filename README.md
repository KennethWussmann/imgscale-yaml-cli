```
  _                                            _        
 (_)  _ __ ___     __ _   ___    ___    __ _  | |   ___ 
 | | | '_ ` _ \   / _` | / __|  / __|  / _` | | |  / _ \
 | | | | | | | | | (_| | \__ \ | (__  | (_| | | | |  __/
 |_| |_| |_| |_|  \__, | |___/  \___|  \__,_| |_|  \___|
                  |___/                                  
                         Auto-rescale images on change
```

Handy CLI tool to resize an image automatically, as soon as a change was detected.
You could export images from Photoshop and automatically resize them to use them where ever a certain image size matters.

## Usage
> Install the CLI tool globally

```
npm install -g imgscale
```
This will automatically setup an example `scale.yml`. If not, create one where ever you need it:
```YAML
# Name of output files. $height will be replaced by the actual height and same with $width
name: Example_$height_$width
# What file should be watched and resized
input: files/My_Image.png
# All output files that should be generated based of input
output:
  # The folder where to output (will be created if not exists)
  - folder: out/
  # The desired width
    width: 100
  # The desired height
    height: 100
  # The file format (and extension)
    format: jpeg
  # You can have as many blocks as you need:
  - folder: out/
    width: 200
    height: 200
    format: png
```

> You can have multiple `scale.yml` in one directory. Just call append a unique name to the filename: `scale_example1.yml`.

### Commands
There are the following commands:
```
imgscale        = Scans the local folder recursivly to find 'scale.yml'. After that it will resize all input files once and exit.
imgscale init   = Create above example 'scale.yml' in your current working directory
imgscale watch  = Scans the local folder recursivly to find 'scale.yml'. After that it will resize all once and keeps watching input files for changes.
```

## How it works
`imgscale` is basically a configuration file for [sharp](https://www.npmjs.com/package/sharp).
When you watch it will detect as soon as an `input` declared file changes and will export all the `output` listed files.

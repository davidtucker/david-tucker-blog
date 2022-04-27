#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const opentype = require('opentype.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { showCompletionScript } = require('yargs');

const LAYOUT = {
  X_MARGIN: 80,
  Y_MARGIN: 80,
  WIDTH: 1200,
  HEIGHT: 600,
  MAX_FONT_SIZE: 72,
  CHARS_PER_LINE: 20,
  FONT_LINE_HEIGHT: 52,
  FONT_LINE_VSPACING: 24
}

const loadFont = async (fontFile) => {
  return new Promise((resolve, reject) => {
    opentype.load(fontFile, (err, font) => {
      if(err) {
        reject(err);
      } else {
        resolve(font);
      }
    })
  });
}

const getLines = (title) => {
  const elements = title.split(' ');
  const lines = [];
  let currentLine = "";
  for(let element of elements) {
    if((currentLine.length + element.length) < LAYOUT.CHARS_PER_LINE) {
      currentLine += element + " ";
    } else {
      lines.push(currentLine);
      currentLine = element + " ";
    }
  }
  if(currentLine.length > 0) {
    lines.push(currentLine);
  }
  console.dir(lines);
  return lines;
}

const getLayout = (lines) => {
  const totalTextHeight = (lines.length * LAYOUT.FONT_LINE_HEIGHT) + ((lines.length - 1) * LAYOUT.FONT_LINE_VSPACING);
  const initialLine = ((LAYOUT.HEIGHT - totalTextHeight) / 2) + LAYOUT.FONT_LINE_HEIGHT;
  return lines.map((line, idx) => {
    return {
      x: LAYOUT.X_MARGIN,
      y: initialLine + (idx * (LAYOUT.FONT_LINE_HEIGHT + LAYOUT.FONT_LINE_VSPACING))
    }
  })
}

const drawText = (ctx, font, title) => {
  const lines = getLines(title);
  const layout = getLayout(lines);
  console.dir(layout);
  for(let i = 0; i < lines.length; i++) {
    const path = font.getPath(lines[i], layout[i].x, layout[i].y, LAYOUT.MAX_FONT_SIZE);
    path.draw(ctx);
  }
}

const writeImage = async (canvas) => {
  return new Promise((resolve, reject) => {
    const imageStream = canvas.createPNGStream();
    const fileStream = fs.createWriteStream('./image.png');
    imageStream.pipe(fileStream)
    .on('finish', resolve)
    .on('error', reject);
  });
}

const generateImage = async (title, outputFile) => {
  const font = await loadFont('./fonts/Inter-Bold.ttf')
  const canvas = createCanvas(LAYOUT.WIDTH, LAYOUT.HEIGHT);
  const ctx = canvas.getContext('2d');

  // White Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Write Text
  drawText(ctx, font, title);

  // Write out Image
  await writeImage(canvas);
}

const argv = yargs(hideBin(process.argv))
  .option('title', {
    alias: 't',
    describe: 'Title of the blog post'
  })
  .option('outputFile', {
    alias: 'o',
    describe: 'Output path for generated image'
  })
  .demandOption(['title', 'outputFile'], 'Please provide both the title and output file')
  .help()
  .argv

generateImage(argv['t'], argv['o'])
.then(() => {
  console.log('Complete')
});
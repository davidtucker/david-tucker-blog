#!/usr/bin/env node
import axios from 'axios';
import * as fs from 'fs';
import { writeFile, access } from 'fs/promises';
import * as path from 'path';
import * as url from 'url';
import sharp from 'sharp';
import PQueue from 'p-queue';

// ENVIRONMENT VARIABLES PRE-FLIGHT --------------------------------------

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.log('Must populate GOOGLE_API_KEY environment variable')
  process.exit(1)
}

const PLAYLIST_ID = process.env.PLAYLIST_ID;
if (!PLAYLIST_ID) {
  console.log('Must populate PLAYLIST_ID environment variable')
  process.exit(1)
}

// Queue for fetching thumbnail URL's
const queue = new PQueue({ concurrency: 1 });

// Shim out dirname since we are in a module
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Fetch the data for the YouTube playlist (ID passed in as PLAYLIST_ID)
const getPlaylistData = async () => {
  const reqConfig = {
    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
    method: 'get',
    params: {
      key: API_KEY,
      playlistId: PLAYLIST_ID,
      part: 'snippet',
      maxResults: 50
    },
    headers: {
      'accept': 'application/json'
    }
  }
  const result = await axios(reqConfig);
  const { data } = result
  const { items } = data
  const output = items.map((i) => {
    const { snippet } = i
    return {
      title: snippet.title,
      id: snippet.resourceId.videoId
    }
  });
  return output;
}

const doesThumbnailExist = async (videoID) => {
  const jpegPath = path.join(__dirname, '..', 'site', 'images', 'youtube', `${videoID}.jpg`)
  try {
    await access(jpegPath)
    return true
  } catch {
    return false
  }
}

// Write image to filesystem with extension
const writeImage = async (buffer, id, extension) => {
  const thumbnailPath = path.join(__dirname, '..', 'site', 'images', 'youtube', `${id}.${extension}`)
  await writeFile(thumbnailPath, buffer)
}

// Fetch all of the thumbnails for each video returned from the API call
const downloadAllThumbnails = async (videos) => {
  for (var i = 0; i < videos.length; i++) {
    await queue.add(() => downloadAndResizeThumbnail(videos[i]));
  }
  return videos;
}

// Download the thumbnail for the video
const downloadThumbnail = async (video) => {
  const result = await axios.get(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`, {
    responseType: 'arraybuffer',
    headers: {
      'Accept': 'image/jpeg'
    }
  })
  return Buffer.from(result.data, 'binary')
}

const resizeThumbnail = async (buffer) => {
  return {
    jpg: await sharp(buffer).resize({ height: 360 }).toBuffer(),
    webp: await sharp(buffer).resize({ height: 360 }).webp().toBuffer(),
  }
}

const downloadAndResizeThumbnail = async (video) => {
  if(await doesThumbnailExist(video.id)) {
    console.log(`Thumbnail already exists for ${video.id} - no download needed`)
    return
  }
  console.log(`Downloading thumbnail for ${video.id}`)
  const originalImageBuffer = await downloadThumbnail(video)
  const { jpg, webp } = await resizeThumbnail(originalImageBuffer)
  await writeImage(jpg, video.id, 'jpg')
  await writeImage(webp, video.id, 'webp')
}

const writeJSONFile = async (items) => {
  const jsonData = JSON.stringify(items);
  const filePath = path.join(__dirname, '..', 'site', '_data', 'videos.json')
  await writeFile(filePath, jsonData);
}

getPlaylistData().then((output) => {
  return downloadAllThumbnails(output);
}).then(output => {
  return writeJSONFile(output);
}).then(() => {
  console.log("JSON populated")
}).catch((err) => {
  console.log("ERROR")
  console.dir(err);
})

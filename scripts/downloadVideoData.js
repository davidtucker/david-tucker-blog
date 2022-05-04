#!/usr/bin/env node

/*

  downloadVideoData.js

  This file downloads the contents of a YouTube playlist via the Google API (even
  though this is a public playlist it still requires an API key from Google).  It
  then will attempt to get a thumbnail (in both jpg and webp formats) from the 
  maxresdefault thumbnail on YouTube.  If a thumbnail already exists for a specific
  video, it will not try and download one again.

  A queue process is used for downloading the thumbnails, so that we can limit the
  amount of simultaneous downloads.  

  Environment Variables

  GOOGLE_API_KEY (required) - The API key for downloading the playlist
  PLAYLIST_ID (required) - The ID of the YouTube playlist to fetch data from
  THUMNAIL_QUEUE_SIZE (optional, default is 1) - The  size of the download queue

*/

import axios from 'axios';
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

// This environment variable is optional
let QUEUE_SIZE = process.env.THUMNAIL_QUEUE_SIZE || 1

// FUNCTIONS AND SHARED VARS ---------------------------------------------

// Queue for fetching thumbnail URL's
const queue = new PQueue({ concurrency: QUEUE_SIZE });

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
  console.log(`Videos in playlist: ${output.length}`)
  console.log('')
  return output;
}

// Checks to see if a thumbnail exists (currently just the JPG format) in the
// expected directory
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

// Resize the thumbnails to the target size (currently 360 pixel height) in
// both jpg and webp formats
const resizeThumbnail = async (buffer) => {
  return {
    jpg: await sharp(buffer).resize({ height: 360 }).toBuffer(),
    webp: await sharp(buffer).resize({ height: 360 }).webp().toBuffer(),
  }
}

// Download the thumbnail for a video and then resize the thumbnails
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

// EXECUTION -------------------------------------------------------------

console.log('---------------------------------------------------------')
console.log('Downloading YouTube Playlist Data')
console.log(`Playlist ID: ${process.env.PLAYLIST_ID}`)
console.log('')

getPlaylistData().then((output) => {
  return downloadAllThumbnails(output);
}).then(output => {
  return writeJSONFile(output);
}).then(() => {
  console.log('')
  console.log('YouTube Playlist JSON populated - Process Completed')
  console.log('---------------------------------------------------------')
}).catch((err) => {
  console.log("ERROR")
  console.dir(err);
  console.log('---------------------------------------------------------')
})

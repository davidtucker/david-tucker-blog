#!/usr/bin/env node
const axios = require('axios').default;
const fs = require('fs')
const path = require('path')

const API_KEY = process.env.GOOGLE_API_KEY;
if(!API_KEY) {
  console.log('Must populate GOOGLE_API_KEY environment variable')
  process.exit(1)
}

const PLAYLIST_ID = process.env.PLAYLIST_ID;
if(!PLAYLIST_ID) {
  console.log('Must populate PLAYLIST_ID environment variable')
  process.exit(1)
}

const getThumbnailUrl = (snippet) => {
  if(snippet.thumbnails.hasOwnProperty('standard')) {
    return snippet.thumbnails.standard.url;
  } else if(snippet.thumbnails.hasOwnProperty('maxres')) {
    return snippet.thumbnails.maxres.url;
  } else if(snippet.thumbnails.hasOwnProperty('high')) {
    return snippet.thumbnails.high.url;
  }
  return ''
}

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
      id: snippet.resourceId.videoId,
      thumbnail: getThumbnailUrl(snippet)
    }
  });
  return output;
}

const writeJSONFile = (items) => {
  const jsonData = JSON.stringify(items);
  const filePath = path.join(__dirname, '..', 'site', '_data', 'videos.json')
  try {
    fs.unlinkSync(filePath)
  } catch(err) {}
  fs.writeFileSync(filePath, jsonData);
}

getPlaylistData().then((output) => {
  writeJSONFile(output);
  console.log("videos.json populated")
})
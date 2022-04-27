const axios = require('axios').default;
const fs = require('fs')
const path = require('path')

console.dir(process.env)

const API_KEY = process.env.GOOGLE_API_KEY;
console.log(`APIKEY: ${API_KEY}`)
if(!API_KEY) {
  console.log('Must populate GOOGLE_API_KEY environment variable')
  process.abort()
}

const PLAYLIST_ID = process.env.PLAYLIST_ID;
if(!PLAYLIST_ID) {
  console.log('Must populate PLAYLIST_ID environment variable')
  process.abort()
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
  console.dir(output)
  return output;
}

const writeJSONFile = (items) => {
  const jsonData = JSON.stringify(items);
  const filePath = path.join(__dirname, '..', '_data', 'videos.json')
  fs.unlinkSync(filePath)
  fs.writeFileSync(filePath, jsonData);
}

getPlaylistData().then((output) => {
  writeJSONFile(output);
  console.log('DONE');
})
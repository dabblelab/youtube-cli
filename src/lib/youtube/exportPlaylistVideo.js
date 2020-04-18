const {google} = require('googleapis')
const service = google.youtube('v3');
const files = require('../files');

const exportPlaylistVideo = async (auth, videoID) => {

  return await Promise.resolve()

  .then( async() => {

    const parameters = {
      'id': videoID,
      'part': 'snippet',
      'auth' : auth
    }

    return service.videos.list(parameters)
  })

  .then( async(video) => {

      let video_data = video.data.items[0];
      //const video_title = video_data.snippet.title.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g,' ').trim().replace(/ /g, '-').toLowerCase() 

      const filename = await files.createYouTubeJSONFile(video_data.id);
      
      const videoObj = {
          "id" : video_data.id,
          "snippet" : {
              "title" : video_data.snippet.title,
              "description" : video_data.snippet.description,
              "thumbnails" : video_data.snippet.thumbnails,
              "tags" : (video_data.snippet.hasOwnProperty('tags')) ? video_data.snippet.tags : [],
              "categoryId" : video_data.snippet.categoryId,
          } 
      }

      video_data.filename = filename;

      await files.writeYouTubeJSONFile(videoObj, filename);

      return video_data;

  })
  .catch( (err) => {
    throw err;  
  })
}

module.exports = {exportPlaylistVideo};
const fs = require('fs');
const mime = require('mime-types');
const {google} = require('googleapis');
const service = google.youtube('v3');
const path = require('path');

const updatePlaylistItems = async (auth, sourcePath, thumbnailPath = '') => {

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`The file ${sourcePath} was not be found.`)
  }

  const schema = require(sourcePath);

  return await Promise.resolve()

  //uploading video
  .then( async() => {

    if(schema.length){

      for( let i = 0 ; i < schema.length ; i ++){
        if(schema[i].hasOwnProperty('snippet')){

          const parameters = {
            "auth" : auth,
            "part" : "snippet",
            "resource" : {
              "id" : schema[i].id,
              "snippet" : {
                "title" : schema[i].snippet.title,
                "description" : schema[i].snippet.description,
                "tags" : schema[i].snippet.tags,
                "categoryId" : schema[i].snippet.categoryId
              }
            }
          }
          await service.videos
          .update(parameters)
          .then(async(video) => {

            if(thumbnailPath && fs.existsSync(thumbnailPath)){

              const thumb_path = path.resolve(thumbnailPath, `${schema[i].id}-thumbnail.jpg`);
              if(fs.existsSync(thumb_path)){
  
                const mimeType = mime.lookup(thumb_path);
                const thumb_parameters = {
                  "auth" : auth,
                  "videoId" : schema[i].id,
                  "media" : {
                    "mimeType" : mimeType,
                    "body" : fs.readFileSync(thumb_path)
                  }
                }
                await service.thumbnails.set(thumb_parameters);
              }
              
            }
          })
        }
        
      }
    }
    return true;
  })
  
  .catch( (err) => {
    throw err;  
  })
}

module.exports = {updatePlaylistItems};
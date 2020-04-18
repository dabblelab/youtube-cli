const fs = require('fs');
const mime = require('mime-types');
const {google} = require('googleapis');
const service = google.youtube('v3');

const uploadPlaylistItem = async (auth, playlistID, mediaFile, schemaFile, thumbnailPath = '') => {

  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  if (!fs.existsSync(mediaFile)) {
    throw new Error(`The file ${mediaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('snippet')) {
    throw new Error(`A 'snippet' must be defined in your schema.`)
  }

  return await Promise.resolve()

  //uploading video
  .then( async() => {

    const parameters = {
      "auth" : auth,
      "part" : "snippet",
      "media" : {
        "body" : fs.createReadStream(mediaFile)
      },
      "notifySubscribers" : true,
      "resource" : {
        "snippet" : schema.snippet
      }
    }

    return service.videos.insert(parameters)
  })

  //setting up video thumbnail
  .then( async(video) => {
    if(thumbnailPath){

      if (fs.existsSync(thumbnailPath)) {

        const mimeType = mime.lookup(thumbnailPath);

        const parameters = {
          "auth" : auth,
          "videoId" : video.data.id,
          "media" : {
            "mimeType" : mimeType,
            "body" : fs.readFileSync(thumbnailPath)
          }
        }

        return await service.thumbnails.set(parameters)
                    .then( (thumbnails) => {
                      return video;
                    })
                    .catch( (err) => {
                       return video;
                    })
      }
      else{
        return video;
      }
    }
    else{
      return video;
    }
  })

  //insert video into playlist 
  .then ( async ( video ) => {

    const parameters = {
      "auth" : auth,
      "part" : "snippet",
      "resource" : {
        "snippet" : {
          "playlistId" : playlistID,
          "resourceId" : {
            "kind" : video.data.kind,
            "videoId" : video.data.id
          }
        }
      }
    }

    return await service.playlistItems.insert(parameters)
                .then( (playlist) => {
                  return video;
                })
                .catch( (err) => {
                  return video;
                })

  })
  .catch( (err) => {
    throw err;  
  })
}

module.exports = {uploadPlaylistItem};
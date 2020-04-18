const fs = require('fs');
const {google} = require('googleapis');
const service = google.youtube('v3');

const deletePlaylistItem = async (auth, playlistVideo) => {

  return await Promise.resolve()

  //uploading video
  .then( async() => {

    const parameters = {
        "auth" : auth,
        "id" : playlistVideo.id
    }

    return service.playlistItems.delete(parameters);
  })

  //deleting actual video
  .then( async(video) => {
    const parameters = {
        "auth" : auth,
        "id" : playlistVideo.contentDetails.videoId
    }

    return await service.videos.delete(parameters)
                .then ( (del) => {
                    return playlistVideo
                })
  })
  
  .catch( (err) => {
    throw err;  
  })
}

module.exports = {deletePlaylistItem};
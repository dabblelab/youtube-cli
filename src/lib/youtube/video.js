const {google} = require('googleapis')
const service = google.youtube('v3');

const video = async (auth, videoID) => {
  
    const parameters = {
        'id': videoID,
        'part': 'snippet',
        'auth' : auth
    }

    return service.videos.list(parameters);
}

module.exports = {video};
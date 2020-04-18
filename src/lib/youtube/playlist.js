const {google} = require('googleapis')
const service = google.youtube('v3');

exports.playlists = async (auth) => {
  
  var parameters = {
    'auth' : auth,
    'mine': 'true',
    'maxResults': '50',
    'part': 'snippet,contentDetails'
    };
  
  const playlists = await service.playlists.list(parameters);

  return playlists.data;
  
}

const {google} = require('googleapis')
const service = google.youtube('v3');

const playlistItems = async (auth, playlistID, playlistItemsData = [], pageToken = '') => {
  
  var parameters = {
    'auth' : auth,
    'maxResults': '50',
    'part': 'snippet,contentDetails',
    'playlistId': playlistID
    };
if(pageToken)
    parameters.pageToken = pageToken;
  
  return service.playlistItems.list(parameters)
          .then( (playlistItems_data) => {

            if(playlistItems_data.data){

              let temp_list = (playlistItems_data.data.items) ? playlistItemsData.concat(playlistItems_data.data.items) : playlistItemsData;

              // checking data has nextPageToken 
              if(playlistItems_data.data.hasOwnProperty('nextPageToken'))
              {
                playlistItems(auth, playlistID, temp_list, playlistItems_data.data.nextPageToken);
              }
              else{
                  return temp_list;
              }

            }else{

                return playlistItemsData;
            }
          })
          .catch( (err) => {
            throw err;
          })
  
}

module.exports = {playlistItems};

const files = require('../files');
const {playlists} = require('./playlist');
const {playlistItems} = require('./playlistItem');
const {video} = require('./video');
const {YTB_Airtable} = require('./airtable');

const exportAllPlaylistItems = async (auth, source, config) => {

  return await Promise.resolve()

  .then ( async() => {
        return playlists(auth);
  })

  .then( async (playlist) => {

      let playlists_json = [];

      try{

        let playlistItems_json = [],
            playlistItems_airtable = [];
        for(let item of playlist.items || []){

            const playlist_Items = await playlistItems(auth, item.id);
            
            for(let pItem of playlist_Items || []){

                let  playlistItem_data = await video(auth ,pItem.contentDetails.videoId),
                      data_item = playlistItem_data.data.items || [];

                if(data_item.length){

                    if("airtable" == source)
                    {
                        data_item[0].playlist = item.snippet.title;
                        playlistItems_airtable.push(data_item[0]);
                    }
                    else{

                        const videoObj = {
                            "id" : data_item[0].id,
                            "snippet" : {
                                "title" : data_item[0].snippet.title,
                                "description" : data_item[0].snippet.description,
                                "thumbnails" : data_item[0].snippet.thumbnails,
                                "tags" : (data_item[0].snippet.hasOwnProperty('tags')) ? data_item[0].snippet.tags : [],
                                "categoryId" : data_item[0].snippet.categoryId,
                            } 
                        }

                        playlistItems_json.push(videoObj);
                    }
                }
            }

            if("file" == source)
                playlists_json.push({
                    "title" : item.snippet.title,
                    "id" :  item.id,
                    "playlistItems" : playlistItems_json
                });
        }

        if("airtable" == source){
            const airtable = await new YTB_Airtable(config, true);
            await airtable.create_update(playlistItems_airtable);
            return { "filename" : `${config.TABLE_NAME} airtable`};
        }

        const filename = await files.createYouTubeJSONFile('playlist');
    
        await files.writeYouTubeJSONFile(playlists_json, filename);
        return {"filename" : filename};

      }catch(err){

        throw err;
      }
  })
  
  .catch( (err) => {
    throw err;  
  })
}
module.exports = {exportAllPlaylistItems};
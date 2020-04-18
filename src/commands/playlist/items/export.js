const {Command, flags} = require('@oclif/command'),
      ora = require("ora"),
      {YouTubeAPI} = require("../../../lib/youtube"),
      {UserChoice} = require("../../../lib/prompt");

class PlaylistItemsExport extends Command {

    async run(){

        let spinner = await ora();
        const {flags} = this.parse(PlaylistItemsExport),
              {profile, playlist, source} = flags;
        try{
            const auth = await require("../../../lib/client")(profile),
                  YouTubeAPIClient = await new YouTubeAPI(auth.oauth2Client);

            if("airtable" == source){
                if(!auth.profileUsed.airtable)
                    throw Error(`Airtable isn't configured. Please run "youtube init:airtable --name ${profile}" to configure airtable.`);
            }

            if("all" == playlist){
            
                spinner.start(`Exporting playlists items...`);
                const resp = await YouTubeAPIClient.exportAllPlaylistItems(source, auth.profileUsed);

                spinner.succeed(`Video's exported into "${resp.filename}"`);
            }else{

                spinner.text = `Getting playlist Items...`;
                const playlistItems = await YouTubeAPIClient.playlistItems(playlist);
                spinner.stop();
                let choices = [];

                for(let item of playlistItems || []){
                    
                    if(item.snippet.title != "Deleted video")
                        choices.push(item.snippet.title);
                }

                if(!choices.length)
                {
                    spinner.fail(`This ${playlist} playlist doesn't have any items!`);
                    return;
                }

                const selectedVideo = await UserChoice('Choose your playlist video : ', choices),
                      found = await playlistItems.find(p => p.snippet.title == selectedVideo);

                if(!found)
                {
                    spinner.fail(`Oops! video not found in playlist`);
                    return;
                }

                const videoID = found.contentDetails.videoId;
                spinner.start(`Exporting playlist video...`);

                const  video = await YouTubeAPIClient.exportPlaylistVideo(videoID);
                spinner.succeed(`Video exported in "${video.filename}"`);

            }

        }catch(err){
            spinner.fail(`Error : ${err.message}`);
        }
    }
}

PlaylistItemsExport.description = `Export all playlists items`;

PlaylistItemsExport.flags = {
    profile : flags.string({
        char : 'p',
        description : 'Name of profile that associated YouTube Data API credential',
        default : 'default'
    }),
    playlist : flags.string({
        description : 'Playlist Id (id | all)',
        default : 'all'
    }),
    source : flags.string({
        char : 's',
        description : 'Export playlist items to file or airtable(file|airtable)',
        default : 'file'
    })
};

module.exports = PlaylistItemsExport;
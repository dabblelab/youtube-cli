const {Command, flags} = require('@oclif/command'),
      ora = require("ora"),
      {UserChoice} = require("../../../lib/prompt"),
      {YouTubeAPI} = require("../../../lib/youtube");

class PlaylistItemsRemove extends Command {

    async run(){

        let spinner = await ora();
        const {flags} = this.parse(PlaylistItemsRemove),
              {profile,  playlist} = flags;

        try{

            const auth = await require("../../../lib/client")(profile),
                  YouTubeAPIClient = await new YouTubeAPI(auth.oauth2Client);

            spinner.start('Getting playlist Items...');

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

            const selectedVideo = await UserChoice('Choose item to delete : ', choices),
                  pItem = await playlistItems.find(p => p.snippet.title == selectedVideo);

            if(!pItem)
            {
                spinner.fail(`Oops! video not found in playlist`);
                return;
            }

            spinner.start("Deleting playlist item...");

            const video = await YouTubeAPIClient.deletePlaylistItem(pItem);

            spinner.succeed(`Item "${video.snippet.title}" deleted from playlist "${playlist}"`);


        }catch(err){
            spinner.fail(`Error : ${err.message}`);
        }
    }
}

PlaylistItemsRemove.description = `Delete item from playlist`;

PlaylistItemsRemove.flags = {
    profile : flags.string({
        char : 'p',
        description : 'Name of profile that associated YouTube Data API credential',
        default : 'default'
    }),
    playlist : flags.string({
        description : 'Playlist ID from which item to be deleted',
        required : true
    })
};

module.exports = PlaylistItemsRemove;
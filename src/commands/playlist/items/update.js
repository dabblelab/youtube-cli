const {Command, flags} = require('@oclif/command'),
      ora = require("ora"),
      path = require("path"),
      {YouTubeAPI} = require("../../../lib/youtube");

class PlaylistItemsUpdate extends Command {

    async run(){

        let spinner = await ora();
        const {flags} = this.parse(PlaylistItemsUpdate),
              {profile, thumbnail, source} = flags,
              sourcePath = ("airtable" == source) ? "airtable" : `${path.resolve()}/${source}`,
              thumbnailPath = (thumbnail) ? `${path.resolve()}/${thumbnail}` : '';

        try{

            const auth = await require("../../../lib/client")(profile),
                  YouTubeAPIClient = await new YouTubeAPI(auth.oauth2Client);

            if("airtable" == source){
                if(!auth.profileUsed.airtable)
                    throw Error(`Airtable isn't configured. Please run "youtube init:airtable --name ${profile}" to configure airtable.`);
            }

            spinner.start('Updating playlist video...');

            const video = ("airtable" == source) ? await YouTubeAPIClient.updatePlaylistItemsAirtable(spinner, thumbnailPath, auth.profileUsed.airtable) : await YouTubeAPIClient.updatePlaylistItems(sourcePath, thumbnailPath);

            spinner.succeed(`Playlist items are updated`);


        }catch(err){
            spinner.fail(`Error : ${err.message}`);
        }
    }
}

PlaylistItemsUpdate.description = `Update all playlists items`;

PlaylistItemsUpdate.flags = {
    profile : flags.string({
        char : 'p',
        description : 'Name of profile that associated YouTube Data API credential',
        default : 'default'
    }),
    source : flags.string({
        char : 's',
        description : 'Export playlist items from file or airtable(<file path>|airtable)',
        required : true
    }),
    thumbnail : flags.string({
        char : 't',
        description : 'Video thumbnail(<thumbnail-file-path>)',
    })
};

module.exports = PlaylistItemsUpdate;
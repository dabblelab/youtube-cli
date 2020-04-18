const {Command, flags} = require('@oclif/command'),
      ora = require("ora"),
      path = require("path"),
      {YouTubeAPI} = require("../../../lib/youtube");

class PlaylistItemsUpload extends Command {

    async run(){

        let spinner = await ora();
        const {flags} = this.parse(PlaylistItemsUpload),
              {profile, thumbnail, schema, media, playlist} = flags,
              schemaPath = `${path.resolve()}/${schema}`,
              mediaPath = `${path.resolve()}/${media}`
              thumbnailPath = (thumbnail) ? `${path.resolve()}/${thumbnail}` : '';

        try{

            const auth = await require("../../../lib/client")(profile),
                  YouTubeAPIClient = await new YouTubeAPI(auth.oauth2Client);

            spinner.start('Upload video into playlist...');

            const video = await YouTubeAPIClient.uploadPlaylistItem(playlist, schemaPath, mediaPath, thumbnailPath);

            spinner.succeed(`Item "${video.data.snippet.title}" uploaded in playlist "${playlist}"`);


        }catch(err){
            spinner.fail(`Error : ${err.message}`);
        }
    }
}

PlaylistItemsUpload.description = `Upload item into playlist`;

PlaylistItemsUpload.flags = {
    profile : flags.string({
        char : 'p',
        description : 'Name of profile that associated YouTube Data API credential',
        default : 'default'
    }),
    schema : flags.string({
        char : 's',
        description : 'Playlist items schema path <schema-file-path>',
        required : true
    }),
    media : flags.string({
        char : 'm',
        description : 'Playlist items media/video path <media-file-path>',
        required : true
    }),
    playlist : flags.string({
        description : 'Playlist ID to which item to be uploaded',
        required : true
    }),
    thumbnail : flags.string({
        char : 't',
        description : 'Video thumbnail(<thumbnail-file-path>)',
    })
};

module.exports = PlaylistItemsUpload;
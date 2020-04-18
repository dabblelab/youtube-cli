const {Command, flags} = require('@oclif/command'),
      ora = require("ora"),
      {YouTubeAPI} = require("../../lib/youtube");

class PlaylistList extends Command {

    async run(){

        let spinner = await ora();
        const {flags} = this.parse(PlaylistList),
              profile = flags.profile || "default";
        try{

            spinner.start(`Getting playlists...`);
            const auth = await require("../../lib/client")(profile),
                  YouTubeAPIClient = await new YouTubeAPI(auth.oauth2Client),
                  playlists = await YouTubeAPIClient.playlist();

            spinner.stop();
            
            for(let item of playlists.items || []){

                console.log(`${item.snippet.title} \t ${item.id}`);
            }

        }catch(err){
            spinner.fail(`Error : ${err.message}`);
        }
    }
}

PlaylistList.description = `List of all playlist`;

PlaylistList.flags = {
    profile : flags.string({
        char : 'p',
        description : 'Name of profile that associated YouTube Data API credential',
        default : 'default'
    })
};

module.exports = PlaylistList;
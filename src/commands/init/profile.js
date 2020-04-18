const {Command, flags} = require('@oclif/command'),
      ora = require('ora'),
      {read, addProfile} = require("../../lib/json_utility"),
      {promptUser} = require("../../lib/prompt"),
      {Auth} = require("../../lib/auth");

class InitProfile extends Command {

  async run() {

    let spinner = await ora(),
        {flags} = this.parse(InitProfile),
        name = flags.name || false,
        isProfile = false;

    try{

      const profiles = await read();

      if(profiles.length){

        if(!name){

          name = await promptUser(`Please type in your new profile name : `, true, `"Profile Name" cannot be empty`);
        }
        const found = await profiles.find(p => p.profileName == name);

        if(found){

          // spinner.info(`
          // NAME : ${found.profileName}
          // CLIENT ID : ${found.clientID}
          // CLIENT SECRET : ${found.clientSecret}
          // TOKEN : {
          //   ACCESS TOKEN : ${found.token.access_token},
          //   REFRESH TOKEN : ${found.token.refresh_token}
          // }
          // To update profile run "youtube init:profile --name ${name} --force"`);
          console.log(`
          NAME : ${found.profileName}
          CLIENT ID : ${found.clientID}
          CLIENT SECRET : ${found.clientSecret}
          TOKEN : {
            ACCESS TOKEN : ${found.token.access_token},
            REFRESH TOKEN : ${found.token.refresh_token}
          },
          AIRTABLE : `);

          isProfile = true;
          return;
        }
      }
      else
          name = "default";

      if(!isProfile){

        const client_id = await promptUser(`CLIENT ID : `, true, `"CLIENT ID" cannot empty`),
              client_secret = await promptUser(`CLIENT SECRET : `, true, `"CLIENT SECRET" cannot empty`),
              AuthClient  = await new Auth(client_id, client_secret),
              authUrl = await AuthClient.authUrl();

        console.log(`Authorize this app by visiting this url : ${authUrl}`);

        const code = await promptUser(`Enter the code from that page here : `, true, `"VERIFICATION CODE" cannot be empty`),
              token = await AuthClient.getToken(code);

        await addProfile(name, {
          clientId : client_id,
          clientSecret : client_secret,
          token : token.tokens
        });

        spinner.succeed(`Profile Created!`)
        return;
      }
    }catch(err){

      spinner.fail(`Error : ${err.message}`);
    }
  }
}

InitProfile.description = `Create YouTube profile`;

InitProfile.flags = {
  name: flags.string({char: 'n', description: 'name of the profile'}),
}

module.exports = InitProfile

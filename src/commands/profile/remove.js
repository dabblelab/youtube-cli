const {Command, flags} = require('@oclif/command'),
      ora = require('ora'),
      {read, removeProfile} = require("../../lib/json_utility"),
      {promptUser, ConfirmPrompt} = require("../../lib/prompt");

class RemoveProfile extends Command {

  async run() {

    let spinner = await ora(),
        {flags} = this.parse(RemoveProfile),
        name = flags.name || false;

    try{

      if(!name){

        name = await promptUser(`Please type in your profile name to remove : `, true, `"Profile Name" cannot be empty`);
      }
      const profiles = await read();

      if(profiles.length){

        const found = await profiles.find(p => p.profileName.trim() == name.trim());

        if(!found){

          spinner.fail(`Profile "${name}" not found!`);
          return;
        }

        if(await ConfirmPrompt(`Are you sure, wants to delete "${name}" profile?`)){

          await removeProfile(name);
          spinner.succeed(`Profile "${name}" removed!`)
        }
      }
      else
        spinner.fail(`Profile "${name}" not found!`);

    }catch(err){

      spinner.fail(`Error : ${err.message}`);
    }
  }
}

RemoveProfile.description = `Remove YouTube profile`;

RemoveProfile.flags = {
  name: flags.string({char: 'n', description: 'name of the profile to remove'}),
}

module.exports = RemoveProfile

const {Command, flags} = require('@oclif/command'),
      ora = require('ora'),
      {read, addAirtable} = require("../../lib/json_utility"),
      {promptUser} = require("../../lib/prompt");

class InitAirtable extends Command {

    async run() {

        let spinner = await ora(),
            {flags} = this.parse(InitAirtable),
            name = flags.name || false;
        try{

            const profiles = await read(),
                  found = await profiles.find(p => p.profileName == name);

            if(!found)
                throw Error(`Cann't add "Airtable" credetial. Must have to add "YouTube" credential first as follow
                "ytb init:profile --name ${name}" and then
                "ytb init:airtable --name ${name}"`);

            const api_key = await promptUser(`AIRTABLE API KEY : `, true, `"API KEY" cannot empty`),
                  base_id = await promptUser(`AIRTABLE BASE ID : `, true, `"BASE ID" cannot empty`),
                  table_name = await promptUser(`AIRTABLE TABLE NAME : `, true, `"TABLE NAME" cannot empty`);

            await addAirtable(name, api_key, base_id, table_name);

            spinner.succeed(`Airtable configured to profile "${name}"`);
        }catch(err){

            spinner.fail(`Error : ${err.message}`);
        }
    }
}

InitAirtable.description = `Update profile with Airtable credential`;

InitAirtable.flags = {
  name: flags.string(
      {
          char: 'n', 
          description: 'name of the profile'
    })
}

module.exports = InitAirtable
const {Command, flags} = require('@oclif/command'),
      ora = require('ora'),
      {displayProfile} = require("../../lib/json_utility")

class ListProfile extends Command {

  async run() {

    let spinner = await ora(),
        {flags} = this.parse(ListProfile);

    try{

      await displayProfile();

    }catch(err){

      spinner.fail(`Error : ${err.message}`);
    }
  }
}

ListProfile.description = `List YouTube profiles`;

ListProfile.flags = {}

module.exports = ListProfile;

const {read} = require("./json_utility"),
      {Auth} = require("./auth");

module.exports = async(profile) => {

    const profiles = await read();
        
    const myprofile = await profiles.find(p => p.profileName.trim() == profile.trim());
    if(!myprofile)
        throw Error(`Profile "${profile}" not found. You can create new profile with : "youtube init:profile --name ${profile}"`);

    let authClient = await new Auth(myprofile.clientID, myprofile.clientSecret);

    authClient.oauth2Client.credentials = myprofile.token;
    return {
                oauth2Client : authClient.oauth2Client,
                profileUsed : myprofile
            };

}
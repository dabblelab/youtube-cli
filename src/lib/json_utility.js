
const os   = require('os'),
path = require('path'),
fs   = require('fs'),
_    = require('lodash');

const youtubeDir = path.resolve(os.homedir(),'.youtube');
const filePath = path.resolve(os.homedir(),'.youtube','config.json');
const FORMATTER_SPACING = 29;

const addProfile = async (profileName,valid_credential_object) => {
  const n_profile = {
    profileName : profileName,
    clientID : valid_credential_object.clientId,
    clientSecret : valid_credential_object.clientSecret,
    token : valid_credential_object.token
  };

  if(fs.existsSync(filePath)){
    const profiles = await read(filePath);
    if(profiles.length){
        const p_index = _.findIndex(profiles,{profileName : profileName});
        if(p_index>=0){
            profiles[p_index] = n_profile;
        }else{
            profiles.push(n_profile);
        }
    }else{
        profiles.push(n_profile);
    }
    return write(profiles);
  }
  else{
    let profiles = [];
    profiles.push(n_profile);
    return write(profiles);
  }
}

const removeProfile = async(profileName) => {

  const profiles = await read(filePath),
        update_profiles = await profiles.filter(p => p.profileName.trim() != profileName.trim());

  await write(update_profiles);
  return true;

}

const displayProfile = async() =>{ 
  const HEADER = 'Profile              Associated YouTube Profile              Associated Airtable Profile';
  const profileList = stringFormatter(read());
  if (!profileList) {
      console.warn('youtube has not set up any profiles yet.');
      return;
  }
  profileList.splice(0, 0, HEADER);
  profileList.forEach((profile) => {
      console.log(`   ${profile}`);
  });
}

function stringFormatter(profileList) {
  if (!profileList || profileList.length === 0) {
      return null;
  }
  const formattedProfileList = [];
  for (const profileObj of profileList) {
      const formattedYTBProfile = `[${profileObj.profileName}]`;
      let fillingSpace = ' ';
      if (formattedYTBProfile.length <= FORMATTER_SPACING) {
          fillingSpace = ' '.repeat(FORMATTER_SPACING - formattedYTBProfile.length);
      }

      let NoFillingSpace = ' '.repeat(40 - 8),
          YesFillingSpace = ' '.repeat(40 - 9);
      if (!profileObj.token) {


          formattedProfileList.push(`${formattedYTBProfile}${fillingSpace}** NO **${NoFillingSpace}** NO **`);
          continue;
      }

      let str = `${formattedYTBProfile}${fillingSpace}** YES **`         
      if(!profileObj.airtable)
          str += `${YesFillingSpace}** NO **`;
      else
        str += `${YesFillingSpace}** YES **`;
      formattedProfileList.push(str);
  }
  return formattedProfileList;
}

const addAirtable = async (profileName, api_key, base_id, table_name) =>{

  let profiles = await read(),
      index = false;

  const found = await profiles.find((p,i) => {
    index = i;
    return p.profileName == profileName;
  });

  if(!found)
      throw Error(`Cann't add "Airtable" credetial. Must have to add "YouTube" credential first as follow
      "ytb init:profile --name ${profileName}" and then
      "ytb init:airtable --name ${profileName}"`);

  profiles[index].airtable = {
    API_KEY : api_key,
    BASE_ID : base_id,
    TABLE_NAME : table_name
  };

  return write(profiles);
  
}

const read = ()=>{
  try {
    let content = require(filePath);
    return content;
  } catch (e) {
    return [];
  }
}

const write = async (jsonObject) =>{
  if(directoryExists(youtubeDir)){
    try{
        await fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2));
        return await read();
    }
    catch(err){
        console.error('Invalid file, cannot write to: ' + filePath);
        process.exit();
    }
  }else{
    console.error('Invalid directory : ' + youtubeDir);
    process.exit();
  }
}

function directoryExists(youtubeDir){
  if(fs.existsSync(youtubeDir)){
    return true;
  }else{
    try{
        fs.mkdirSync(youtubeDir);
        return true
    }catch(e){
        return false;
    }
  }
}

module.exports = {
  addAirtable,
  addProfile,
  removeProfile,
  displayProfile,
  read
}
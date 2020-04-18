const os = require('os'),
      path = require("path"),
      {google} = require('googleapis'),
      OAuth2 = google.auth.OAuth2;

function CreateOAuth2Client(clientId, clientSecret){

    const redirectUrl = `urn:ietf:wg:oauth:2.0:oob`;
    return new OAuth2(clientId, clientSecret, redirectUrl);
}

class Auth {
    constructor(clientId, clientSecret){
        return (async() => {
            
            this.oauth2Client = await CreateOAuth2Client(clientId, clientSecret);
            return this;
        })();
    }

    authUrl(){

        const SCOPES = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload'
          ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
    }

    getOauth2Client(clientId, clientSecret){
        return CreateOAuth2Client(clientId, clientSecret);
    }

    async getToken(code){

        return this.oauth2Client.getToken(code);
    }

    async getAuth(profile){

        const profiles = await read();
        
        const myprofile = profiles.find(p => p.profileName.trim() == profile.trim());
        if(!myprofile)
            throw Error(`Profile "${profile}" not found. You can create new profile with : "youtube init --name ${profile}"`);

        return this.oauth2Client.credentials = myprofile.token;
    }
}

exports.Auth = Auth;
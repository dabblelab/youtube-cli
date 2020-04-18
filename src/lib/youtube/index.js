"use strict";

const {playlists} = require("./playlist"),
      {exportAllPlaylistItems} = require("./exportAllPlaylistItems"),
      {playlistItems} = require("./playlistItem"),
      {exportPlaylistVideo} = require("./exportPlaylistVideo"),
      {updatePlaylistItemsAirtable} = require("./updatePlaylistItemsAirtable"),
      {updatePlaylistItems} = require("./updatePlaylistItems"),
      {uploadPlaylistItem} = require("./uploadPlaylistItem"),
      {deletePlaylistItem} = require("./deletePlaylistItem");

class YouTubeAPI{
    constructor(auth){
        
        this.auth = auth;
    }

    async playlist(){

        return playlists(this.auth);
    }

    async playlistItems(playlistID){
        
        return playlistItems(this.auth, playlistID);
    }

    async exportPlaylistVideo(videoID){

        return exportPlaylistVideo(this.auth, videoID);
    }

    async exportAllPlaylistItems(source, profile){

        return exportAllPlaylistItems(this.auth, source, profile.airtable);
    }

    async updatePlaylistItemsAirtable(spinner, thumbnailPath, config){
        
        return updatePlaylistItemsAirtable(this.auth, spinner, thumbnailPath, config);
    }

    async updatePlaylistItems(sourcePath, thumbnailPath){
        
        return updatePlaylistItems(this.auth, sourcePath, thumbnailPath);
    }

    async uploadPlaylistItem(playlistID, schemaPath, mediaPath, thumbnailPath){
        
        return uploadPlaylistItem(this.auth, playlistID, schemaPath, mediaPath, thumbnailPath);
    }

    async deletePlaylistItem(itemObj){

        return deletePlaylistItem(this.auth, itemObj);
    }
}

exports.YouTubeAPI = YouTubeAPI;
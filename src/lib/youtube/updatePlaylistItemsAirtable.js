const fs = require('fs'),
      mime = require('mime-types'),
      {google} = require('googleapis'),
      service = google.youtube('v3'),
      path = require('path'),
      {YTB_Airtable} = require('./airtable');

const updatePlaylistItemsAirtable = async (auth, spinner, thumbnailPath, config) => {

  const airtable = await new YTB_Airtable(config);

  return await Promise.resolve()

  //get modified videos from airtable

  .then( async () => {

      spinner.text = `Getting modified videos airtable...`
      return airtable.list();
  })

  //uploading video
  .then( async(airtableData) => {

    spinner.text = `Updating playlist video...`
    if(airtableData.length){

      for( let i = 0 ; i < airtableData.length ; i ++){
        
        const {youtube_id, youtube_title, youtube_description, youtube_keywords, youtube_categoryID} = airtableData[i],
              keywords = youtube_keywords || '';

        const parameters = {
          "auth" : auth,
          "part" : "snippet",
          "resource" : {
            "id" : youtube_id,
            "snippet" : {
              "title" : youtube_title,
              "description" : youtube_description,
              "tags" : keywords.trim().split(','),
              "categoryId" : youtube_categoryID
            }
          }
        };

        await service.videos
        .update(parameters)
        .then(async(video) => {

          if(thumbnailPath && fs.existsSync(thumbnailPath)){

            const thumb_path = path.resolve(thumbnailPath, `${airtableData[i].youtube_id}-thumbnail.jpg`);
            if(fs.existsSync(thumb_path)){

              const mimeType = mime.lookup(thumb_path);
              const thumb_parameters = {
                "auth" : auth,
                "videoId" : airtableData[i].youtube_id,
                "media" : {
                  "mimeType" : mimeType,
                  "body" : fs.readFileSync(thumb_path)
                }
              }
              await service.thumbnails.set(thumb_parameters)
                    .then((data) => {
                      airtableData[i]['youtube_thumbnail'] = (data.data.items[0].hasOwnProperty('maxres')) ? data.data.items[0].maxres.url : (data.data.items[0].hasOwnProperty('standard')) ? data.data.items[0].standard.url : data.data.items[0].high.url;
                    });
            }
            
          }
        })
      }
    }
    return airtableData;
  })
  .then(async ( airtableData) => {

    spinner.text = `Updating airtable(unchecked checkboxes)...`
    return airtable.update(airtableData);
  })
  
  .catch( (err) => {
    throw err;  
  })
}

module.exports = {updatePlaylistItemsAirtable};
const Airtable = require('airtable');

function createBase(config){

    return new Airtable({apiKey: config.API_KEY}).base(config.BASE_ID);
}

async function getAirtableItems(base, config){

    let video_data = [];
        return new Promise(function (resolve, reject) {
            base(config.TABLE_NAME).select({
                view: "Grid view"
            })
            .eachPage(function page(records, fetchNextPage){

                records.forEach(function(record) {
                    record.fields['id'] = record.id;
                    video_data.push(record.fields);
                });

                fetchNextPage();
            }, function done(err) {
                if(err){

                    reject(err);
                }else{

                    resolve(video_data);
                }
            })
        });
}

async function updateAirtableItem(base, airtable_id, video_data, config){

    const thumbnails = video_data.snippet.thumbnails,
          thumbnail_url = (thumbnails.hasOwnProperty('maxres')) ? thumbnails.maxres.url : (thumbnails.hasOwnProperty('standard')) ? thumbnails.standard.url : thumbnails.high.url;

    return base(config.TABLE_NAME)
        .update(airtable_id,
            {
                "isModified" : false,
                "youtube_title" : video_data.snippet.title,
                "youtube_description" : video_data.snippet.description,
                "youtube_keywords" : (video_data.snippet.hasOwnProperty('tags')) ? video_data.snippet.tags.toString() : '',
                "youtube_thumbnail" : thumbnail_url,
                "youtube_categoryID" : video_data.snippet.categoryId
            }
        );
}

class YTB_Airtable {

    constructor(config, type = false){

        return (async() => {

            this.config = config;
            this.base = await createBase(config);
            if(type)
                this.dataItems = await getAirtableItems(this.base, config);

            return this;
        })();
    }

    async create(video_data){
        
        const thumbnails = video_data.snippet.thumbnails,
              thumbnail_url = (thumbnails.hasOwnProperty('maxres')) ? thumbnails.maxres.url : (thumbnails.hasOwnProperty('standard')) ? thumbnails.standard.url : thumbnails.high.url;

        return this.base(this.config.TABLE_NAME)
                .create({
                    "youtube_id" : video_data.id,
                    "youtube_title" : video_data.snippet.title,
                    "youtube_description" : video_data.snippet.description,
                    "youtube_keywords" : (video_data.snippet.hasOwnProperty('tags')) ? video_data.snippet.tags.toString() : '',
                    "youtube_thumbnail" : thumbnail_url,
                    "youtube_categoryID" : video_data.snippet.categoryId
                });
    }

    async list(){

        let video_data = [];
        const {base, config} = this;
        return new Promise(function (resolve, reject) {
            base(config.TABLE_NAME).select({
                view: "Grid view",
                filterByFormula : 'isModified'
            })
            .eachPage(function page(records, fetchNextPage){

                records.forEach(function(record) {
                    record.fields['id'] = record.id;
                    video_data.push(record.fields);
                });

                fetchNextPage();
            }, function done(err) {
                if(err){

                    reject(err);
                }else{

                    resolve(video_data);
                }
            })
        });
    }

    async create_update(videoItems){

        for(let vItem of videoItems){

            let isUpdated = false;
            for(let aItem of this.dataItems){

                if(vItem.id == aItem.youtube_id){

                    await updateAirtableItem(this.base, aItem.id, vItem, this.config);
                    isUpdated = true;
                    break;
                }
            }

            if(!isUpdated)
                await this.create(vItem);
        }

        return;
    }

    async update(airtableData){

        for(let data of airtableData || []){

            //await sleep(200);
            await this.base(this.config.TABLE_NAME)
                    .update(data.id,
                        {
                            isModified : false,
                            youtube_thumbnail : data.youtube_thumbnail
                        }
                    );
        }

        return;
    }
}

exports.YTB_Airtable = YTB_Airtable;
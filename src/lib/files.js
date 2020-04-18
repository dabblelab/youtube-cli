const fs = require('fs'),
      path = require('path'),
      os   = require('os'),
      _    = require('lodash');

module.exports = {
  getCurrentDirectoryBase : () => {
    return path.basename(process.cwd());
  },

  directoryExists : (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  fileExists : (filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },

  createYouTubeJSONFile : async (filename) => {
    
    try{
    if(fs.existsSync(path.join(process.cwd(),`${filename}.json`))){
        filename = `${filename}-${Date.now()}.json`;
        await fs.writeFileSync(path.join(process.cwd(),filename));
        return filename;
    }else{
        await fs.writeFileSync(path.join(process.cwd(),`${filename}.json`),{});
        return `${filename}.json`;
    }
    } catch (err){
    return err;
    }
  },

  writeYouTubeJSONFile : async(data, filename) => {
      return fs.writeFileSync(path.join(process.cwd(),filename),JSON.stringify(data, null, 2));
  },

  removeFile : async(filePath) => {
    try{
      return fs.unlinkSync(filePath);
    }catch(e) {
      console.log(e.message);
      return e;
    }
  }

};


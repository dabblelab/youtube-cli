
const runScript = async() => {

    try{
        const fs = require('fs-extra'),
              {version} = require('./package.json');

        let readme = await fs.readFile('readmeText.txt', 'utf8');
        //readme = readme.replace(/v0.0.1/g, `master`);
        await fs.outputFile('README.md', readme)
    }catch(err){
        console.log(err);
    }
    
} 

runScript();
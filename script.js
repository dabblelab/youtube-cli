
const runScript = async() => {

    try{
        const fs = require('fs-extra'),
              {version} = require('./package.json');

        console.log(version);
        let readme = await fs.readFile('readmeText.txt', 'utf8');
        readme = readme.replace(/v0.0.1/g, `v${version}`);
        await fs.outputFile('README.md', readme)
    }catch(err){
        console.log(err);
    }
    
} 

runScript();
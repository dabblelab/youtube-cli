const {prompt} = require("inquirer");

exports.promptUser = async(msg, validate = false, validate_msg = false) => {

    let promptObj = {
        message : msg,
        type : 'input',
        name : 'userTyped'
    };

    if(validate)
        promptObj.validate = function(input){
            if(!input.trim())
                return validate_msg;
            return true;   
        };

    const answer = await prompt(
                            [
                                promptObj
                            ]
                        );

    return answer.userTyped;
}

exports.UserChoice = async(msg, choice) => {

    const choiceResp = await prompt(
        [
            {
                type: 'list',
                name: 'answer',
                message: msg,
                choices: choice
              }
        ]
    );

    return choiceResp.answer;
}
// // Get Reward amount given staked token and the ratio of stake
function getReturnAmount(expectedTokenToStake, ratioOfStake){
    try{
        return expectedTokenToStake*ratioOfStake;
    }catch(err){
        console.log(err);
    }
}

// // Get total Amount that is to be paid by the player for each game
function totalAmtToBePaid(expectedTokenToStake){
    try{
        return expectedTokenToStake;
    }catch(err){
        console.log(err);
    }
}

// generate a random integer between [min, max]
function randomNumber(min, max){
    try{
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }catch(err){
        console.log(err);
    }
}

module.exports={getReturnAmount, totalAmtToBePaid, randomNumber};
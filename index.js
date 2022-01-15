const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const { program } = require('commander');
const { getReturnAmount, totalAmtToBePaid, randomNumber } = require('./helper')
const {getWalletBalance, transferSOL, airDropSol} = require("./solana");
const { Keypair } = require("@solana/web3.js");

const init = () => {
    console.log(
        chalk.green(
        figlet.textSync("SOL Stake", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
        )
    );
    console.log(chalk.yellow`The max bidding amount is 2 SOL here`);
};

// const userWallet = Keypair.generate();
const userSecretKey= [
    252, 244, 220, 254, 102, 170,  89, 156,  28,  24, 211,
      8,  37, 239,   0,  15, 122, 126, 207, 188, 112, 102,
    176, 117,  95,  76, 203, 103, 137,  43, 162, 199,  83,
    212,  31,  10,  83,  65, 243, 236, 214, 121,  47,  62,
    203, 171,  60, 110,   1, 112, 201, 198, 192, 204, 125,
    234,  83, 106, 213,  39, 193, 142, 140,  35
];

const userWallet=Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
const treasurySecretKey = [
    82, 165,  89, 237,  76,  56, 172, 199,  30,  93, 150,
    97,  75, 233,  88,  64,  58, 239, 230, 189, 123, 206,
    13,  33, 204, 105,  75, 215,  40, 173, 175, 131, 163,
   176, 253,  35, 248, 183,  10, 183, 103, 253,  51, 100,
   157, 217, 170,  32,  39, 172, 253,  52,  16,  37, 190,
    32, 252, 234, 237,  14, 187, 213,  28,  69
 ];

const treasuryWallet = Keypair.fromSecretKey(Uint8Array.from(treasurySecretKey));

const askQuestions = (mini, maxi) => {
    const questions = [
        {
            name: "SOL",
            type: "number",
            message: "What is the amount of SOL you want to stake?",
        },
        {
            type: "rawlist",
            name: "RATIO",
            message: "What is the ratio of your staking?",
            choices: ["1:1.25", "1:1.5", "1:1.75", "1:2"],
            filter: function(val) {
                const stakeFactor=val.split(":")[1];
                return stakeFactor;
            },
        },
        {
            type:"number",
            name:"RANDOM",
            message:"Guess a random number from " + mini +" to "+ maxi+ " (both " +mini+", "+maxi+ " included)",
            when:async (val)=>{
                if(parseFloat(totalAmtToBePaid(val.SOL))>2){
                    console.log(chalk.red`Violated the max stake limit. Stake with smaller amount.`)
                    return false;
                }else{
                    console.log(`You need to pay ${chalk.green`${totalAmtToBePaid(val.SOL)}`} to move forward`)
                    const userBalance=await getWalletBalance(userWallet.publicKey)
                    if(userBalance<totalAmtToBePaid(val.SOL)){
                        console.log(chalk.red`You don't have enough balance in your wallet`);
                        return false;
                    }else{
                        console.log(chalk.green`You will get ${getReturnAmount(val.SOL,parseFloat(val.RATIO))} if guessing the number correctly`)
                        return true;    
                    }
                }
            },
        }
    ];
    return inquirer.prompt(questions);
};

const gameExecution=async ()=>{
    // intital display
    init();
    // getting min and max limit for random number
    program
        .option('--min_limit <val>', 'minimum roulette limit', 1)
        .option('--max_limit <val>', 'maximum roulette limit', 5)
        .parse();

    const options = program.opts();
    // console.log(await getWalletBalance(userWallet.publicKey))
    // console.log(await getWalletBalance(treasuryWallet.publicKey))
    
    // If out of balance the uncomment one line at a time to get an airdrop
    // Cannot have multiple airdrops as it gives error

    // await airDropSol(userWallet, 2);
    // await airDropSol(treasuryWallet, 2);
    try{
        if (parseInt(options.min_limit)>= parseInt(options.max_limit)) throw new Error(chalk.red`Wrong limits set. Please enter correct limits`)
        const generateRandomNumber = randomNumber(parseInt(options.min_limit), parseInt(options.max_limit));
        // console.log(`Random Number ${generateRandomNumber}`);
        const answers=await askQuestions(parseInt(options.min_limit), parseInt(options.max_limit));
        if (answers.RANDOM){
            const paymentSignature=await transferSOL(userWallet,treasuryWallet,totalAmtToBePaid(answers.SOL))
            console.log(`Signature of payment for playing the game`,chalk.green`${paymentSignature}`);
            if(answers.RANDOM===generateRandomNumber){
                //AirDrop Winning Amount
                await airDropSol(treasuryWallet,getReturnAmount(answers.SOL,parseFloat(answers.RATIO)-1));
                //guess is successfull
                const prizeSignature=await transferSOL(treasuryWallet,userWallet,getReturnAmount(answers.SOL,parseFloat(answers.RATIO)))
                console.log(chalk.green`Your guess is absolutely correct`);
                console.log(`Here is the price signature `,chalk.green`${prizeSignature}`);
            }else{
                //better luck next time
                console.log(chalk.yellowBright`Better luck next time`)
            }
        }
    }catch(err){
        console.log(err);
    }
    // console.log(await getWalletBalance(userWallet.publicKey))
    // console.log(await getWalletBalance(treasuryWallet.publicKey))
};
gameExecution();
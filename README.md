# SolanaRoulette
Creating a Roulette game on Solana blockchain

![alt text](https://github.com/GoelPratyush/SolanaRoulette/blob/main/sol1.JPG?raw=true)
![alt text](https://github.com/GoelPratyush/SolanaRoulette/blob/main/sol2.JPG?raw=true)

## Installation
Go to the app directory and install the package dependencies
```
npm install
```

## How to Use
Directly execute the index.js file in the app directory and then follow the in app instructions
```
node index.js
```

You can also set max and min limit for the roulette number game (Should be a +ve number). 
```
node index.js --min_limit [optional] <val> --max_limit [optional] <val>
```

## Warnings
* The stake value must not be greater than 2 as then the transaction would surely fail.
* If it shows __not enough balance__ error then you would require to airdrop SOL to userWallet and treasuryWallet.
* Airdrop to treasury wallet is essential because of transaction fee

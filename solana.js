const web3 = require("@solana/web3.js");

// Transfer Sol from one wallet to another
const transferSOL=async (from,to,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        // Creating a traction instace [from, to, sol_token]
        const transaction=new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey:new web3.PublicKey(from.publicKey.toString()),
                toPubkey:new web3.PublicKey(to.publicKey.toString()),
                lamports:transferAmt*web3.LAMPORTS_PER_SOL
            })
        )
        // Authorise signing of transaction
        const signature=await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    }catch(err){
        console.log(err);
    }
};

// Get wallet balance
const getWalletBalance=async (pubk)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const balance=await connection.getBalance(new web3.PublicKey(pubk));
        return parseInt(balance)/web3.LAMPORTS_PER_SOL;
    }catch(err){
        console.log(err);
    }
};

//Air dropping SOL (in terms of LAMPORTS)
const airDropSol = async (wallet,transferAmt) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
        const fromAirDropSignature = await connection.requestAirdrop(
            new web3.PublicKey(wallet.publicKey),
            transferAmt * web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

module.exports={getWalletBalance, transferSOL, airDropSol};
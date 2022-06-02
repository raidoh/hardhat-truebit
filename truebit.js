const ether = require("@nomiclabs/hardhat-ethers");
const { keccak256 } = require("ethers/lib/utils");
const truebitgoerli = require("./client/goerli.json");
const truebitmain = require("./client/mainnet.json");
const web3 = require("web3");


// Check License price
task("license", "Prints license price")
    .addPositionalParam("param1")
    .addPositionalParam("param2")
    .addPositionalParam("index")
    .setAction(async (taskArgs) => {
    // Checking correct parameters syntax 
    if (taskArgs.param2=="-a" && (taskArgs.param1=="price" || taskArgs.param1=="check") && !isNaN(taskArgs.index)){
        
            var contract ;
            switch (hre.network.name) {
                case "mainnet":
                    contract = truebitmain;
                    break;
                case "hardhat":
                    contract= truebitgoerli;
                    break;
                case "goerli":
                    contract= truebitgoerli;
                    break;
            }
            
            if (taskArgs.param1=="price"){
                const accounts = await hre.ethers.getSigners();
                const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
                const value = await incentivelayer.LICENSE_FEE();
                console.log("Solver license price %s eth", ethers.utils.formatEther(value));
            }
            if (taskArgs.param1=="check"){
                const accounts = await hre.ethers.getSigners();
                const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
                const solver = web3.utils.soliditySha3('SOLVER');
                if (await purchasecontract.hasRole(solver,accounts[taskArgs.index].address) ){
                    console.log("Has license");
                }else {
                    console.log("No license");
                }
                
            }
            if (taskArgs.param1=="purchase"){ 
                //TODO
            }
    }else{
            console.log("Check syntax eror in parameters");
            
    }
  });

 
// Token operations
// price: return the current price for purchase and sell
task("token", "prices and purchase")
    .addPositionalParam("param1")
    .setAction(async (taskArgs) => {
     // Checking correct parameters syntax 
    if (taskArgs.param1=="price" || taskArgs.param1=="purchase"){
        var contract ;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract= truebitgoerli;
                break;
            case "goerli":
                contract= truebitgoerli;
                break;
        }
        if (taskArgs.param1=="price"){     
            const accounts = await hre.ethers.getSigners();
            var contract = truebitgoerli;
            //const contractAddress = truebit.incentiveLayer.address;
            // Tru price
            const trucontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
                
            const valuetrubuy = await trucontract.getPurchasePrice(ethers.utils.parseUnits("1000"));
            const valuetrusell = await trucontract.getRetirePrice(ethers.utils.parseUnits("1000"));
            console.log("Purchase 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrubuy));
            console.log("Retiring 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrusell));
        }
        if (taskArgs.param1=="purchase"){
            //TODO
        }
    }else {
        console.log("Check syntax eror in parameters");
    }
  });


// Check balance
  task("balance", "Prints an account's balance")
    .addPositionalParam("param1")
    .addPositionalParam("index")
    .setAction(async (taskArgs) => {
     // Checking correct parameters syntax 
     if (taskArgs.param1=="-a" && !isNaN(taskArgs.index) ){
        var contract ;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract= truebitgoerli;
                break;
            case "goerli":
                contract= truebitgoerli;
                break;
        }
        if (taskArgs.param1=="-a"){ 
            const accounts = await hre.ethers.getSigners();
            const balance = await accounts[taskArgs.index].getBalance();
            console.log("balance: \n   Address: ",accounts[taskArgs.index].address);
            console.log("   account: %s ETH", ethers.utils.formatEther(balance));
            
            // Tru balance
            const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
            const balancetru = await trucontract.balanceOf(accounts[taskArgs.index].address);
            console.log("             %s TRU", ethers.utils.formatEther(balancetru));
            // Tru deposit
            const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
            const deposit = await incentivelayer.getUnbondedDeposit(accounts[taskArgs.index].address);
            console.log("deposit (unbonded):  %s TRU", ethers.utils.formatEther(deposit));

        }
     }else{
        console.log("Check syntax eror in parameters");
     }
  });


// Impersonate 
// get Balance impersonating specific account 
task("Impersonate", "Impersonate account")
    .addPositionalParam("param1")
    .addPositionalParam("account")
    .setAction(async (taskArgs) => {
    if (taskArgs.param1=="true"){     
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [taskArgs.account],
          });
          await network.provider.send("hardhat_setBalance", [
            taskArgs.account,
            "0xFB900000000000000",
          ]);
          var contract ;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract= truebitgoerli;
                break;
        }

        const accountip = await hre.ethers.getSigner(taskArgs.account);
        console.log("balance: \n   Address: ",accountip.address);
        const balance = await accountip.getBalance();
        console.log("   account: %s ETH", ethers.utils.formatEther(balance));
         // Tru balance
         const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
         const balancetru = await trucontract.balanceOf(taskArgs.account);
         console.log("             %s TRU", ethers.utils.formatEther(balancetru));
         // Tru deposit
         const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
         const deposit = await incentivelayer.getUnbondedDeposit(taskArgs.account);
         console.log("deposit (unbonded):  %s TRU", ethers.utils.formatEther(deposit));

         const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
         const solver = web3.utils.soliditySha3('SOLVER');
         if (await purchasecontract.hasRole(solver,taskArgs.account) ){
             console.log("Has license");
         }else {
             console.log("No license");
         }
    }
    if (taskArgs.param1=="false"){
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [taskArgs.account],
          });
    }
  });

  // Check Bonus per task
task("bonus", " Display current per task subsidy")
.setAction(async (taskArgs) => {
var contract ;
switch (hre.network.name) {
    case "mainnet":
        contract = truebitmain;
        break;
    case "hardhat":
        contract= truebitgoerli;
        break;
    case "goerli":
        contract= truebitgoerli;
        break;
}

const accounts = await hre.ethers.getSigners();
const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
const value = await incentivelayer.bonusTable();

let ownerAmount = ethers.utils.formatEther(value.mul(2).toString())/9;
let solverAmount = ethers.utils.formatEther(value.mul(4).toString())/9;
let verifierAmount = ethers.utils.formatEther(value.mul(3).toString())/9;
console.log("info: Subsidies per task");
console.log("     %s TRU for the Task Owner", ownerAmount);
console.log("     %s TRU for the Solver, and", solverAmount);
console.log("     %s TRU for split among Verifiers", verifierAmount);

});
////////////////****************  MANUAL INTERACTION WITH SMART CONTRACT   *********///////////////////////// 




const hre = require("hardhat");  // creating object of hardhat

async function getBalance(address) {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);    // hre = object of hardhat
    // waffle = inbuilt library of hardhat
    // provider = a node of blockchain that you are talking to

    return hre.ethers.utils.formatEther(balanceBigInt);                    // returning balance in ether format
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {                           // another way to run 'for' loop
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
    }
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {                                  // addresses is array list of array
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx++;
    }
}




async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();            // assigning accounts address to variables using getSigners function of ethers library

    // get instance of contract and deploy
    const buymeacoffee = await hre.ethers.getContractFactory("coffee");          // hre.ethers.getContractFactory("__contract name__")
    // creating instance of contract in 'buymeacoffee' variable
    const buyMeACoffee = await buymeacoffee.deploy();                                  // deployed contract is  in "buyMeACoffee"
    await buyMeACoffee.deployed();                                                     // to check contract is deployed or not

    console.log("Buy Me A Coffee is deployed to", buyMeACoffee.address);               // '.address' is a function to refer to address of account or contract


    // check balance of addresses
    const address = [owner.address, tipper1.addrress];
    console.log(printBalances(address));
    console.log("Tipper 2 balance ", getBalance(tipper2.address));
    console.log("Contract Balance", getBalance(buyMeACoffee.address));

    // Buy the owner a few coffees.
    const tip = { value: hre.ethers.utils.parseEther("0.1") };
    await buyMeACoffee.connect(tipper1).BuyACoffee("a", "You're the best!", tip);                   // 'BuyACoffee' is a function of our smart contract
    await buyMeACoffee.connect(tipper2).BuyACoffee("b", "Amazing teacher", tip);                   // here 'tip' value = msg.value and we can give as an extra parameter becuase our function is payable
    await buyMeACoffee.connect(tipper3).BuyACoffee("c", "I love my Proof of Knowledge", tip);      // '.connect' connects the account at that moment


    // balance after tipping
    console.log("after tipping");
    console.log(printBalances(address));
    console.log("Tipper 2 balance ", getBalance(tipper2.address));
    console.log("Contract Balance", getBalance(buyMeACoffee.address));

    // withdraw tips
    await buyMeACoffee.connect(owner).WithdrawTips();

    // balnce after withdrwaing
    console.log("after withdraw");
    console.log(printBalances(address));
    console.log("Tipper 2 balance ", getBalance(tipper2.address));
    console.log("Contract Balance", getBalance(buyMeACoffee.address));


    // We recommend this pattern to be able to use async/await everywhere
    // and properly handle errors.
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });


}
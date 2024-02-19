import { ethers, formatEther, formatUnits, parseEther } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 创建airdrop合约
// Airdrop的ABI
const abiAirdrop = [
    "function multiTransferToken(address,address[],uint256[]) external",
    "function multiTransferETH(address[],uint256[]) public payable",
];
// Airdrop合约地址（Sepolia测试网）
const addressAirdrop = '0x34A4B863d510B2710f5BCb66A495AD8f2ff8099F' // Airdrop Contract
// 声明Airdrop合约
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)


// WETH的ABI
const abiWTF = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
    "function approve(address, uint256) public returns (bool)"
];
// WTF合约地址（Sepolia测试网）
const addressWTF = '0x836759c18deAF143A240f985609317eD7Ff05B5D' // WETH Contract
// 声明WETH合约
const contractWTF = new ethers.Contract(addressWTF, abiWTF, wallet)


const multiTransferMain = async() => {
    console.log("\n1. 创建HD钱包")
    // 通过助记词生成HD钱包
    const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
    console.log(hdNode);

    console.log("\n2. 通过HD钱包派生20个钱包")
    const numWallet = 20
    // 派生路径：m / purpose' / coin_type' / account' / change / address_index
    // 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
    let basePath = "m/44'/60'/0'/0";
    let addresses = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        addresses.push(walletNew.address);
    }
    console.log(addresses)
    const amounts = Array(20).fill(parseEther("0.01"));
    console.log(`发送数额: ${amounts}`);

    console.log("\n3. 读取一个地址的ETH和WETH余额")
    //读取WETH余额
    const balanceWTF = await contractWTF.balanceOf(addresses[10])
    console.log(`WTF持仓: ${formatEther(balanceWTF)}\n`)
    //读取ETH余额
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH持仓: ${formatEther(balanceETH)}\n`)

    // console.log("\n4. 调用multiTransferETH()函数，给每个钱包转 0.01 ETH")
    // const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: parseEther("0.2")})
    // await tx.wait()
    // const balanceETH2 = await provider.getBalance(addresses[10])
    // console.log(`发送后该钱包ETH持仓: ${formatEther(balanceETH2)}\n`)

    console.log("\n5. 调用multiTransferToken()函数，给每个钱包转 0.05 WTF")
    // 先approve WETH给Airdrop合约
    const txApprove = await contractWTF.approve(addressAirdrop, parseEther("1"))
    await txApprove.wait()
    // 发起交易
    const tx2 = await contractAirdrop.multiTransferToken(addressWTF, addresses, amounts)
    // 等待交易上链
    await tx2.wait()
    // console.log(`交易详情：`)
    // console.log(tx2)
    // 读取WTF余额
    const balanceWETH2 = await contractWTF.balanceOf(addresses[10])
    console.log(`发送后该钱包WTF持仓: ${formatEther(balanceWETH2)}\n`)
}

export {
    multiTransferMain
}

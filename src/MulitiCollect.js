import { ethers, formatEther, formatUnits, parseEther } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// WETH的ABI
const abiWTF = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// WETH合约地址（Sepolia测试网）
const addressWTF = '0x836759c18deAF143A240f985609317eD7Ff05B5D' // WTF Contract
// 声明WETH合约
const contractWTF = new ethers.Contract(addressWTF, abiWTF, wallet)


const MultiCollectMain = async() => {
    console.log("\n1. 创建HD钱包")
    // 通过助记词生成HD钱包
    const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
    console.log(hdNode);

    const numWallet = 20
    // 派生路径：m / purpose' / coin_type' / account' / change / address_index
    // 我们只需要切换最后一位address_index，就可以从hdNode派生出新钱包
    let basePath = "m/44'/60'/0'/0";
    let wallets = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        wallets.push(walletNew);
        console.log(walletNew.address)
    }
    // 定义发送数额
    const amount = parseEther("0.001")
    console.log(`发送数额：${amount}`)

    console.log("\n3. 读取一个地址的ETH和WETH余额")
    //读取WTF余额
    const balanceWTF = await contractWTF.balanceOf(wallets[19])
    console.log(`WTF持仓: ${formatEther(balanceWTF)}`)
    //读取ETH余额
    const balanceETH = await provider.getBalance(wallets[19])
    console.log(`ETH持仓: ${formatEther(balanceETH)}\n`)

    // 6. 批量归集钱包的ETH
    // console.log("\n4. 批量归集20个钱包的ETH")
    // const txSendETH = {
    //     to: wallet.address,
    //     value: amount
    // }
    // for (let i = 0; i < numWallet; i++) {
    //     // 将钱包连接到provider
    //     let walletiWithProvider = wallets[i].connect(provider)
    //     var tx = await walletiWithProvider.sendTransaction(txSendETH)
    //     console.log(`第 ${i+1} 个钱包 ${walletiWithProvider.address} ETH 归集开始`)
    // }
    // await tx.wait()
    // console.log(`ETH 归集结束`)
    // console.log("\n4. 批量归集20个钱包的WTF")
    // for (let i = 0; i < numWallet; i++) {
    //     // 将钱包连接到provider
    //     let walletiWithProvider = wallets[i].connect(provider)
    //     // 将合约连接到新的钱包
    //     let contractConnected = contractWTF.connect(walletiWithProvider)
    //     var tx = await contractConnected.transfer(wallet.address, amount)
    //     console.log(`第 ${i+1} 个钱包 ${wallets[i].address} WTF 归集开始`)
    // }
    // await tx.wait()
    // console.log(`WTF 归集结束`)

    console.log("\n6. 读取一个地址在归集后的ETH和WTF余额")
    // 读取WTF余额
    const balanceWETHAfter = await contractWTF.balanceOf(wallet.address)
    console.log(`归集后WETH持仓: ${formatEther(balanceWETHAfter)}`)
    // 读取ETH余额
    // const balanceETHAfter = await provider.getBalance(wallet.address)
    // console.log(`归集后ETH持仓: ${formatEther(balanceETHAfter)}\n`)
}

export {
    MultiCollectMain
}
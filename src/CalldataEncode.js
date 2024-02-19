import { ethers, formatEther } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const CallDataMain = async() => {
    // WETH的ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
    ];
    // WETH合约地址（Sepolla测试网）
    const addressWETH = '0xf531b8f309be94191af87605cfbf600d71c2cfe0'
    // 声明WETH合约
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    // console.log("\n1. 读取WETH余额")
    // // 编码calldata
    // const param1 = contractWETH.interface.encodeFunctionData(
    //     "balanceOf",
    //     [address]
    // );
    // console.log(`编码结果： ${param1}`)

    // // 创建交易
    // const tx1 = {
    //     to: addressWETH,
    //     data: param1
    // }
    // // 发起交易，可读操作（view/pure）可以用 provider.call(tx)
    // const balanceWETH = await provider.call(tx1)
    // console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`)

    // 编码calldata
    const param2 = contractWETH.interface.encodeFunctionData(
        "deposit"          
        );
    console.log(`编码结果： ${param2}`)
    // 创建交易
    const tx2 = {
        to: addressWETH,
        data: param2,
        value: ethers.parseEther("0.026")}
    // 发起交易，写入操作需要 wallet.sendTransaction(tx)
    const receipt1 = await wallet.sendTransaction(tx2)
    // 等待交易上链
    await receipt1.wait()
    console.log(`交易详情：`)
    console.log(receipt1)
    const balanceWETH_deposit = await contractWETH.balanceOf(address)
    console.log(`存款后WETH持仓: ${formatEther(balanceWETH_deposit)}\n`)

}

export {
    CallDataMain
}
import { ethers, formatEther, formatUnits } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const ContractListenerMain = async() => {
    const usdcContractAddress = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
    const abi = ["event Transfer(address indexed from, address indexed to, uint value)"]
    // 生成usdc合约对象
    const contractUSDC = new ethers.Contract(usdcContractAddress, abi, provider);

    // 只监听一次
    // console.log("\n1. 利用contract.once()，监听一次Transfer事件");
    // contractUSDC.once("Transfer", (from, to, value, event) => {
    //     // 打印结果
    //     // `${from} 转账 ${formatEther(value)} USDC 到 ${to}，事件hash: ${event.transactionHash}`
    //     `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
    // })
    console.log("\n1. 利用contract.on()，持续监听Transfer事件");
    contractUSDC.on("Transfer", (from, to, value, event) => {
        // 打印结果
        // `${from} 转账 ${formatEther(value)} USDC 到 ${to}，事件hash: ${event.transactionHash}`
        console.log(`${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`)
    })
}

export {
    ContractListenerMain
}
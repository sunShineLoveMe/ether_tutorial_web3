import { ethers, formatEther } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const WriteContractMain = async() => {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    // WETH的ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
    ];

    // WETH的合约地址
    const addressWETH = "0xf531b8f309be94191af87605cfbf600d71c2cfe0";
    // 声明可写的合约实例
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
    const address = wallet.getAddress();
    // 读取weth 合约的链上信息
    console.log("\n1. 读取WETH余额");
    const balanceWETH = await contractWETH.balanceOf(address);
    console.log(`余额: ${formatEther(balanceWETH)}`);

    console.log("\n2. 调用desposit()函数，存入0.024 ETH");
    // 发起交易
    const tx = await contractWETH.deposit({value: ethers.parseEther("0.024")});
    // 等待交易上链
    await tx.wait();
    console.log("交易详情:");
    console.log(tx);

    const balanceWTH_deposit = await contractWETH.balanceOf(address);
    console.log(`deposit之后的余额: ${formatEther(balanceWTH_deposit)}`);
    
}

export {
    WriteContractMain
};
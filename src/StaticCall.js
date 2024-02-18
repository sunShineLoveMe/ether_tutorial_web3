import { ethers, formatUnits, formatEther, parseEther } from "ethers";
const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;

const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// DAI的ABI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const StaticCallMain = async() => {
    const address = await wallet.getAddress()
    console.log("\n1. 读取测试钱包的DAI余额")
    const balanceDAI = await contractDAI.balanceOf(address)
    console.log(`DAI持仓: ${formatEther(balanceDAI)}\n`)

    console.log("\n2.  用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik地址")
    const tx = await contractDAI.transfer.staticCall("vitalik.eth", parseEther("1"), {from: await provider.resolveName("vitalik.eth")})
    console.log(`交易会成功吗？：`, tx)

    console.log("\n3.  用staticCall尝试调用transfer转账1 DAI，msg.sender为测试钱包地址")
    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
    console.log(`交易会成功吗？：`, tx)
}
// 总结：

export {
    StaticCallMain
}
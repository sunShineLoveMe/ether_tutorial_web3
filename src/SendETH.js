import { ethers, formatEther } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;

const SendETHMain = async() => {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);
    // 创建随机的wallet对象
    const wallet1 = ethers.Wallet.createRandom();
    const wallet1WithProvider = wallet1.connect(provider);
    // const mnemonic = wallet1.mnemonic;
    // console.log(`获取助记词: ${mnemonic}`);
    // console.log(`获取助记词: ${wallet1.mnemonic.phrase}`);

    // 利用私钥和provider创建wallet对象
    const privateKey = process.env.PRIVATE_KEY;
    const wallet2 = new ethers.Wallet(privateKey, provider);
    // const wallet2Address = await wallet2.getAddress();
    // console.log(`钱包地址: ${wallet2Address}`);
    // 获取钱包对象的助记词

    // 获取钱包的交互次数
    // const txCount2 = await provider.getTransactionCount(wallet2);
    // console.log(`交互次数: ${txCount2}`);
    
    // 发送ETH
    // 打印发送前的余额
    console.log(`发送前wallet1的余额: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`);
    console.log(`发送前wallet2的余额: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`);

    // 构造交易
    const tx = {
        to: wallet1.address,
        value: ethers.parseEther("0.03")
    };

    // 发送交易
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`);
    const receipt = await wallet2.sendTransaction(tx);
    await receipt.wait(); // 等待交易上链
    console.log(receipt); // 打印交易详情

    // 打印发送后的余额
    console.log(`发送后wallet1的余额: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`);
    console.log(`发送后wallet2的余额: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`);
}
export {
    SendETHMain
};

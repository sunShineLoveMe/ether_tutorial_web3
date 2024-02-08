import { ethers, formatEther } from "ethers";
// 主网
const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;
const ProviderMain = async() => {
    const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
    const balance = await provider.getBalance(`ricmoo.eth`);
    const convertBalance = formatEther(balance);
    console.log(`Balance: ${convertBalance}`);

    console.log("\n2. 查询provider连接到了哪条链");
    const network = await provider.getNetwork();
    console.log(network.toJSON());

    console.log("\n3. 查询provider的区块高度");
    const blockNumber = await provider.getBlockNumber();
    console.log(blockNumber);

    // 利用getCode()查询某个地址的合约bytecode，参数为合约地址，下面例子中用的主网WETH的合约地址
    console.log("\n4. 查询某个地址的合约bytecode");
    const wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
    const wethCode = await provider.getCode(wethAddress);
    console.log(wethCode);
}
export {
    ProviderMain
};
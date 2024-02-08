import { ethers, formatEther } from "ethers";
const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;
const HelloVitalik1 = async() => {
    // await console.log(ALCHEMY_MAINNET_URL);
    const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
    const balance = await provider.getBalance(`ricmoo.eth`);
    // console.log(`Balance: ${balance}`);
    const convertBalance = formatEther(balance);
    console.log(`Balance: ${convertBalance}`);
}
export {
    HelloVitalik1
};
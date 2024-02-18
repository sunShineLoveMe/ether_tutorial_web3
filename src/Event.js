import { ethers, formatEther, formatUnits, getBigInt } from "ethers";
// Sepolia 测试网
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const addressETH ='0xf531b8f309be94191af87605cfbf600d71c2cfe0'

const EventMain = async() => {
    const abiWETH = [
        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    // 声明合约实例
    const contract = new ethers.Contract(addressETH, abiWETH, provider)

    // 得到当前区块
    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    console.log(`打印事件详情:`);

    const transferEvents = await contract.queryFilter('Transfer', 5238526, 5238529)
    // 打印第1个Transfer事件
    console.log(transferEvents[0])

    // 读取事件的解析结果
    console.log("\n2. 解析事件：")
    const amount = formatUnits(getBigInt(transferEvents[0].args["amount"]), "ether");
    console.log(`地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)
}

export {
    EventMain
}


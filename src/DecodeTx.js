import { ethers, formatUnits } from "ethers";
const ALCHEMY_MAINNET_WSS = process.env.ALCHEMY_MAINNET_WSS;
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSS);
let network = provider.getNetwork();

const DecodeTxMain = async() => {
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}]连接到chain-id:${res.chainId}`))
    // 创建interface对象，用于解码交易详情。
    const contractABI = [
        "function transfer(address, uint) public returns (bool)",
    ]
    const iface = new ethers.Interface(contractABI)
    // 3. 获取函数选择器。
    const selector = iface.getFunction("transfer").selector
    console.log(`函数选择器是${selector}`)

    // 4. 监听pending的erc20 transfer交易，获取交易详情，然后解码。
    // 处理bigInt
    function handleBigInt(key, value) {
        if (typeof value === "bigint") {
            return value.toString() + "n"; // or simply return value.toString();
        }
        return value;
    }

    let j = 0
    provider.on('pending', async (txHash) => {
        if (txHash) {
            const tx = await provider.getTransaction(txHash)
            j++
            if (tx !== null && tx.data.indexOf(selector) !== -1) {
                console.log(`[${(new Date).toLocaleTimeString()}]监听到第${j + 1}个pending交易:${txHash}`)
                console.log(`打印解码交易详情:${JSON.stringify(iface.parseTransaction(tx), handleBigInt, 2)}`)
                console.log(`转账目标地址:${iface.parseTransaction(tx).args[0]}`)
                console.log(`转账金额:${ethers.formatEther(iface.parseTransaction(tx).args[1])}`)
                provider.removeListener('pending', this)
            }
        }
        }
    )
}

export {
    DecodeTxMain
}






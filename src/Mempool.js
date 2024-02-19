import { ethers, formatUnits } from "ethers";
const ALCHEMY_MAINNET_WSS = process.env.ALCHEMY_MAINNET_WSS;
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSS);
let network = provider.getNetwork();

// 限制rpc访问频率，不然调用很容易超出限制，报错
function throttle(fn, delay) {
    // 定时器
    let timer;
    // 返回一个函数
    return function() {
        if(!timer) {
            // 通过apply来绑定this和参数
            fn.apply(this, arguments)
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
            }, delay);
        }
    }
}

const MempoolMain = async() => {
    // console.log("\n1. 连接 wss RPC")
    // console.log(`连接地址: ${ALCHEMY_MAINNET_WSS}`)
    let i = 0;
    // 3. 监听pending交易，获取txHash
    // console.log("\n3. 监听pending交易，打印txHash。")
    // provider.on("pending", async(txHash) => {
    //     if(txHash && i < 100) {
    //         // 打印Hash
    //         console.log(`[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${i}: ${txHash} \r`);
    //         i++;
    //     }
    // })
    // 4. 监听pending交易，并获取交易详情
    console.log("\n4. 监听pending交易，并获取交易详情。")
    let j = 0;
    provider.on("pending", throttle(async(txHash) => {
        if(txHash && j <= 100) {
            // 获取交易详情
            const tx = await provider.getTransaction(txHash);
            console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易 ${j}: ${txHash} \r`);
            console.log(tx);
            j++;
        }
    }, 1000))
}

export {
    MempoolMain
}
import { ethers, getBigInt } from "ethers";

// 1. 创建provider
let url = "ws://127.0.0.1:8545";
const provider = new ethers.WebSocketProvider(url);
let network = provider.getNetwork();

// 2. 创建interface对象，用于解码交易详情
const iface = new ethers.Interface([
    "function mint() external",
])

// 创建钱包
const privateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
const wallet = new ethers.Wallet(privateKey, provider)

const FrontRunMain = async() => { 
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));
    console.log(`\n2. 抢跑钱包地址: ${wallet.address}`)
    // 4. 监听pending的mint交易，获取交易详情，然后解码。
    console.log("\n4. 监听pending交易，获取txHash，并输出交易详情。")
    provider.on("pending", async(txHash) => {
        if(txHash) {
            // 获取tx详情
            let tx = await provider.getTransaction(txHash)
            if(tx) {
                // 过滤交易数据
                if(tx.data.indexOf(iface.getFunction('mint').selector) !== -1 && tx.from != wallet.address) {
                    // 打印txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] 监听Pending交易: ${txHash} \r`);
                    // 打印交易详情
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("pending交易详情解码：")
                    console.log(parsedTx);
                    // Input data解码
                    console.log("raw transaction")
                    console.log(tx);

                    // 构造抢跑交易
                    let txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        maxPriorityFeePerGas: BigInt(tx.maxPriorityFeePerGas.toString()) * 2n,
                        maxFeePerGas: BigInt(tx.maxFeePerGas.toString()) * 2n,
                        gasLimit: BigInt(tx.gasLimit.toString()) * 2n,
                        data: tx.data
                    }

                    // 发送抢跑交易
                    let txResponse = await wallet.sendTransaction(txFrontrun)
                    console.log(`正在frontrun交易`)
                    await txResponse.wait()
                    console.log(`frontrun交易成功`)
                }
            }
        }
    })
    // provider._websocket.on("error", async () => {
    //     console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
    //     setTimeout(init, 3000);
    //   });

    // provider._websocket.on("close", async (code) => {
    //     console.log(
    //         `Connection lost with code ${code}! Attempting reconnect in 3s...`
    //     );
    //     provider._websocket.terminate();
    //     setTimeout(init, 3000);
    // });
}

export {
    FrontRunMain
}
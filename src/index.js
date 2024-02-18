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
    ContractListenerMain();
}

main();

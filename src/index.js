import dotenv from  "dotenv";
dotenv.config();

import {HelloVitalikMain} from "./HelloVitalik.js";
import {ProviderMain} from './Provider.js'
import { ContractMain } from "./ReadContract.js";
import { SendETHMain } from "./SendETH.js";

const main = () => {
    // 入门查询v神账户余额
    // HelloVitalikMain();
    // provider
    // ProviderMain();
    // ContractMain();
    SendETHMain();
}

main();

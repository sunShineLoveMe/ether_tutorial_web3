import { ethers, formatUnits } from "ethers";
const ALCHEMY_MAINNET_WSS = process.env.ALCHEMY_MAINNET_WSS;
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSS);
let network = provider.getNetwork();


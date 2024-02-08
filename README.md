## ether.js 基础
### 1. Provider
provider 类是对以太坊网络连接的抽象，为标准以太坊节点功能提供简洁、一致的接口。在ethers中，Provider不接触用户私钥，只能读取链上信息，不能写入，这一点比web3.js要安全。
除了默认提供者defaultProvider以外，ethers中最常用的是**jsonRpcProvider**，可以让用户连接到特定节点服务商的节点。
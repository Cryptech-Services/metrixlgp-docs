---
sidebar_position: 1
title: MRX - Metrix
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

export const Image = ({src}) => (
<img src='/img/logo-mrx-white.png' style={{width: '48px',height : '48px'}} />
);

# <Image  /> MRX - Metrix

<Highlight color="#bf96c6">**Metrix**</Highlight> is the native gas coin of the MetrixCoin blockchain.

Metrix is a decentralized blockchain project software forked from Qtum, built on Bitcoin's UTXO model, with support for Ethereum Virtual Machine based smart contracts, and secured by a proof of stake consensus model. It achieves this through the revolutionary Account Abstraction Layer which allows the EVM to communicate with Metrix's Bitcoin-like UTXO blockchain.

For more general information about the original Qtum blockchain, go to [**qtum.org**](https://qtum.org)

**The major features of the Metrix network include:**

- Compatibility with the Ethereum Virtual Machine, which allows for compatibility with most existing Solidity based smart contracts. No special solidity compiler is required to deploy your smart contract to Metrix.
- A Proof of Stake consensus system which is optimized for Metrix's contract model. Any user can stake and help to secure the network.
- The Decentralized Governance Protocol is completely implemented and functional, which allows certain network parameters to be modified without a fork or other network disruption. This currently controls parameters like block size, gas prices, etc.
- Uses the UTXO transaction model and is compatible with Bitcoin, allowing for existing tooling and workflows to be used with Metrix. This allows for the infamous SPV protocol to be used which is ideal for light wallets on mobile phones and IoT devices.

## Coin Details

| Blockchain Name | Coin Name | Token Symbol | Decimals | Target Blocktime |
| :-------------: | :-------: | :----------: | :------: | :--------------: |
|   Metrix Coin   |  Metrix   |     MRX      |    8     |       90s        |

---
sidebar_position: 1
title: About the Metrix LGP
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# About the Metrix LGP

The Metrix Liquid Governance Protocol (LGP) leverages the MetrixCoin Decentralized Governance Protocol (DGP) to enable MRX holders to create Liquid Governance positions by providing <Highlight color="#bf96c6">**MRX**</Highlight> which is used as collateral to enroll AutoGovernor smart contracts into the MetrixCoin DGP.

These AutoGovernors ensure that 20% royalties are paid to the corresponding g token holder and that the built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool always has a regular stream of <Highlight color="#bf96c6">**MRX**</Highlight> rewards. When g tokens are burned, the AutoGovernor attached to it is destroyed and the <Highlight color="#bf96c6">**MRX**</Highlight> collateral is injected into the built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool.

The primary objective of the Metrix LGP is to create a way to instantly gain access to liquidity while still maintaining governing rights in the MetrixCoin DGP.

## Minting <Highlight color="#bf96c6">g</Highlight> and <Highlight color="#bf96c6">gMRX</Highlight>

Minters deposit the required <Highlight color="#bf96c6">**MRX**</Highlight> collateral needed to create a new AutoGovernor and mint both <Highlight color="#bf96c6">**Gov (g)**</Highlight> and <Highlight color="#bf96c6">**Liquid Governance Metrix (gMRX)**</Highlight>

Upon collateral deposit, both a <Highlight color="#bf96c6">**g**</Highlight> token and <Highlight color="#bf96c6">**gMRX**</Highlight> tokens are issued the the contract caller. AutoGovernor smart contracts ensure that <Highlight color="#bf96c6">**g**</Highlight> holder 20% royalties are paid, and that the liquidity pool has a continuous steam of <Highlight color="#bf96c6">**MRX**</Highlight>.

The <Highlight color="#bf96c6">**g**</Highlight> token is used to allow the holder to control the duration which they will hold their Liquid Governance position and to participate in on-chain governance via the MetrixCoin DGP.

The <Highlight color="#bf96c6">**gMRX**</Highlight> token are used to allow the minter access to liquidity instantly, which would otherwise only exist as locked <Highlight color="#bf96c6">**MRX**</Highlight> collateral in the DGP, or fully or partially unavailable due to the way staking works.

## Built in Liquidity Pool

A built in liquidity pool is built into the protocol so that <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**MRX**</Highlight> can be freely traded as long as there is liquidity provided to the pool. Trades have a `0.3%` trading fee applied to the output token, which goes directly into the liquidity pool as an incentive for providers. Additionally `80%` of the Metrix DGP rewards for each AutoGovernor within the protocol is injected into the pool every 1920 blocks, or roughly 2 days.

The liquidity pool has a built in burn mechanism meant to deflate the supply of <Highlight color="#bf96c6">**gMRX**</Highlight> over time. Allowing burning of <Highlight color="#bf96c6">**gMRX**</Highlight> at the current exchange rate in exchange for <Highlight color="#bf96c6">**wMRX**</Highlight> held within the pool.

:::info

## There is NO customer support for Metrix LGP.

**If you're experiencing issues,**

- First check the [troubleshooting page](/troubleshooting) for your error code and possible solutions.
- If you can't find a solution, try reaching out in the [MetrixCoin Discord](https://discord.com/invite/drp7Rc6NMB).

:::

:::warning
Admins will **NEVER** send you a direct message. If anybody approaches you directly on e.g. Discord pretending to represent customer support, please block them and report as spam.
:::

:::warning
**NEVER**, under any situation, should you ever give someone your private key or recovery phrases. Immediately block and report anyone that asks for them.
:::

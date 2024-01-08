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

These AutoGovernors ensure that 20% royalties are paid to the corresponding g token holder and that the built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool always has a regular stream of <Highlight color="#bf96c6">**MRX**</Highlight> rewards. When g tokens are burned, the AutoGovernor attached to it is destroyed and the <Highlight color="#bf96c6">**MRX**</Highlight> collateral is injected intol the built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool.

The primary objective of the Metrix LGP is to create a way to instantly gain access to liquidity while still maintaining governing rights in the MetrixCoin DGP.

## Minting <Highlight color="#bf96c6">g</Highlight> and <Highlight color="#bf96c6">gMRX</Highlight>

Minters deposit the required <Highlight color="#bf96c6">**MRX**</Highlight> collateral needed to create a new AutoGovernor and mint both <Highlight color="#bf96c6">**Gov (g)**</Highlight> and <Highlight color="#bf96c6">**Liquid Governance Metrix (gMRX)**</Highlight>

Upon collateral deposit, both a <Highlight color="#bf96c6">**g**</Highlight> token and <Highlight color="#bf96c6">**gMRX**</Highlight> tokens are issued the the contract caller. AutoGovernor smart contracts ensure that <Highlight color="#bf96c6">**g**</Highlight> holder 20% royalties are paid, and that the liquidity pool has a continuous steam of <Highlight color="#bf96c6">**MRX**</Highlight>.

The <Highlight color="#bf96c6">**g**</Highlight> token is used to allow the holder to control the duration which they will hold their Liquid Governance position and to participate in on-chain governance via the MetrixCoin DGP.

The <Highlight color="#bf96c6">**gMRX**</Highlight> token are used to allow the minter access to liquidity instantly, which would otherwise only exist as locked <Highlight color="#bf96c6">**MRX**</Highlight> collateral in the DGP, or fully or partially unavailable due to the way staking works.

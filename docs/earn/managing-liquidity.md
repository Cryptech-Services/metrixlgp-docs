---
sidebar_position: 2
title: Managing Liquidity
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# Managing Liquidity

Redeem LGP-LP tokens for the underlying assets in the pool.

## Adding Liquidity

When liqudity is added <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens are issued to the provider of the liquidity. The liquidity providers are able to earn more <Highlight color="#bf96c6">**gMRX**</Highlight> and/or <Highlight color="#bf96c6">**MRX**</Highlight> in the form of trading fees and Metrix DGP emissions.

## Removing Liquidity

Removing the liquidity is a process that involved redeeming <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens for the underlying <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool. <Highlight color="#bf96c6">**LGP-LP**</Highlight> is burned when redeemed.

## Locked Liquidity

Trading fees for swaps are **completely waived** for any liquidity provider with at least `1%` of the total supply of the <Highlight color="#bf96c6">**LGP-LP**</Highlight> token locked. In addition to this, qualifying liquidity lockers have the ability to burn and self liquidate their <Highlight color="#bf96c6">**gMRX**</Highlight> in exchange for <Highlight color="#bf96c6">**MRX**</Highlight> from the pool.

### Lock Action Cooldowns

Liquidity lock actions have a `cooldown` period of 960 blocks or roughly 24 hours. Locked <Highlight color="#bf96c6">**LGP-LP**</Highlight> can be added or removed at any time the `cooldown` is not in effect.

:::tip

## Burning <Highlight color="#bf96c6">**gMRX**</Highlight>

There may be cases where a liquidity provider with locked liqudity <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens or a <Highlight color="#bf96c6">**g**</Highlight> hodler wants to liquidate some or all of their <Highlight color="#bf96c6">**gMRX**</Highlight> tokens.

In this case that at least **`50%`** of the total supply of <Highlight color="#bf96c6">**gMRX**</Highlight> is in the liquidity pool, they may call `burnAndRelease` to burn <Highlight color="#bf96c6">**gMRX**</Highlight> at the market rate in exchange for <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool.

### How to Qualify

- **Hodl one or more <Highlight color="#bf96c6">g</Highlight> tokens**

- **Lock >= `1%` <Highlight color="#bf96c6">LGP-LP</Highlight> total supply**

:::

---
sidebar_position: 1
title: Getting Started
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> Liquidity

Provide MRX and gMRX liquidity and earn trading fees and rewards.

Providers of liquidity mint <Highlight color="#bf96c6">**LGP-LP**</Highlight> which can be redeemed for the underlying <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> from the liquidity pool.

In addition to being provided as liquidity, <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> are injected into the pool from several sources and drives the value of <Highlight color="#bf96c6">**gMRX**</Highlight>.

## Liquidity Injections

### Trading Fees

**Fees for swaps are completely waived for any liquidity provider with at least `1%` of the total supply of the <Highlight color="#bf96c6">LGP-LP</Highlight> token locked.**

A `0.3%` trading fee is applied to all buys, taken from the output of the swap.

When <Highlight color="#bf96c6">**gMRX**</Highlight> is purchased `0.3%` of the <Highlight color="#bf96c6">**gMRX**</Highlight> is sent to the pool.

When <Highlight color="#bf96c6">**wMRX**</Highlight> is purchased `0.3%` of the <Highlight color="#bf96c6">**wMRX**</Highlight> is sent to the pool.

### Flash Loan Fees

Flash loan fees from loans of <Highlight color="#bf96c6">**gMRX**</Highlight> have a `1%` fee applied to them. When the loan is returned the <Highlight color="#bf96c6">**gMRX**</Highlight> loan amount is burned and the fee is sent to the pool.

### AutoGovernor Rewards

80% of the rewards from each of the AutoGovernors is automatically injected into the pool every 1920 blocks, roughly every 2 days.

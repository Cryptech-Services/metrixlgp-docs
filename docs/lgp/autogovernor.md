---
sidebar_position: 2
title: AutoGovernor
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# AutoGovernor

AutoGovernors are semi-autonomous participants in the Metrix DGP.

Governors are addresses which have deposited <Highlight color="#bf96c6">**MRX**</Highlight> as collateral into the Metrix DGP. Governors receive voting rights and a regular reward for maintaining their position. At least once every 28800 blocks, roughly every 30 days, governors are required to propose or vote on a proposal or to call the `ping()` method on the Metrix DGP's Governance contract.

AutoGovernors do away with the need to directly participate by automatically calling the `ping()` method if there was no vote made in the 30 day period. Additionally the AutoGovernor routes it's <Highlight color="#bf96c6">**MRX**</Highlight> rewards to it's owner.

## Usage in the Metrix LGP

In the case of the Metrix LGP, the LiquidGovernance contract is the owner of every AutoGovernor enrolled through it. The LiquidGovernance contract allows the owner of a specific <Highlight color="#bf96c6">**g**</Highlight> token authority over the AutoGovernor. When rewards are received by the LiquidGovernance contract they are distribued a 20% to the <Highlight color="#bf96c6">**g**</Highlight> token holder abd 80% to the Metrix LGP liquidity pool.

## Migrations

In the case that the Metrix DGP is upgraded in the future, a migration mechanism is built into the contracts which will allow migrations only be done if 90% of the supply of <Highlight color="#bf96c6">**gMRX**</Highlight> is locked to support the migration.

## Contract Details

### Sourcecode

```js

```

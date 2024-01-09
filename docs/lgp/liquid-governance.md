---
sidebar_position: 1
title: LiquidGovernance
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# LiquidGovernance

The LiquidGovernance contract is the core of the Metrix LGP.

## LiquidGovernance Contract

The LiquidGovernance contract is the main public facing contract which allows participants to interact with the Metrix LGP. In exchange for depositing <Highlight color="#bf96c6">**MRX**</Highlight> collateral used to enroll an AutoGovernor in the Metrix DGP, both a <Highlight color="#bf96c6">**g**</Highlight> token and an equivalent amount of <Highlight color="#bf96c6">**gMRX**</Highlight> as the amount of collateral provided is minted and issued to the depositor.

LiquidGovernance is address agnostic, and by holding a <Highlight color="#bf96c6">**g**</Highlight> token, a user or smart contract is able to maintain Metrix DGP governing rights over the corresponding AutoGovernor. Additionally the <Highlight color="#bf96c6">**g**</Highlight> token can be burned to unenroll the AutoGovernor and return the underlying <Highlight color="#bf96c6">**MRX**</Highlight> collateral back into the Metrix LGP liquidity pool.

## Migrations

In the case that the Metrix DGP is upgraded in the future, a migration mechanism is built into the contracts which will allow migrations only be done if 90% of the supply of <Highlight color="#bf96c6">**gMRX**</Highlight> is locked to support the migration.

## Contract Details

### Contract Address

- **`TestNet`** - [**`0000000000000000000000000000000000000000`**](https://testnet-explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```js

```

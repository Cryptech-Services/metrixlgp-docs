---
sidebar_position: 8
title: Troubleshooting
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

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

## General

| Revert Message | Description                                                          | Solution                      |
| :------------- | :------------------------------------------------------------------- | :---------------------------- |
| Revert         | The contract call reverted with no reason given.                     | Check gaslimit and all inputs |
| OutOfGas       | The contract call exceeded the gaslimit spcified in the transaction. | Increase gaslimit             |

## LiquidGovernance

### Create Governor

| Revert Message                                                 | Description                                                                                 |
| :------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| LiquidGovernance: Invalid collateral                           | Collateral must match **exactly** the required collateral for the Metrix DGP.               |
| LiquidGovernance: Failed to transfer funds to the AutoGovernor | An internal error occurred and the funds we not able to be transferred to the AutoGovernor. |
| LiquidGovernance: Insufficient funding                         | The AutoGovenor did not have sufficent funding to enroll in the Metrix DGP.                 |

### Ping, Unenroll, Proposals, Voting

| Revert Message                                  | Description                                       |
| :---------------------------------------------- | :------------------------------------------------ |
| LiquidGovernance: Governor does not exist       | The zero address was provided for an AutoGovernor |
| LiquidGovernance: Token does not exist          | The token doesn't exist or has been burned        |
| LiquidGovernance: Only executable by the holder | Only the owner of a token can call this method    |

## Pool

### Swap

| Revert Message                      | Description                                                        | Solution                                                         |
| :---------------------------------- | :----------------------------------------------------------------- | :--------------------------------------------------------------- |
| Pool: Amount must be greater than 0 | Input amount for swap must be at least 1 satoshi                   | Increase the input amount of the trade                           |
| Pool: Same token swap not supported | Both tokens had the same address                                   | Check the token addresses used in the transaction                |
| Pool: Invalid fromToken             | Only gMRX and wMRX are valid tokens in the pool                    | Check the input token address used in the transaction            |
| Pool: Invalid toToken               | Only gMRX and wMRX are valid tokens in the pool                    | Check the output token address used in the transaction           |
| Pool: Empty pool                    | The pool does not have any liquidity to facilitate trading         | Liquidity must be added to the pool before trading can resume    |
| Pool: Output is below minimum       | The output was lower than the minimum specified in the transaction | Specify a lower output amount and/or increase slippage tolerance |
| Pool: Insufficient output amount    | The output amount must be greater than 0                           | Increase trade size                                              |
| Pool: Slippage tolerance exceeded   | The price impact was higher than specified in the trasaction       | Increase slippage tolerance                                      |
| Pool: Slippage exceeded 50%         | Price impact exceeds 50% which is the pool maximum                 | Decrease trade size                                              |
| Pool: Failed to transfer            | Failed to transfer the output tokens                               |                                                                  |
| Pool: Failed to transferFrom        | Failed to transfer the input tokens                                | Check token approvals and balances                               |

### Add Liquidity

| Revert Message                       | Description                                                        | Solution                                                            |
| :----------------------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------ |
| Pool: Amounts must be greater than 1 | At least 1 MRX/wMRX and 1 gMRX must be added                       | Increase the input tokens amounts                                   |
| Pool: Slippage exceeded 50%          | Price impact exceeds 50% which is the pool maximum                 | Balance the input tokens amounts                                    |
| Pool: Slippage tolerance exceeded    | Price impact exceeds 1% which would be treated as a trade          | Increase slippage tolerance and/or balance the input tokens amounts |
| Pool: Output is below minimum        | The output was lower than the minimum specified in the transaction | Check input tokens amounts                                          |
| Pool: Invalid resulting lpAmount     | The resulting LP amount must be greater than 0                     | Increase the input tokens amounts                                   |
| Pool: Failed to transferFrom gMRX    | Failed to transfer the input gMRX                                  | Check token approvals and balances                                  |
| Pool: Failed to transferFrom wMRX    | Failed to transfer the input wMRX                                  | Check token approvals and balances                                  |

### Remove Liquidity

| Revert Message                                      | Description                           | Solution                             |
| :-------------------------------------------------- | :------------------------------------ | :----------------------------------- |
| Amount of LGP-LP must be greater than 0             | Must remove more than 0 LGP-LP        | Increase amount of liquidity removed |
| Pool: Total supply of LGP-LP must be greater than 0 | Some LGP-LP must exist                |                                      |
| Pool: Outputs must be greater than 0                | Output amounts must be greater than 0 | Increase amount of liquidity removed |
| Pool: Failed to transferFrom LPG-LP                 | Failed to transfer input LGP-LP       | Check token approvals and balances   |
| Pool: Failed to remove gMRX                         | Failed to transfer output gMRX        |                                      |
| Pool: Failed to remove MRX                          | Failed to transfer output MRX         |                                      |
| Pool: Failed to remove wMRX                         | Failed to transfer output wMRX        |                                      |

### Locking/Unlocking LGP-LP

| Revert Message                                      | Description                              | Solution                              |
| :-------------------------------------------------- | :--------------------------------------- | :------------------------------------ |
| Pool: Cooldown in effect                            | Lock actions have a 960 block cooldown   | Wait until the cooldown has completed |
| Pool: Total supply of LGP-LP must be greater than 0 | Some LGP-LP must exist                   |                                       |
| Pool: Amount of LGP-LP must be greater than 0       | Must lock more than 0 LGP-LP             | Increase amount of LGP-LP             |
| Pool: Failed to transfer LGP-LP                     | Failed to remove LGP-LP from lock        |                                       |
| Pool: Failed to transferFrom LGP-LP                 | Failed to add LGP-LP from lock           | Check token approvals and balances    |
| Pool: Amount exceeds currently locked LGP-LP        | Cannot remove more LGP-LP than is locked |                                       |

### Burn And Release

| Revert Message                                                    | Description                                                                       | Solution                                                         |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| Pool: Lock LP or hodl g                                           | Only available to g holders and LP lockers of at least 1% of the supply of LGP-LP | Mint Gov or lock LGP-LP                                          |
| Pool: Amount must be greater than 0                               | Amount gMRX burned must be greater than 0                                         | Increase burn size                                               |
| Pool: One or more paired tokens empty                             | Both gMRX and wMRX must exist in the pool to burn                                 | Liquidity must be added to the pool before burning can resume    |
| Pool: Burn amount must be less than or equal pooled gMRX and wMRX | Burn amount cannot exceed either balance of gMRX or wMRX                          | Decrease burn size                                               |
| Pool: Reserve gMRX needs to be at least 50% of the totalSupply    | At least 50% of the existing gMRX must be in the pool                             | gMRX must be added to the pool before burning can resume         |
| Pool: Empty pool                                                  | The pool does not have any liquidity to facilitate trading                        | Liquidity must be added to the pool before burning can resume    |
| Pool: Output is below minimum                                     | The output was lower than the minimum specified in the transaction                | Specify a lower output amount and/or increase slippage tolerance |
| Pool: Output MRX must be greater than 0                           | The output amount must be greater than 0                                          | Increase burn size                                               |
| Pool: Slippage exceeded 25%                                       | Price impact exceeds 25% which is the maximum for burns                           | Decrease burn size                                               |
| Pool: Failed to transferFrom gMRX                                 | Failed to transfer gMRX to the pool for burning                                   | Check token approvals and balances                               |
| Pool: Failed to remove MRX                                        | Failed to transfer output MRX                                                     |                                                                  |
| Pool: Failed to remove wMRX                                       | Failed to transfer output wMRX                                                    |                                                                  |

---
sidebar_position: 5
title: LG-LP - LiquidGovernance-LP
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# LG-LP - LiquidGovernance-LP

A token for liquidity providers which can be redeemed for the liquidity.

:::tip

## Trading Fee Waiver For LP Locks

<Highlight color="#bf96c6">**LGP-LP**</Highlight> can be locked or unlocked in the liquidity pool. Liquidity locking actions have a cooldown of 960 blocks, roughly 24 hours.

When an address has locked at least `1%` of the total supply of <Highlight color="#bf96c6">**LGP-LP**</Highlight> they will become exempt from trading fees for swaps.

:::

## Issuance

LGP-LP is minted when <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> are added to the liquidity pool. Whenever a liquidity provider wants to exit their position, they can be redeemed for the underlying <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> in the liquidity pool.
Calculate `newReserveMRX` by adding `amountMRX` to the current `reserveMRX`, and `newReserveGMRX` by adding `amountGMRX` to the current `reserveGMRX`. Compute the square root of the product of `newReserveMRX` and `newReserveGMRX` as `sqrtK`.

If the total supply is equal to 0, then the number of <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens `lpAmount` is set to `sqrtK` (initial LP tokens based on the square root of the product).

Otherwise, if there is a total supply, calculate the <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens `lpAmount` by taking the total supply of <Highlight color="#bf96c6">**LGP-LP**</Highlight>, multiplying it by the difference between `sqrtK` and the square root of the product of the current reserves `reserveMRX` and `reserveGMRX`, and dividing the result by the square root of the product of the current reserves.

$$
\begin{align*}
    \text{newReserveMRX} &= \text{reserveMRX} + \text{amountMRX} \\
    \text{newReserveGMRX} &= \text{reserveGMRX} + \text{amountGMRX} \\
    \text{sqrtK} &= \sqrt{\text{newReserveMRX} \times \text{newReserveGMRX}} \\~\\
    \text{lpAmount} &=
    \begin{cases}
        \text{sqrtK}, & \text{if } \text{totalSupply} = 0 \\
        \frac{\text{totalSupply} \times (\text{sqrtK} - \sqrt{\text{reserveMRX} \times \text{reserveGMRX}})}{\sqrt{\text{reserveMRX} \times \text{reserveGMRX}}}, & \text{otherwise}
    \end{cases}
\end{align*}
$$

## Redemption

<Highlight color="#bf96c6">**LGP-LP**</Highlight> can be used to redeem the underlying <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> in the liquidity pool.

The redemption rate for <Highlight color="#bf96c6">**LGP-LP**</Highlight> is based on the current reserves of <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> as well as the total supply of <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens.

$$
\large\text{amountMRX} =  \frac{{\text{amountLP} \times \text{poolMRX}}}{{\text{totalSupplyLP}}}
$$

$$
\large\text{amountGMRX} = \frac{{\text{amountLP} \times \text{poolGMRX}}}{{\text{totalSupplyLP}}}
$$

## Token Details

|     Token Name      | Token Symbol | Decimals |
| :-----------------: | :----------: | :------: |
| LiquidGovernance LP |    LGP-LP    |    18    |

## Contract Details

### Contract Address

- **`TestNet`** - [**`e786c947bdee4d4d30b5720aa1c470582c4b3132`**](https://testnet-explorer.metrixcoin.com/contract/e786c947bdee4d4d30b5720aa1c470582c4b3132)
- **`MainNet`** - [**`a9b1fe0c80d0fd3e71a8fa621e8739f02481f2a9`**](https://explorer.metrixcoin.com/contract/a9b1fe0c80d0fd3e71a8fa621e8739f02481f2a9)

### Sourcecode

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract LiquidityProvider is ERC20, ERC20Burnable, Ownable {
    constructor(address _mns) ERC20("LiquidGovernance-LP", "LGP-LP") {
        ReverseRegistrar registrar = ReverseRegistrar(
            MNS(_mns).owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Metrix LGP:LiquidGovernance-LP (LGP-LP)");
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual override {
        _burn(_msgSender(), amount);
    }
}
```

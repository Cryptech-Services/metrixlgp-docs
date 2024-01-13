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

LGP-LP is minted when <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> are added to the liquidity pool. Whenever a liquidity provider wants to exit their position, they can be redeemed for the underlying <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> in the liquidity pool.

## Contract Details

### Contract Address

- **`TestNet`** - [**`0000000000000000000000000000000000000000`**](https://testnet-explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract LiquidityProvider is ERC20, ERC20Burnable, Ownable {
    constructor(address _mns) ERC20("LiquidGovernance-LP", "LG-LP") {
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

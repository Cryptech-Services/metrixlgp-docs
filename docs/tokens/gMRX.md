---
sidebar_position: 2
title: gMRX - Liquid Governor Metrix
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

export const Image = ({src}) => (
<img src='/img/logo-gmrx-white.png' style={{width: '48px',height : '48px'}} />
);

# <Image  /> gMRX - Liquid Governor Metrix

<Highlight color="#bf96c6">**Liquid Governor Metrix**</Highlight> allows illiquid DGP collateral to become liquid.

## Minting

<Highlight color="#bf96c6">**gMRX**</Highlight> is minted and issued to the minter of a <Highlight color="#bf96c6">**Gov**</Highlight> token.

## Burning

## Trading

## Providing Liquidity

## Contract Details

### Contract Address

- **`TestNet`** - [**`0000000000000000000000000000000000000000`**](https://testnet-explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract LiquidGovernorMRX is ERC20, ERC20Burnable, Ownable, ERC20FlashMint {
    constructor() ERC20("Liquid Governor Metrix", "gMRX") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    /**
     * @dev Returns the fee applied when doing flash loans. This
     * implementation has a 1% fee.
     * @param token The token to be flash loaned.
     * @param amount The amount of tokens to be loaned.
     * @return The fees applied to the corresponding flash loan.
     */
    function _flashFee(
        address token,
        uint256 amount
    ) internal view virtual override returns (uint256) {
        // silence warning about unused variable without the addition of bytecode.
        token;
        return amount / 100;
    }

    /**
     * @dev Returns the receiver address of the flash fee. This
     * implementation returns the owner() which is the LiquidGovernance contract.
     * @return The address for which the flash fee will be sent to.
     */
    function _flashFeeReceiver()
        internal
        view
        virtual
        override
        returns (address)
    {
        return address(owner());
    }
}


```

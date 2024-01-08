---
sidebar_position: 3
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

### Providing MRX Collateral

<Highlight color="#bf96c6">**gMRX**</Highlight> is minted and issued to the minter of a <Highlight color="#bf96c6">**Gov**</Highlight> token.

### Flash Loans

A flash loan is a type of uncollateralized loan that lets a user borrow assets with no upfront collateral as long as the borrowed assets are paid back within the same blockchain transaction.

Flash loans can be utilized to mint gMRX so long as the loan and the fee are paid back in the same transacion. Any gMRX generated through a flash loan is burned after repaid.

## Burning

<Highlight color="#bf96c6">**gMRX**</Highlight> can be redeemed and is burned in exchange for <Highlight color="#bf96c6">**MRX**</Highlight>.

### Redemption Rate

The rate of this redemption is calculated based on the amount of <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**MRX**</Highlight> liquidity available in the liquidity pool.

$\text{amountMRX} = \frac{{\text{burnAmount} \times \left(\frac{{\text{poolMRX} \times 10^8}}{{\text{poolGMRX}}}\right)}}{{10^8}}$

## Providing Liquidity

A built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool is provided. All trading fees and 80% of the AutoGovernor rewards are injected into the pool, increasing the amount of <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> that the <Highlight color="#bf96c6">**LGP-LP**</Highlight> can be redeemed for.

### LGP-LP Rate

The rate of <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens issued for liquidity is dependent on the current balances of the liquidity pool. Should the adding of liquidity exceed a 1% price slippage threshold, it will be treated as a trade and a 0.3% trading fee will be incurred.

$\text{amountLP} = \frac{{\text{totalSupply} \times \left(\sqrt{\text{newBalanceMRX} \times \text{newBalanceGMRX}} - \sqrt{\text{balanceMRX} \times \text{balanceGMRX}}\right)}}{\sqrt{\text{balanceMRX} \times \text{balanceGMRX}}}$

## Trading

<Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**MRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> can be traded directly through the built in liquidity pool.

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

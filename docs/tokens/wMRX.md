---
sidebar_position: 4
title: wMRX - Wrapped Metrix
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# wMRX - Wrapped Metrix

<Highlight color="#bf96c6">**Wrapped Metrix**</Highlight> is an MRC20 copatible wrapped version of Metrix.

## Minting

<Highlight color="#bf96c6">**wMRX**</Highlight> can be minted by either sending <Highlight color="#bf96c6">**MRX**</Highlight> to the contract, or by calling the `deposit()` method on the contract.

## Burning

<Highlight color="#bf96c6">**wMRX**</Highlight> can be burned and withdrawn to <Highlight color="#bf96c6">**MRX**</Highlight> at a 1:1 ration by calling the `withdraw(uint amount)` method on the contract.

## Contract Details

### Contract Address

- **`TestNet`** - [**`e91054ec53104ad1cd5def66abc49857736b919d`**](https://testnet-explorer.metrixcoin.com/contract/e91054ec53104ad1cd5def66abc49857736b919d)
- **`MainNet`** - [**`b2bda71ecb4eebe461ab0d4f6c0d1acdaf50f27b`**](https://explorer.metrixcoin.com/contract/b2bda71ecb4eebe461ab0d4f6c0d1acdaf50f27b)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract WrappedMetrix is ERC20, ERC20Burnable {
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor() ERC20("Wrapped Metrix", "wMRX") {}

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balanceOf(msg.sender) >= amount);
        _burn(_msgSender(), amount);
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "WrappedMetrix: Failed to send MRX");
        emit Withdrawal(msg.sender, amount);
    }
}
```

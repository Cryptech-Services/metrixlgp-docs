---
sidebar_position: 2
title: wMRX - Wrapped Metrix
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

export const Image = ({src}) => (
<img src='/img/logo-wmrx-white.png' style={{width: '48px',height : '48px'}} />
);

# <Image  /> wMRX - Wrapped Metrix

<Highlight color="#bf96c6">**Wrapped Metrix**</Highlight> is an MRC20 compatible wrapped version of Metrix.

## Minting

<Highlight color="#bf96c6">**wMRX**</Highlight> can be minted by either sending <Highlight color="#bf96c6">**MRX**</Highlight> to the contract, or by calling the `deposit()` method on the contract.

## Burning

<Highlight color="#bf96c6">**wMRX**</Highlight> can be burned and withdrawn to <Highlight color="#bf96c6">**MRX**</Highlight> at a 1:1 ration by calling the `withdraw(uint amount)` method on the contract.

## Contract Details

### Contract Address

- **`TestNet`** - [**`6573e5f357196d34ca11e54745d1ff09a72e4bb9`**](https://testnet-explorer.metrixcoin.com/contract/6573e5f357196d34ca11e54745d1ff09a72e4bb9)
- **`MainNet`** - [**`71dc6fef381bb9cb379b8870289c2d06b32b0ad6`**](https://explorer.metrixcoin.com/contract/71dc6fef381bb9cb379b8870289c2d06b32b0ad6)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract WrappedMetrix is ERC20, ERC20Burnable {
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor(address _mns) ERC20("Wrapped Metrix", "wMRX") {
        ReverseRegistrar registrar = ReverseRegistrar(
            MNS(_mns).owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Wrapped Metrix (wMRX)");
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        if (msg.value > 0) {
            _mint(msg.sender, msg.value);
            emit Deposit(msg.sender, msg.value);
        }
    }

    function withdraw(uint amount) public {
        require(amount > 0, "WrappedMetrix: Amount must be greater than 0");
        require(
            balanceOf(msg.sender) >= amount,
            "WrappedMetrix: Amount exceeds balance"
        );
        _burn(_msgSender(), amount);
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "WrappedMetrix: Failed to send MRX");
        emit Withdrawal(msg.sender, amount);
    }
}

```

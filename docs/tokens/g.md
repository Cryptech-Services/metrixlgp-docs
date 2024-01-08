---
sidebar_position: 4
title: g - Gov
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

export const Image = ({src}) => (
<img src='/img/logo-g-white.png' style={{width: '48px',height : '48px'}} />
);

# <Image  /> g - Gov

<Highlight color="#bf96c6">**Gov**</Highlight> token entitles it's holder to govern and a 20% royalty.

This reward comes in the form of <Highlight color="#bf96c6">**wMRX**</Highlight> every 1920 blocks (roughly every 48 hours) where the remaining 80% will be injected into the built in liquidity pool of the Metrix LGP.

## Minting

<Highlight color="#bf96c6">**Gov**</Highlight> can be minted by providing the required Metrix DGP collateral in <Highlight color="#bf96c6">**MRX**</Highlight>. Additionally the corresponding amount of <Highlight color="#bf96c6">**gMRX**</Highlight> is minted and issued to the minter of the <Highlight color="#bf96c6">**Gov**</Highlight> token.

## Burning

<Highlight color="#bf96c6">**g**</Highlight> tokens are burnable which will unenroll the corresponding AutoGovernor, returning it's MRX collateral to the built in <Highlight color="#bf96c6">**wMRX**</Highlight>/<Highlight color="#bf96c6">**gMRX**</Highlight> liquidity pool.

## Governing

Rights for both creation of and voting on both Budget and DGP proposals are maintained by the <Highlight color="#bf96c6">**g**</Highlight> token holder.

## Royalties

A **20% royalty is taken from every AutoGovernor reward** which corresponds to the specific <Highlight color="#bf96c6">**g**</Highlight> token held by an address. Rewards are automatically distributed in the form of wMRX every 1920 blocks or roughly every 48 hours.

## Contract Details

### Contract Address

- **`TestNet`** - [**`0000000000000000000000000000000000000000`**](https://testnet-explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Gov is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    constructor() ERC721("Gov", "g") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

```

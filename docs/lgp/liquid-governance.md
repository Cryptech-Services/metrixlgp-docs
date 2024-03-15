---
sidebar_position: 2
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

## Creating AutoGovernors

AutoGovernors are semi-autonomous smart contract governors participating in the Metrix DGP. Control over the release of the collateral to the built in liquidity pool as well as voting rights is maintained by the holder of the <Highlight color="#bf96c6">**g**</Highlight> token which has a tokenId of the AutoGovernor's contract address. This allows ownership over the <Highlight color="#bf96c6">**g**</Highlight> token to be easily transferred and/or traded.

## Handling DGP Rewards

The LiquidGovernance handles all incoming funds and routes `20%` of rewards from AutoGovernors to the corresponding <Highlight color="#bf96c6">**g**</Highlight> token holder, routing the remaining `80%` into the built in liquidity pool.

## Contract Details

### Contract Address

- **`TestNet`** - [**`490db059bf60321e2d8c611c12dac1028dda3438`**](https://testnet-explorer.metrixcoin.com/contract/490db059bf60321e2d8c611c12dac1028dda3438)
- **`MainNet`** - [**`614554e34dfb2b4e7383dcab7e0c40ae37910771`**](https://explorer.metrixcoin.com/contract/614554e34dfb2b4e7383dcab7e0c40ae37910771)

### Sourcecode

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Gov.sol";
import "./Pool.sol";
import "./WrappedMetrix.sol";
import "./AutoGovernor.sol";
import "./LiquidGovernorMRX.sol";
import "./factory/IAutoGovernorFactory.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract LiquidGovernance is IAutoGovernorFactory {
    address public mns;
    address public governance;
    address public immutable g;
    address public immutable gmrx;
    address public immutable mrx;
    address public immutable pool;

    constructor(address _governance, address _mrx, address _mns) {
        governance = _governance;
        address _gmrx = address(new LiquidGovernorMRX(_mns));
        gmrx = _gmrx;
        mrx = _mrx;
        address _g = address(new Gov(_mns));
        g = _g;
        pool = address(new Pool(_mrx, _gmrx, _g, _mns));
        mns = _mns;
        ReverseRegistrar registrar = ReverseRegistrar(
            MNS(mns).owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Metrix LGP");
    }

    modifier onlyHolder(address autoGovernor) {
        uint256 tokenId = uint256(uint160(autoGovernor));
        try Gov(g).ownerOf(tokenId) returns (address owner) {
            require(msg.sender == owner, "LiquidGovernance: Only executable by the holder");
        } catch {
            revert("LiquidGovernance: Token does not exist");
        }
        _;
    }

    fallback() external payable {
        if (msg.value > 0) {
            uint256 tokenId = uint256(uint160(msg.sender));
            try Gov(g).ownerOf(tokenId) returns (address owner) {
                if (owner != address(0)) {
                    (
                        uint256 blockHeight,
                        ,
                        uint256 collateral,
                        ,

                    ) = Governance(governance).governors(msg.sender);
                    if (blockHeight > 0 && collateral > 0) {
                        uint256 govAmt = (msg.value * 20) / 100;
                        WrappedMetrix token = WrappedMetrix(payable(mrx));
                        token.deposit{value: msg.value}();
                        token.transfer(pool, msg.value - govAmt);
                        token.transfer(owner, govAmt);
                    } else {
                        WrappedMetrix token = WrappedMetrix(payable(mrx));
                        token.deposit{value: msg.value}();
                        token.transfer(pool, msg.value);
                    }
                } else {
                    WrappedMetrix token = WrappedMetrix(payable(mrx));
                    token.deposit{value: msg.value}();
                    token.transfer(pool, msg.value);
                }
            } catch {
                WrappedMetrix token = WrappedMetrix(payable(mrx));
                token.deposit{value: msg.value}();
                token.transfer(pool, msg.value);
            }
        }
    }

    receive() external payable {
        if (msg.value > 0) {
            uint256 tokenId = uint256(uint160(msg.sender));
            try Gov(g).ownerOf(tokenId) returns (address owner) {
                if (owner != address(0)) {
                    (
                        uint256 blockHeight,
                        ,
                        uint256 collateral,
                        ,

                    ) = Governance(governance).governors(msg.sender);
                    if (blockHeight > 0 && collateral > 0) {
                        uint256 govAmt = (msg.value * 20) / 100;
                        WrappedMetrix token = WrappedMetrix(payable(mrx));
                        token.deposit{value: msg.value}();
                        token.transfer(pool, msg.value - govAmt);
                        token.transfer(owner, govAmt);
                    } else {
                        WrappedMetrix token = WrappedMetrix(payable(mrx));
                        token.deposit{value: msg.value}();
                        token.transfer(pool, msg.value);
                    }
                } else {
                    WrappedMetrix token = WrappedMetrix(payable(mrx));
                    token.deposit{value: msg.value}();
                    token.transfer(pool, msg.value);
                }
            } catch {
                WrappedMetrix token = WrappedMetrix(payable(mrx));
                token.deposit{value: msg.value}();
                token.transfer(pool, msg.value);
            }
        }
    }

    function createGovernor() public payable override {
        uint256 requiredCollateral = DGP(Governance(governance).dgpAddress())
            .getGovernanceCollateral()[0];
        require(
            msg.value == requiredCollateral,
            "LiquidGovernance: Invalid collateral"
        );
        AutoGovernor governor = new AutoGovernor(governance, mns);

        (bool success, ) = payable(address(governor)).call{value: msg.value}(
            ""
        );
        require(
            success,
            "LiquidGovernance: Failed to transfer funds to the AutoGovernor"
        );

        require(
            payable(address(governor)).balance == requiredCollateral,
            "LiquidGovernance: Insufficient funding"
        );
        governor.enroll();
        Gov(g).safeMint(msg.sender, uint256(uint160(address(governor))));
        LiquidGovernorMRX(gmrx).mint(msg.sender, requiredCollateral);
        emit GovernorCreated(msg.sender, address(governor));
    }

    function ping(
        address governorAddress
    ) public override onlyHolder(governorAddress) {
        require(
            governorAddress != address(0),
            "LiquidGovernance: Governor does not exist"
        );
        AutoGovernor governor = AutoGovernor(payable(governorAddress));
        governor.ping();
        emit Pinged(governorAddress);
    }

    function unenroll(
        address governorAddress,
        bool /*force*/
    ) public override onlyHolder(governorAddress) {
        require(
            governorAddress != address(0),
            "LiquidGovernance: Governor does not exist"
        );
        Gov(g).burn(uint256(uint160(governorAddress)));
        AutoGovernor governor = AutoGovernor(payable(governorAddress));
        governor.unenroll(false);
        emit GovernorUnenrolled(governorAddress);
    }

    function startProposal(
        address governorAddress,
        string memory title,
        string memory description,
        string memory url,
        uint256 requested,
        uint8 duration
    ) public payable override onlyHolder(governorAddress) {
        require(
            governorAddress != address(0),
            "LiquidGovernance: Governor does not exist"
        );
        AutoGovernor governor = AutoGovernor(payable(governorAddress));
        governor.startProposal{value: msg.value}(
            title,
            description,
            url,
            requested,
            duration
        );
        emit ProposalStarted(governorAddress);
    }

    function voteForProposal(
        address governorAddress,
        uint8 proposalId,
        Budget.Vote vote
    ) public override onlyHolder(governorAddress) {
        require(
            governorAddress != address(0),
            "LiquidGovernance: Governor does not exist"
        );
        AutoGovernor governor = AutoGovernor(payable(governorAddress));
        governor.voteForProposal(proposalId, vote);
        emit ProposalVoted(governorAddress, proposalId);
    }

    function addProposal(
        address governorAddress,
        DGP.ProposalType proposalType,
        address proposalAddress
    ) public override onlyHolder(governorAddress) {
        require(
            governorAddress != address(0),
            "LiquidGovernance: Governor does not exist"
        );
        AutoGovernor governor = AutoGovernor(payable(governorAddress));
        governor.addProposal(proposalType, proposalAddress);
        emit ProposalAdded(governorAddress, proposalType, proposalAddress);
    }
}
```

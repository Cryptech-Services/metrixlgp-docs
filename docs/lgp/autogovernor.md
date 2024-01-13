---
sidebar_position: 2
title: AutoGovernor
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# AutoGovernor

AutoGovernors are semi-autonomous participants in the Metrix DGP.

Governors are addresses which have deposited <Highlight color="#bf96c6">**MRX**</Highlight> as collateral into the Metrix DGP. Governors receive voting rights and a regular reward for maintaining their position. At least once every 28800 blocks, roughly every 30 days, governors are required to propose or vote on a proposal or to call the `ping()` method on the Metrix DGP's Governance contract.

AutoGovernors do away with the need to directly participate by automatically calling the `ping()` method if there was no vote made in the 30 day period. Additionally the AutoGovernor routes it's <Highlight color="#bf96c6">**MRX**</Highlight> rewards to it's owner.

## Usage in the Metrix LGP

In the case of the Metrix LGP, the LiquidGovernance contract is the owner of every AutoGovernor enrolled through it. The LiquidGovernance contract allows the owner of a specific <Highlight color="#bf96c6">**g**</Highlight> token authority over the AutoGovernor. When rewards are received by the LiquidGovernance contract they are distribued a 20% to the <Highlight color="#bf96c6">**g**</Highlight> token holder abd 80% to the Metrix LGP liquidity pool.

## Contract Details

### Sourcecode

```js
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "./dgp/DGP.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract AutoGovernor is Ownable {
    address public governance;

    constructor(address _governance, address _mns) {
        governance = _governance;
        ReverseRegistrar registrar = ReverseRegistrar(
            MNS(_mns).owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Metrix LGP:AutoGovernor");
    }

    fallback() external payable {
        if (msg.value > 0 && msg.sender != owner()) {
            payable(owner()).call{value: msg.value}("");
        }
        if (msg.sender == governance) {
            (uint256 blockHeight, uint256 lastPing, , , ) = Governance(
                governance
            ).governors(address(this));
            if (blockHeight > 0 && block.number - lastPing >= 960 * 28) {
                Governance(governance).ping();
            }
        }
    }

    receive() external payable {
        if (msg.value > 0 && msg.sender != owner()) {
            payable(owner()).call{value: msg.value}("");
        }
        if (msg.sender == governance) {
            (uint256 blockHeight, uint256 lastPing, , , ) = Governance(
                governance
            ).governors(address(this));
            if (blockHeight > 0 && block.number - lastPing >= 960 * 28) {
                Governance(governance).ping();
            }
        }
    }

    function enroll() public onlyOwner {
        uint256 requiredCollateral = DGP(Governance(governance).dgpAddress())
            .getGovernanceCollateral()[0];
        require(
            payable(address(this)).balance >= requiredCollateral,
            "AutoGovernor: Insufficient collateral"
        );
        Governance(governance).enroll{value: requiredCollateral}();
    }

    function unenroll(bool force) public onlyOwner {
        Governance(governance).unenroll(force);
    }

    function ping() public onlyOwner {
        Governance(governance).ping();
    }

    function startProposal(
        string memory title,
        string memory description,
        string memory url,
        uint256 requested,
        uint8 duration
    ) public payable onlyOwner {
        Budget budget = Budget(Governance(governance).budgetAddress());
        budget.startProposal{value: msg.value}(
            title,
            description,
            url,
            requested,
            duration
        );
    }

    function voteForProposal(
        uint8 proposalId,
        Budget.Vote vote
    ) public onlyOwner {
        Budget budget = Budget(Governance(governance).budgetAddress());
        budget.voteForProposal(proposalId, vote);
    }

    function addProposal(
        DGP.ProposalType proposalType,
        address proposalAddress
    ) public onlyOwner {
        DGP dgp = DGP(Governance(governance).dgpAddress());
        dgp.addProposal(proposalType, proposalAddress);
    }
}
```

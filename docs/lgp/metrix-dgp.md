---
sidebar_position: 4
title: MetrixCoin DGP
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# MetrixCoin DGP

A Decentralized Governance Protocol built into the Metrix blockchain.

In exchange for locking <Highlight color="#bf96c6">**MRX**</Highlight> as collateral, governors receive <Highlight color="#bf96c6">**MRX**</Highlight> as a reward at the same rate as staking. Additionally governors have the ability to propose and vote on both DGP and Budget proposals.

MetrixCoin's Decentralized Governance Protocol is made up of 3 primary smart contracts which are named DGP, Governance and Budget. These contracts work together to allow the governors to propose and vote on both blockchain and budget proposals.

## DGP

The DGP contract uses a series of proxy smart contracts which provide the EVM gas schedule, block size, minimum gas price, block gas limit, transaction fee rates, governor collateral and budget fees.

## Governance

The Governance contract manages current governance membership status, governor collateral and rewards. Membership requires depositing <Highlight color="#bf96c6">**MRX**</Highlight> as collateral into this contract and will automatically remove inactive governors who have not proposed, voted or pinged within 28800 blocks or 30 days roughly.

## Budget

The Budget contract manages a budget of 10% of the staking and governor rewards which are settled, and either sent to any passed budgets or burned if no proposals passed.

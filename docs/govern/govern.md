---
sidebar_position: 3
title: Governing
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# Governing

Holders of <Highlight color="#bf96c6">**Gov**</Highlight> token may participate in the MetrixCoin DGP.

## DGP Proposals

DGP proposals allow the MetrixCoin governors to decide on the parameters of the blockchain.

### Creating

Once the AutoGovernor is mature (~30 days) and as long as 100 governors are enrolled into the Metrix DGP, DGP proposals can be created. EVM gas schedule, blocksize, minimum EVM gas price,EVM block gas limit, transaction fee rates, DGP collateral and budget fees are all available for proposal.

### Voting

Once the AutoGovernor is mature (~30 days) and as long as 100 governors are enrolled into the Metrix DGP, DGP proposals can be voted on. Once a proposal has passed the proxy contract is updated in the Metrix DGP's contract state.

## Budget Proposals

Budget proposals allow the MetrixCoin governors to decide on how the monthly MRX budget is spent.

### Creating

Budget proposals can be created at any time so long as the proposal fee (currently 600k <Highlight color="#bf96c6">**MRX**</Highlight>) is paid. Budget proposals created through the LGP are injected into the built in liquidity pool at the same rewards rate with `20%` going to the Gov token holder and `80%` going to the built in liquidity pool. This allows proposers to reclaim their budget fee in the case that it passes.

### Voting

Once the AutoGovernor is mature (~30 days) Budget proposals can be voted on.

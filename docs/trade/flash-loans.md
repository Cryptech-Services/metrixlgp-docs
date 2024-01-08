---
sidebar_position: 2
title: gMRX Flash Loans
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# gMRX Flash Loans

Create <Highlight color="#bf96c6">**gMRX**</Highlight> flash loans that are paid back in the same transaction.

## What are flash loans?

Flash loans, integral to decentralized finance (DeFi), offer borrowers instant, collateral-free access to substantial sums of <Highlight color="#bf96c6">**gMRX**</Highlight> within a single transaction. Alongside the borrowed amount, a 1% fee must be repaid to the lending protocol within the same transaction, compensating for the immediate and risk-free nature of these loans. This fee structure ensures the sustainability and security of the lending platforms facilitating these flash loan services.

## How do you use a flash loan?

First, a borrower initiates a smart contract to request a flash loan for a specific <Highlight color="#bf96c6">**gMRX**</Highlight> amount. Once borrowed, the funds are utilized for various purposes, such as arbitrage, liquidation, or other complex trading strategies. Importantly, the borrowed amount, including a fee, must be repaid within the same transaction, ensuring the loan's closure and minimizing the associated risk. This rapid borrowing and repayment within a single transaction window distinguish flash loans and their usage within the DeFi ecosystem.

## What happens if the loan is not repaid?

If a borrower fails to repay the loan and its associated fee within the same transaction, the entire transaction is reverted or rolled back by the <Highlight color="#bf96c6">**gMRX**</Highlight> smart contract.

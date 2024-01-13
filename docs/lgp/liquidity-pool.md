---
sidebar_position: 3
title: Liquidity Pool
---

export const Highlight = ({children, color}) => (
<span
style={{color}}>
{children}
</span>
);

# Liquidity Pool

A built in liquidity pool for trading MRX and gMRX.

## Trading

The liquidity pool provides methods for trading between <Highlight color="#bf96c6">**MRX**</Highlight> or <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight>. Optionally traders have the ability to unwrap the <Highlight color="#bf96c6">**wMRX**</Highlight> received into <Highlight color="#bf96c6">**MRX**</Highlight> at a rate of 1:1 if desired.

### Trading Rate

The rate of trades are calculated based on the amount of <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> liquidity available in the liquidity pool.

$\large\text{amountTo} = \text{amountFrom} \times \frac{{\text{poolTo}}}{{\text{poolFrom}}}$

## Providing Liquidity

Providing <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> as liquidity will mint the provider <Highlight color="#bf96c6">**LGP-LP**</Highlight> which is the pools liquidity provider token. These tokens can be redeemed for the underlying <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> in the pool.

## Removing Liqudidty

Removing the liquidity is a process that involved redeeming <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens for the underlying <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool. <Highlight color="#bf96c6">**LGP-LP**</Highlight> is burned when redeemed.

## Burning gMRX

There is a built in mechanism for burning <Highlight color="#bf96c6">**gMRX**</Highlight> which allows any <Highlight color="#bf96c6">**gMRX**</Highlight> holder to burn <Highlight color="#bf96c6">**gMRX**</Highlight> at the market rate removing <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool. Optionally <Highlight color="#bf96c6">**MRX**</Highlight> can be unwrapped to <Highlight color="#bf96c6">**MRX**</Highlight> during the burn.

### Redemption Rate

$\large\text{amountMRX} = \text{burnGMRX} \times \frac{{\text{poolMRX}}}{{\text{poolGMRX}}}$

## Liquidity Injections

In addition to being provided as liquidity, <Highlight color="#bf96c6">**wMRX**</Highlight> and <Highlight color="#bf96c6">**gMRX**</Highlight> are injected into the pool from several sources and drives the value of <Highlight color="#bf96c6">**gMRX**</Highlight>.

### Trading Fees

A `0.3%` trading fee is applied to all buys, taken from the output of the swap.

When <Highlight color="#bf96c6">**gMRX**</Highlight> is purchased `0.3%` of the <Highlight color="#bf96c6">**gMRX**</Highlight> is sent to the pool.

When <Highlight color="#bf96c6">**wMRX**</Highlight> is purchased `0.3%` of the <Highlight color="#bf96c6">**wMRX**</Highlight> is sent to the pool.

### Flash Loan Fees

Flash loan fees from loans of <Highlight color="#bf96c6">**gMRX**</Highlight> have a `1%` fee applied to them. When the loan is returned the <Highlight color="#bf96c6">**gMRX**</Highlight> loan amount is burned and the fee is sent to the pool.

### AutoGovernor Rewards

80% of the rewards from each of the AutoGovernors is automatically injected into the pool every 1920 blocks, roughly every 2 days.

### Redemption Rate

The rate of this redemption is calculated based on the amount of <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> liquidity available in the liquidity pool.

$\large\text{amountMRX} = \text{burnGMRX} \times \frac{{\text{poolMRX}}}{{\text{poolGMRX}}}$

### Requirements for Burning

- Amount burned must be greater than 0
- The reserve of gMRX and wMRX in the pool must be more than 0
- The reserve of gMRX and wMRX must be more than the amount burned
- The pool must contain at least 50% of the total supply of gMRX
- More than 50% slippage cannot be exceeded in the burning of the gMRX

## Contract Details

### Contract Address

- **`TestNet`** - [**`0000000000000000000000000000000000000000`**](https://testnet-explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./LiquidityProvider.sol";
import "./LiquidGovernorMRX.sol";
import "./WrappedMetrix.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@metrixnames/mns-contracts/contracts/registry/MNS.sol";
import "@metrixnames/mns-contracts/contracts/registry/ReverseRegistrar.sol";

contract Pool {
    event BurnAndRelease(
        address indexed sender,
        uint256 burnAmount,
        uint256 releaseAmount
    );
    event AddLiquidity(
        address indexed sender,
        uint256 amountMRX,
        uint256 amountGMRX,
        uint256 amountLP
    );
    event RemoveLiquidity(
        address indexed sender,
        uint256 amountMRX,
        uint256 amountGMRX,
        uint256 amountLP
    );
    event Swap(
        address indexed sender,
        address from,
        address to,
        uint256 amountFrom,
        uint256 amountTo
    );

    address public immutable mrx;
    address public immutable gmrx;
    address public immutable lp;

    constructor(address _mrx, address _gmrx, address _mns) {
        mrx = _mrx;
        gmrx = _gmrx;
        lp = address(new LiquidityProvider(_mns));
        MNS mns = MNS(_mns);
        ReverseRegistrar registrar = ReverseRegistrar(
            mns.owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Metrix LGP:Pool");
    }

    function reserves()
        external
        view
        returns (uint256 mrxReserve, uint256 gmrxReserve)
    {
        mrxReserve = IERC20(mrx).balanceOf(address(this));
        gmrxReserve = IERC20(gmrx).balanceOf(address(this));
    }

    function quote(
        address from,
        address to,
        uint256 amountIn
    ) external view returns (uint256 swapQuote) {
        swapQuote = calculateSwapAmount(amountIn, from, to);
    }

    function burnAndRelease(uint256 amountGMRX, bool unwrapMRX) external {
        require(amountGMRX > 0, "Pool: Amount must be greater than 0");
        uint256 totalSupply = IERC20(gmrx).totalSupply();
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));
        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        require(
            reserveGMRX > 0 && reserveMRX > 0,
            "Pool: One or more paired tokens empty"
        );
        require(
            reserveGMRX >= amountGMRX && reserveMRX >= amountGMRX,
            "Pool: Burn amount must be less than or equal pooled gMRX and MRX"
        );
        require(
            (reserveGMRX * 100) / totalSupply >= 50,
            "Pool: Reserve gMRX needs to be at least 50% of the totalSupply"
        );
        uint256 amountMRX = amountGMRX *
            (((reserveMRX * 1e8) / reserveGMRX) / 1e8);

        uint256 oldPrice = ((reserveMRX * 1e8) / reserveGMRX) / 1e8;
        uint256 newPrice = (((reserveMRX - amountMRX) * 1e8) / reserveGMRX) /
            1e8;

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? (newPrice - (oldPrice * 10000)) / 10000
            : (oldPrice - (newPrice * 10000)) / 10000;

        require(
            slippageBasisPoints < 5000,
            "Pool: Slippage tolerance exceeded 50%"
        );

        require(
            IERC20(gmrx).transferFrom(msg.sender, address(this), amountGMRX),
            "Pool: Failed to transfer gMRX"
        );
        LiquidGovernorMRX(gmrx).burn(amountGMRX);
        if (unwrapMRX) {
            WrappedMetrix((payable(mrx))).withdraw(amountMRX);
            (bool sent, ) = payable(msg.sender).call{value: amountMRX}("");
            require(sent, "Pool: Failed to remove MRX");
        } else {
            require(
                IERC20(mrx).transfer(msg.sender, amountMRX),
                "Pool: Failed to remove wMRX"
            );
        }
        emit BurnAndRelease(msg.sender, amountGMRX, amountMRX);
    }

    function addLiquidity(
        uint256 amountGMRX,
        bool allowHighSlippage
    ) external payable {
        require(
            msg.value > 1e8 && amountGMRX > 1e8,
            "Pool: Amounts must be greater than 1"
        );
        uint256 amountMRX = msg.value;

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 oldPrice = ((reserveMRX * 1e8) / reserveGMRX) / 1e8;
        uint256 newPrice = ((reserveMRX + amountMRX * 1e8) /
            (reserveGMRX + amountGMRX)) / 1e8;

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? (newPrice - (oldPrice * 10000)) / 10000
            : (oldPrice - (newPrice * 10000)) / 10000;

        require(
            slippageBasisPoints <= 5000,
            "Pool: Slippage tolerance exceeded 50%"
        );

        uint256 tradingFeeMRX = 0;
        uint256 tradingFeeGMRX = 0;

        if (slippageBasisPoints > 100) {
            if (!allowHighSlippage) revert("Pool: Slippage tolerance exceeded");
            tradingFeeMRX = (amountMRX * 3) / 1000; // 0.3% fee
            tradingFeeGMRX = (amountMRX * 3) / 1000; // 0.3% fee
        }

        uint256 lpAmount = calculateLP(
            amountMRX - tradingFeeMRX,
            amountGMRX - tradingFeeGMRX
        );

        require(lpAmount > 0, "Pool: Invalid resulting lpAmount");

        // Transfer tokens to the contract
        WrappedMetrix(payable(mrx)).deposit{value: amountMRX}();
        require(
            IERC20(gmrx).transferFrom(msg.sender, address(this), amountGMRX),
            "Pool: Failed to transferFrom"
        );

        LiquidityProvider(lp).mint(msg.sender, lpAmount);

        emit AddLiquidity(msg.sender, amountMRX, amountGMRX, lpAmount);
    }

    function addLiquidity(
        uint256 amountMRX,
        uint256 amountGMRX,
        bool allowHighSlippage
    ) external {
        require(
            amountMRX > 1e8 && amountGMRX > 1e8,
            "Pool: Amounts must be greater than 1"
        );

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 oldPrice = ((reserveMRX * 1e8) / reserveGMRX) / 1e8;
        uint256 newPrice = (((reserveMRX + amountMRX) * 1e8) /
            (reserveGMRX + amountGMRX)) / 1e8;

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? (newPrice - (oldPrice * 10000)) / 10000
            : (oldPrice - (newPrice * 10000)) / 10000;

        require(
            slippageBasisPoints < 5000,
            "Pool: Slippage tolerance exceeded 50%"
        );

        uint256 tradingFeeMRX = 0;
        uint256 tradingFeeGMRX = 0;

        if (slippageBasisPoints > 100) {
            if (!allowHighSlippage) revert("Pool: Slippage tolerance exceeded");
            tradingFeeMRX = (amountMRX * 3) / 1000; // 0.3% fee
            tradingFeeGMRX = (amountMRX * 3) / 1000; // 0.3% fee
        }

        uint256 lpAmount = calculateLP(
            amountMRX - tradingFeeMRX,
            amountGMRX - tradingFeeGMRX
        );

        require(lpAmount > 0, "Pool: Invalid resulting lpAmount");
        require(
            IERC20(mrx).transferFrom(msg.sender, address(this), amountMRX),
            "Pool: Failed to transferFrom MRX"
        );
        require(
            IERC20(gmrx).transferFrom(msg.sender, address(this), amountGMRX),
            "Pool: Failed to transferFrom gMRX"
        );

        LiquidityProvider(lp).mint(msg.sender, lpAmount);
        emit AddLiquidity(msg.sender, amountMRX, amountGMRX, lpAmount);
    }

    function removeLiquidity(uint256 lpAmount, bool unwrapMRX) external {
        require(lpAmount > 0, "Pool: Amount must be greater than 0");

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));
        uint256 totalSupply = IERC20(lp).totalSupply();

        uint256 amountMRX = (lpAmount * reserveMRX) / totalSupply;
        uint256 amountGMRX = (lpAmount * reserveGMRX) / totalSupply;

        require(
            IERC20(lp).transferFrom(msg.sender, address(this), lpAmount),
            "Pool: Failed to transferFrom LPG-LP"
        );

        LiquidityProvider(lp).burn(lpAmount);

        require(
            IERC20(gmrx).transfer(msg.sender, amountGMRX),
            "Pool: Failed to remove gMRX"
        );

        if (unwrapMRX) {
            WrappedMetrix((payable(mrx))).withdraw(amountMRX);

            (bool sent, ) = payable(msg.sender).call{value: amountMRX}("");

            require(sent, "Pool: Failed to remove MRX");
        } else {
            require(
                IERC20(mrx).transfer(msg.sender, amountMRX),
                "Pool: Failed to remove wMRX"
            );
        }
        emit RemoveLiquidity(msg.sender, amountMRX, amountGMRX, lpAmount);
    }

    function swapTokens(uint16 slippage) external payable {
        require(slippage <= 5000, "Pool: Invalid slippage amount");
        WrappedMetrix(payable(mrx)).deposit{value: msg.value}();
        uint256 output = calculateSwapAmount(msg.value, mrx, gmrx);
        require(output > 0, "Pool: Insufficient output amount");
        uint256 reserveFrom = IERC20(mrx).balanceOf(address(this));
        uint256 reserveTo = IERC20(gmrx).balanceOf(address(this));

        uint256 oldPrice = ((reserveFrom * 1e8) / reserveTo) / 1e8;
        uint256 newPrice = ((reserveFrom + msg.value * 1e8) /
            (reserveTo - output)) / 1e8;

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? (newPrice - (oldPrice * 10000)) / 10000
            : (oldPrice - (newPrice * 10000)) / 10000;

        require(
            slippageBasisPoints <= slippage,
            "Pool: Slippage tolerance exceeded"
        );

        require(
            slippageBasisPoints < 5000,
            "Pool: Slippage tolerance exceeded 50%"
        );

        require(
            IERC20(mrx).transferFrom(msg.sender, address(this), msg.value),
            "Pool: Failed to transferFrom"
        );
        require(
            IERC20(gmrx).transfer(msg.sender, (output * 997) / 1000),
            "Pool: Failed to transfer"
        );
        emit Swap(msg.sender, mrx, gmrx, msg.value, (output * 997) / 1000);
    }

    function swapTokens(
        uint256 amount,
        address from,
        address to,
        uint16 slippage,
        bool unwrapMRX
    ) external {
        require(slippage <= 5000, "Pool: Invalid slippage amount");
        uint256 output = calculateSwapAmount(amount, from, to);
        require(output > 0, "Pool: Insufficient output amount");
        uint256 reserveFrom = IERC20(from).balanceOf(address(this));
        uint256 reserveTo = IERC20(to).balanceOf(address(this));

        uint256 oldPrice = ((reserveFrom * 1e8) / reserveTo) / 1e8;
        uint256 newPrice = ((reserveFrom + amount * 1e8) /
            (reserveTo - output)) / 1e8;

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? (newPrice - (oldPrice * 10000)) / 10000
            : (oldPrice - (newPrice * 10000)) / 10000;

        require(
            slippageBasisPoints <= slippage,
            "Pool: Slippage tolerance exceeded"
        );

        require(
            slippageBasisPoints < 5000,
            "Pool: Slippage tolerance exceeded 50%"
        );
        require(
            IERC20(from).transferFrom(msg.sender, address(this), amount),
            "Pool: Failed to transferFrom"
        );
        if (to == mrx && unwrapMRX) {
            WrappedMetrix((payable(mrx))).withdraw((output * 997) / 1000);

            (bool sent, ) = payable(msg.sender).call{
                value: (output * 997) / 1000
            }("");

            require(sent, "Pool: Failed to transfer");
        } else {
            require(
                IERC20(to).transfer(msg.sender, (output * 997) / 1000),
                "Pool: Failed to transfer"
            );
        }

        emit Swap(msg.sender, mrx, gmrx, amount, (output * 997) / 1000);
    }

    function calculateLP(
        uint256 amountMRX,
        uint256 amountGMRX
    ) internal view returns (uint256) {
        uint256 totalSupply = IERC20(lp).totalSupply();

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 newReserveMRX = reserveMRX + amountMRX;
        uint256 newReserveGMRX = reserveGMRX + amountGMRX;

        uint256 sqrtK = Math.sqrt(newReserveMRX * newReserveGMRX);

        if (totalSupply == 0) {
            return sqrtK; // Initial LP tokens based on sqrt of product
        }

        uint256 currentK = Math.sqrt(reserveMRX * reserveGMRX);
        uint256 lpAmount = (totalSupply * (sqrtK - currentK)) / currentK;

        return lpAmount;
    }

    function calculateSwapAmount(
        uint256 amountIn,
        address from,
        address to
    ) internal view returns (uint256) {
        require(amountIn > 0, "Pool: Amount must be greater than 0");
        require(from != to, "Pool: Same token swap not supported");
        require(from == mrx || from == gmrx, "Pool: Invalid fromToken");
        require(to == mrx || to == gmrx, "Pool: Invalid toToken");

        uint256 balanceFrom = IERC20(from).balanceOf(address(this));
        uint256 balanceTo = IERC20(to).balanceOf(address(this));
        require(balanceFrom > 0 && balanceTo > 0, "Pool: Empty pool");
        // Apply a 0.3% trading fee into the pool for providers
        uint256 amountOut = (amountIn * balanceTo * 997) /
            (balanceFrom * 1000 + amountIn * 997);
        return amountOut;
    }
}
```

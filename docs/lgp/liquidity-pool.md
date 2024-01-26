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

## Removing Liquidity

Removing the liquidity is a process that involved redeeming <Highlight color="#bf96c6">**LGP-LP**</Highlight> tokens for the underlying <Highlight color="#bf96c6">**gMRX**</Highlight> and <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool. <Highlight color="#bf96c6">**LGP-LP**</Highlight> is burned when redeemed.

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

## Burning gMRX

There is a built in mechanism for burning <Highlight color="#bf96c6">**gMRX**</Highlight> which allows any <Highlight color="#bf96c6">**gMRX**</Highlight> holder to burn <Highlight color="#bf96c6">**gMRX**</Highlight> at the market rate removing <Highlight color="#bf96c6">**wMRX**</Highlight> from the pool. Optionally <Highlight color="#bf96c6">**MRX**</Highlight> can be unwrapped to <Highlight color="#bf96c6">**MRX**</Highlight> during the burn.

### Redemption Rate

$\large\text{amountMRX} = \text{burnGMRX} \times \frac{{\text{poolMRX}}}{{\text{poolGMRX}}}$

### Requirements for Burning

- **Hodl <Highlight color="#bf96c6">g</Highlight>** _or_ **Lock >= `1%` <Highlight color="#bf96c6">LGP-LP</Highlight> total supply**
- **Amount burned must be greater than 0**
- **The reserves of <Highlight color="#bf96c6">gMRX</Highlight> and <Highlight color="#bf96c6">wMRX</Highlight> in the pool must be greater than 0**
- **The reserves of <Highlight color="#bf96c6">gMRX</Highlight> and <Highlight color="#bf96c6">wMRX</Highlight> must be greater than the amount burned**
- **The pool must contain at least `50%` of the total supply of <Highlight color="#bf96c6">gMRX</Highlight>**
- **More than `50%` slippage cannot be exceeded in the burning of the <Highlight color="#bf96c6">gMRX</Highlight>**

## Contract Details

### Contract Address

- **`TestNet`** - [**`ca5cadab4857c8507be486a04cd4e196dd989075`**](https://testnet-explorer.metrixcoin.com/contract/ca5cadab4857c8507be486a04cd4e196dd989075)
- **`MainNet`** - [**`0000000000000000000000000000000000000000`**](https://explorer.metrixcoin.com/contract/0000000000000000000000000000000000000000)

### Sourcecode

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./LiquidityProvider.sol";
import "./LiquidGovernorMRX.sol";
import "./WrappedMetrix.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
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

    event LockedLiquidity(address indexed sender, uint256 amountLP);

    event UnlockedLiquidity(address indexed sender, uint256 amountLP);

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
        address indexed from,
        address indexed to,
        uint256 amountFrom,
        uint256 amountTo
    );

    modifier notCooldown() {
        require(
            block.number >= lockCooldown[msg.sender],
            "Pool: Cooldown in effect"
        );
        _;
    }

    address public immutable mrx;
    address public immutable gmrx;
    address public immutable g;
    address public immutable lp;

    uint256 public totalLockedLP;
    mapping(address => uint256) public lockedLP;
    mapping(address => uint256) public lockCooldown;

    constructor(address _mrx, address _gmrx, address _g, address _mns) {
        mrx = _mrx;
        gmrx = _gmrx;
        g = _g;
        lp = address(new LiquidityProvider(_mns));
        MNS mns = MNS(_mns);
        ReverseRegistrar registrar = ReverseRegistrar(
            mns.owner(ADDR_REVERSE_NODE)
        );
        registrar.setName("Metrix LGP:Pool wMRX/gMRX");
    }

    fallback() external payable {
        if (msg.value > 0 && msg.sender != mrx) {
            WrappedMetrix(payable(mrx)).deposit{value: msg.value}();
        }
    }

    receive() external payable {
        if (msg.value > 0 && msg.sender != mrx) {
            WrappedMetrix(payable(mrx)).deposit{value: msg.value}();
        }
    }

    function reserves()
        external
        view
        returns (uint256 mrxReserve, uint256 gmrxReserve)
    {
        mrxReserve = IERC20(mrx).balanceOf(address(this));
        gmrxReserve = IERC20(gmrx).balanceOf(address(this));
    }

    function traderDiscount(
        address trader
    ) external view returns (bool discount) {
        discount = hasDiscount(trader);
    }

    function swapQuote(
        address from,
        address to,
        uint256 amountIn
    ) external view returns (uint256 amountOut, uint256 slippage) {
        (amountOut, slippage) = calculateSlippage(from, to, amountIn);
    }

    function lpAddQuote(
        uint256 amountMRX,
        uint256 amountGMRX
    ) external view returns (uint256 amountLP) {
        amountLP = calculateLP(amountMRX, amountGMRX);
    }

    function lpRemoveQuote(
        uint256 amountLP
    ) external view returns (uint256 amountMRX, uint256 amountGMRX) {
        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));
        uint256 totalSupply = IERC20(lp).totalSupply();
        require(
            totalSupply > 0,
            "Pool: Total supply of LP must be greater than 0"
        );

        amountMRX = (amountLP * reserveMRX) / totalSupply;
        amountGMRX = (amountLP * reserveGMRX) / totalSupply;
    }

    function lockLP(uint256 amountLP) external notCooldown {
        require(amountLP > 0, "Pool: Amount of LP must be greater than 0");
        require(
            IERC20(lp).transferFrom(msg.sender, address(this), amountLP),
            "Pool: Failed to transfer LGP-LP"
        );
        lockedLP[msg.sender] += amountLP;
        totalLockedLP += amountLP;
        lockCooldown[msg.sender] = block.number + 960;
        emit LockedLiquidity(msg.sender, amountLP);
    }

    function unlockLP(uint256 amountLP) external notCooldown {
        require(amountLP > 0, "Pool: Amount of LP must be greater than 0");
        require(
            lockedLP[msg.sender] >= amountLP,
            "Pool: Amount exceeds currently locked LGP-LP"
        );
        lockedLP[msg.sender] -= amountLP;
        totalLockedLP -= amountLP;
        lockCooldown[msg.sender] = block.number + 960;
        require(
            IERC20(lp).transfer(msg.sender, amountLP),
            "Pool: Failed to transfer gMRX"
        );
        emit UnlockedLiquidity(msg.sender, amountLP);
    }

    function burnAndRelease(
        uint256 amountGMRX,
        uint256 minimum,
        bool unwrapMRX
    ) external {
        require(hasDiscount(msg.sender), "Pool: Lock LP or hodl g");
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
        (uint256 amountMRX, uint256 basisPoints) = calculateSlippage(
            gmrx,
            mrx,
            amountGMRX
        );
        require(amountMRX >= minimum, "Pool: Output is below minimum");

        require(amountMRX > 0, "Pool: Output MRX must be greater than 0");

        require(basisPoints <= 5000, "Pool: Slippage tolerance exceeded 50%");

        require(
            IERC20(gmrx).transferFrom(msg.sender, address(this), amountGMRX),
            "Pool: Failed to transfer gMRX"
        );
        LiquidGovernorMRX(gmrx).burn(amountGMRX);
        if (unwrapMRX) {
            WrappedMetrix((payable(mrx))).withdraw((amountMRX * 997) / 1000);
            (bool sent, ) = payable(msg.sender).call{
                value: (amountMRX * 997) / 1000
            }("");
            require(sent, "Pool: Failed to remove MRX");
        } else {
            require(
                IERC20(mrx).transfer(msg.sender, (amountMRX * 997) / 1000),
                "Pool: Failed to remove wMRX"
            );
        }
        emit BurnAndRelease(msg.sender, amountGMRX, (amountMRX * 997) / 1000);
    }

    function addLiquidity(
        uint256 amountGMRX,
        uint256 minimum,
        bool allowHighSlippage
    ) external payable {
        require(
            msg.value >= 1e8 && amountGMRX >= 1e8,
            "Pool: Amounts must be greater than 1"
        );
        uint256 amountMRX = msg.value;

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 oldPrice = reserveGMRX > 0
            ? (reserveMRX * 1e8) / reserveGMRX
            : 1e8;
        uint256 newPrice = ((reserveMRX + amountMRX) * 1e8) /
            (reserveGMRX + amountGMRX);

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? ((newPrice - oldPrice) * 10000) / oldPrice
            : ((oldPrice - newPrice) * 10000) / oldPrice;

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
        require(lpAmount >= minimum, "Pool: Output is below minimum");
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
        uint256 minimum,
        bool allowHighSlippage
    ) external {
        require(
            amountMRX > 1e8 && amountGMRX > 1e8,
            "Pool: Amounts must be greater than 1"
        );

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 oldPrice = reserveGMRX > 0
            ? (reserveMRX * 1e8) / reserveGMRX
            : 1e8;
        uint256 newPrice = ((reserveMRX + amountMRX) * 1e8) /
            (reserveGMRX + amountGMRX);

        uint256 slippageBasisPoints = newPrice > oldPrice
            ? ((newPrice - oldPrice) * 10000) / oldPrice
            : ((oldPrice - newPrice) * 10000) / oldPrice;

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
        require(lpAmount >= minimum, "Pool: Output is below minimum");
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
        require(
            totalSupply > 0,
            "Pool: Total supply of LP must be greater than 0"
        );
        uint256 amountMRX = (lpAmount * reserveMRX) / totalSupply;
        uint256 amountGMRX = (lpAmount * reserveGMRX) / totalSupply;
        require(
            amountMRX > 0 && amountGMRX > 0,
            "Pool: Outputs must be greater than 0"
        );
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

    function swapTokens(uint256 minimum, uint16 slippage) external payable {
        WrappedMetrix(payable(mrx)).deposit{value: msg.value}();
        (uint256 output, uint256 basisPoints) = calculateSlippage(
            mrx,
            gmrx,
            msg.value
        );
        require(output >= minimum, "Pool: Output is below minimum");
        require(output > 0, "Pool: Insufficient output amount");

        require(basisPoints <= slippage, "Pool: Slippage tolerance exceeded");

        require(basisPoints <= 5000, "Pool: Slippage tolerance exceeded 50%");
        bool discount = hasDiscount(msg.sender);
        require(
            IERC20(gmrx).transfer(
                msg.sender,
                discount ? output : (output * 997) / 1000
            ),
            "Pool: Failed to transfer"
        );
        emit Swap(
            msg.sender,
            mrx,
            gmrx,
            msg.value,
            discount ? output : (output * 997) / 1000
        );
    }

    function swapTokens(
        uint256 amount,
        address from,
        address to,
        uint256 minimum,
        uint16 slippage,
        bool unwrapMRX
    ) external {
        (uint256 output, uint256 basisPoints) = calculateSlippage(
            from,
            to,
            amount
        );
        require(output >= minimum, "Pool: Output is below minimum");
        require(output > 0, "Pool: Insufficient output amount");

        require(basisPoints <= slippage, "Pool: Slippage tolerance exceeded");

        require(basisPoints < 5000, "Pool: Slippage tolerance exceeded 50%");
        require(
            IERC20(from).transferFrom(msg.sender, address(this), amount),
            "Pool: Failed to transferFrom"
        );
        bool discount = hasDiscount(msg.sender);

        if (to == mrx && unwrapMRX) {
            WrappedMetrix((payable(mrx))).withdraw(
                discount ? output : (output * 997) / 1000
            );

            (bool sent, ) = payable(msg.sender).call{
                value: discount ? output : (output * 997) / 1000
            }("");

            require(sent, "Pool: Failed to transfer");
        } else {
            require(
                IERC20(to).transfer(
                    msg.sender,
                    discount ? output : (output * 997) / 1000
                ),
                "Pool: Failed to transfer"
            );
        }

        emit Swap(
            msg.sender,
            from,
            to,
            amount,
            discount ? output : (output * 997) / 1000
        );
    }

    function hasDiscount(address trader) internal view returns (bool discount) {
        uint256 traderLockedLP = lockedLP[trader];
        uint256 totalSupply = IERC20(lp).totalSupply();
        uint256 gBalance = IERC721(g).balanceOf(trader);
        discount =
            (
                totalSupply > 0
                    ? (traderLockedLP * 10000) / totalSupply >= 100
                    : false
            ) ||
            gBalance > 0; // trader has locked at least 1% of the totalSupply of LGP-LP // trader holds g
    }

    function calculateSlippage(
        address from,
        address to,
        uint256 amount
    ) internal view returns (uint256 output, uint256 basisPoints) {
        (
            uint256 reserveFrom,
            uint256 reserveTo,
            uint256 out
        ) = calculateSwapAmount(amount, from, to);
        output = out;

        uint256 oldPrice = (reserveFrom * 1e8) / reserveTo;
        uint256 newPrice = reserveTo <= output
            ? 0
            : ((reserveFrom + amount) * 1e8) / (reserveTo - output);

        basisPoints = newPrice > oldPrice
            ? ((newPrice - oldPrice) * 10000) / oldPrice
            : ((oldPrice - newPrice) * 10000) / oldPrice;
    }

    function calculateLP(
        uint256 amountMRX,
        uint256 amountGMRX
    ) internal view returns (uint256 amountLP) {
        uint256 totalSupply = IERC20(lp).totalSupply();

        uint256 reserveMRX = IERC20(mrx).balanceOf(address(this));
        uint256 reserveGMRX = IERC20(gmrx).balanceOf(address(this));

        uint256 newReserveMRX = reserveMRX + amountMRX;
        uint256 newReserveGMRX = reserveGMRX + amountGMRX;

        uint256 sqrtK = Math.sqrt(newReserveMRX * newReserveGMRX);

        if (totalSupply == 0) {
            amountLP = sqrtK; // Initial LP tokens based on sqrt of product
        } else {
            uint256 currentK = Math.sqrt(reserveMRX * reserveGMRX);
            amountLP = (totalSupply * (sqrtK - currentK)) / currentK;
        }
    }

    function calculateSwapAmount(
        uint256 amountIn,
        address from,
        address to
    )
        internal
        view
        returns (uint256 reserveFrom, uint256 reserveTo, uint256 amountOut)
    {
        require(amountIn > 0, "Pool: Amount must be greater than 0");
        require(from != to, "Pool: Same token swap not supported");
        require(from == mrx || from == gmrx, "Pool: Invalid fromToken");
        require(to == mrx || to == gmrx, "Pool: Invalid toToken");

        reserveFrom = IERC20(from).balanceOf(address(this));
        reserveTo = IERC20(to).balanceOf(address(this));

        require(reserveFrom > 0 && reserveTo > 0, "Pool: Empty pool");

        amountOut = (amountIn * 1e8) / ((reserveFrom * 1e8) / reserveTo);
    }
}
```

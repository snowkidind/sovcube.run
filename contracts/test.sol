pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract Test {

  function test() public {
    uint periodWithdrawalAmount = 100;
    for (uint i = 0; i < 5; i++) {
      periodWithdrawalAmount /= 2;
      console.log('pwd: ', periodWithdrawalAmount);
    }
  }
}
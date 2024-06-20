const fs = require('fs')

const hre = require("hardhat");
const ethers = hre.ethers
const provider = ethers.provider

const helpers = require("@nomicfoundation/hardhat-network-helpers")

const run = async () => {

  const network = process.env.HARDHAT_NETWORK;
  if (typeof (network) === 'undefined') {
    console.log("Try: npx hardhat run --network <network> filepath");
    process.exit(1);
  }

  if (network !== 'hardhat' && network !== 'mainnet' && network !== 'goerli' && network !== 'sepolia') {
    console.log("Unsupported Network");
    process.exit(1);
  }

  const parameters1 = []
  const Contract1 = await hre.ethers.getContractFactory("Test")
  testContract = await Contract1.deploy(...parameters1)
  const testContractAddress = testContract.target
  console.log("testContract deployed to: " + testContractAddress + ' on ' + network)

  await testContract.test()

}


  ; (async () => {

    if (Number(process.version.split('.')[0].replace('v', '')) < 20) {
      console.log('this requires node v20. exiting')
      process.exit(3)
    }
    if (ethers.version < 6) {
      console.log('Upgrade to ethers 6. exiting.')
      process.exit(4)
    }

    try {
      await run()
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
    process.exit(0)
  })()
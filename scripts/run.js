const { utils } = require("ethers");

async function main() {
  const baseTokenURI = "ipfs://QmZT1DLsugZsfY96Ab6hu3ycTrH2WHgJE9BWQe5wUV6hKz/";

  // Get owner/deployer's wallet address
  const [owner] = await hre.ethers.getSigners();

  // Get contract we want to deploy
  const contractFactory = await hre.ethers.getContractFactory("NFTCollectible");

  // Deploy contract with the correct contructor arguments
  const contract = await contractFactory.deploy(baseTokenURI);

  // Wait for this transaction to me mined
  await contract.deployed();

  // Get contract address
  console.log("Contract deployed to:", contract.address);

  // Reserve NFTs
  let tx = await contract.reserveNFTs();
  await tx.wait();
  console.log("10 NFTs have been reserved!");

  // Mint 3 NFTs by sending 0.03 ethers
  tx = await contract.mintNFTs(3, { value: utils.parseEther("0.03") });
  await tx.wait();

  // Get all token IDs of the owner
  const tokens = await contract.tokensOfOwner(owner.address);
  console.log("Owner has tokens:", tokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

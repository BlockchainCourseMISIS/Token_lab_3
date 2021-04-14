const BlackJack = artifacts.require("BlackJack");
const Fishka = artifacts.require("FishkaToken");
module.exports = async function (deployer) {
  await deployer.deploy(Fishka, 10, "Fishka", 1, "F");
  const token = await Fishka.deployed();
  await deployer.deploy(BlackJack, token.address);
};

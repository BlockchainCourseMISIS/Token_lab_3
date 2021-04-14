const BlackJack = artifacts.require("BlackJack");
const Token20 = artifacts.require("TokenERC20");
module.exports = async function (deployer) {
   await deployer.deploy(Token20, 1, "token", "token2");
   const token = await Token20.deployed();
   await deployer.deploy(BlackJack, token.address);

};

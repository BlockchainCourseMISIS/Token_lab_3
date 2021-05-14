const { assert } = require("chai");

const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

contract("stand test", async (accounts) => {
  it("transfer test", async () => {
    const fishka_token = await FishkaToken.deployed();

    await fishka_token.transfer(accounts[1], 5);
    const balanceOf0 = await fishka_token.balanceOf(accounts[0]);
    const balanceOf1 = await fishka_token.balanceOf(accounts[1]);

    assert.equal(balanceOf0, 5, "balance of dealer should be equal to 5");
    assert.equal(balanceOf1, 5, "balance of player should be equal to 5");
  });
  it("add money", async () => {
    const fishka_token = await FishkaToken.deployed();
    const black_jack = await BlackJack.deployed();

    await fishka_token.approve(black_jack.address, 2, { from: accounts[0] });
    await fishka_token.approve(black_jack.address, 2, { from: accounts[1] });

    await black_jack.choose_dealer(2, { from: accounts[0] });
    await black_jack.choose_player(2, { from: accounts[1] });

    await fishka_token.approve(black_jack.address, 3, { from: accounts[0] });
    await fishka_token.approve(black_jack.address, 3, { from: accounts[1] });

    await black_jack.add_money_player(3, { from: accounts[1] });
    await black_jack.add_money_dealer(3, { from: accounts[0] });

    const balance_player = await black_jack.get_balance_player();
    const balance_dealer = await black_jack.get_balance_dealer();

    assert.equal(5, balance_dealer, "dealer balance should be equal to 5");
    assert.equal(5, balance_player, "player balance should be equal to 5");
  });
  it("stand test", async () => {
    const black_jack = await BlackJack.deployed();

    await black_jack.stand({ from: accounts[0] });
    await black_jack.stand({ from: accounts[1] });

    const p = await black_jack.getStandP();
    const d = await black_jack.getStandD();
    assert.isTrue(p);
    assert.isTrue(d);
  });
});

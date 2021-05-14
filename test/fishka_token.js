const { assert } = require("chai");

const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

contract("Black Jack", async (accounts) => {
  describe("test token", function(){
  let fishka_token;
  let black_jack;
  beforeEach("delpoy", async() =>{
    fishka_token = await FishkaToken.deployed();
    black_jack = await BlackJack.deployed();
  });
  it("transfer test", async () => {
    await fishka_token.transfer(accounts[1], 5);
    const balanceOf0 = await fishka_token.balanceOf(accounts[0]);
    const balanceOf1 = await fishka_token.balanceOf(accounts[1]);

    assert.equal(balanceOf0, 5, "balance of dealer should be equal to 5");
    assert.equal(balanceOf1, 5, "balance of player should be equal to 5");
  });
  it("choose dealer/player", async () => {
    await fishka_token.approve(black_jack.address, 2, { from: accounts[0] });
    await fishka_token.approve(black_jack.address, 2, { from: accounts[1] });

    await black_jack.choose_dealer(2, { from: accounts[0] });
    await black_jack.choose_player(2, { from: accounts[1] });

    //написать assert
  });
  it("give cards", async () => {
    await black_jack.giveCards({ from: accounts[0] });
    let amount = await black_jack.get_cards_amount();
    assert.equal(
      amount.toNumber(),
      49,
      "amount of cards should be equal to 49"
    );
  });
  it("hit dealer", async () => {
    await black_jack.hit_dealer({ from: accounts[0] });
    let amount = await black_jack.get_cards_amount();
    assert.equal(
      amount.toNumber(),
      48,
      "amount of cards should be equal to 48"
    );
  });
  it("hit player", async () => {
    await black_jack.hit_player({ from: accounts[1] });
    let amount = await black_jack.get_cards_amount();

    assert.equal(
      amount.toNumber(),
      47,
      "amount of cards should be equal to 47"
    );
  });
  it("add money", async () => {
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
    await black_jack.stand({ from: accounts[0] });
    await black_jack.stand({ from: accounts[1] });

    const p = await black_jack.get_stand_player();
    const d = await black_jack.get_stand_dealer();
    assert.isTrue(p);
    assert.isTrue(d);
  });

  });
});
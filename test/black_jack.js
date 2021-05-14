const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

contract("Game process test", async (accounts) => {
  describe("Basic functions", function () {
    let fishka_token;
    let black_jack;
    beforeEach("delpoy", async () => {
      fishka_token = await FishkaToken.deployed();
      black_jack = await BlackJack.deployed();
    });

    it("transfer", async () => {
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

      const dealer_name = await black_jack.get_dealer_name();
      const player_name = await black_jack.get_player_name();

      assert.equal(
        dealer_name,
        accounts[0],
        "dealer address should be equal to accounts[0] address"
      );
      assert.equal(
        player_name,
        accounts[1],
        "player address should be equal to accounts[1] address"
      );
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
    it("stand", async () => {
      await black_jack.stand({ from: accounts[0] });
      await black_jack.stand({ from: accounts[1] });

      const p = await black_jack.get_stand_player();
      const d = await black_jack.get_stand_dealer();
      assert.isTrue(p);
      assert.isTrue(d);
    });
    it("check winner", async () => {
      await black_jack.checkWinner();
      const balance_of_dealer = await fishka_token.balanceOf(accounts[0]);
      const balance_of_player = await fishka_token.balanceOf(accounts[1]);

      const sum_player = await black_jack.get_player_sum();
      const sum_dealer = await black_jack.get_dealer_sum();
      const winner = await black_jack.get_winner();

      if (sum_player > sum_dealer && sum_player <= 21 && sum_dealer <= 21) {
        assert.equal(winner, accounts[1]);
        assert.equal(
          balance_of_player.toNumber(),
          10,
          "balance of player should be equal to 10"
        );
      } else if (sum_player == sum_dealer) {
        assert.equal(
          balance_of_dealer.toNumber(),
          5,
          "balance of dealer should be equal to 5"
        );
        assert.equal(
          balance_of_player.toNumber(),
          5,
          "balance of player should be equal to 5"
        );
      } else {
        assert.equal(winner, accounts[0]);
        assert.equal(
          balance_of_dealer.toNumber(),
          10,
          "balance of dealer should be equal to 10"
        );
      }
    });
  });
});

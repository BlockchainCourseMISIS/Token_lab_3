const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

contract("Game process test", async (accounts) => {
  describe("Basic functions", function () {
    var fishka_token;
    var black_jack;
    before("delpoy", async () => {
      fishka_token = await FishkaToken.deployed();
      black_jack = await BlackJack.deployed();
    });

    describe("transfer", async() =>{
      before("transer", async() =>{
        await fishka_token.transfer(accounts[1], 5);
      });
      it("check balanceOf0", async () => {
        const balanceOf0 = await fishka_token.balanceOf(accounts[0]);
        assert.equal(balanceOf0, 5, "balance of dealer should be equal to 5");
      });
      it("check balanceOf1", async() =>{
        const balanceOf1 = await fishka_token.balanceOf(accounts[1]);
        assert.equal(balanceOf1, 5, "balance of player should be equal to 5");
      });
    });

    describe("choose dealer/player", async() =>{
      before("approve and choose", async() =>{
        await fishka_token.approve(black_jack.address, 2, { from: accounts[0] });
        await fishka_token.approve(black_jack.address, 2, { from: accounts[1] });
  
        await black_jack.choose_dealer(2, { from: accounts[0] });
        await black_jack.choose_player(2, { from: accounts[1] });
      });

      it("check dealer name", async () => {
        const dealer_name = await black_jack.get_dealer_name();
        assert.equal(
          dealer_name,
          accounts[0],
          "dealer address should be equal to accounts[0] address"
        );
      });
      it("check player name", async () => {
        const player_name = await black_jack.get_player_name();
        assert.equal(
          player_name,
          accounts[1],
          "player address should be equal to accounts[1] address"
        );
      });
    });
    describe("give cards", async() =>{
      before("give cards", async() =>{
        await black_jack.giveCards({ from: accounts[0] });
      });
      it("check cards", async () => {
        let amount = await black_jack.get_cards_amount();
        assert.equal(
          amount.toNumber(),
          49,
          "amount of cards should be equal to 49"
        );
      });

    });
    describe("hit player", async() =>{
      before("make hit", async()=>{
        await black_jack.hit_player({ from: accounts[1] });
      });
      it("hit player", async () => {
        let amount = await black_jack.get_cards_amount({from: accounts[1]});
  
        assert.equal(
          amount.toNumber(),
          48,
          "amount of cards should be equal to 48"
        );
      });

    });
    describe("hit player", async() =>{
      before("make hit", async()=>{
        await black_jack.hit_dealer({ from: accounts[0] });
      });
      it("hit player", async () => {
        let amount = await black_jack.get_cards_amount({from: accounts[0]});
  
        assert.equal(
          amount.toNumber(),
          47,
          "amount of cards should be equal to 47"
        );
      });
    });

    describe("add money", async() =>{
      before("approve and add_money", async ()=>{
        await fishka_token.approve(black_jack.address, 3, { from: accounts[0] });
        await fishka_token.approve(black_jack.address, 3, { from: accounts[1] });
  
        await black_jack.add_money_player(3, { from: accounts[1] });
        await black_jack.add_money_dealer(3, { from: accounts[0] });
  
      });
      it("check player balance", async () => {
        const balance_player = await black_jack.get_balance_player();
        assert.equal(5, balance_player, "player balance should be equal to 5");
      });
      it("check dealer balance", async () => {
        const balance_dealer = await black_jack.get_balance_dealer();
        assert.equal(5, balance_dealer, "dealer balance should be equal to 5");
      });
    });

    describe("stand", async()=>{
      before("make stand", async()=>{
        await black_jack.stand({ from: accounts[0] });
        await black_jack.stand({ from: accounts[1] });
      });
      it("check stand player", async () => {
        const p = await black_jack.get_stand_player();
        assert.isTrue(p);
      });
      it("check stand dealer", async () => {
        const d = await black_jack.get_stand_dealer();
        assert.isTrue(d);
      });
    });
    describe("check winner", async()=>{
      let balance_of_dealer;;
      let sum_player;
      let sum_dealer; 
      let balance_of_player;
      let winner;
      before("call checkWinner", async() =>{
        await black_jack.checkWinner();
         balance_of_dealer = await fishka_token.balanceOf(accounts[0]);
         sum_player = await black_jack.get_player_sum();
         sum_dealer = await black_jack.get_dealer_sum(); 
         balance_of_player = await fishka_token.balanceOf(accounts[1]); 
         winner = await black_jack.get_winner();
      });
      it("check balance player", async() =>{
        if (sum_player > sum_dealer && sum_player <= 21 && sum_dealer <= 21) {
          assert.equal(
            balance_of_player.toNumber(),
            10,
            "balance of player should be equal to 10"
          );
        } else if (sum_player == sum_dealer) {
          assert.equal(
            balance_of_player.toNumber(),
            5,
            "balance of player should be equal to 5"
          );
        } else {
          assert.equal(
            balance_of_player.toNumber(),
            0,
            "balance of player should be equal to 0"
          );
        }
      });
      it("check balance dealer", async () => {

        if (sum_player > sum_dealer && sum_player <= 21 && sum_dealer <= 21) {
          assert.equal(
            balance_of_dealer.toNumber(),
            0,
            "balance of dealer should be equal to 0"
          );
        } else if (sum_player == sum_dealer) {
          assert.equal(
            balance_of_dealer.toNumber(),
            5,
            "balance of dealer should be equal to 5"
          );
        } else {
          assert.equal(
            balance_of_dealer.toNumber(),
            10,
            "balance of dealer should be equal to 10"
          );
        }
      });
      it("check winner", async()=>{
        if (sum_player > sum_dealer && sum_player <= 21 && sum_dealer <= 21) {
          assert.equal(winner, accounts[1]);
        } else if (sum_player != sum_dealer) {
          assert.equal(winner, accounts[0]);
        } 
      });
    });
   
  });
});
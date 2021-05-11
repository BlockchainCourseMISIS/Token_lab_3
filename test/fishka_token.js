const { assert } = require("chai");

const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FishkaToken", async accounts => {
  let instance;
  let temp;
  describe("Test", function(){
    it("should assert true", async  ()=> {
      instance =  await FishkaToken.deployed();
      instance.transfer(accounts[1],5)
      const balanceOf0 = await  instance.balanceOf(accounts[0])
      const balanceOf1 = await  instance.balanceOf(accounts[1])
      assert.equal(balanceOf0, 5)
      assert.equal(balanceOf1, 5)
     });
    
  
    it("player's balance should be equels 2", async()=>{
      temp = await BlackJack.deployed()
      temp.choose_player(2,{from : accounts[1]}).then(async ()=>{
      const value = await temp.get_balance_player()
      assert.equal(value, 2)
    });
  });  
    it("dealer's balance should be equels 2", async()=>{
      temp.choose_dealer(2,{from : accounts[0]}).then(async ()=>{
        const value = await temp.get_balance_dealer()
        assert.equal(value, 2)
      });  
    });
});
});




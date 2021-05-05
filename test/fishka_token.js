const FishkaToken = artifacts.require("FishkaToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FishkaToken", async accounts => {
  it("should assert true", async  ()=> {
   const instance =  await FishkaToken.deployed();
   instance.transfer(accounts[1],5)
   const balanceOf = await  instance.balanceOf(accounts[1])
   assert.equal(balanceOf, 5)
  });
});

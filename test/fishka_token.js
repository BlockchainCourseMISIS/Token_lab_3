const FishkaToken = artifacts.require("FishkaToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FishkaToken", function (/* accounts */) {
  it("should assert true", async function () {
    await FishkaToken.deployed();
    return assert.isTrue(true);
  });
});

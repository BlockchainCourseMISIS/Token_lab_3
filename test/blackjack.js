const blackjack = artifacts.require("blackjack");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("blackjack", function (/* accounts */) {
  it("should assert true", async function () {
    await blackjack.deployed();
    return assert.isTrue(true);
  });
});

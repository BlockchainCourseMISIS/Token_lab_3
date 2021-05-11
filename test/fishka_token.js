const FishkaToken = artifacts.require("FishkaToken");
const BlackJack = artifacts.require("BlackJack");

contract("stand test", async (accounts) => {
  it("transfer test", async () => {
    const instance = await FishkaToken.deployed();
    await instance.transfer(accounts[1], 5);
    const balanceOf0 = await instance.balanceOf(accounts[0]);
    const balanceOf1 = await instance.balanceOf(accounts[1]);

    assert.equal(balanceOf0, 5, "balance of dealer should be equal to 5");
    assert.equal(balanceOf1, 5, "balance of player should be equal to 5");
    await instance.transfer(accounts[0], 5, { from: accounts[1] });
  });

  it("stand test", async () => {
    const instance = await FishkaToken.deployed();
    let temp = await BlackJack.deployed();
    await instance.transfer(accounts[1], 5, { from: accounts[0] });

    await instance.approve(temp.address, 2, { from: accounts[0] });
    await instance.approve(temp.address, 2, { from: accounts[1] });

    await temp.choose_dealer(2, { from: accounts[0] });
    await temp.choose_player(2, { from: accounts[1] });

    await temp.stand({ from: accounts[1] });
    await temp.stand({ from: accounts[0] });

    const p = await temp.getStandP();
    const d = await temp.getStandD();
    assert.isTrue(p);
    assert.isTrue(d);
  });
});

pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BlackJack.sol";

contract Test {
    function testCards() public {
        BlackJack jack = BlackJack(DeployedAddresses.BlackJack());
        uint256 cards = jack.get_cards_amount();
        uint256 card = 52;
        Assert.equal(
            uint256(card),
            uint256(cards),
            "52 cards should be in the deck"
        );
    }
}

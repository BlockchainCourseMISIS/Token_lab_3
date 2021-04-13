pragma solidity >=0.4.22 <0.7.0;
contract TokenERC20 {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    /**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        string memory tokenSymbol
    ) public {
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
    }

    /**
     * Internal transfer, only can be called by this contrac
     */

    function setTotalSupply(uint256 ts) external{
        totalSupply = ts;
    }
    function tr_tr(address _from, address _to, uint _value) public {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != address(0x0), "Sender can't transfer currency to null address");
        // Check if the sender has enough
        require(balanceOf[_from] >= _value, "Sender have no enough currency");
        // Check for overflows
        require(balanceOf[_to] + _value > balanceOf[_to], "You sent too much currency");
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer123(address from, address _to, uint256 _value) external {
        tr_tr(from, _to, _value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` on behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender], "Sender didn't approved such amount of currency");     // Check allowance
        allowance[_from][msg.sender] -= _value;
        tr_tr(_from, _to, _value);(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens on your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Sender has no enough currency");   // Check if the sender has enough
        balanceOf[msg.sender] -= _value;            // Subtract from the sender
        totalSupply -= _value;                      // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }

    /**
     * Destroy tokens from other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, 'Sender has no enough currency');                // Check if the targeted balance is enough
        require(_value <= allowance[_from][msg.sender], "Sender didn't approved such amount of currency");    // Check allowance
        balanceOf[_from] -= _value;                         // Subtract from the targeted balance
        allowance[_from][msg.sender] -= _value;             // Subtract from the sender's allowance
        totalSupply -= _value;                              // Update totalSupply
        emit Burn(_from, _value);
        return true;
    }
}
contract BlackJack  {
    struct Player {
        address payable name; //имя игрока
        uint256 cashAmmount; //колличество денег
        bool hasCards;
        uint32 sumPlayer;
        Card[] cards;
    }
    struct Card {
        string name; //название карты
        uint8 rate; //насколько карта сильна
    }
    struct Dealer {
        address payable name; //имя дилера
        uint256 cashAmmount; //колличество денег
        uint32 sumDealer; //сумма очков дилера
        Card[] cards;
    }
    TokenERC20 token;
    Player player;
    Dealer dealer;
    Card[] public deck; //колода карт

    address winner;
    bool public standP; // сделал ли стэнд игрок
    bool public standD; // сделал ли стэнд дилер

    uint32 constant Cards = 52;
    uint32 ammountOfCards;

    event Deposit(address _from, uint256 _value);
    event Get_Cards(address _from, uint256 sum);
    event Compare(address d, uint256 sumd, address p, uint256 sump);
    modifier points_player() {
        check_cards();
        require(player.sumPlayer <= 21, "You've lost.Total points over 21");
        _;
    } // проверка суммы баллов игрока

    modifier points_dealer() {
        check_cards();
        require(dealer.sumDealer <= 17, "Total points over 17");
        _;
    } // провера суммы баллов дилера
    modifier only_dealer() {
        require(msg.sender == dealer.name, "Only dealer can call this.");
        _;
    }

    modifier only_player() {
        require(msg.sender == player.name, "Only player can call this.");
        _;
    }

    function choose_dealer() public payable {
        dealer.name = msg.sender;
        dealer.cashAmmount = msg.value;
        emit Deposit(msg.sender, msg.value);
    } // получение адреса дилера

    function choose_player() public payable {
        player.cashAmmount = msg.value;
        player.name = msg.sender;
        emit Deposit(msg.sender, msg.value);
    } // получение адреса игрока

    function add_money_player() public payable only_player {
        player.cashAmmount += msg.value;
        emit Deposit(msg.sender, msg.value);
    } // увеличение ставки

    function add_money_dealer() public payable only_dealer {
        dealer.cashAmmount += msg.value;
        emit Deposit(msg.sender, msg.value);
        require(
            (player.cashAmmount) == dealer.cashAmmount,
            "Rates must be the same."
        );
    } // увеличение ставки

    function giveToPlayer(uint256 card1, uint256 card2) private {
        player.cards.push(deck[card1]);
        player.sumPlayer += deck[card1].rate;
        deck[card1] = deck[ammountOfCards - 1];
        delete deck[ammountOfCards - 1];
        ammountOfCards--;

        player.cards.push(deck[card2]);
        player.sumPlayer += deck[card2].rate;
        deck[card2] = deck[ammountOfCards - 1];
        delete deck[ammountOfCards - 1];
        ammountOfCards--;
    }

    function giveToPlayer(uint256 card) private {
        Card[] storage card1 = deck;
        player.cards.push(card1[card]);
        player.sumPlayer += deck[card].rate;
        deck[card] = deck[ammountOfCards - 1];
        delete deck[ammountOfCards - 1];
        ammountOfCards--;
    }

    function giveCards() public only_dealer {
        require(!player.hasCards, "The player already has cards.");
        require(deck.length != 0, "No more cards in the deck!");

        //выдача карт
        uint256 card = rand();
        dealer.cards.push(deck[card]);
        dealer.sumDealer += deck[card].rate;
        deck[card] = deck[ammountOfCards - 1];
        delete deck[ammountOfCards - 1];
        ammountOfCards--;

        uint256 card1 = rand();
        uint256 card2 = rand();

        giveToPlayer(card1, card2);

        player.hasCards = true;
        emit Compare(
            dealer.name,
            dealer.sumDealer,
            player.name,
            player.sumPlayer
        );
    } //Раздать карты

    function hit_dealer() public only_dealer points_dealer {
        uint256 cardDealer = rand();
        dealer.cards.push(deck[cardDealer]);
        dealer.sumDealer += deck[cardDealer].rate;
        deck[cardDealer] = deck[ammountOfCards - 1];
        delete deck[ammountOfCards - 1];
        ammountOfCards--;
        emit Get_Cards(dealer.name, dealer.sumDealer);
    } //взять еще одну карту

    function hit_player() public only_player points_player {
        uint256 cardPlayer = rand();
        giveToPlayer(cardPlayer);
        emit Get_Cards(player.name, player.sumPlayer);
    }

    function stand() public {
        if (msg.sender == dealer.name) {
            standD = true;
        } else {
            standP = true;
        }
    } // завершить набор карт

    function check_cards() public {
        require(
            player.hasCards,
            "Player doesn't have cards" // у игрока нет карт
        );
        player.sumPlayer = 0;
        dealer.sumDealer = 0;
        for (uint32 i = 0; i < player.cards.length; i++) {
            player.sumPlayer += player.cards[i].rate;
        }
        for (uint32 i = 0; i < dealer.cards.length; i++) {
            dealer.sumDealer += dealer.cards[i].rate;
        }
    } // подсчет суммы баллов

    function checkWinner() public {
        require(
            (player.cashAmmount) == dealer.cashAmmount,
            "Rates must be the same."
        );
        require(standP == true && standD == true, "Not all made 'stand");
        if ((player.sumPlayer > dealer.sumDealer) && (player.sumPlayer <= 21)) {
            player.name.transfer(dealer.cashAmmount + player.cashAmmount);
            token.transfer123(player.name, dealer.name,dealer.cashAmmount + player.cashAmmount);
            winner = player.name;
        } else if (player.sumPlayer == dealer.sumDealer) {
            dealer.name.transfer(dealer.cashAmmount);
            player.name.transfer(player.cashAmmount);
        } else {
            dealer.name.transfer(dealer.cashAmmount + player.cashAmmount);
            winner = dealer.name;
        }
        emit Compare(
            dealer.name,
            dealer.sumDealer,
            player.name,
            player.sumPlayer
        );
    }

    function check() public view returns (address) {
        return winner;
    }

    function fillDeck() private {
        ammountOfCards = Cards;
        //в колоде 52 карты, заполняем их
        for (uint8 i = 0; i < 4; i++) {
            //заполняем карты от 2 до 10
            for (uint8 j = 2; j <= 10; j++) {
                deck.push(Card({name: uint2str(j), rate: j}));
            }
            deck.push(
                Card({
                    name: "Jack", //валет
                    rate: 10
                })
            );
            deck.push(
                Card({
                    name: "Lady", //дама
                    rate: 10
                })
            );
            deck.push(
                Card({
                    name: "King", //король
                    rate: 10
                })
            );
            deck.push(
                Card({
                    name: "Ace", //туз
                    rate: 11
                })
            );
        }
    }

    constructor() public {
        dealer.cashAmmount = 0;
        player.cashAmmount = 0;
        dealer.sumDealer = 0;
        player.sumPlayer = 0;
        //token = new TokenERC20(1, "ss", "s");
        
        fillDeck();
    }

    //Вспомогательные функции
    //Рандом
    uint256 randNonce = 0;

    function rand() internal returns (uint256) {
        randNonce++;
        return
            uint256(keccak256(abi.encodePacked(msg.sender, randNonce))) %
            ammountOfCards;
    }

    function uint2str(uint8 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len = 0;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (true) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
            if (_i != 0) {
                continue;
            } else break;
        }
        return string(bstr);
    }
}

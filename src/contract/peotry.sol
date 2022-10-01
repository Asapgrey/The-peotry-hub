// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract YouDeserveToRead {
    uint256 public poemsLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Poem {
        address payable owner;
        string title;
        string poem;
        uint256 likes;
        uint256 price;
        mapping(address => bool) hasLiked;
        bool forSale;
    }
    mapping(uint256 => Poem) private poems;

    /**
     * @dev allow users to add a poem to the platform
     * @notice Input data needs to contain only valid values
     */
    function addPoem(
        string calldata _title,
        string calldata _poem,
        uint256 _price
    ) public {
        require(bytes(_title).length > 0, "Empty title");
        require(bytes(_poem).length > 0, "Empty poem");
        Poem storage poetry = poems[poemsLength];

        poetry.owner = payable(msg.sender);
        poetry.title = _title;
        poetry.poem = _poem;
        poetry.price = _price;
        poetry.forSale = true;

        poemsLength++;
    }

    function getPoem(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            bool,
            bool
        )
    {
        return (
            poems[_index].owner,
            poems[_index].title,
            poems[_index].poem,
            poems[_index].likes,
            poems[_index].price,
            poems[_index].hasLiked[msg.sender],
            poems[_index].forSale
        );
    }

    /**
     * @dev allow users to like a poem
     * @notice you can only like a poem once
     */
    function Like(uint256 _index) public {
        Poem storage currentPoem = poems[_index];
        require(currentPoem.owner != address(0), "Query of nonexistent poem");
        require(
            currentPoem.hasLiked[msg.sender] == false,
            "User can like the peom only once"
        );
        currentPoem.likes++;
        currentPoem.hasLiked[msg.sender] = true;
    }

    /**
     * @dev allow users to buy a poem that is on sale
     * @notice Poem must be on sale
     */
    function buyPoem(uint256 _index) public payable {
        Poem storage currentPoem = poems[_index];
        require(currentPoem.forSale, "Poem isn't on sale");
        require(currentPoem.owner != msg.sender, "You can't buy your own poem");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentPoem.owner,
                currentPoem.price
            ),
            "Transfer failed."
        );

        currentPoem.owner = payable(msg.sender);
        currentPoem.forSale = false;
    }

    /**
     * @dev allow poems' owners to toggle the forSale status of a poem
     */
    function toggleForSale(uint256 _index) public {
        poems[_index].forSale = !poems[_index].forSale;
    }

    function getPoemsLength() public view returns (uint256) {
        return (poemsLength);
    }
}

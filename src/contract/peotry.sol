 // SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


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

contract   YouDeserveToRead {
    
    
    uint public peomsLength = 0;
    address internal cUsdTokenAddress = 
    0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct  Peom {
        address payable owner;
        string title;
        string peom;
        uint likes;
         uint price;

         mapping(address => bool) hasLiked;
     bool forSale;
        
    }
     mapping (uint =>  Peom) internal peoms;
    
    // events for some actions performed on the contract by users
    event peomAdded(address indexed sender, uint peomIndex);
    event peomBought(address indexed buyer, address seller, uint peomIndex, uint price);
    event peomLiked(address indexed sender, uint peomIndex);

    // modifier to impose a condition that only a peom owner can perform.
    modifier checkPeomOwner(uint _index) {
        require (peoms[_index].owner == msg.sender, "Only the owner of this peom is allowed to perform this action");
        _;
    }

     function  addPeom(
        string memory _title, 
        string memory _peom,
        uint _price

          ) public {
       Peom storage peotry = peoms[peomsLength];


         peotry.owner = payable(msg.sender);
          peotry.title = _title;
          peotry.peom = _peom;
          peotry.price = _price;
          peotry.forSale= true;

        emit peomAdded(msg.sender, peomsLength);
        peomsLength++;
          }


     function getPeom(uint _index) public view returns (
        address payable,
        string memory,  
        string memory,
        uint,
        uint,
        bool,
        bool
        
      
    ) {
        return (  
            peoms[_index].owner,
             peoms[_index].title,
              peoms[_index].peom,
              peoms[_index].likes,
               peoms[_index].price,
               peoms[_index].hasLiked[msg.sender],
               peoms[_index].forSale
        );
    }

     function Like(uint _index)public{
        require(peoms[_index].hasLiked[msg.sender] == false, "User can like the peom only once");
        peoms[_index].likes++;
        peoms[_index].hasLiked[msg.sender] = true;
        emit peomLiked(msg.sender, _index);
     }

      function buyPeom(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            peoms[_index].owner,
            peoms[_index].price
          ),
          "Transfer failed."
        );
        emit peomBought(msg.sender, peoms[_index].owner, _index, peoms[_index].price);
        peoms[_index].owner = payable(msg.sender);
         
    }

    // added require to prevent redundant transactions.
    function End_Sale(uint _index) public checkPeomOwner(_index) {
        require (peoms[_index].forSale == true, "The sale of this peom has already ended");
        peoms[_index].forSale = false;
    }
    
    // function to enable the sale of a peom again.
    function Add_to_Sale(uint _index) public checkPeomOwner(_index) {
        require (peoms[_index].forSale == true, "This peom is already on sale");
        peoms[_index].forSale = true;
    }

    function getpeomsLength() public view returns (uint) {
        return (peomsLength);
    }
}

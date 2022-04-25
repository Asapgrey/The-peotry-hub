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

         peoms[_index].owner = payable(msg.sender);
         
    }

    function End_Sale(uint _index) public {
        peoms[_index].forSale = false;
    }
    

      //  this function returns the total number of billboardss
    function getpeomsLength() public view returns (uint) {
        return (peomsLength);
    }
}




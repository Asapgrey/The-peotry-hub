import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect, useCallback } from "react";



import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import YouDeserveToRead  from  './contract/YouDeserveToRead.abi.json';
import Peoms from './components/Peoms';
import Newpeom from './components/Newpeom';
 
 
 
 




const ERC20_DECIMALS = 18;


const contractAddress =  "0x27f733B51d85DdB92b2580Ceb42eC4C90D8cB435";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";




function App() {

  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [peoms, setPeoms] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error Occurred");
    }
  };

  const getBalance = (async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(YouDeserveToRead , contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
     
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      getPeom();
    }
  }, [contract]);  

  
  const getPeom = (async () => {
    const peomsLength = await contract.methods.getpeomsLength().call();
    const _peomm = []
    for (let index = 0; index < peomsLength; index++) {
      console.log(peomsLength);
      let _peoms = new Promise(async (resolve, reject) => {
      let peom = await contract.methods.getPeom(index).call();

      resolve({
        index: index,
        owner: peom[0],
        title: peom[1],
        peom: peom[2],
        likes: peom[3],
        price: peom[4],
        hasLiked: peom[5],
        forSale: peom[6]

               
      });
    });
    _peomm.push(_peoms);
  }

  const peoms = await Promise.all(_peomm);
setPeoms(peoms);
  console.log(peoms)
});

const addPeom = async (
  _title,
  _peom,
  price
) => {

  const _price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();
  try {
    await contract.methods
      .addPeom(_title,_peom,_price)
      .send({ from: address });
     getPeom();
  } catch (error) {
    console.log(error);
  }
};

const Like = async (_index) => {
  try {
    await contract.methods.Like(_index).send({ from: address });
    getPeom ();
    getBalance();
  } catch (error) {
    alert.log(error);
  }};

  const buyPeom = async (_index,) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
    
      
      await cUSDContract.methods
        .approve(contractAddress, peoms[_index].price)
        .send({ from: address });
      await contract.methods.buyPeom(_index).send({ from: address });
      getPeom();
      getBalance();
    } catch (error) {
      console.log(error)
    }};

    return (
      <div>
        <Navbar balance = {cUSDBalance} />
        <Peoms peoms ={peoms}
        buyPeom = {buyPeom}
        Like= {Like}
         
        />
         <Newpeom addPeom = {addPeom}
         
/>
      </div>
      )


}




export default App;

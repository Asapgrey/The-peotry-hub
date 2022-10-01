import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect, useCallback } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import YouDeserveToRead from "./contract/YouDeserveToRead.abi.json";
import Peoms from "./components/Poems";
import NewPoem from "./components/NewPoem";

const ERC20_DECIMALS = 18;

const contractAddress = "0x27f733B51d85DdB92b2580Ceb42eC4C90D8cB435";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
	const [contract, setcontract] = useState(null);
	const [address, setAddress] = useState(null);
	const [kit, setKit] = useState(null);
	const [cUSDBalance, setcUSDBalance] = useState(0);
	const [poems, setPoems] = useState([]);

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

	const getBalance = async () => {
		try {
			const balance = await kit.getTotalBalance(address);
			const USDBalance = balance.cUSD
				.shiftedBy(-ERC20_DECIMALS)
				.toFixed(2);
			const contract = new kit.web3.eth.Contract(
				YouDeserveToRead,
				contractAddress
			);
			setcontract(contract);
			setcUSDBalance(USDBalance);
		} catch (error) {
			console.log(error);
		}
	};

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
			getPoem();
		}
	}, [contract]);

	const getPoem = async () => {
		const peomsLength = await contract.methods.getPoemsLength().call();
		const _poem = [];
		for (let index = 0; index < peomsLength; index++) {
			let _peoms = new Promise(async (resolve, reject) => {
				let peom = await contract.methods.getPoem(index).call();

				resolve({
					index: index,
					owner: peom[0],
					title: peom[1],
					peom: peom[2],
					likes: peom[3],
					price: peom[4],
					hasLiked: peom[5],
					forSale: peom[6],
				});
			});
			_poem.push(_peoms);
		}

		const poems = await Promise.all(_poem);
		setPoems(poems);
	};

	const addPoem = async (_title, _peom, price) => {
		const _price = new BigNumber(price)
			.shiftedBy(ERC20_DECIMALS)
			.toString();
		try {
			await contract.methods
				.addPoem(_title, _peom, _price)
				.send({ from: address });
			getPoem();
		} catch (error) {
			console.log(error);
		}
	};

	const Like = async (_index) => {
		try {
			await contract.methods.Like(_index).send({ from: address });
			getPoem();
			getBalance();
		} catch (error) {
			alert.log(error);
		}
	};

	const buyPoem = async (_index) => {
		try {
			const cUSDContract = new kit.web3.eth.Contract(
				IERC,
				cUSDContractAddress
			);

			await cUSDContract.methods
				.approve(contractAddress, peoms[_index].price)
				.send({ from: address });
			await contract.methods.buyPoem(_index).send({ from: address });
			getPoem();
			getBalance();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Navbar balance={cUSDBalance} />
			<Peoms poems={poems} buyPoem={buyPoem} Like={Like} />
			<NewPoem addPoem={addPoem} />
		</div>
	);
}

export default App;

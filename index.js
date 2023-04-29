//in nodejs
//require()

//in fron-end js you cnat use require
// import

import { Contract, ethers } from "./ethers-5.6.esm.min.js"
import { abi } from "./constants.js"
import { contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected!"
  } else {
    connectButton.innerHTML = "Please install metamask"
  }
}
//fund function
async function fund() {
  const ehtAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ehtAmount}`)
  if (typeof window.ethereum != "undefined") {
    //provider connector to the bc
    //signer / wallet / someone with some gas
    //contract that we are interact with
    // ABI  and Address

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ehtAmount),
      })
      //listen for the tx tp be mined
      //listen for an event <- we have not learned about yet
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch (error) {
      console.log(error)
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log("The balance is", ethers.utils.formatEther(balance))
  }
}
//withdraw
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try{
        const transacitionResponse = await contract.withdraw()
        await listenForTransactionMine(transacitionResponse, provider)
    }catch(error){
        console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log("Mining", transactionResponse.hash, "...")
  return new Promise((resolve, reject) => {
    //listen for this transacition to finish
    provider.once(transactionResponse.hash, (transacitionReceipt) => {
      console.log(
        "Completed with",
        transacitionReceipt.confirmations,
        "confirmations"
      )
      resolve()
    })
  })
}

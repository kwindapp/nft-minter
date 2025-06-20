import Head from 'next/head'
import { useState } from 'react'
import { NFTStorage, File } from 'nft.storage'
import { ethers } from 'ethers'

// Replace with your deployed contract address
const contractAddress = "0xYourContractAddress"
const contractABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
]

// NFT.Storage API Key
const NFT_STORAGE_KEY = "3aed0601.4cabb0d99678455d9b1df3115bcff73f"
const client = new NFTStorage({ token: NFT_STORAGE_KEY })

export default function UploadForm() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)
  const [minting, setMinting] = useState(false)

  // Form state
  const [productName, setProductName] = useState("")
  const [productModel, setProductModel] = useState("")
  const [year, setYear] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [additionalData, setAdditionalData] = useState("")
  const [file, setFile] = useState(null)

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch {
      setError("Wallet connection failed.")
    }
  }

  const uploadFileToIPFS = async () => {
    const imageFile = new File([file], file.name, { type: file.type })

    const metadata = await client.store({
      name: productName,
      description: additionalData,
      image: imageFile,
      properties: {
        model: productModel,
        year,
        serialNumber
      }
    })

    return metadata.url // ipfs://.../metadata.json
  }

  const mintNFT = async (e) => {
    e.preventDefault()
    setError(null)

    if (!account) return setError("Connect wallet first.")
    if (!file || !productName || !productModel || !year || !serialNumber) {
      return setError("Please fill all required fields and upload image.")
    }

    try {
      setMinting(true)
      const tokenURI = await uploadFileToIPFS()

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.mintNFT(account, tokenURI)
      await tx.wait()
      alert("NFT minted successfully! Tx Hash: " + tx.hash)

      // Reset
      setProductName("")
      setProductModel("")
      setYear("")
      setSerialNumber("")
      setAdditionalData("")
      setFile(null)
    } catch (err) {
      console.error(err)
      setError(err.message || "Minting failed.")
    } finally {
      setMinting(false)
    }
  }

  return (
    <>
      <Head>
        <title>HeliumSmartWorld NFT Mint Tool</title>
      </Head>
      <div className="w-screen h-auto flex justify-end items-center">
        <button
          onClick={connectWallet}
          className="mt-6 mr-10 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-600"
        >
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>
      </div>
      <div className="flex items-center justify-center overflow-y-hidden bg-white min-h-screen">
        <div className="w-2/3 max-w-screen mt-6">
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight drop-shadow-md">
            HeliumSmartWorld KWind Product NFT Mint Tool
          </h1>

          <form onSubmit={mintNFT}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                <Input label="Product Name" value={productName} onChange={setProductName} placeholder="North" />
                <Input label="Product Model" value={productModel} onChange={setProductModel} placeholder="Orbit 9m2" />
                <Input label="Year" value={year} onChange={setYear} type="number" placeholder="2025" />
                <Input label="Serial Number" value={serialNumber} onChange={setSerialNumber} placeholder="SN:" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Data</label>
                  <textarea
                    rows={3}
                    value={additionalData}
                    onChange={e => setAdditionalData(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Any other relevant specs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Product Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <input type="file" onChange={e => setFile(e.target.files[0])} />
                      <p className="text-xs text-gray-500">PNG, JPG, or GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={minting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {minting ? "Minting..." : "Mint Product NFT"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  )
}

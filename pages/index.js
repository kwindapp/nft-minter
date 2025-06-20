import Head from 'next/head'
import { useState } from 'react'
import { NFTStorage, File } from 'nft.storage'
import { ethers } from 'ethers'

// Replace with your actual deployed contract address
const contractAddress = "0xYourContractAddress"
const contractABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
]

// Your NFT.Storage API key
const NFT_STORAGE_KEY = "2e5743e4.e1a6bad77aa64faabd6dbe67418c3e68"
const client = new NFTStorage({ token: NFT_STORAGE_KEY })

export default function UploadForm() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)
  const [minting, setMinting] = useState(false)

  const [productName, setProductName] = useState("")
  const [productModel, setProductModel] = useState("")
  const [year, setYear] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [additionalData, setAdditionalData] = useState("")
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [mintedImageUrl, setMintedImageUrl] = useState(null)

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setError(null)
    } catch {
      setError("⚠ Wallet connection failed. Please try again.")
    }
  }

  const uploadFileToIPFS = async () => {
    try {
      const imageFile = new File([file], file.name, { type: file.type })

      const metadata = await client.store({
        name: productName,
        description: additionalData || "No additional data",
        image: imageFile,
        properties: {
          model: productModel,
          year,
          serialNumber
        }
      })

      return metadata.url // ipfs://.../metadata.json
    } catch (err) {
      throw new Error("IPFS upload failed: " + err.message)
    }
  }

  const fetchMetadataAndGetImageUrl = async (tokenURI) => {
    try {
      const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch metadata")
      const metadata = await response.json()
      if (!metadata.image) throw new Error("Metadata does not contain image URL")
      return metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    } catch (err) {
      console.error("Error fetching metadata or image:", err)
      return null
    }
  }

  const mintNFT = async (e) => {
    e.preventDefault()
    setError(null)
    setMintedImageUrl(null)

    if (!account) return setError("⚠ Connect wallet first.")
    if (!file || !productName || !productModel || !year || !serialNumber) {
      return setError("⚠ Please fill all required fields and upload an image.")
    }

    try {
      setMinting(true)

      // Upload metadata and image to IPFS
      const tokenURI = await uploadFileToIPFS()

      // Connect to contract and mint NFT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.mintNFT(account, tokenURI)
      await tx.wait()

      alert("✅ NFT minted successfully!\nTransaction Hash:\n" + tx.hash)

      // Fetch the image URL from metadata to display minted NFT image
      const imageUrl = await fetchMetadataAndGetImageUrl(tokenURI)
      setMintedImageUrl(imageUrl)

      // Reset form
      setProductName("")
      setProductModel("")
      setYear("")
      setSerialNumber("")
      setAdditionalData("")
      setFile(null)
      setPreviewUrl(null)
      document.getElementById("image-upload").value = null

    } catch (err) {
      console.error(err)
      setError(err.message || "⚠ Minting failed.")
    } finally {
      setMinting(false)
    }
  }

  const onFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <>
      <Head>
        <title>HeliumSmartWorld NFT Mint Tool</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
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

          <h1
            className="text-4xl sm:text-5xl font-bold text-center mb-8 tracking-tight drop-shadow-md"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
          >
            Helium
            <span className="text-black fade-slide-in" style={{ animationDelay: "0.5s" }}>SmartWorld</span>
            <span className="text-indigo-500 color-pulse fade-slide-in" style={{ animationDelay: "1s" }}>
              {' '}Product NFT Mint Tool
            </span>
          </h1>

          <style>{`
            @keyframes fadeSlideIn {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes colorPulse {
              0%, 100% {
                color: #6366f1; /* indigo-500 */
              }
              50% {
                color:rgb(13, 116, 121); /* darker indigo */
              }
            }

            .fade-slide-in {
              animation: fadeSlideIn 1s ease forwards;
            }

            .color-pulse {
              animation: colorPulse 3s ease-in-out infinite;
            }
          `}</style>

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
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                      />
                      <p className="text-xs text-gray-500">PNG, JPG, or GIF up to 10MB</p>

                      {/* Preview uploaded image */}
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Image Preview"
                          className="mx-auto mt-2 max-w-xs rounded-md shadow-md"
                        />
                      )}
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

          {/* Show minted NFT image */}
          {mintedImageUrl && (
            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Minted NFT Image:</h2>
              <img
                src={mintedImageUrl}
                alt="Minted NFT"
                className="mx-auto max-w-xs rounded-md shadow-lg"
              />
            </div>
          )}
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

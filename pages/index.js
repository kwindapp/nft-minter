import Head from 'next/head'
import { useEffect, useState } from 'react'
import { NFTStorage, File } from 'nft.storage'
import { ethers } from 'ethers'

const contractAddress = "0xYourContractAddress" // Replace with your actual contract address
const contractABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
]

const NFT_STORAGE_KEY = "42baf681.b4b188b5a0bd417da29e0ef011116732"
const client = new NFTStorage({ token: NFT_STORAGE_KEY })

const uploadToIPFS = async (name, description, imageFile) => {
  try {
    const metadata = await client.store({
      name,
      description,
      image: new File([imageFile], imageFile.name, { type: imageFile.type }),
    })
    return metadata.url
  } catch (err) {
    throw new Error("IPFS upload failed: " + err.message)
  }
}

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

  // Animate browser tab title (document.title)
  useEffect(() => {
    const tabTitle = "HeliumSmartWorld NFT Mint Tool 🚀   "
    let pos = 0
    const interval = setInterval(() => {
      document.title = tabTitle.substring(pos) + tabTitle.substring(0, pos)
      pos = (pos + 1) % tabTitle.length
    }, 300)
    return () => clearInterval(interval)
  }, [])

  // Animate page heading text
  const fullHeading = "HeliumSmartWorld KWind Product NFT Mint Tool 🚀   "
  const [animatedHeading, setAnimatedHeading] = useState(fullHeading)
  useEffect(() => {
    let pos = 0
    const interval = setInterval(() => {
      setAnimatedHeading(fullHeading.substring(pos) + fullHeading.substring(0, pos))
      pos = (pos + 1) % fullHeading.length
    }, 300)
    return () => clearInterval(interval)
  }, [])

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setError(null)
    } catch {
      setError("⚠ Wallet connection failed. Please try again.")
    }
  }

  const fetchMetadataAndGetImageUrl = async (tokenURI) => {
    try {
      const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      const response = await fetch(url)
      const metadata = await response.json()
      return metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
    } catch (err) {
      console.error("Error fetching metadata:", err)
      return null
    }
  }

  const mintNFT = async (e) => {
    e.preventDefault()
    setError(null)
    setMintedImageUrl(null)

    if (!account) return setError("⚠ Connect wallet first.")
    if (!file || !productName || !productModel || !year || !serialNumber) {
      return setError("⚠ Fill all fields and upload an image.")
    }

    try {
      setMinting(true)

      const tokenURI = await uploadToIPFS(
        productName,
        additionalData || "No additional data",
        file
      )

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.mintNFT(account, tokenURI)
      await tx.wait()

      alert("✅ NFT minted!\nTransaction Hash:\n" + tx.hash)

      const imageUrl = await fetchMetadataAndGetImageUrl(tokenURI)
      setMintedImageUrl(imageUrl)

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
    if (selectedFile) setPreviewUrl(URL.createObjectURL(selectedFile))
    else setPreviewUrl(null)
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
          className="mt-6 mr-10 py-2 px-4 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-600"
        >
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>
      </div>

      <div className="flex items-center justify-center bg-white min-h-screen">
        <div className="w-2/3 max-w-screen mt-6">

          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 tracking-tight drop-shadow-md">
            {animatedHeading}
          </h1>

          <form onSubmit={mintNFT}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <Input label="Product Name" value={productName} onChange={setProductName} placeholder="e.g.North" />
                <Input label="Product Model" value={productModel} onChange={setProductModel} placeholder="e.g.Orbit 9m2" />
                <Input label="Year" value={year} onChange={setYear} type="number" placeholder="2025" />
                <Input label="Serial Number" value={serialNumber} onChange={setSerialNumber} placeholder="SN:" />

                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Data</label>
                  <textarea
                    rows={3}
                    value={additionalData}
                    onChange={e => setAdditionalData(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Any other relevant specs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Product Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <input id="image-upload" type="file" accept="image/*" onChange={onFileChange} />
                      <p className="text-xs text-gray-500">PNG, JPG, or GIF up to 10MB</p>
                      {previewUrl && (
                        <img src={previewUrl} alt="Preview" className="mx-auto mt-2 max-w-xs rounded-md shadow-md" />
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
                  className="py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {minting ? "Minting..." : "Mint Product NFT"}
                </button>
              </div>
            </div>
          </form>

          {mintedImageUrl && (
            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Minted NFT Image:</h2>
              <img src={mintedImageUrl} alt="Minted NFT" className="mx-auto max-w-xs rounded-md shadow-lg" />
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
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
      />
    </div>
  )
}

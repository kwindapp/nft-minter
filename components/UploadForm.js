import Head from 'next/head'

export default function UploadForm() {
  return (
    <>
      <Head>
        <title>Product Mint</title>
      </Head>
      <div className='w-screen h-auto flex justify-end items-center'>
        <button
          type="button"
          className='mt-6 mr-10 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
          Logout
        </button>
      </div>
      <div className="flex items-center justify-center overflow-y-hidden bg-white min-h-screen">
        <div className="w-2/3 max-w-screen mt-6">

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight drop-shadow-md">
            HeliumSmartWorld KWind Product NFT Mint Tool
          </h1>

          <form>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">

                {/* Product Name */}
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="North"
                  />
                </div>

                {/* Product Model */}
                <div>
                  <label htmlFor="productModel" className="block text-sm font-medium text-gray-700">
                    Product Model
                  </label>
                  <input
                    type="text"
                    name="productModel"
                    id="productModel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Orbit 9m2"
                  />
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    id="year"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="2025"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    id="serialNumber"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="SN"
                  />
                </div>

                {/* Additional Data */}
                <div>
                  <label htmlFor="additionalData" className="block text-sm font-medium text-gray-700">
                    Additional Data
                  </label>
                  <textarea
                    id="additionalData"
                    name="additionalData"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Any other relevant specifications or notes..."
                  />
                </div>

                {/* Product Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Product (Mask) Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload product image</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Mint Product NFT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

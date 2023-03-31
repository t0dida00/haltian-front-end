import React, { useState } from "react"

export const Connection = () => {
  const [clientId, setClientId] = useState("")
  const [hostProtocol, setHostProtocol] = useState("mqtt")
  const [hostAddress, setHostAddress] = useState("")
  const [topic, setTopic] = useState("")
  const [useSSL, setUseSSL] = useState(false)
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Perform form submission logic here, such as sending data to a server
  }

  return (
    <div className="h-screen bg-[#F8F8FF]">
      <p className="text-center text-6xl text-light-purple font-bold py-8">
        WELCOME
      </p>
      <p className="text-center text-3xl text-light-purple pb-8">
        Haltian Demo
      </p>

      <div className="flex justify-center">
        <form
          className="w-[40%] bg-white rounded-xl p-8"
          onSubmit={handleSubmit}
        >
          <div className="font-semibold text-xl mb-2">Connection Input</div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="clientId"
            >
              Client ID:
            </label>
            <input
              className="w-[85%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
              type="text"
              id="clientId"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="hostProtocol"
            >
              Host:
            </label>
            <div className="w-[85%]">
              <select
                className="w-[20%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
                id="hostProtocol"
                value={hostProtocol}
                onChange={(event) => setHostProtocol(event.target.value)}
              >
                <option value="mqtt">mqtt</option>
                <option value="mqtts">mqtts</option>
              </select>
              <input
                className="w-[80%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
                type="text"
                id="hostAddress"
                value={hostAddress}
                onChange={(event) => setHostAddress(event.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="clientId"
            >
              Topic:
            </label>
            <input
              className="w-[85%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
              type="text"
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="useSSL"
            >
              SSL/TLS:
            </label>
            <input
              className="my-4 rounded focus:ring-light-purple"
              type="checkbox"
              id="useSSL"
              checked={useSSL}
              onChange={(event) => setUseSSL(event.target.checked)}
            />
          </div>

          <div className="font-semibold text-xl mt-8 mb-2">Certificates</div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="file1"
            >
              File 1:
            </label>
            <input
              className="w-[85%] pl-2 my-2"
              type="file"
              id="file1"
              onChange={(event) => setFile1(event.target.files[0])}
            />
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="file2"
            >
              File 2:
            </label>
            <input
              className="w-[85%] pl-2 my-2 "
              type="file"
              id="file2"
              onChange={(event) => setFile2(event.target.files[0])}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="mt-8 bg-light-purple text-white rounded-full px-6 py-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

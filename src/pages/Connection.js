import React, { useState } from "react"
import { useNavigate } from "react-router-dom"


const development_URL = "http://localhost:8080/"
const production_URL = "https://air-quality.azurewebsites.net/"
export const Connection = () => {
  const [clientId, setClientId] = useState("")
  const [protocol, setProtocol] = useState("mqtt")
  const [host, setHost] = useState("")
  const [port, setPort] = useState("")
  const [topic, setTopic] = useState("")
  const [useSSL, setUseSSL] = useState(false)
  const [cert, setCert] = useState(null)
  const [key, setKey] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    navigate("/dashboard")

    const formData = new FormData()
    formData.append("clientId", clientId)
    formData.append("protocol", protocol)
    formData.append("host", host)
    formData.append("port", port)
    formData.append("topic", topic)
    formData.append("useSSL", useSSL)
    formData.append("cert", cert)
    formData.append("key", key)

    const response = await fetch(`${production_URL}set-up`, {
      method: "POST",
      body: formData,
    })
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
              htmlFor="protocol"
            >
              Host:
            </label>
            <div className="w-[85%]">
              <select
                className="w-[20%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
                id="protocol"
                value={protocol}
                onChange={(event) => setProtocol(event.target.value)}
              >
                <option value="mqtt">mqtt</option>
                <option value="mqtts">mqtts</option>
              </select>
              <input
                className="w-[80%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
                type="text"
                id="host"
                value={host}
                onChange={(event) => setHost(event.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="clientId"
            >
              Port:
            </label>
            <input
              className="w-[85%] border border-gray-300 focus:outline-none focus:border-light-purple rounded-lg shadow-sm pl-2 my-2 py-1"
              type="text"
              id="port"
              value={port}
              onChange={(event) => setPort(event.target.value)}
            />
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
              htmlFor="cert"
            >
              Certificate:
            </label>
            <input
              className="w-[85%] pl-2 my-2"
              type="file"
              id="cert"
              onChange={(event) => setCert(event.target.files[0])}
            />
          </div>

          <div className="flex justify-between">
            <label
              className="w-[10%] text-light-purple align-center my-auto text-right"
              htmlFor="key"
            >
              Key:
            </label>
            <input
              className="w-[85%] pl-2 my-2 "
              type="file"
              id="key"
              onChange={(event) => setKey(event.target.files[0])}
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

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import axios from "axios"

export const History = () => {
  const navigate = useNavigate()
  const navigateDashboard = () => {
    navigate("/dashboard")
  }

  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3000/history")
      .then((res) => {
        setData(res.data.list)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const co2Data = data.map((item) => {
    const date = new Date(item.time)
    const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    return { Time: formattedTime, CO2: item.CO2 }
  })

  const humidityData = data.map((item) => {
    const date = new Date(item.time)
    const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    return { Time: formattedTime, Humidity: item.humidity }
  })

  const temperatureData = data.map((item) => {
    const date = new Date(item.time)
    const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    return { Time: formattedTime, Temperature: item.temperature }
  })

  return (
    <div className="bg-[#F8F8FF] h-screen flex flex-col justify-around">
      <div className="text-5xl text-light-purple font-bold mx-auto">
        HALTIAN DEMO
      </div>
      <div className="bg-white rounded-xl w-[80%] h-[80%] mx-auto p-8">
        <div className="flex py-8 justify-between">
          <div className="text-2xl font-semibold">History Data</div>
          <button
            className="w-[10%] bg-light-purple text-white rounded-full"
            onClick={navigateDashboard}
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-2 grid-rows-2">
          <ResponsiveContainer width="200%" height={300}>
            <LineChart data={temperatureData}>
              <XAxis dataKey="Time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <div></div>

          <ResponsiveContainer>
            <LineChart data={humidityData}>
              <XAxis dataKey="Time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer>
            <LineChart data={co2Data}>
              <XAxis dataKey="Time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="CO2" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

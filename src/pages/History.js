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
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const co2Data = data.map((item) => ({ time: item.time, CO2: item.CO2 }))
  const humidityData = data.map((item) => ({
    time: item.time,
    humidity: item.humidity,
  }))
  const temperatureData = data.map((item) => ({
    time: item.time,
    temperature: item.temperature,
  }))

  return (
    <div className="bg-[#F8F8FF] h-screen flex flex-col justify-around">
      <div className="bg-white rounded-xl w-[80%] h-[80%] mx-auto p-8">
        <div className="flex py-8 justify-between">
          <div className="text-3xl text-light-purple font-semibold">
            History
          </div>
          <button
            className="w-[10%] bg-light-purple text-white rounded-full"
            onClick={navigateDashboard}
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-2 grid-rows-2">
          <LineChart width={600} height={300} data={co2Data}>
            <XAxis dataKey="Time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="CO2" stroke="#8884d8" />
          </LineChart>

          <LineChart width={600} height={300} data={humidityData}>
            <XAxis dataKey="Time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" />
          </LineChart>

          <LineChart width={600} height={300} data={temperatureData}>
            <XAxis dataKey="Time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Temperature" stroke="#ffc658" />
          </LineChart>
        </div>
      </div>
    </div>
  )
}

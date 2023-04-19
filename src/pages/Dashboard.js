import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
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
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js"
import socket from "./Socket"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export const Dashboard = ({ historyData }) => {
  const navigate = useNavigate()

  const navigateHistory = () => {
    navigate("/history")
  }

  const disconnect = () => {
    fetch("https://air-quality.azurewebsites.net/set-up/disconnection/", {
      method: "POST",
    }).then((response) => {
      console.log("Disconnected")
    })
  }

  const navigateConnection = () => {
    localStorage.clear()
    disconnect()
    navigate("/")
  }

  const [realtimeData, setRealtimeData] = useState({
    light: null,
    co2: null,
    tvoc: null,
    humd: null,
    airp: null,
    temp: null,
    sunrise: null,
    sunset: null,
  })

  const [aqi, setAqi] = useState(null)
  const [quality, setQuality] = useState(null)
  const [co2Alert, setCo2Alert] = useState(false)
  const [tvocAlert, setTvocAlert] = useState(false)

  const co2Threshhold = 5000
  const tvocThreshhold = 350

  function handleDismiss() {
    setCo2Alert(false)
    setTvocAlert(false)
  }

  useEffect(() => {
    socket.on("message", (data) => {
      const temporary = JSON.parse(data)
      const { light, co2, tvoc, humd, airp, temp, sunrise, sunset } =
        temporary.elements
      const aqi = temporary.AQI
      const quality = temporary.Quality

      setRealtimeData({
        light,
        co2,
        tvoc,
        humd,
        airp: Math.round(airp),
        temp,
        sunrise,
        sunset,
      })
      setAqi(aqi)
      setQuality(quality)

      if (co2 > co2Threshhold) {
        setCo2Alert(true)
      } else if (tvoc > tvocThreshhold) {
        setTvocAlert(true)
      } else {
        setCo2Alert(false)
        setTvocAlert(false)
      }
    })

    return () => {}
  }, [])

  const [tempData, setTempData] = useState([])

  const fetchTempData = () => {
    fetch("https://air-quality.azurewebsites.net/history")
      .then((response) => response.json())
      .then((data) => {
        setTempData(data.list)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    fetchTempData()
  }, [])

  const temperatureData = tempData.map((item) => {
    const date = new Date(item.time)
    const formattedTime = `${date.toLocaleTimeString()}`
    return { Time: formattedTime, Temperature: item.temperature }
  })

  return (
    <div className="bg-[#F8F8FF] h-screen">
      {co2Alert && (
        <div className="fixed z-50 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-red-600 text-white font-bold p-16 rounded-lg shadow-lg flex items-center justify-between">
            <p className="text-6xl">CO2 Level is too high!</p>
            <button
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-4 text-3xl"
              onClick={handleDismiss}
            >
              X
            </button>
          </div>
        </div>
      )}
      {tvocAlert && (
        <div className="fixed z-50 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-red-600 text-white font-bold p-16 rounded-lg shadow-lg flex items-center justify-between">
            <p className="text-6xl">T.V.O.C. Level is too high!</p>
            <button
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-4 text-3xl"
              onClick={handleDismiss}
            >
              X
            </button>
          </div>
        </div>
      )}
      <div className="py-12 px-32">
        <div className="flex justify-between">
          <div className="text-light-purple font-bold text-5xl font-sans mb-12">
            HALTIAN DEMO
          </div>
          <div className="w-[10%]">
            <button
              className="rounded-xl bg-light-purple text-white h-[50%] w-full"
              onClick={navigateConnection}
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="flex justify-between mb-16">
          <div className="bg-white rounded-xl flex flex-col w-[25%] justify-around">
            <div className="text-center text-light-purple text-3xl">
              AIR QUALITY
            </div>

            <CircularProgressbar
              className="max-w-[55%] mx-auto"
              value={aqi || 100}
              text={`${aqi}%`}
              styles={buildStyles({
                textColor: "#7284FF",
                pathColor: "#7284FF",
                trailColor: "#F8F8FF",
              })}
            />

            <div className="text-center text-light-purple text-3xl font-semibold">
              {quality || "EXCELLENT"}
            </div>
          </div>

          <div className="w-[28%]">
            <div className="bg-white rounded-xl flex py-4 mb-8">
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="w-[55%] align-middle m-auto"
                  src="co2-cloud.png"
                  alt="img"
                />
              </div>

              <div>
                <div className="text-3xl text-light-purple font-medium pt-4 pb-4">
                  Carbon Dioxide
                </div>
                <div className="inline-block text-5xl pr-2 pb-8">
                  {realtimeData.co2 || 0}
                </div>
                <div className="inline-block text-3xl font-light">ppm</div>
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4">
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="w-[55%] align-middle m-auto"
                  src="flask.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium pt-4 pb-4">
                  T. V. O. C.
                </div>
                <div className="inline-block text-5xl pr-2 pb-8">
                  {realtimeData.tvoc || 0}
                </div>
                <div className="inline-block text-3xl font-light">ppb</div>
              </div>
            </div>
          </div>

          <div className="w-[28%]">
            <div className="bg-white rounded-xl flex py-4 mb-8">
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="max-w-[55%] align-middle m-auto"
                  src="barometer.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium pt-4 pb-4">
                  Air Pressure
                </div>
                <div className="inline-block text-5xl pr-2 pb-8">
                  {realtimeData.airp || 0}
                </div>
                <div className="inline-block text-3xl font-light">hPA</div>
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4">
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="max-w-[55%] align-middle m-auto"
                  src="thermometer.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium pt-4 pb-4">
                  Temperature
                </div>
                <div className="inline-block text-5xl pr-2 pb-8">
                  {realtimeData.temp || 0}
                </div>
                <div className="inline-block text-3xl font-light">Cel</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="w-[35%] rounded-xl">
            <div className="flex bg-white rounded-xl justify-around mb-8">
              <div className="flex w-[40%] py-8">
                <div className="border-r-2 border-r-black">
                  <div className="flex pb-4">
                    <img className="w-[30%] " src="humidity.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Humidity</div>
                      <div className="font-bold">{realtimeData.humd || 0}%</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="lamp.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Light Level</div>
                      <div className="font-bold">{realtimeData.light || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-[40%] py-8">
                <div>
                  <div className="flex pb-4">
                    <img className="w-[30%] " src="sunrise.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Sunrise</div>
                      <div className="font-bold">
                        {realtimeData.sunrise || "00:00"}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="sunset.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Sunset</div>
                      <div className="font-bold">
                        {realtimeData.sunset || "00:00"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#C3CAFF] rounded-xl p-8 text-3xl text-white font-semibold">
              Suggestions
            </div>
          </div>
          <div className="bg-white w-[60%] rounded-xl p-8 h-[40%]">
            <div className="flex justify-between">
              <div className="font-semibold">Previous Temperature</div>
              <button
                className="w-[15%] p-2 bg-light-purple text-white rounded-full"
                onClick={navigateHistory}
              >
                History
              </button>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={temperatureData}>
                <XAxis dataKey="Time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

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
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import socket from "./Socket"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export const Dashboard = ({ historyData }) => {
  const navigate = useNavigate()

  const navigateHistory = () => {
    navigate("/history")
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

  const co2Threshhold = 5000
  const tvocThreshhold = 350

  const [alertData, setAlertData] = useState({
    type: null,
    message: null,
  })

  useEffect(() => {
    socket.on("message", (data) => {
      const temperary = JSON.parse(data)
      const { light, co2, tvoc, humd, airp, temp, sunrise, sunset } =
        temperary.elements
      setRealtimeData({ light, co2, tvoc, humd, airp, temp, sunrise, sunset })
      if (co2 > co2Threshhold) {
        toast.error("CO2 is too high!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
      if (tvoc > tvocThreshhold) {
        toast.error("TVOC is too high!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })

    return () => {}
  }, [])

  const [tempData, setTempData] = useState([])

  const fetchTempData = () => {
    axios
      .get("http://localhost:3000/history")
      .then((res) => {
        setTempData(res.data.list)
      })
      .catch((err) => {
        console.log(err)
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

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [80, 60, 85, 90, 95, 85],
        backgroundColor: "#F8F8FF",
        borderColor: "#7284FF",
        tension: 0.25,
        fill: true,
      },
    ],
  }

  return (
    <div className="bg-[#F8F8FF] h-screen">
      <div className="py-12 px-32">
        <ToastContainer autoClose={30000} />
        <div className="text-light-purple font-bold text-5xl font-sans mb-12">
          Air Quality Measure
        </div>

        <div className="flex justify-between mb-16">
          <div className="bg-white rounded-xl flex flex-col w-[25%] justify-around">
            <div className="text-center text-light-purple text-3xl">
              AIR QUALITY
            </div>

            <CircularProgressbar
              className="max-w-[55%] mx-auto"
              value="85"
              text="85%"
              styles={buildStyles({
                textColor: "#7284FF",
                pathColor: "#7284FF",
                trailColor: "#F8F8FF",
              })}
            />

            <div className="text-center text-light-purple text-3xl font-semibold">
              EXCELLENT
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
                <div className="inline-block text-5xl pr-4 pb-8">
                  {realtimeData.co2}
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
                <div className="inline-block text-5xl pr-4 pb-8">
                  {realtimeData.tvoc}
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
                <div className="inline-block text-5xl pr-4 pb-8">
                  {realtimeData.airp}
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
                <div className="inline-block text-5xl pr-4 pb-8">
                  {realtimeData.temp}
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
                      <div className="font-bold">{realtimeData.humd}%</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="lamp.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Light Level</div>
                      <div className="font-bold">{realtimeData.light}</div>
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
                      <div className="font-bold">{realtimeData.sunrise}</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="sunset.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Sunset</div>
                      <div className="font-bold">{realtimeData.sunset}</div>
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
              <div className="font-semibold">Today Temperature</div>
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

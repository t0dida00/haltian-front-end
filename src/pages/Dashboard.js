import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js"
import io from "socket.io-client"

const socket = io.connect("http://localhost:3000")

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export const Dashboard = () => {
  const navigate = useNavigate()

  const navigateHistory = () => {
    navigate("/history")
  }

  const [light, setLight] = useState(0)
  const [co2, setCo2] = useState(0)
  const [tvoc, setTvoc] = useState(0)
  const [humd, setHumd] = useState(0)
  const [airp, setAirp] = useState(0)
  const [temp, setTemp] = useState(0)
  const [sunrise, setSunrise] = useState("")
  const [sunset, setSunset] = useState("")

  useEffect(() => {
    socket.on("message", (data) => {
      const { elements } = data
      setLight(elements.light)
      setCo2(elements.co2)
      setTvoc(elements.tvoc)
      setHumd(elements.humd)
      setAirp(elements.airp)
      setTemp(elements.temp)
      setSunrise(elements.sunrise)
      setSunset(elements.sunset)
    })
  }, [])

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

  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        min: 50,
        max: 100,
      },
    },
  }

  return (
    <div className="bg-[#F8F8FF] max-h-screen">
      <div className="py-12 px-32">
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
              <div className="flex align-middle justify-center">
                <img
                  className="max-w-[65%] align-middle m-auto"
                  src="logo192.png"
                  alt="img"
                />
              </div>

              <div>
                <div className="text-3xl text-light-purple font-medium pt-8 pb-4">
                  Carbon Dioxide
                </div>
                <div className="inline-block text-5xl pr-4 pb-8">{co2}</div>
                <div className="inline-block text-3xl font-light">ppm</div>
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4">
              <div className="flex align-middle justify-center">
                <img
                  className="max-w-[65%] align-middle m-auto"
                  src="logo192.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium pt-8 pb-4">
                  T. V. O. C.
                </div>
                <div className="inline-block text-5xl pr-4 pb-8">{tvoc}</div>
                <div className="inline-block text-3xl font-light">ppb</div>
              </div>
            </div>
          </div>

          <div className="w-[28%]">
            <div className="bg-white rounded-xl flex py-4 mb-8">
              <div className="flex align-middle justify-center">
                <img
                  className="max-w-[65%] align-middle m-auto"
                  src="logo192.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium  pt-8 pb-4">
                  Air Pressure
                </div>
                <div className="inline-block text-5xl pr-4 pb-8">{airp}</div>
                <div className="inline-block text-3xl font-light">hPA</div>
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4">
              <div className="flex align-middle justify-center">
                <img
                  className="max-w-[65%] align-middle m-auto"
                  src="logo192.png"
                  alt="img"
                />
              </div>
              <div>
                <div className="text-3xl text-light-purple font-medium pt-8 pb-4">
                  Temperature
                </div>
                <div className="inline-block text-5xl pr-4 pb-8">{temp}</div>
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
                    <img className="max-w-[40%] " src="logo192.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Humidity</div>
                      <div className="font-bold">{humd}%</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="max-w-[40%] " src="logo192.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Light Level</div>
                      <div className="font-bold">{light}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-[40%] py-8">
                <div>
                  <div className="flex pb-4">
                    <img className="max-w-[40%] " src="logo192.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Sunrise</div>
                      <div className="font-bold">{sunrise}</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="max-w-[40%] " src="logo192.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Sunset</div>
                      <div className="font-bold">{sunset}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#C3CAFF] rounded-xl p-8 text-3xl text-white font-semibold">
              Suggestions
            </div>
          </div>
          <div className="bg-white w-[60%] rounded-xl p-8">
            <div className="flex justify-between">
              <div className="font-semibold">
                Previous Daily Overall Air Quality
              </div>
              <button
                className="w-[15%] p-2 bg-light-purple text-white rounded-full"
                onClick={navigateHistory}
              >
                History
              </button>
            </div>

            <Line
              className="max-h-[17rem]"
              data={data}
              options={options}
            ></Line>
          </div>
        </div>
      </div>
    </div>
  )
}

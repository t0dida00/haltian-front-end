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

const development_URL = "http://localhost:8080/"
const production_URL = "https://air-quality.azurewebsites.net/"
export const Dashboard = ({ historyData }) => {
  const navigate = useNavigate()

  const navigateHistory = () => {
    handleSaveData()
    navigate("/history")
  }

  const disconnect = () => {
    fetch(`${production_URL}set-up/disconnection/`, {
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
  const [outdoorData, setOutdoorData] = useState({
    aqi_outdoor: null,
    app_temp: null,
    temperature: null,
    humidity: null,
    wind_spd: null,
    ob_time: null,
    description: null,
  })
  const [aqi, setAqi] = useState("")
  const [quality, setQuality] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hiddenElement, setHiddenElement] = useState({})
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  //const [index,setIndex]=useState["#FAD200","#FA1D00","#FA1D00"]
  function handleDismiss() {
    //setAlerts([])
    setHiddenElement({ display: "none" })
  }

  useEffect(() => {
    socket.on("message", (data) => {

      setCurrentTime(new Date())
      const temporary = JSON.parse(data)
      const { light, co2, tvoc, humd, airp, temp, sunrise, sunset } =
        temporary.elements
      const { aqi_outdoor, app_temp, temperature, humidity, wind_spd, ob_time, description } =
        temporary.outdoor
      const aqi = temporary.AQI
      const quality = temporary.Quality
      const alerts = temporary.alerts

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
      setOutdoorData({
        aqi_outdoor,
        app_temp,
        temperature,
        humidity,
        wind_spd,
        ob_time,
        description
      })
      setHiddenElement({})
      setAqi(aqi)
      setQuality(quality)
      setAlerts(alerts)

      localStorage.setItem("indoorData", JSON.stringify({
        light,
        co2,
        tvoc,
        humd,
        airp: Math.round(airp),
        temp,
        sunrise,
        sunset,
      }))
      localStorage.setItem("aqi", aqi)
      localStorage.setItem("quality", quality)
      localStorage.setItem("outdoorData", JSON.stringify({
        aqi_outdoor,
        app_temp,
        temperature,
        humidity,
        wind_spd,
        ob_time,
        description
      }))
     
    })

    // return () => {}
  }, [])

  const handleSaveData = () => {

    localStorage.setItem("realtimeData", JSON.stringify(realtimeData))
    localStorage.setItem("aqi", aqi)
    localStorage.setItem("quality", quality)
  }

  const getDataFromStorage = () => {
    let storedData = localStorage.getItem("indoorData")
    if (storedData) {
      setRealtimeData(JSON.parse(storedData))
    }
    storedData = localStorage.getItem("outdoorData")
    if (storedData) {
      setOutdoorData(JSON.parse(storedData))
    }
    const storedAqi = localStorage.getItem("aqi")
    const storedQuality = localStorage.getItem("quality")
    if (storedAqi && storedQuality) {
      setAqi(storedAqi)
      setQuality(storedQuality)
    }
  }

  useEffect(() => {
    getDataFromStorage()
  }, [])

  const [tempData, setTempData] = useState([])

  const fetchTempData = () => {
    fetch(`${production_URL}history`)
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

  const co2Alert = alerts.find(alert => (alert.element.includes("co2")))
  const co2Style = co2Alert ? { background: co2Alert.index, color: "white" } : null;
  const tvocAlert = alerts.find(alert => (alert.element.includes("tvoc")))
  const tvocStyle = tvocAlert ? { background: tvocAlert.index, color: "white" } : null;
  const tempAlert = alerts.find(alert => (alert.element.includes("temperature")))
  const tempStyle = tempAlert ? { background: tempAlert.index, color: "white" } : null;
  const humdAlert = alerts.find(alert => (alert.element.includes("humidity")))
  const humdStyle = humdAlert ? { background: humdAlert.index } : null;

  const qualityStyle = quality == "Excellent" ? null : quality == "Good" ? { color: "green" } : quality == "Moderate" ? { color: "orange" } : null

  return (
    <div className="bg-[#F8F8FF] h-screen">
      {alerts.length > 0 && (
        <div className="fixed z-50 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center" style={hiddenElement}>
          <div className="bg-red-600 flex">

            <div className=" text-white font-bold p-16  flex-col items-center justify-between">
              {alerts.map((alert, index) => (
                //<p className="text-6xl">{alert}</p>
                <p className="my-2" key={index}>{index + 1}. {alert.alert}</p>
              ))}

            </div>
            <button
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4"
              onClick={handleDismiss}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 px-32">
        <div className="text-light-purple font-bold text-5xl font-sans mb-12 text-center">
          INDOOR AIR QUALITY MORNITORING

          {/* <div className="w-[20%] flex justify-between">
            <button
              className="rounded-xl bg-light-purple text-white h-[50%] w-[40%]"
              onClick={navigateHistory}
            >
              History
            </button>
            <button
              className="rounded-xl bg-light-purple text-white h-[50%] w-[40%]"
              onClick={navigateConnection}
            >
              Disconnect
            </button>

          </div> */}
        </div>

        <div className="flex justify-between mb-16 h-[50%]">
          <div className="bg-white rounded-xl flex flex-col w-[30%] justify-around">
            <div className="text-center text-light-purple text-1xl lg:text-2xl xl:text-3xl">
              AIR QUALITY INDEX
            </div>

            <CircularProgressbar
              className="max-w-[55%] mx-auto"
              value={typeof aqi === 'number' ? 100 - aqi : 50}
              text={aqi || "Analyzing"}
              styles={buildStyles({
                textColor: "#7284FF",
                pathColor: "#7284FF",
                trailColor: "#F8F8FF",
              })}
            />

            <div className="text-center text-light-purple text-1xl lg:text-2xl xl:text-3xl font-semibold" style={qualityStyle}>
              {quality || "Analyzing"}
            </div>
            <div className="text-blue-600/50 text-1xl font-semibold" >
              Last updated: {currentTime.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
                // weekday: 'short',
                // month: 'short',
                // day: 'numeric',
              })}
            </div>
          </div>

          <div className="w-[30%] flex flex-col justify-between">
            <div className="bg-white rounded-xl flex py-4 mb-8" style={co2Style}>

              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="w-[55%] align-middle m-auto"
                  src="co2-cloud.png"
                  alt="img"
                />
              </div>

              <div className="flex flex-col justify-around">
                <div className="text-light-purple font-medium text-1xl lg:text-2xl xl:text-3xl pt-4 pb-4" style={co2Style}>
                  Carbon Dioxide
                </div>
                <div className="inline-block text-1xl lg:text-3xl xl:text-5xl pr-2 pb-8 ">
                  {realtimeData.co2 || 0} ppm
                </div>
                {/* <div className="inline-block text-1xl lg:text-2xl xl:text-3xl font-light">ppm</div> */}
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4" style={tvocStyle}>
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="w-[55%] align-middle m-auto"
                  src="flask.png"
                  alt="img"
                />
              </div>
              <div className="flex flex-col justify-around">
                <div className="text-1xl lg:text-2xl xl:text-3xl text-light-purple font-medium pt-4 pb-4" style={tvocStyle}>
                  T. V. O. C.
                </div>
                <div className="inline-block text-1xl lg:text-3xl xl:text-5xl pr-2 pb-8">
                  {realtimeData.tvoc || 0} ppb
                </div>
                {/* <div className="inline-block text-1xl lg:text-2xl xl:text-3xl font-light">ppb</div> */}
              </div>

            </div>

          </div>

          <div className="w-[30%] flex flex-col justify-between">

            <div className="bg-white rounded-xl flex py-4 mb-8">
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="max-w-[55%] align-middle m-auto"
                  src="barometer.png"
                  alt="img"
                />
              </div>
              <div className="flex flex-col justify-around">
                <div className=" text-1xl lg:text-2xl xl:text-3xl text-light-purple font-medium pt-4 pb-4">
                  Air Pressure
                </div>
                <div className="inline-block text-1xl lg:text-3xl xl:text-5xl pr-2 pb-8">
                  {realtimeData.airp || 0} hPa
                </div>
                {/* <div className="inline-block text-1xl lg:text-2xl xl:text-3xl font-light">hPA</div> */}
              </div>
            </div>

            <div className="bg-white rounded-xl flex py-4" style={tempStyle}>
              <div className="flex align-middle justify-center w-[50%]">
                <img
                  className="max-w-[55%] align-middle m-auto"
                  src="thermometer.png"
                  alt="img"
                />
              </div>
              <div className="flex flex-col justify-around">
                <div className="text-1xl lg:text-2xl xl:text-3xl  text-light-purple font-medium pt-4 pb-4" style={tempStyle}>
                  Temperature
                </div>
                <div className="inline-block  text-1xl lg:text-3xl xl:text-5xl pr-2 pb-8">
                  {realtimeData.temp || 0} Cel
                </div>
                {/* <div className="inline-block text-1xl lg:text-2xl xl:text-3xl  font-light">Cel</div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between h-[40%]">
          <div className="w-[35%] rounded-xl flex flex-col justify-between ">
            <div className="flex bg-white rounded-xl justify-around mb-8">
              <div className="flex p-8">
                <div className="border-r-2 border-r-black">
                  <div className="flex pb-4" style={humdStyle}>
                    <img className="w-[30%] " src="humidity.png" alt="img" />
                    <div className="align-center m-auto text-1xl">
                      <div>Humidity</div>
                      <div className="font-bold">{realtimeData.humd || 0}%</div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="lamp.png" alt="img" />
                    <div className="align-center m-auto text-1xl">
                      <div>Light Level</div>
                      <div className="font-bold">{realtimeData.light || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex  p-8">
                <div>
                  <div className="flex pb-4">
                    <img className="w-[30%] " src="sunrise.png" alt="img" />
                    <div className="align-center m-auto text-1xl">
                      <div>Sunrise</div>
                      <div className="font-bold">
                        {realtimeData.sunrise || "00:00"}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <img className="w-[30%] " src="sunset.png" alt="img" />
                    <div className="align-center m-auto text-1xl">
                      <div>Sunset</div>
                      <div className="font-bold">
                        {realtimeData.sunset || "00:00"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-[#C3CAFF] rounded-xl p-8 text-3xl text-black font-semibold "> */}
              {/* Suggestion */}
              {/* Last updated: {currentTime.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
                // weekday: 'short',
                // month: 'short',
                // day: 'numeric',
              })} */}
              <div style={{ display: "flex", justifyContent: "center",border: "1px solid black",  borderRadius: "5px" }} className="p-8 text-1xl lg:text-2xl xl:text-3xl text-black font-semibold bg-[#C3CAFF] rounded-xl" >

                <div style={{  height: "auto", textAlign: "center", fontWeight: "bold"}} className="bg-[#C3CAFF] rounded-xl ">
                  {`${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} ${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/${year} `}
                </div>
              </div>
            {/* </div> */}
          </div>
          <div className="bg-white w-[60%] rounded-xl p-8 ">
            <div className="text-center text-1xl lg:text-3xl xl:text-5xl	">
              <div className="font-semibold">OUTDOOR WEATHER</div>

            </div>
            <div className="flex bg-white rounded-xl justify-around h-[80%] items-center">
              <div className="flex w-[40%] p-8 m-auto">
                <div className="border-r-2 border-r-black">
                  <div className="flex pb-4" >
                  <svg className="h-16 w-16 text-indigo-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="4 19 8 13 12 15 16 10 20 14 20 19 4 19" />  <polyline points="4 12 7 8 11 10 16 4 20 8" /></svg>
                    <div className="align-center  ml-7 my-auto">
                      <div>Air Quality Index</div>
                      <div className="font-bold">{outdoorData.aqi_outdoor || "Updating"}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {/* <img className="w-[30%] " src="lamp.png" alt="img" />
                    <div className="align-center m-auto">
                      <div>Light Level</div>
                      <div className="font-bold">{realtimeData.light || 0}</div>
                    </div> */}
                    <div className="align-center m-auto ">
                      <div className="font-bold">{outdoorData.description || ""}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[40%] p-8">
                <div className="border-r-2 border-r-black">
                  <div className="flex pb-4" >
                    <img className="w-[30%] " src="thermometer.png" alt="img" />
                    <div className="align-center  ml-7 my-auto">
                      <div>Temperature</div>
                      <div className="font-bold">{outdoorData.temperature} Cel</div>
                    </div>
                  </div>
                  <div className="flex">
                  <div >
                  <svg className="h-16 w-16 text-indigo-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="7" r="4" />  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                    </div>

                    <div className="align-center ml-7 my-auto">
                      <div>Feels like</div>
                      <div className="font-bold">{outdoorData.app_temp || "Updating"} Cel</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-[40%] p-8">
                <div>
                  <div className="flex pb-4">
                    <img className="w-[30%] " src="humidity.png" alt="img" />
                    <div className="align-center  ml-7 my-auto">
                      <div>Humidity</div>
                      <div className="font-bold">
                        {outdoorData.humidity || "Updating"}%
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                  <svg className="h-16 w-16 text-indigo-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  strokeLinecap="round"  stroke-linejoin="round">  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>
                    <div className="align-center ml-7 my-auto">
                      <div>Wind speed</div>
                      <div className="font-bold">
                        {outdoorData.wind_spd || "Updating"}  m/s
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* <ResponsiveContainer width="100%" height={350}>
              <LineChart data={temperatureData}>
                <XAxis dataKey="Time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer> */}

            <div className="text-center">Last observation time: {outdoorData.ob_time || "Updating"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

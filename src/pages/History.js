import React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

function Co2Chart() {
  const co2 = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [400, 410, 420, 430, 440, 450, 460],
        label: "Carbon Dioxide",
        backgroundColor: "#F8F8FF",
        borderColor: "#FF6666",
        tension: 0.1,
        fill: true,
      },
    ],
  }
  return (
    <div>
      <Line data={co2}></Line>
    </div>
  )
}

function TempChart() {
  const temp = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dataset: [
      {
        data: [22, 23, 24, 25, 26, 27, 28],
        label: "Temperature",
        backgroundColor: "#F8F8FF",
        borderColor: "#66FFB2",
        tension: 0.1,
        fill: true,
      },
    ],
  }
  return (
    <div>
      <Line data={temp}></Line>
    </div>
  )
}

function HumdChart() {
  const humd = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dataset: [
      {
        data: [45, 50, 55, 60, 65, 70],
        label: "Humidity",
        backgroundColor: "#F8F8FF",
        borderColor: "#7284FF",
        tension: 0.1,
        fill: true,
      },
    ],
  }
  return (
    <div>
      <Line data={humd}></Line>
    </div>
  )
}

export const History = () => {
  return (
    <div>
      <Co2Chart />
      <TempChart />
      <HumdChart />
    </div>
  )
}

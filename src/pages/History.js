import React from "react"
import { useNavigate } from "react-router-dom"

export const History = () => {
  const navigate = useNavigate()

  const navigateDashboard = () => {
    navigate("/dashboard")
  }

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
        <div className="grid gap-8 grid-cols-2 grid-rows-2 p-4">
          <div>Grid 1</div>
          <div>Grid 2</div>
          <div>Grid 3</div>
          <div>Grid 4</div>
        </div>
      </div>
    </div>
  )
}

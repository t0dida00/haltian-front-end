import { Route, Routes } from "react-router-dom"
import { Connection } from "./pages/Connection"
import { Dashboard } from "./pages/Dashboard"
import { History } from "./pages/History"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Connection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
    </Routes>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Breath from './pages/Breath'
import Train from './pages/Train'

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="breath" element={<Breath />} />
            <Route path="train" element={<Train />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

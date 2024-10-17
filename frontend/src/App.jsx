import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import BookingForm from "./components/BookingForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Tracking from "./components/ItemTracking/Tracking";
import JobStatus from "./components/Driver/JobStatus";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<BookingForm />} />
            <Route path="/track/:bookingId" element={<Tracking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/job/:bookingId" element={<JobStatus />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

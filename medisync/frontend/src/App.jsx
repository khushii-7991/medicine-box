import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home';
import Patient from './components/Patient';
import Doctor from './components/Doctor';
import AddPrescription from './components/AddPrescription';
import ViewAppointments from './components/ViewAppointments';
import Reports from './components/Reports';
import TodaysAppointment from './components/TodaysAppointment';
import PatientList from './components/PatientList';
import ViewPrescriptions from './components/ViewPrescriptions';
import BookAppointment from './components/BookAppointment';
import UploadReports from './components/UploadReports';
import HealthRemainders from './components/HealthRemainders';
import EmergencyHelp from './components/EmergencyHelp';
import MyAppointments from './components/MyAppointments';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/patient' element={<Patient />} />
        <Route path='/doctor' element={<Doctor />} />
        <Route path='/add-prescription' element={<AddPrescription />} />
        <Route path='/view-appointments' element={<ViewAppointments />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/emergency-requests' element={<Reports />} />
        <Route path='/todays-appointment' element={<TodaysAppointment />} />
        <Route path='/patient-list' element={<PatientList />} />
        <Route path='/view-prescriptions' element={<ViewPrescriptions />} />
        <Route path='/book-appointment' element={<BookAppointment />} />
        <Route path='/upload-reports' element={<UploadReports />} />
        <Route path='/health-remainders' element={<HealthRemainders />} />
        <Route path='/emergency-help' element={<EmergencyHelp />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
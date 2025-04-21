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
import LoginDoctor from './components/LoginDoctor';
import LoginPatient from './components/LoginPatient';
import MedicationSchedule from './components/MedicationSchedule';
import ProtectedDoctorRoute from './components/ProtectedDoctorRoute';
import ProtectedPatientRoute from './components/ProtectedPatientRoute';
import FindDoctor from "./components/FindDoctor";
import DoctorProfile from "./components/DoctorProfile";
import AddHospital from "./components/AddHospital";
import Layout from './components/Layout';
import Profile from './components/Profile';
import { Toaster } from 'react-hot-toast';
import MedicineTracking from './components/MedicineTracking';
import MedicineInfo from './components/MedicineInfo';

function App() {

  return (
    <BrowserRouter>
      {/* Toast container for notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path="/find-doctor" element={<FindDoctor />} />
        <Route path='/login/doctor' element={<LoginDoctor />} />
        <Route path='/login/patient' element={<LoginPatient />} />
        
        {/* Protected Doctor routes */}
        <Route path="/doctor-profile" element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <DoctorProfile />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        
        {/* Protected Patient routes */}
        <Route path='/patient' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <Patient />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/profile' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <Profile />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/view-prescriptions' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <ViewPrescriptions />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/medication-schedule' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <MedicationSchedule />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/book-appointment' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <BookAppointment />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/upload-reports' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <UploadReports />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/health-reminders' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <HealthRemainders />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/find-doctor' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <FindDoctor />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/emergency-help' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <EmergencyHelp />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/my-appointments' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <MyAppointments />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/medicine-tracking' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <MedicineTracking />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/medicine-info' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <MedicineInfo />
            </Layout>
          </ProtectedPatientRoute>
        } />
        <Route path='/find-doctor' element={
          <ProtectedPatientRoute>
            <Layout userType="patient">
              <FindDoctor />
            </Layout>
          </ProtectedPatientRoute>
        } />
        
        {/* Protected Doctor routes */}
        <Route path='/doctor' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <Doctor />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/add-prescription' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <AddPrescription />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/view-appointments' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <ViewAppointments />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/reports' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <Reports />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/emergency-requests' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <Reports />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/todays-appointment' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <TodaysAppointment />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/patient-list' element={
          <ProtectedDoctorRoute>
            <Layout userType="doctor">
              <PatientList />
            </Layout>
          </ProtectedDoctorRoute>
        } />
        <Route path='/add-hospital' element={
          <ProtectedDoctorRoute>
            <AddHospital />
          </ProtectedDoctorRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './dashboard_mahasiswa';
import Dashboardd from './dashboard';
import Dash_m from './content/dash_m';
import Dash from './content/dash';
import Profil from './content/Profil';
import Pengaduan_m from './content/Pengaduan_m';
// import Respon  from './content/Respon';
import Akun from './content/akun';
import Data_pengaduan from './content/data_pengaduan';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/dashboard_mahasiswa" element={<Dashboard />}></Route>
          <Route path="/dashboard" element={<Dashboardd />}></Route>
          <Route path="./content/dash_m" element={<Dash_m />}></Route>
          <Route path="./content/dash" element={<Dash />}></Route>
          <Route path="./content/Profil" element={<Profil />}></Route>
          <Route path="./content/Pengaduan_m" element={<Pengaduan_m/>}></Route>
          {/* <Route path="./content/Respon" element={<Respon />}></Route> */}
          <Route path="./content/akun" element={<Akun />}></Route>
          <Route path="./content/data_pengaduan" element={<Data_pengaduan/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

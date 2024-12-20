import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dashboardCSS from '../dashboard.module.css';
import fotox from '../assets/img/Flowchart_Mahasiswa.png';

function Dash_m() {
  const [totalComplaints, setTotalComplaints] = useState(0); // for lpsy
  const [resolvedComplaints, setResolvedComplaints] = useState(0); // for lpsl

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const nim = localStorage.getItem('userNim'); // Pastikan ini benar-benar menyimpan NIM pengguna
        if (nim) {
          // Ambil total laporan
          const totalResponse = await axios.get(`https://sim-production-ed22.up.railway.app:5000/complaints/count/${nim}`);
          console.log('Total complaints:', totalResponse.data.total); // Debugging
  
          setTotalComplaints(totalResponse.data.total); // Set total laporan ke state
  
          // Ambil laporan yang telah divalidasi (status = 1)
          const resolvedResponse = await axios.get(`https://sim-production-ed22.up.railway.app:5000/complaints/resolved/${nim}`);
          console.log('Resolved complaints:', resolvedResponse.data.resolved); // Debugging
  
          setResolvedComplaints(resolvedResponse.data.resolved); // Set laporan selesai ke state
        }
      } catch (error) {
        console.error('Error fetching complaint data:', error);
      }
    };
  
    fetchComplaintData();
  }, []);
  

  return (
    <div className={dashboardCSS.dashboardd}>
      <h1>Selamat Datang Di Dashboard</h1>
      <div className={dashboardCSS.kotak}>
        <div className={dashboardCSS.lpsy}>{totalComplaints}</div>
        <div className={dashboardCSS.lpsl}>{resolvedComplaints}</div>
      </div>
      <div className={dashboardCSS.gambarA} >
          <img src={fotox} class={dashboardCSS.gambaraa} alt="gambar" />
        </div>
    </div>
  );
}

export default Dash_m;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dashboardCSS from '../dashboard.module.css';

function Dash() {
  const [totalComplaints, setTotalComplaints] = useState(0); // for total complaints
  const [resolvedComplaints, setResolvedComplaints] = useState(0); // for resolved complaints

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const totalResponse = await axios.get('http://localhost:5000/dashboard/total');
        console.log('Total response:', totalResponse); // Check the full response
        setTotalComplaints(totalResponse.data.total); // Correct key name
        
        const resolvedResponse = await axios.get('http://localhost:5000/dashboard/resolved');
        console.log('Resolved response:', resolvedResponse); // Check the full response
        setResolvedComplaints(resolvedResponse.data.resolved); // Correct key name
        
      } catch (error) {
        console.error('Error fetching complaint data:', error);
      }
    };
  
    fetchComplaintData();
  }, []);
  

  return (
    <div className={dashboardCSS.dashboarddd}>
      <h1>Selamat Datang Di Dashboard</h1>
      <div className={dashboardCSS.kotak}>
        <div className={dashboardCSS.lpsm}>{totalComplaints}</div>
        <div className={dashboardCSS.lpsl}>{resolvedComplaints}</div>
      </div>
    </div>
  );
}

export default Dash;

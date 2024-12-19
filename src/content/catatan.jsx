import React, { useState, useEffect } from 'react';
import axios from 'axios';
import akunCSS from './Pengaduan_m.module.css';

function akun(){
    const [akun, setAkun] = useState({
        id: '',
        nim: '',
        password: '',
        nama: '',
        contact: '',
        email: ''
    });
    const [akunList, setAkunList] = useState([]);
    useEffect(() => {
          axios.get(`http://localhost:5000/akun/`)
            .then(akun => {
                setAkunList(akun.data);
            })
            .catch(error => {
              console.error('Error fetching profile:', error);
            });
      }, []);
    
return(
    <div>
      <h1>Selamat Datang Di Akun</h1>
      <div className={akunCSS.complaintsTable}>
        <h2>Akun</h2>
        <table className={akunCSS.table}>
          <thead>
            <tr>
                <th>Id</th>
                <th>Nim</th>
                <th>Password</th>
                <th>Nama</th>
                <th>Contact</th>
                <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {akunList.map((akun) => (
              <tr key={akun.id}>
                <td>{akun.id}</td>
                <td>{akun.nim}</td>
                <td>{akun.nama}</td>
                <td>{akun.contact}</td>
                <td>{akun.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}
export default akun;
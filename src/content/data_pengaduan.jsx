import React, { useState, useEffect } from 'react';
import axios from 'axios';
import datapengaduanCSS from './data_pengaduan.module.css';

function Data_pengaduan() {
  const [complaintsList, setComplaintsList] = useState([]);

  // Ambil data pengaduan
  useEffect(() => {
    axios.get('https://sim-production-ed22.up.railway.app:5000/complaints')
      .then(response => {
        setComplaintsList(response.data);
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  // Fungsi untuk validasi pengaduan
  const handleValidate = async (id, validasi) => {
    try {
      console.log('Validating complaint:', { id, validasi }); // Logging untuk debug
      axios.put(`https://sim-production-ed22.up.railway.app:5000/complaints/validate/${id}`, { validasi });
      alert(validasi === 1 ? 'Pengaduan berhasil divalidasi' : 'Pengaduan batal divalidasi');
  
      // Refresh data setelah validasi
      const updatedComplaints = complaintsList.map((complaints) =>
        complaints.id === id ? { ...complaints, validasi } : complaints
      );
      setComplaintsList(updatedComplaints);
    } catch (error) {
      console.error('Error updating validation:', error);
      alert('Gagal memvalidasi pengaduan.');
    }
  };
  

  return (
    <div className={datapengaduanCSS.container}>
      <h2>Data Pengaduan</h2>
      <table className={datapengaduanCSS.table}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Fakultas</th>
            <th>Prodi</th>
            <th>Email</th>
            <th>Kontak</th>
            <th>Subjek</th>
            <th>Deskripsi</th>
            <th>Foto</th>
            <th>Tanggal</th>
            <th>Validasi</th>
          </tr>
        </thead>
        <tbody>
          {complaintsList.map((complaints) => (
            <tr key={complaints.id}>
              <td>{complaints.name}</td>
              <td>{complaints.nim}</td>
              <td>{complaints.fakultas}</td>
              <td>{complaints.prodi}</td>
              <td>{complaints.email}</td>
              <td>{complaints.contact}</td>
              <td>{complaints.subject}</td>
              <td>{complaints.description}</td>
              <td>
                {complaints.image_url ? (
                  <img
                    src={`data:image/jpeg;base64,${complaints.image_url}`}
                    alt="complaints"
                    className={datapengaduanCSS.thumbnail}
                  />
                ) : (
                  'No image'
                )}
              </td>
              <td>{new Date(complaints.created_at).toLocaleDateString()}</td>
              <td>
                {complaints.validasi === 1 ? (
                  <span className={datapengaduanCSS.iconCheck}>✔️</span>
                ) : (
                  <span className={datapengaduanCSS.iconCross}>❌</span>
                )}
                <button onClick={() => handleValidate(complaints.id, complaints.validasi === 1 ? 0 : 1)} className={datapengaduanCSS.validateBtn}>
                  {complaints.validasi === 1 ? 'Batalkan Validasi' : 'Validasi'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Data_pengaduan;

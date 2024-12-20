import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pengaduan_mCSS from './Pengaduan_m.module.css';

function Pengaduan_m() {
  const [complaint, setComplaint] = useState({
    name: '',
    nim: '',
    contact: '',
    fakultas:'',
    prodi: '',
    email:'',
    subject: '',
    description: '',
  });
  const [photo, setPhoto] = useState(null);
  const [base64Photo, setBase64Photo] = useState('');
  const [userId, setUserId] = useState(null);
  const [complaintsList, setComplaintsList] = useState([]);
   // State for complaints list


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      axios.get(`https://sim-production-ed22.up.railway.app:5000/profile/${storedUserId}`)
        .then(response => {
          const { name, nim, contact, fakultas, prodi, email } = response.data;
          setComplaint({ ...complaint, name, nim, contact, fakultas, prodi, email });
          axios.get(`https://sim-production-ed22.up.railway.app:5000/complaints/${nim}`)
          .then(complaintResponse => {
            setComplaintsList(complaintResponse.data);
          })
          .catch(error => {
            console.error('Error fetching complaints:', error);
          }); 
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint({ ...complaint, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Photo(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditbtn = (complaintToEdit) => {
    setComplaint((prevComplaint) => ({
      ...prevComplaint,
      id: complaintToEdit.id, // Tambahkan ID jika ada
      subject: complaintToEdit.subject,
      description: complaintToEdit.description,
    }));
  };
  

  const fetch =()=>{
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      axios.get(`https://sim-production-ed22.up.railway.app:5000/profile/${storedUserId}`)
        .then(response => {
          const { name, nim, contact, fakultas, prodi, email } = response.data;
          setComplaint({ ...complaint, name, nim, contact, fakultas, prodi, email });
          axios.get(`http://localhost:5000/complaints/${nim}`)
          .then(complaintResponse => {
            setComplaintsList(complaintResponse.data);
          })
          .catch(error => {
            console.error('Error fetching complaints:', error);
          }); 
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
  }
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sim-production-ed22.up.railway.app:5000/complaints/delete/${id}`);
      alert('Data berhasil dihapus.');
      fetch(); // Refresh data
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Gagal menghapus data.');
    }
  };
  
  
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const { id, subject, description } = complaint;
  
      await axios.put(`https://sim-production-ed22.up.railway.app:5000/complaints/${id}`, { subject, description });
  
      alert('Pengaduan berhasil diperbarui.');
  
      // Kosongkan form
      setComplaint({
        name: '',
        nim: '',
        contact: '',
        fakultas: '',
        prodi: '',
        email: '',
        subject: '',
        description: '',
      });
      
      // Refresh daftar pengaduan
      const response = await axios.get(`https://sim-production-ed22.up.railway.app:5000/complaints/${complaint.nim}`);
      setComplaintsList(response.data);
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Gagal memperbarui pengaduan.');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, nim, contact, fakultas, prodi, email, subject, description } = complaint;
  
    if (id) {
      // Pembaruan data
      try {
        await axios.put(`https://sim-production-ed22.up.railway.app:5000/complaints/${id}`, { subject, description });
        alert('Pengaduan berhasil diperbarui.');
      } catch (error) {
        console.error('Error updating complaint:', error);
        alert('Gagal memperbarui pengaduan.');
      }
    } else {
      // Penambahan data baru
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nim', nim);
      formData.append('contact', contact);
      formData.append('fakultas', fakultas);
      formData.append('prodi', prodi);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('description', description);
  
      if (photo) {
        formData.append('photo', photo);
      }
  
      try {
        await axios.post('https://sim-production-ed22.up.railway.app:5000/submit-complaint', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Pengaduan berhasil ditambahkan.');
      } catch (error) {
        console.error('Error submitting complaint:', error);
        alert('Gagal menambahkan pengaduan.');
      }
    }
  
    // Kosongkan form
    setComplaint({
      name,
      nim,
      contact,
      fakultas:'',
      prodi: '',
      email:'',
      subject: '',
      description: '',
    });
    setPhoto(null);
    setBase64Photo('');
  
    // Refresh daftar pengaduan
    fetch();
  };

  return (
    <div className={pengaduan_mCSS.pengaduanContainer}>
      <div className={pengaduan_mCSS.form}>
        <h1 className={pengaduan_mCSS.header}>Pengaduan Mahasiswa</h1>
        <form className={pengaduan_mCSS.formp} onSubmit={handleSubmit}>
        <div className={pengaduan_mCSS.kiri}>
          <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="name" className={pengaduan_mCSS.label}>Nama:</label>
              <input type="text" name="name" value={complaint.name} onChange={handleChange} className={pengaduan_mCSS.inpute} required readOnly />
            </div>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="nim" className={pengaduan_mCSS.label}>NIM:</label>
              <input type="text" name="nim" value={complaint.nim} onChange={handleChange} className={pengaduan_mCSS.inpute} required readOnly />
            </div>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="contact" className={pengaduan_mCSS.label}>Kontak:</label>
              <input type="text" name="contact" value={complaint.contact} onChange={handleChange} className={pengaduan_mCSS.inpute} required readOnly />
            </div>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="fakultas" className={pengaduan_mCSS.label}>Fakultas:</label>
              <input type="text" name="fakultas" value={complaint.fakultas} onChange={handleChange} className={pengaduan_mCSS.inpute} required readOnly />
            </div>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="prodi" className={pengaduan_mCSS.label}>Prodi:</label>
              <input type="text" name="prodi" value={complaint.prodi} onChange={handleChange} className={pengaduan_mCSS.inpute} required />
            </div>
            </div>
            <div className={pengaduan_mCSS.kanan}>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="email" className={pengaduan_mCSS.label}>Email:</label>
              <input type="text" name="email" value={complaint.email} onChange={handleChange} className={pengaduan_mCSS.inpute} required readOnly />
            </div>
            <div className={pengaduan_mCSS.formGroup}>
              <label htmlFor="subject" className={pengaduan_mCSS.label}>Subjek Pengaduan:</label>
              <input type="text" name="subject" value={complaint.subject} onChange={handleChange} className={pengaduan_mCSS.inpute} required />
            </div>
              <div className={pengaduan_mCSS.formGroup}>
                <label htmlFor="description" className={pengaduan_mCSS.label}>Deskripsi Pengaduan:</label>
                <textarea name="description" value={complaint.description} onChange={handleChange} className={pengaduan_mCSS.textarea} required />
              </div>
              <div className={pengaduan_mCSS.uploadSection}>
              <div className={pengaduan_mCSS.fileUploadContainer}>
                  <label htmlFor="photo" className={pengaduan_mCSS.label}>Upload Photo (optional):</label>
                  <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className={pengaduan_mCSS.inputFile} />
                  {photo && (
                    <div className={pengaduan_mCSS.photoPreview}>
                      <img src={URL.createObjectURL(photo)} alt="Preview" className={pengaduan_mCSS.previewImage} />
                    </div>
              )}
              </div>
              <button type="submit" className={pengaduan_mCSS.submitBtn}>Kirim Pengaduan</button>
            </div>
          </div>
          <div className={pengaduan_mCSS.complaintsTable}>
        <h4>Pengaduan Anda</h4>
        <table className={pengaduan_mCSS.table}>
          <thead>
            <tr>
              <th>Subjek</th>
              <th>Deskripsi</th>
              <th>Foto</th>
              <th>Validasi</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
  {complaintsList.map((complaint) => (
    <tr key={complaint.id}>
      <td>{complaint.subject}</td>
      <td>{complaint.description}</td>
      <td>
        {complaint.image_url ? (
          <img
            src={`data:image/jpeg;base64,${complaint.image_url}`}
            alt="Complaint"
            className={pengaduan_mCSS.thumbnail}
          />
        ) : (
          'No image'
        )}
      </td>
      <td>
        {complaint.validasi === 1 ? (
          <span className={pengaduan_mCSS.iconCheck}>✔️</span>
        ) : (
          <span className={pengaduan_mCSS.iconCross}>❌</span>
        )}
      </td>
      <td>
        <button onClick={() => handleEditbtn(complaint)} className={pengaduan_mCSS.editBtn}>
          Edit
        </button>
        <button onClick={() => handleDelete(complaint.id)} className={pengaduan_mCSS.editBtn}>
          Hapus
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
        </form>
      </div>
      
    </div>
  );
}

export default Pengaduan_m;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AkunCSS from './Akun.module.css';

function Akun() {
  const [akunList, setAkunList] = useState([]); // Daftar akun
  const [akun, setAkun] = useState({
    id: '',
    username: '',
    password: '',
    name: '',
    fakultas: '',
    prodi: '',
    contact: '',
    email: '',
    type: '',
  });

  // Daftar Prodi berdasarkan Fakultas
  const prodiList = {
    Teknik: ['Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Industri', 'Teknik Informatika', 'Teknik Kontruksi Perkapalan', 'Teknik Kimia', 'Sistem Informasi'],
    'Keguruan dan Ilmu Pendidikan': ['Pendidikan Matematika', 'Pendidikan Bahasa Inggris', 'Pendidikan Guru Sekolah Dasar', 'Profesi PPG'],
    Pertanian: ['Agribisnis', 'Agroteknologi', 'Akuakultur', 'Teknologi Pangan'],
    'Ekonomi dan Bisnis': ['Manajemen', 'Akuntansi', 'Kewirausahaan'],
    Kesehatan: ['Keperawatan', 'Farmasi', 'Kesehatan Masyarakat','Ilmu Gizi','Kebidanan','Profesi Ners','Profesi Kebidanan'],
    'Agama Islam': ['Pendidikan Agama Islam', 'Pendidikan Islam Anak Usia Dini '],
    Psikologi: ['Psikologi'],
    Hukum: ['Ilmu Hukum'],
  };

  // Mengambil data akun saat pertama kali render
  useEffect(() => {
    fetchAkunList();
  }, []);

  const fetchAkunList = () => {
    axios
      .get('https://sim-production-ed22.up.railway.app:5000/akun/')
      .then((response) => {
        setAkunList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching akun data:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAkun((prevAkun) => ({
      ...prevAkun,
      [name]: value,
      ...(name === 'fakultas' && { prodi: '' }), // Reset Prodi jika Fakultas berubah
    }));
  };

  const handleEditbtn = (akunToEdit) => {
    setAkun({
      id: akunToEdit.id,
      username: akunToEdit.username,
      password: akunToEdit.password,
      name: akunToEdit.name,
      fakultas: akunToEdit.fakultas,
      prodi: akunToEdit.prodi,
      contact: akunToEdit.contact,
      email: akunToEdit.email,
      type: akunToEdit.type,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sim-production-ed22.up.railway.app:5000/akun/delete/${id}`);
      alert('Akun berhasil dihapus.');
      fetchAkunList();
    } catch (error) {
      console.error('Error deleting akun:', error);
      alert('Gagal menghapus akun.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (akun.id) {
        // Update akun
        await axios.put(`https://sim-production-ed22.up.railway.app:5000/akun/${akun.id}`, akun);
        alert('Akun berhasil diperbarui.');
      } else {
        // Tambah akun baru
        await axios.post('https://sim-production-ed22.up.railway.app:5000/akun', akun);
        alert('Akun berhasil ditambahkan.');
      }

      // Reset form dan refresh daftar akun
      setAkun({
        id: '',
        username: '',
        password: '',
        name: '',
        fakultas: '',
        prodi: '',
        contact: '',
        email: '',
        type: '',
      });
      fetchAkunList();
    } catch (error) {
      console.error('Error submitting akun:', error);
      alert('Gagal menyimpan data akun.');
    }
  };

  return (
    <div className={AkunCSS.akunContainer}>
      <div className={AkunCSS.formContainer}>
        <h2>{akun.id ? 'Edit Akun' : 'Tambah Akun'}</h2>
        <form onSubmit={handleSubmit} className={AkunCSS.form}>
          <div className={AkunCSS.formGroup}>
            <label htmlFor="username">NIM</label>
            <input
              type="text"
              id="username"
              name="username"
              value={akun.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={AkunCSS.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              value={akun.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={AkunCSS.formGroup}>
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              name="name"
              value={akun.name}
              onChange={handleChange}
              required
            />
          </div>
          {akun.type === '0' && (
  <>
    <div className={AkunCSS.formGroup}>
      <label htmlFor="fakultas">Fakultas</label>
      <select
        id="fakultas"
        name="fakultas"
        value={akun.fakultas}
        onChange={handleChange}
        required
      >
        <option value="">-- Pilih Fakultas --</option>
        {Object.keys(prodiList).map((fakultas) => (
          <option key={fakultas} value={fakultas}>
            {fakultas}
          </option>
        ))}
      </select>
    </div>
    <div className={AkunCSS.formGroup}>
      <label htmlFor="prodi">Prodi</label>
      <select
        id="prodi"
        name="prodi"
        value={akun.prodi}
        onChange={handleChange}
        required
        disabled={!akun.fakultas}
      >
        <option value="">-- Pilih Prodi --</option>
        {akun.fakultas &&
          prodiList[akun.fakultas]?.map((prodi) => (
            <option key={prodi} value={prodi}>
              {prodi}
            </option>
          ))}
      </select>
    </div>
  </>
)}
          <div className={AkunCSS.formGroup}>
            <label htmlFor="contact">Contact</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={akun.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className={AkunCSS.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={akun.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={AkunCSS.formGroup}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={akun.type}
              onChange={handleChange}
              required
            >
              <option value="1">Admin</option>
              <option value="0">Mahasiswa</option>
            </select>
          </div>
          <button type="submit" className={AkunCSS.submitBtn}>
            {akun.id ? 'Update Akun' : 'Tambah Akun'}
          </button>
        </form>
      </div>

      <div className={AkunCSS.akunTable}>
        <h2>Daftar Akun</h2>
        <table className={AkunCSS.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>NIM</th>
              <th>Password</th>
              <th>Nama</th>
              <th>Fakultas</th>
              <th>Prodi</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {akunList.map((akun) => (
              <tr key={akun.id}>
                <td>{akun.id}</td>
                <td>{akun.username}</td>
                <td className={AkunCSS.passwordtb}>*******</td>
                <td>{akun.name}</td>
                <td>{akun.fakultas}</td>
                <td>{akun.prodi}</td>
                <td>{akun.contact}</td>
                <td>{akun.email}</td>
                <td>
                {akun.type === 1 ? (
                    <span>Admin</span>
                  ) : (
                    <span>Mahasiswa</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleEditbtn(akun)}
                    className={AkunCSS.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(akun.id)}
                    className={AkunCSS.editBtn}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Akun;

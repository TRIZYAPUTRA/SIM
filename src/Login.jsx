import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCSS from './Login.module.css';
import backgroundfoto from './assets/img/Background.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);  // State untuk kontrol popup
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login(username, password);
  }

  function login(username, password) {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Login successful!') {
        // Simpan ID pengguna dan token autentikasi di localStorage
        localStorage.setItem('userId', data.id);
        localStorage.setItem('authToken', data.authToken);  // Simpan token autentikasi
        localStorage.setItem('type', data.type);
        
        if (data.type === 0) {
          console.log('Login successful! Redirecting to Mahasiswa dashboard.');
          navigate('/dashboard_mahasiswa');  // Mengarahkan ke halaman dashboard mahasiswa
        } else if (data.type === 1) {
          console.log('Login successful! Redirecting to Admin dashboard.');
          navigate('/dashboard');  // Mengarahkan ke halaman dashboard admin
        }
      } else {
        console.error('Username atau password salah!');
        setShowErrorPopup(true); // Menampilkan popup error jika login gagal
      }
    })
    .catch((error) => {
      console.error('Terjadi kesalahan:', error);  // Menangani kesalahan jika ada
      setShowErrorPopup(true);  // Tampilkan error popup jika ada kesalahan jaringan
    });
  }

  // Fungsi untuk menutup pop-up
  function closeErrorPopup() {
    setShowErrorPopup(false);
  }

  return (
    <div>
      <div className={LoginCSS.background}>
      <img src={backgroundfoto} className={LoginCSS.background} alt="" />
        <div className={LoginCSS.putih}></div>
        <div className={LoginCSS.kotaktengah}>
          <div className={LoginCSS.teksatas}>
            SISTEM INFORMASI <br />
            MANAJEMEN
          </div>
          <form onSubmit={handleSubmit} className={LoginCSS.form}>
            <label className={LoginCSS.text}>NIM :</label>
            <input 
              type="text" 
              className={LoginCSS.input} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <label className={LoginCSS.text}>Password :</label>
            <input 
              type="password" 
              className={LoginCSS.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className={LoginCSS.button}>Login</button>
          </form>
        </div>
      </div>

      {/* Pop-up error jika login gagal */}
      {showErrorPopup && (
        <div className={LoginCSS.popupOverlay}>
          <div className={LoginCSS.popup}>
            <p>Login gagal! Username atau password salah.</p>
            <button onClick={closeErrorPopup} className={LoginCSS.closeButton}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from 'react';
import dashboardCSS from './dashboard.module.css';
import { BiMenu, BiSolidDashboard, BiSolidCommentAdd, BiSolidConversation, BiLogOut, BiSolidUserAccount, BiSolidUser } from 'react-icons/bi';
import Dash from './content/dash';
import Profil from './content/Profil';
// import Respon from './content/Respon';
import Akun from './content/akun';
import Data_pengaduan from './content/data_pengaduan';
import { useNavigate } from 'react-router-dom';
import backgroundfoto from './assets/img/Background.png';

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponentState] = useState('dashboard');
  const [profileData, setProfileData] = useState({ name: '', nim: '', photo_url: '' });
  const navigate = useNavigate();

  // Cek autentikasi saat komponen pertama kali dimuat
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login'); // Redirect ke halaman login jika tidak ada token
      return; // Jangan lanjutkan eksekusi kode berikutnya
    }

    const savedPage = localStorage.getItem('activePage') || 'dashboard';
    setActiveComponentState(savedPage);

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5000/profile/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileData(data);
          localStorage.setItem('userNim', data.nim);
        })
        .catch((error) => {
          console.error('Failed to fetch profile data:', error);
        });
    }
  }, [navigate]);

  const setActiveComponent = (component) => {
    localStorage.setItem('activePage', component);
    setActiveComponentState(component);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Bersihkan semua data di localStorage
    setActiveComponent(''); // Reset komponen aktif
    navigate('/login'); // Redirect ke halaman login setelah logout
  };

  return (
    <div className={dashboardCSS.background}>
      <img src={backgroundfoto} className={dashboardCSS.background} alt="" />
      <div className={dashboardCSS.putih}></div>
      <button className={dashboardCSS.toggleBtn} onClick={toggleSidebar}>
        <BiMenu className={dashboardCSS.icon} />
      </button>
      <div className={`${dashboardCSS.sidebar} ${isOpen ? dashboardCSS.open : ''}`}>
        <button className={dashboardCSS.closeBtn} onClick={toggleSidebar}>
          <BiMenu className={dashboardCSS.icon} />
        </button>
        <div className={dashboardCSS.list}>
          <h2>Pengaduan</h2>
          <div className={dashboardCSS.profile}>
            <img src={profileData.photo_url || '/default-profile.png'} className={dashboardCSS.fotoP} alt="Profile" />
            {profileData.name}
          </div>
          <ul>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('dashboard')}>
                <BiSolidDashboard className={dashboardCSS.icon} />
                <span className={dashboardCSS.txtlist}>Dashboard</span>
              </button>
            </li>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('profile')}>
                <BiSolidUser className={dashboardCSS.icon} />
                <span className={dashboardCSS.txtlist}>Profile</span>
              </button>
            </li>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('akun')}>
                <BiSolidUserAccount className={dashboardCSS.icon} />
                <span className={dashboardCSS.txtlist}>Akun</span>
              </button>
            </li>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('data_pengaduan')}>
                <BiSolidCommentAdd className={dashboardCSS.icon} />
                <span className={dashboardCSS.txtlist}>Data Pengaduan</span>
              </button>
            </li>
            {/* <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('respon')}>
                <BiSolidConversation className={dashboardCSS.icon} />
                <span className={dashboardCSS.txtlist}>Respon</span>
              </button>
            </li> */}
          </ul>
        </div>
        <button className={dashboardCSS.logout} onClick={handleLogout}>
          <BiLogOut className={dashboardCSS.iconlo} /> Logout
        </button>
      </div>

      <div className={dashboardCSS.content}>
        {activeComponent === 'dashboard' && <Dash />}
        {activeComponent === 'profile' && <Profil />}
        {activeComponent === 'akun' && <Akun />}
        {activeComponent === 'data_pengaduan' && <Data_pengaduan />}
        {/* {activeComponent === 'respon' && <Respon />} */}
      </div>
    </div>
  );
}

export default Dashboard;

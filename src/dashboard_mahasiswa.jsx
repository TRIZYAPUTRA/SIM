import React, { useState, useEffect } from 'react';
import dashboardCSS from './dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { BiMenu, BiSolidDashboard, BiSolidCommentAdd, BiSolidConversation, BiLogOut, BiSolidUser } from 'react-icons/bi';
import Dash_m from './content/dash_m';
import Profil from './content/Profil';
import Pengaduan from './content/Pengaduan_m';
// import Respon from './content/Respon';

function DashboardMahasiswa() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponentState] = useState('dashboard');
  const [profileData, setProfileData] = useState({ name: '', nim: '', photo_url: ''});
  const navigate = useNavigate();
  
  // Ambil data profil berdasarkan userId yang ada di localStorage
  useEffect(() => {
      const savedPage = localStorage.getItem('activePage') || 'dashboard';
      setActiveComponentState(savedPage);
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:5000/profile/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileData(data);
          localStorage.setItem('userNim', data.nim); // Simpan data profil di state
        })
        .catch((error) => {
          console.error('Gagal mengambil data profil:', error);
        });
    }
  }, []); // Hanya dijalankan sekali ketika komponen dimuat

  const setActiveComponent = (component) => {
    localStorage.setItem('activePage', component);
    setActiveComponentState(component);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setActiveComponent('');
    navigate('/login');
  };

  return (
    <div className={dashboardCSS.background}>
      <div className={dashboardCSS.putih}></div>
      <button className={dashboardCSS.toggleBtn} onClick={toggleSidebar}>
        <BiMenu className={dashboardCSS.icon}></BiMenu>
      </button>
      <div className={`${dashboardCSS.sidebar} ${isOpen ? dashboardCSS.open : ''}`}>
        <button className={dashboardCSS.closeBtn} onClick={toggleSidebar}>
          <BiMenu className={dashboardCSS.icon}></BiMenu>
        </button>
        <div className={dashboardCSS.list}>
          <h2>Pengaduan</h2>
          <div className={dashboardCSS.profile}>
            {/* Render foto dan nama dari data profil */}
            <img src={profileData.photo_url} className={dashboardCSS.fotoP} alt="Profile" />
            {profileData.name}
          </div>
          <ul>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('dashboard')}>
                <BiSolidDashboard className={dashboardCSS.icon}></BiSolidDashboard>
                <span className={dashboardCSS.txtlist}>Dashboard</span>
              </button>
            </li>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('profile')}>
                <BiSolidUser className={dashboardCSS.icon}></BiSolidUser>
                <span className={dashboardCSS.txtlist}>Profile</span>
              </button>
            </li>
            <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('pengaduan')}>
                <BiSolidCommentAdd className={dashboardCSS.icon}></BiSolidCommentAdd>
                <span className={dashboardCSS.txtlist}>Pengaduan</span>
              </button>
            </li>
            {/* <li>
              <button className={dashboardCSS.btnlist} onClick={() => setActiveComponent('respon')}>
                <BiSolidConversation className={dashboardCSS.icon}></BiSolidConversation>
                <span className={dashboardCSS.txtlist}>Respon</span>
              </button>
            </li> */}
          </ul>
        </div>
        <button className={dashboardCSS.logout} onClick={handleLogout}>
          <BiLogOut className={dashboardCSS.iconlo}></BiLogOut> Logout
        </button>
      </div>

      <div className={dashboardCSS.content}>
        {activeComponent === 'dashboard' && <Dash_m />}
        {activeComponent === 'profile' && <Profil />}
        {activeComponent === 'pengaduan' && <Pengaduan />}
        {/* {activeComponent === 'respon' && <Respon />} */}
      </div>
    </div>
  );
}

export default DashboardMahasiswa;

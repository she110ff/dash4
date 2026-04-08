import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './PortalLayout.module.css';

export function PortalLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout} data-theme="light">
      <header className={styles.header}>
        <Link to="/dashboard" className={styles.logo}>Dash4</Link>
        <div className={styles.right}>
          <span className={styles.userName}>{user?.name}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

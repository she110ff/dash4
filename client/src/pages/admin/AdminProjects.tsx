import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { PortalLayout } from '../../components/portal/PortalLayout';
import styles from './AdminProjects.module.css';

const STATUS_LABELS: Record<string, string> = {
  W1: 'Week 1', W2: 'Week 2', W3: 'Week 3', W4: 'Week 4',
  DONE: '완료', PAUSED: '중단',
};

export function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects.list().then(setProjects).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await api.projects.updateStatus(id, status);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  return (
    <PortalLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.heading}>프로젝트 관리</h1>
          <Link to="/admin/projects/new" className={styles.newBtn}>새 프로젝트</Link>
        </div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>프로젝트</th>
                <th>고객</th>
                <th>상태</th>
                <th>커밋</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/projects/${p.id}`} className={styles.link}>{p.name}</Link>
                  </td>
                  <td>{p.client.name}</td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className={styles.select}
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{p._count.commits}</td>
                  <td>
                    <Link to={`/admin/projects/${p.id}`} className={styles.actionLink}>리포트 작성</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PortalLayout>
  );
}

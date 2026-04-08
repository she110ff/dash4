import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { PortalLayout } from '../components/portal/PortalLayout';
import styles from './Dashboard.module.css';

const STATUS_LABELS: Record<string, string> = {
  W1: 'Week 1', W2: 'Week 2', W3: 'Week 3', W4: 'Week 4',
  DONE: '완료', PAUSED: '중단',
};

export function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects.list()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout>
      <div className={styles.page}>
        <h1 className={styles.heading}>
          {user?.name}님, 안녕하세요
        </h1>
        <p className={styles.sub}>
          {projects.length > 0
            ? `${projects.length}개의 프로젝트가 진행 중입니다.`
            : ''}
        </p>

        {loading ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : projects.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>아직 진행 중인 프로젝트가 없습니다.</p>
            <p className={styles.emptyHint}>상담 후 프로젝트가 시작되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.statusBadge} data-status={project.status}>
                    {STATUS_LABELS[project.status] || project.status}
                  </span>
                </div>
                <div className={styles.cardStats}>
                  <span>{project._count.commits} 커밋</span>
                  <span>{project._count.messages} 메시지</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

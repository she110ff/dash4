import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import styles from './CommitTab.module.css';

interface Commit {
  id: string;
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  url?: string;
}

export function CommitTab({ projectId }: { projectId: string }) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects.commits(projectId)
      .then(setCommits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className={styles.loading}>커밋을 불러오는 중...</div>;

  if (commits.length === 0) {
    return (
      <div className={styles.empty}>
        아직 커밋이 없습니다. 곧 첫 커밋이 올라옵니다.
      </div>
    );
  }

  // 일별 그룹핑
  const grouped = commits.reduce<Record<string, Commit[]>>((acc, commit) => {
    const date = new Date(commit.timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    (acc[date] ||= []).push(commit);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className={styles.group}>
          <div className={styles.dateLabel}>{date}</div>
          {items.map((commit) => (
            <div key={commit.id} className={styles.commitRow}>
              <a
                href={commit.url || '#'}
                target="_blank"
                rel="noopener"
                className={styles.sha}
              >
                {commit.sha.slice(0, 7)}
              </a>
              <span className={styles.message}>{commit.message}</span>
              <span className={styles.time}>
                {new Date(commit.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

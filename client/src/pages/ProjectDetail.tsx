import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { PortalLayout } from '../components/portal/PortalLayout';
import { CommitTab } from '../components/portal/CommitTab';
import { ChatTab } from '../components/portal/ChatTab';
import styles from './ProjectDetail.module.css';

const STATUS_LABELS: Record<string, string> = {
  W1: 'Week 1', W2: 'Week 2', W3: 'Week 3', W4: 'Week 4',
  DONE: '완료', PAUSED: '중단',
};

type Tab = 'commits' | 'chat' | 'reports' | 'invoices';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('commits');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.projects.get(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PortalLayout>
        <div className={styles.skeleton} />
      </PortalLayout>
    );
  }

  if (!project) {
    return (
      <PortalLayout>
        <div className={styles.notFound}>프로젝트를 찾을 수 없습니다.</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.meta}>
              {project.client.name} · {STATUS_LABELS[project.status]}
            </p>
          </div>
          <span className={styles.statusBadge} data-status={project.status}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <div className={styles.tabs}>
          {(['commits', 'chat', 'reports', 'invoices'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {{ commits: '커밋', chat: '채팅', reports: '리포트', invoices: '인보이스' }[t]}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {tab === 'commits' && <CommitTab projectId={project.id} />}
          {tab === 'chat' && <ChatTab projectId={project.id} />}
          {tab === 'reports' && (
            <ReportsView reports={project.reports} />
          )}
          {tab === 'invoices' && (
            <InvoicesView invoices={project.invoices} />
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function ReportsView({ reports }: { reports: any[] }) {
  if (reports.length === 0) {
    return <div className={styles.empty}>아직 리포트가 없습니다. 곧 첫 리포트가 올라옵니다.</div>;
  }
  return (
    <div className={styles.list}>
      {reports.map((r) => (
        <div key={r.id} className={styles.reportCard}>
          <h3 className={styles.reportTitle}>Week {r.weekNumber} 리포트</h3>
          <div className={styles.reportSection}>
            <strong>완료 사항</strong>
            <ul>{r.completedItems.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
          </div>
          <div className={styles.reportSection}>
            <strong>다음 주 계획</strong>
            <ul>{r.nextWeekPlan.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function InvoicesView({ invoices }: { invoices: any[] }) {
  if (invoices.length === 0) {
    return <div className={styles.empty}>아직 정산 내역이 없습니다.</div>;
  }
  const STATUS_STYLE: Record<string, string> = {
    PENDING: styles.invoicePending,
    PAID: styles.invoicePaid,
    CANCELLED: styles.invoiceCancelled,
  };
  return (
    <div className={styles.list}>
      {invoices.map((inv) => (
        <div key={inv.id} className={styles.invoiceRow}>
          <span>Week {inv.weekNumber}</span>
          <span>{(inv.amount / 10000).toLocaleString()}만 원</span>
          <span className={STATUS_STYLE[inv.status] || ''}>
            {{ PENDING: '정산 대기', PAID: '정산 완료', CANCELLED: '취소' }[inv.status as string]}
          </span>
        </div>
      ))}
    </div>
  );
}

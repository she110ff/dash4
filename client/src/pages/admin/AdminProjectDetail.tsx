import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { PortalLayout } from '../../components/portal/PortalLayout';
import styles from './AdminProjectDetail.module.css';

export function AdminProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [weekNumber, setWeekNumber] = useState(1);
  const [completedItems, setCompletedItems] = useState('');
  const [nextWeekPlan, setNextWeekPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    api.projects.get(id).then(setProject);
  }, [id]);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setMessage('');
    try {
      await api.reports.create(id, {
        weekNumber,
        completedItems: completedItems.split('\n').filter(Boolean),
        nextWeekPlan: nextWeekPlan.split('\n').filter(Boolean),
      });
      setMessage(`Week ${weekNumber} 리포트가 생성되었습니다. 인보이스도 자동 생성됨.`);
      setCompletedItems('');
      setNextWeekPlan('');
      // Refresh project data
      api.projects.get(id).then(setProject);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvoiceStatus = async (invoiceId: string, status: string) => {
    await api.invoices.updateStatus(invoiceId, status);
    if (id) api.projects.get(id).then(setProject);
  };

  if (!project) return <PortalLayout><div className={styles.loading}>로딩 중...</div></PortalLayout>;

  return (
    <PortalLayout>
      <div className={styles.page}>
        <h1 className={styles.heading}>{project.name}</h1>
        <p className={styles.meta}>{project.client.name} · {project.status}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>주간 리포트 작성</h2>
          <form onSubmit={handleCreateReport} className={styles.form}>
            <label className={styles.label}>
              주차
              <select value={weekNumber} onChange={(e) => setWeekNumber(Number(e.target.value))} className={styles.select}>
                {[1, 2, 3, 4].map((w) => (
                  <option key={w} value={w} disabled={project.reports.some((r: any) => r.weekNumber === w)}>
                    Week {w} {project.reports.some((r: any) => r.weekNumber === w) ? '(작성됨)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              이번 주 완료 사항 (줄 단위)
              <textarea value={completedItems} onChange={(e) => setCompletedItems(e.target.value)}
                className={styles.textarea} rows={4} placeholder="API 엔드포인트 구현&#10;인증 시스템 완성" />
            </label>
            <label className={styles.label}>
              다음 주 계획 (줄 단위)
              <textarea value={nextWeekPlan} onChange={(e) => setNextWeekPlan(e.target.value)}
                className={styles.textarea} rows={4} placeholder="프론트엔드 개발&#10;UI 테스트" />
            </label>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? '생성 중...' : '리포트 생성 (인보이스 자동 생성)'}
            </button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>기존 리포트</h2>
          {project.reports.length === 0 ? (
            <p className={styles.empty}>아직 리포트가 없습니다.</p>
          ) : (
            project.reports.map((r: any) => (
              <div key={r.id} className={styles.reportCard}>
                <strong>Week {r.weekNumber}</strong>
                <div className={styles.reportItems}>
                  <span>완료: {r.completedItems.join(', ')}</span>
                  <span>계획: {r.nextWeekPlan.join(', ')}</span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>인보이스</h2>
          {project.invoices.length === 0 ? (
            <p className={styles.empty}>아직 인보이스가 없습니다.</p>
          ) : (
            <table className={styles.invoiceTable}>
              <thead>
                <tr><th>주차</th><th>금액</th><th>상태</th><th>액션</th></tr>
              </thead>
              <tbody>
                {project.invoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>Week {inv.weekNumber}</td>
                    <td>{(inv.amount / 10000).toLocaleString()}만 원</td>
                    <td className={styles[`status${inv.status}`]}>
                      {{ PENDING: '정산 대기', PAID: '정산 완료', CANCELLED: '취소' }[inv.status as string]}
                    </td>
                    <td>
                      {inv.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleInvoiceStatus(inv.id, 'PAID')} className={styles.paidBtn}>정산 완료</button>
                          <button onClick={() => handleInvoiceStatus(inv.id, 'CANCELLED')} className={styles.cancelBtn}>취소</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </PortalLayout>
  );
}

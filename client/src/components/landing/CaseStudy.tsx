import styles from './CaseStudy.module.css';

export function CaseStudy() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>실제 프로젝트</h2>
        <p className={styles.sub}>Dash4가 직접 만든 프로젝트의 실제 데이터입니다.</p>
        <div className={styles.card}>
          <div className={styles.screenshot}>
            <span className={styles.screenshotLabel}>Dash4 서비스 플랫폼</span>
          </div>
          <div className={styles.info}>
            <h3 className={styles.projectName}>Case Study #1: Dash4 자체 구축</h3>
            <p className={styles.meta}>SaaS 웹앱 · Vite+React, NestJS, PostgreSQL, AWS</p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>—</span>
                <span className={styles.statLabel}>커밋</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>4주</span>
                <span className={styles.statLabel}>소요 기간</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>—</span>
                <span className={styles.statLabel}>테스트 커버리지</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>—</span>
                <span className={styles.statLabel}>Lighthouse</span>
              </div>
            </div>
            <p className={styles.note}>
              이 서비스 자체가 4주 안에 만들어졌습니다.
              위 수치는 프로젝트 완료 시 실제 데이터로 업데이트됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>아이디어를 현실로</h2>
        <p className={styles.sub}>
          30분 무료 상담으로 시작하세요. 선금 없이, 결과를 보고 결정하세요.
        </p>
        <a href="https://calendly.com" target="_blank" rel="noopener" className={styles.button}>
          무료 상담 예약
        </a>
        <div className={styles.stack}>
          {['React', 'NestJS', 'Prisma', 'PostgreSQL', 'AWS', 'Claude Code AI'].map((tech) => (
            <span key={tech} className={styles.techBadge}>{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

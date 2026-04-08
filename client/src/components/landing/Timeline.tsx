import styles from './Timeline.module.css';

const weeks = [
  { num: 'W1', title: '설계 & 기반', items: ['아키텍처 설계', 'DB 스키마', 'API 구조', '인증 시스템'], cost: '250만 원' },
  { num: 'W2', title: '핵심 기능', items: ['코어 기능 개발', '인증/인가', '데이터 모델', '커밋 로그 연동'], cost: '250만 원' },
  { num: 'W3', title: 'UI & 통합', items: ['프론트엔드', 'API 연동', '반응형 UI', '실시간 채팅'], cost: '250만 원' },
  { num: 'W4', title: '배포 & QA', items: ['테스트', '배포 파이프라인', 'QA 검수', '인수인계'], cost: '250만 원' },
];

export function Timeline() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>4주간의 여정</h2>
        <p className={styles.sub}>매주 결과물을 확인하고, 매주 250만 원씩 후불 정산합니다.</p>
        <div className={styles.grid}>
          {weeks.map((week) => (
            <div key={week.num} className={styles.week}>
              <span className={styles.num}>{week.num}</span>
              <h3 className={styles.weekTitle}>{week.title}</h3>
              <ul className={styles.items}>
                {week.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.cost}>{week.cost}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

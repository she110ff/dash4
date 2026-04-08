import styles from './Pillars.module.css';

const pillars = [
  {
    title: '실시간 투명성',
    description: '매일 코드 커밋과 진행 로그를 실시간으로 확인하세요. 무슨 일이 일어나고 있는지 항상 알 수 있습니다.',
    detail: 'Discord가 아닌 전용 포털에서 커밋 로그, 주간 리포트, 실시간 채팅을 한 곳에서 관리합니다.',
  },
  {
    title: '리스크 제로',
    description: '매주 결과물을 보고 계속 진행할지 결정합니다. 중단하면 그 주까지만 정산. 선금 없음.',
    detail: '250만 원씩 주 단위 후불 정산. 결과에 만족하지 않으면 언제든 중단할 수 있습니다.',
  },
  {
    title: '아키텍처 전문성',
    description: '27년 설계 경험 + Claude Code AI. 단순 코딩이 아닌, 확장 가능한 아키텍처를 제공합니다.',
    detail: 'NestJS, React, PostgreSQL, AWS. 스타트업이 시리즈 A 이후에도 쓸 수 있는 구조를 처음부터 설계합니다.',
  },
];

export function Pillars() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {pillars.map((pillar, i) => (
          <div key={i} className={`${styles.pillar} ${i % 2 === 1 ? styles.reversed : ''}`}>
            <div className={styles.text}>
              <span className={styles.number}>0{i + 1}</span>
              <h2 className={styles.title}>{pillar.title}</h2>
              <p className={styles.description}>{pillar.description}</p>
              <p className={styles.detail}>{pillar.detail}</p>
            </div>
            <div className={styles.visual}>
              <div className={styles.visualPlaceholder} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

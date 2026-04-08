import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.badge}>27년 경력 아키텍트 + AI</span>
          <h1 className={styles.headline}>
            4주 완성.<br />
            후불제.<br />
            MVP.
          </h1>
          <p className={styles.sub}>
            투자받은 창업자를 위한 가장 투명한 MVP 제작 서비스.
            <br />
            매주 결과를 확인하고, 매주 결정하세요.
          </p>
          <div className={styles.cta}>
            <a href="https://calendly.com" target="_blank" rel="noopener" className={styles.ctaButton}>
              무료 상담 예약
            </a>
            <span className={styles.price}>1,000만 원 / 4주 · 100% 후불제</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.portalPreview}>
            <div className={styles.portalHeader}>
              <span className={styles.projectName}>FoodTech MVP</span>
              <span className={styles.statusBadge}>W2 진행중</span>
            </div>
            <div className={styles.portalBody}>
              <div className={styles.commitLine}>
                <span className={styles.sha}>a3f2d1c</span>
                <span>feat: 주문 API 엔드포인트 구현</span>
                <span className={styles.time}>2시간 전</span>
              </div>
              <div className={styles.commitLine}>
                <span className={styles.sha}>b7e4a2f</span>
                <span>fix: 사용자 인증 토큰 만료 처리</span>
                <span className={styles.time}>4시간 전</span>
              </div>
              <div className={styles.commitLine}>
                <span className={styles.sha}>c9d1b3e</span>
                <span>feat: 결제 연동 Stripe webhook</span>
                <span className={styles.time}>어제</span>
              </div>
              <div className={styles.chatPreview}>
                <div className={styles.chatMsg}>
                  <strong>아키텍트</strong> Week 2 결제 모듈 완료했습니다.
                </div>
                <div className={styles.chatMsgClient}>
                  <strong>의뢰인</strong> 확인했습니다. 환불 플로우도 추가 가능할까요?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Hero } from '../components/landing/Hero';
import { Pillars } from '../components/landing/Pillars';
import { Timeline } from '../components/landing/Timeline';
import { CaseStudy } from '../components/landing/CaseStudy';
import { FinalCta } from '../components/landing/FinalCta';
import styles from './Landing.module.css';

export function Landing() {
  return (
    <div className={styles.landing}>
      <Hero />
      <Pillars />
      <Timeline />
      <CaseStudy />
      <FinalCta />
    </div>
  );
}

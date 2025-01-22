import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      Løbsresultater DM2025 <br/>
      Resultater findes på .../results/[eventID]
    </div>
  );
}

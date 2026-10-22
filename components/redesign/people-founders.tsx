import styles from "./people-founders.module.css";

const team = [
  { name: "Akarsh Malavalli", initials: "AM", role: "Co-Founder + CTO" },
  { name: "Arnav Maheshwari", initials: "AM", role: "Co-Founder + CBO" },
];

export function PeopleFounders() {
  return (
    <section className={styles.section} aria-labelledby="people-team-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>THE PEOPLE BEHIND OPENECONOMICS</p>
          <h2 id="people-team-title">Start with the people building it.</h2>
        </div>
        <p>Meet the team at the heart of OpenEconomics before exploring the wider ambassador network.</p>
      </div>
      <div className={styles.grid}>
        {team.map((person, index) => (
          <article className={styles.card} key={person.name}>
            <div className={`${styles.art} ${index === 0 ? styles.first : styles.second}`} aria-hidden="true">
              <span className={styles.ring} />
              <span className={styles.initials}>{person.initials}</span>
            </div>
            <div className={styles.cardBody}>
              <div>
                <span className={styles.number}>0{index + 1} / OEP TEAM</span>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

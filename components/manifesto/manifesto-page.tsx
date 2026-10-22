import { manifesto, manifestoVideoId } from "@/lib/manifesto";
import { ReadingProgress } from "./reading-progress";
import { RevealWords } from "./reveal-words";
import styles from "./manifesto.module.css";

/** The existing OEP bracket mark, drawn as a crisp single-color vector. */
function OEPMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 108" fill="none" aria-hidden="true">
    <path d="M35 7H8V101H35" stroke="currentColor" strokeWidth="9"/>
    <path d="M65 7H91V39C91 47 94 51 99 54C94 57 91 61 91 69V101H65" stroke="currentColor" strokeWidth="9"/>
  </svg>;
}

function ManifestoFilm() {
  return <figure className={styles.film} aria-label="The story behind the manifesto">
    <div className={styles.filmFrame}>
      {manifestoVideoId ? <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(manifestoVideoId)}`}
        title="Why we believe economic knowledge should be open"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      /> : <div className={styles.filmPlaceholder} role="img" aria-label="The Open Economics Project manifesto film.">
        <OEPMark className={styles.watermark}/>
        <div className={styles.filmBrand}><OEPMark/><span>The Open Economics Project</span></div>
        <span className={styles.filmStamp}>INSTITUTIONAL FILM</span>
        <div className={styles.filmTitle} aria-hidden="true"><span className={styles.play}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12L8 5Z"/></svg></span><span>The story behind<br/>the conviction.</span></div>
        <div className={styles.filmFoot}><span>OUR MANIFESTO</span><span className={styles.filmStatus}>MANIFESTO FILM</span></div>
      </div>}
    </div>
    <figcaption>Why we believe economic knowledge should be open.</figcaption>
  </figure>;
}

function Marginalia({ number }: { number: string }) {
  return <div className={styles.marginalia} aria-label={`Section ${number}`}><span>{number}</span></div>;
}

export function ManifestoPage() {
  return <div className={styles.page} id="oep-manifesto">
    <ReadingProgress/>
    <header className={styles.hero}>
      <div className={styles.mark} role="img" aria-label="The Open Economics Project"><OEPMark/></div>
      <p className={styles.label} data-manifesto-copy>{manifesto.title}</p>
      <h1 data-manifesto-copy><span><RevealWords text="Economic knowledge"/></span>{" "}<span><RevealWords text="should be open."/></span></h1>
      <p className={styles.promise} data-manifesto-copy><RevealWords text={manifesto.promise}/></p>
    </header>
    <ManifestoFilm/>
    <div className={styles.rule} aria-hidden="true"/>
    <article className={styles.reading} aria-label="The manifesto">
      <section className={styles.movement} aria-labelledby="manifesto-opening">
        <Marginalia number="I"/>
        <div className={styles.column}>
          <div className={styles.opening}>
            <h2 id="manifesto-opening" data-manifesto-copy><RevealWords text={manifesto.opening} italicFrom={5}/></h2>
            <p data-manifesto-copy><RevealWords text={manifesto.response}/></p>
          </div>
          <div className={styles.prose}>
            <p data-manifesto-copy><RevealWords text={manifesto.firstMovement[0]}/></p>
            <div className={styles.contrast}>
              <p data-manifesto-copy><RevealWords text={manifesto.firstMovement[1]}/></p>
              <p data-manifesto-copy><RevealWords text={manifesto.firstMovement[2]}/></p>
            </div>
            <p data-manifesto-copy><RevealWords text={manifesto.firstMovement[3]}/></p>
          </div>
        </div>
      </section>
      <div className={styles.transition} aria-hidden="true"><span/><OEPMark/><span/></div>
      <section className={styles.movement} aria-labelledby="manifesto-purpose">
        <Marginalia number="II"/>
        <div className={styles.column}>
          <div className={styles.principle}>
            <h2 id="manifesto-purpose" data-manifesto-copy><RevealWords text={manifesto.principle[0]}/></h2>
            <p data-manifesto-copy><RevealWords text={manifesto.principle[1]}/></p>
          </div>
          <div className={styles.prose}>
            <p data-manifesto-copy><RevealWords text={manifesto.secondMovement[0]}/></p>
            <p className={styles.conviction} data-manifesto-copy><RevealWords text={manifesto.secondMovement[1]}/></p>
            <p data-manifesto-copy><RevealWords text={manifesto.secondMovement[2]}/></p>
            <p data-manifesto-copy><RevealWords text={manifesto.secondMovement[3]}/></p>
          </div>
        </div>
      </section>
    </article>
    <section className={styles.closing} aria-labelledby="manifesto-closing">
      <div className={styles.closingInner}>
        <h2 id="manifesto-closing">
          <span className={styles.closingLead}>
            <span data-manifesto-copy><RevealWords text={manifesto.closing[0]}/></span>{" "}
            <span className={styles.closingCounter} data-manifesto-copy><RevealWords text={manifesto.closing[1]}/></span>
          </span>
          <span className={styles.closingChallenge} data-manifesto-copy><RevealWords text={manifesto.closing[2]}/></span>
        </h2>
        <div className={styles.closingRule} aria-hidden="true"/>
        <p className={styles.invitation} data-manifesto-copy><RevealWords text={manifesto.invitation}/></p>
        <div className={styles.signature}><OEPMark/><p data-manifesto-copy>{manifesto.signature}</p></div>
      </div>
    </section>
  </div>;
}

import Portrait from './Portrait';
import { profile } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function About() {
  const factRows = [
    { label: 'Name', value: profile.name },
    { label: 'Title', value: profile.title },
    { label: 'Email', value: profile.email },
    { label: 'WhatsApp', value: profile.whatsapp.display },
  ];

  const nothingToHide =
    profile.education.length === 0 &&
    profile.experience.length === 0 &&
    profile.certifications.length === 0 &&
    profile.achievements.length === 0;

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          index="08"
          label="About"
          title={<span id="about-title">Engineering solutions, not just interfaces.</span>}
        />

        <div className="about__grid">
          <Reveal className="about__intro-wrap">
            <figure className="about__portrait">
              <Portrait />
            </figure>

            <div className="about__facts">
              {factRows.map((row) => (
                <div className="about__fact" key={row.label}>
                  <i>{row.label}</i>
                  <b>{row.value}</b>
                </div>
              ))}
            </div>

            <div className="about__chips" aria-label="Working capabilities">
              {profile.capabilities.map((cap) => (
                <span className="chip" key={cap}>
                  {cap}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90} className="about__body">
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {nothingToHide ? (
              <div className="about__missing">
                <b>To keep this profile honest</b>
                Education, work history, certifications and achievements are intentionally not published yet
                because they haven&rsquo;t been verified for this page. Ask me about any of it directly —
                email or WhatsApp reach me fastest.
              </div>
            ) : (
              <>
                {profile.education.length > 0 && (
                  <div className="about__missing">
                    <b>Education</b>
                    {profile.education.join(' · ')}
                  </div>
                )}
                {profile.experience.length > 0 && (
                  <div className="about__missing">
                    <b>Experience</b>
                    {profile.experience.join(' · ')}
                  </div>
                )}
                {profile.certifications.length > 0 && (
                  <div className="about__missing">
                    <b>Certifications</b>
                    {profile.certifications.join(' · ')}
                  </div>
                )}
                {profile.achievements.length > 0 && (
                  <div className="about__missing">
                    <b>Achievements</b>
                    {profile.achievements.join(' · ')}
                  </div>
                )}
              </>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

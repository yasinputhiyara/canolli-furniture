import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import '../styles/AboutPage.css';

const TEAM = [
    { name: 'Muhammed Rashid', role: 'Founder & Master Craftsman', since: '1987', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=75&auto=format&fit=crop&face' },
    { name: 'Ayesha Rashid', role: 'Design Director', since: '2010', img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=75&auto=format&fit=crop&face' },
    { name: 'Arjun Nair', role: 'Head of Craftsmanship', since: '2014', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=75&auto=format&fit=crop&face' },
];

export default function AboutPage() {
    return (
        <div className="about-page">
            <SEOHead 
                title="About Us | Canolli Furniture"
                description="Learn about the master craftsmen behind Canolli Furniture. Three decades of teak mastery in Nilambur, Kerala. Est. 1987."
                url="/about"
                keywords="about canolli furniture, nilambur teak history, kerala furniture craftsmen"
            />
            {/* Hero */}
            <div className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-vignette" />
                <div className="about-hero-content au">
                    <div className="ab-eyebrow"><span className="ab-line" />Est. 1987 · Nilambur, Kerala</div>
                    <h1 className="about-h1">Where Forest Meets<br /><em>Craft.</em></h1>
                    <p className="about-sub">Three decades of teak mastery, one family's obsession with perfection.</p>
                </div>
            </div>

            {/* Origin */}
            <section className="about-section origin-sect" style={{ background: 'white' }}>
                <div className="about-inner two-col">
                    <div className="about-text au">
                        <div className="sec-eyebrow">Our Story</div>
                        <h2 className="sec-title">Rooted in <em>Nilambur</em></h2>
                        <p className="about-body">
                            In 1987, master craftsman Muhammed Rashid set up his first workshop in the teak heartland of Kerala — Nilambur.
                            Armed with traditional techniques passed down through generations, he began crafting furniture that was built not for seasons, but for lifetimes.
                        </p>
                        <p className="about-body" style={{ marginTop: '1rem' }}>
                            Three decades later, Canolli is Kerala's most-trusted teak furniture brand.
                            We source directly from GI-certified Nilambur forest estates and work only with master craftsmen who share our obsession with quality.
                        </p>
                        <div className="about-numbers">
                            {[['35+', 'Years of Craft'], ['50K+', 'Pieces Delivered'], ['100%', 'GI Certified Teak'], ['30+', 'Master Artisans']].map(([n, l]) => (
                                <div className="about-num" key={l}><div className="about-num-val">{n}</div><div className="about-num-lbl">{l}</div></div>
                            ))}
                        </div>
                    </div>
                    <div className="about-img-wrap">
                        <img src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=900&q=80&auto=format&fit=crop" alt="Craftsman at work" />
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-section values-sect" style={{ background: 'var(--parch)' }}>
                <div className="about-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>What We Stand For</div>
                        <h2 className="sec-title">Our Values</h2>
                    </div>
                    <div className="values-grid">
                        {[['🌳', 'Forest Stewardship', 'Every tree we use is sustainably harvested from regulated forest estates. We plant three saplings for every tree used.'],
                        ['🔨', 'Craft Excellence', 'No shortcuts. Every joint is hand-fitted, every surface hand-sanded through 8 progressive grits.'],
                        ['🛡', 'Lifetime Warranty', 'We stand behind every piece we create. If it breaks, we fix it — no questions asked.'],
                        ['🚚', 'White-Glove Delivery', 'Free delivery and expert assembly across India. We don\'t leave until you\'re satisfied.']
                        ].map(([i, t, d]) => (
                            <div className="value-card" key={t}>
                                <div className="vc-icon">{i}</div>
                                <div className="vc-title">{t}</div>
                                <div className="vc-desc">{d}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="about-section team-sect" style={{ background: 'white' }}>
                <div className="about-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>Meet the Team</div>
                        <h2 className="sec-title">The <em>People</em> Behind Canolli</h2>
                    </div>
                    <div className="team-grid">
                        {TEAM.map(t => (
                            <div className="team-card" key={t.name}>
                                <div className="team-img-wrap"><img src={t.img} alt={t.name} loading="lazy" /></div>
                                <div className="team-info">
                                    <div className="team-name">{t.name}</div>
                                    <div className="team-role">{t.role}</div>
                                    <div className="team-since">With Canolli since {t.since}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="about-cta-bg" />
                <div className="about-cta-content">
                    <h2 className="cta-title">Ready to bring <em>Nilambur</em> home?</h2>
                    <p className="cta-sub">Explore our full collection of GI-certified teak furniture.</p>
                    <Link to="/shop" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}><span>Shop the Collection →</span></Link>
                </div>
            </section>
        </div>
    );
}

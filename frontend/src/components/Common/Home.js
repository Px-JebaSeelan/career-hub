import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find Your <span className="highlight-text">Dream Job</span> <br />
                        With <span className="brand-text">CareerHub</span>
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate platform connecting top-tier talent with world-class organizations.
                        Start your journey today.
                    </p>
                    <div className="cta-group">
                        {localStorage.getItem('isloggedin') === 'true' ? (
                            <Link to={localStorage.getItem('user_type') === 'recruiter' ? "/profile" : "/search_job"} className="btn-primary btn-lg">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-primary btn-lg">Get Started</Link>
                                <Link to="/login" className="btn-glass btn-lg">Login</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="glass-card float-card card-1">
                        <div className="icon"><span role="img" aria-label="rocket">🚀</span></div>
                        <h4>1000+ Jobs</h4>
                        <p>Posted Daily</p>
                    </div>
                    <div className="glass-card float-card card-2">
                        <div className="icon"><span role="img" aria-label="people">👥</span></div>
                        <h4>Top Talent</h4>
                        <p>Hired Weekly</p>
                    </div>
                    <div className="glass-card float-card card-3">
                        <div className="icon"><span role="img" aria-label="office">🏢</span></div>
                        <h4>Best Companies</h4>
                        <p>Trust Us</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="glass feature-card">
                        <div className="feature-icon"><span role="img" aria-label="search">🔍</span></div>
                        <h3>Smart Search</h3>
                        <p>Filter jobs by salary, duration, and type to find your perfect match instantly.</p>
                    </div>
                    <div className="glass feature-card">
                        <div className="feature-icon"><span role="img" aria-label="lightning">⚡</span></div>
                        <h3>Fast Applications</h3>
                        <p>Apply to multiple jobs in seconds with your saved profile and resume.</p>
                    </div>
                    <div className="glass feature-card">
                        <div className="feature-icon"><span role="img" aria-label="shield">🛡️</span></div>
                        <h3>Verified Recruiters</h3>
                        <p>We vet every recruiter to ensure you only see legitimate and high-quality opportunities.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} CareerHub Job Portal. All rights reserved.</p>
            </footer>

            <style>{`
                .home-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                /* Hero Section */
                .hero-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 4rem 10%;
                    min-height: 85vh;
                    position: relative;
                    overflow: hidden;
                }

                .hero-content {
                    max-width: 50%;
                    z-index: 2;
                }

                .hero-title {
                    font-size: 4rem;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    color: var(--text-main);
                }

                .highlight-text {
                    color: var(--primary);
                    background: -webkit-linear-gradient(45deg, var(--primary), #a8efff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .brand-text {
                    color: var(--secondary);
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                    max-width: 90%;
                }

                .cta-group {
                    display: flex;
                    gap: 1.5rem;
                }

                .btn-lg {
                    padding: 1rem 2.5rem;
                    font-size: 1.1rem;
                    border-radius: 50px;
                }

                .btn-glass {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-main);
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .btn-glass:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    color: var(--text-main);
                    text-decoration: none;
                }

                /* Visuals */
                .hero-visual {
                    position: relative;
                    width: 45%;
                    height: 500px;
                }

                .float-card {
                    position: absolute;
                    width: 200px;
                    padding: 1.5rem;
                    text-align: center;
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: float 6s ease-in-out infinite;
                }

                .card-1 {
                    top: 10%;
                    left: 0;
                    background: rgba(30, 30, 60, 0.6);
                    animation-delay: 0s;
                }
                .card-2 {
                    top: 40%;
                    right: 0;
                    background: rgba(60, 30, 60, 0.6);
                    animation-delay: 2s;
                }
                .card-3 {
                    bottom: 10%;
                    left: 20%;
                    background: rgba(30, 60, 60, 0.6);
                    animation-delay: 4s;
                }

                .icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }

                /* Features */
                .features-section {
                    padding: 5rem 10%;
                }

                .section-title {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 3rem;
                    font-weight: 700;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }

                .feature-card {
                    padding: 2.5rem;
                    text-align: center;
                    border-radius: 20px;
                    transition: transform 0.3s;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }

                .home-footer {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-tertiary);
                    font-size: 0.9rem;
                    margin-top: auto;
                }

                /* Responsive - Tablet */
                @media (max-width: 900px) {
                    .hero-section {
                        flex-direction: column;
                        text-align: center;
                        padding: 6rem 5% 3rem;
                        min-height: auto;
                    }
                    .hero-content {
                        max-width: 100%;
                        margin-bottom: 3rem;
                    }
                    .hero-title {
                        font-size: 2.8rem;
                    }
                    .hero-subtitle {
                        font-size: 1.1rem;
                        max-width: 100%;
                    }
                    .hero-visual {
                        width: 100%;
                        height: 350px;
                    }
                    .cta-group {
                        justify-content: center;
                    }
                    .float-card {
                        width: 150px;
                        font-size: 0.85rem;
                        padding: 1.2rem;
                    }
                    .features-section {
                        padding: 3rem 5%;
                    }
                    .section-title {
                        font-size: 2rem;
                    }
                }

                /* Responsive - Mobile */
                @media (max-width: 600px) {
                    .hero-section {
                        padding: 5rem 4% 2rem;
                    }
                    .hero-title {
                        font-size: 2rem;
                    }
                    .hero-subtitle {
                        font-size: 1rem;
                        margin-bottom: 2rem;
                    }
                    .cta-group {
                        flex-direction: column;
                        gap: 1rem;
                        width: 100%;
                    }
                    .btn-lg {
                        padding: 0.9rem 2rem;
                        font-size: 1rem;
                        width: 100%;
                        text-align: center;
                    }
                    .hero-visual {
                        height: 280px;
                    }
                    .float-card {
                        width: 120px;
                        padding: 1rem;
                        font-size: 0.75rem;
                    }
                    .float-card h4 {
                        font-size: 0.9rem;
                    }
                    .float-card p {
                        font-size: 0.7rem;
                    }
                    .icon {
                        font-size: 1.8rem;
                    }
                    .card-1 {
                        top: 5%;
                        left: 5%;
                    }
                    .card-2 {
                        top: 35%;
                        right: 5%;
                    }
                    .card-3 {
                        bottom: 5%;
                        left: 30%;
                    }
                    .features-section {
                        padding: 2.5rem 4%;
                    }
                    .section-title {
                        font-size: 1.6rem;
                        margin-bottom: 2rem;
                    }
                    .features-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    .feature-card {
                        padding: 1.8rem;
                    }
                    .feature-icon {
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                    }
                    .feature-card h3 {
                        font-size: 1.2rem;
                    }
                    .feature-card p {
                        font-size: 0.9rem;
                    }
                    .home-footer {
                        padding: 1.5rem 1rem;
                        font-size: 0.8rem;
                    }
                }

                /* Responsive - Small Mobile */
                @media (max-width: 400px) {
                    .hero-title {
                        font-size: 1.7rem;
                    }
                    .hero-visual {
                        height: 220px;
                    }
                    .float-card {
                        width: 100px;
                        padding: 0.8rem;
                    }
                    .icon {
                        font-size: 1.5rem;
                        margin-bottom: 0.3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
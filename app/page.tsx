"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLElement | null>(null);
  const scrollTopRef = useRef<HTMLButtonElement | null>(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const navbar = navbarRef.current;
    const scrollTopBtn = scrollTopRef.current;
    function onScroll() {
      if (!navbar || !scrollTopBtn) return;
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = carouselTrackRef.current;
    if (!track) return;

    function handleMouseEnter() {
      const t = carouselTrackRef.current;
      if (t) t.style.animationPlayState = "paused";
    }
    function handleMouseLeave() {
      const t = carouselTrackRef.current;
      if (t) t.style.animationPlayState = "running";
    }

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const cardWidth = 410; // card width + gap

  function prevClick() {
    const track = carouselTrackRef.current;
    if (!track) return;
    track.style.animation = "none";
    let next = scrollAmount - cardWidth;
    if (next < 0) next = cardWidth * 7; // Reset to end
    setScrollAmount(next);
    track.style.transform = `translateX(-${next}px)`;
  }

  function nextClick() {
    const track = carouselTrackRef.current;
    if (!track) return;
    track.style.animation = "none";
    let next = scrollAmount + cardWidth;
    if (next > cardWidth * 7) next = 0; // Reset to start
    setScrollAmount(next);
    track.style.transform = `translateX(-${next}px)`;
  }

  function scrollToTarget(hash: string) {
    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus('submitting');
    setFormMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        e.currentTarget.reset();
      } else {
        setFormStatus('error');
        setFormMessage(result.error || 'Something went wrong. Please try again or call us directly.');
      }
    } catch (error) {
      setFormStatus('error');
      setFormMessage('Failed to send message. Please try again or contact us by phone.');
    }
  }

  return (
    <>
      <nav id="navbar" ref={navbarRef}>
        <a href="#home" className="nav-logo">
          Fix <span>Syndicate</span>
        </a>
        <ul className="nav-links">
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#home"); }} href="#home">Home</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Services</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#about"); }} href="#about">About</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact">Contact</a>
          </li>
          <li>
            <a href="tel:0416493356" className="nav-cta">Call Now</a>
          </li>
        </ul>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Property <span>Maintenance</span> & Management Excellence
            </h1>
            <p className="tagline">Residential • Commercial • Industrial</p>
            <p>
              Specialised in building, renovating, and managing properties with
              precision and care. Your trusted partner for comprehensive property
              solutions.
            </p>
            <div className="hero-buttons">
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> Get Free Quote
              </a>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services" className="btn btn-outline">
                <i className="fas fa-arrow-right"></i> Explore Services
              </a>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Modern Property"
              className="hero-image-main"
            />
            <div className="hero-floating-card card-1">
              <div className="floating-icon">
                <i className="fas fa-check" />
              </div>
              <div className="floating-text">
                <h4>500+</h4>
                <p>Projects Completed</p>
              </div>
            </div>
            <div className="hero-floating-card card-2">
              <div className="floating-icon">
                <i className="fas fa-star" />
              </div>
              <div className="floating-text">
                <h4>98%</h4>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-down" onClick={() => scrollToTarget("#portfolio")}>
          <span>Scroll Down</span>
          <i className="fas fa-chevron-down" />
        </div>
      </section>

      <section className="carousel-section" id="portfolio">
        <div className="section-header">
          <span className="section-badge">Our Portfolio</span>
          <h2 className="section-title">Services We Provide</h2>
          <p className="section-subtitle">Explore our comprehensive range of property maintenance and management services</p>
        </div>

        <div className="carousel-container">
          <div className="carousel-track" ref={carouselTrackRef}>
            {[
              { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "General Maintenance", text: "Complete repair and maintenance solutions" },
              { src: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Cleaning & Janitorial", text: "Professional cleaning services" },
              { src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Grounds & Landscaping", text: "Beautiful outdoor spaces" },
              { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Exterior & Structural", text: "Building exterior maintenance" },
              { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Property Turnover", text: "Rental preparation services" },
              { src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Emergency Services", text: "24/7 on-call support" },
              { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Property Inspections", text: "Detailed assessment reports" },
              { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Preventive Maintenance", text: "Scheduled care programs" },
            ].concat([
              { src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "General Maintenance", text: "Complete repair and maintenance solutions" },
              { src: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Cleaning & Janitorial", text: "Professional cleaning services" },
              { src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Grounds & Landscaping", text: "Beautiful outdoor spaces" },
              { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Exterior & Structural", text: "Building exterior maintenance" },
              { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Property Turnover", text: "Rental preparation services" },
              { src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Emergency Services", text: "24/7 on-call support" },
              { src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Property Inspections", text: "Detailed assessment reports" },
              { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", title: "Preventive Maintenance", text: "Scheduled care programs" },
            ])
            .map((item, idx) => (
              <div className="carousel-item" key={idx}>
                <img src={item.src} alt={item.title} />
                <div className="carousel-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-nav">
          <button className="carousel-btn" id="prevBtn" onClick={prevClick} aria-label="Previous">
            <i className="fas fa-arrow-left" />
          </button>
          <button className="carousel-btn" id="nextBtn" onClick={nextClick} aria-label="Next">
            <i className="fas fa-arrow-right" />
          </button>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-building" /></div>
            <span className="stat-number">500+</span>
            <div className="stat-label">Properties Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-smile" /></div>
            <span className="stat-number">98%</span>
            <div className="stat-label">Client Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-clock" /></div>
            <span className="stat-number">24/7</span>
            <div className="stat-label">Emergency Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-award" /></div>
            <span className="stat-number">15+</span>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">What We Offer</span>
            <h2 className="section-title">Our Professional Services</h2>
            <p className="section-subtitle">Comprehensive property maintenance solutions tailored to your needs</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><i className="fas fa-tools" /></div>
              <h3>General Maintenance & Repairs</h3>
              <p>From minor fixes to major repairs, we handle all aspects of property maintenance with expertise.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-broom" /></div>
              <h3>Cleaning & Janitorial</h3>
              <p>Professional cleaning solutions to keep your property spotless and welcoming.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-leaf" /></div>
              <h3>Grounds & Landscaping</h3>
              <p>Transform outdoor spaces with expert landscaping and grounds maintenance.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-hard-hat" /></div>
              <h3>Exterior & Structural</h3>
              <p>Comprehensive exterior maintenance including painting, roofing, and repairs.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-home" /></div>
              <h3>Property Turnover & Rental Prep</h3>
              <p>Get your property rent-ready with thorough turnover services.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-phone-volume" /></div>
              <h3>Emergency & On-Call</h3>
              <p>24/7 emergency response for urgent property issues when you need us most.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-calendar-alt" /></div>
              <h3>Scheduled Maintenance</h3>
              <p>Regular preventive maintenance programs to extend your property&apos;s lifespan.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-clipboard-check" /></div>
              <h3>Inspections & Admin</h3>
              <p>Detailed property inspections and comprehensive administrative services.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <div className="about-images">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Property" className="about-img-main" />
            <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Interior" className="about-img-secondary" />
            <div className="about-experience">
              <span>15+</span>
              <p>Years Experience</p>
            </div>
          </div>
          <div className="about-text">
            <span className="section-badge">About Us</span>
            <h2>Your Trusted Property Care Partner</h2>
            <p>At Fix Syndicate, we understand that your property is more than just a building – it&apos;s an investment. Our dedicated team provides comprehensive maintenance and management services for residential, commercial, and industrial properties.</p>

            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-shield-alt" />
                </div>
                <span>Licensed & Insured</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-dollar-sign" />
                </div>
                <span>Transparent Pricing</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-medal" />
                </div>
                <span>Quality Guaranteed</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-bolt" />
                </div>
                <span>Fast Response</span>
              </div>
            </div>

            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact" className="btn btn-primary">
              <i className="fas fa-arrow-right"></i> Get Started Today
            </a>
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center', marginBottom: '20px'}}>
            <span className="section-badge">Why Us</span>
            <h2 className="section-title">Why Choose Fix Syndicate?</h2>
            <p className="section-subtitle">We deliver exceptional value through quality, reliability, and customer focus</p>
          </div>

          <div className="why-grid">
            <div className="why-item">
              <i className="fas fa-gem" />
              <h4>Premium Quality</h4>
              <p>Our skilled professionals deliver superior results on every project, big or small.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-stopwatch" />
              <h4>Timely Delivery</h4>
              <p>We respect your time with punctual arrivals and efficient project completion.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-hand-holding-usd" />
              <h4>Best Value</h4>
              <p>Fair, transparent pricing with no hidden fees. Maximum value for your investment.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-headset" />
              <h4>Always Available</h4>
              <p>Round-the-clock availability for emergencies and customer inquiries.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Property?</h2>
          <p>Get in touch today for a free consultation and quote. Let us take care of all your property maintenance needs.</p>
          <a href="tel:0416493356" className="btn">
            <i className="fas fa-phone-alt"></i> Call Now: 0416 493 356
          </a>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center'}}>
            <span className="section-badge">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">We&apos;d love to hear from you. Reach out for a free quote today!</p>
          </div>

          <div className="contact-wrapper">
            <div className="contact-info">
              <h3>Let&apos;s Talk About Your Property</h3>
              <p>Have a question or need a quote? We&apos;re here to help with all your property maintenance needs.</p>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-phone-alt" />
                </div>
                <div className="contact-item-text">
                  <h4>Phone</h4>
                  <a href="tel:0416493356">0416 493 356</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-envelope" />
                </div>
                <div className="contact-item-text">
                  <h4>Email</h4>
                  <a href="mailto:rapidshiftdev@gmail.com">rapidshiftdev@gmail.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-clock" />
                </div>
                <div className="contact-item-text">
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 7:00 AM - 6:00 PM | Emergency: 24/7</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                {formStatus === 'success' && (
                  <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    {formMessage}
                  </div>
                )}
                {formStatus === 'error' && (
                  <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    {formMessage}
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" name="name" placeholder="John Smith" required disabled={formStatus === 'submitting'} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="0400 000 000" disabled={formStatus === 'submitting'} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="john@example.com" required disabled={formStatus === 'submitting'} />
                </div>
                <div className="form-group">
                  <label>Service Required</label>
                  <select name="service" disabled={formStatus === 'submitting'}>
                    <option value="">Select a service...</option>
                    <option value="maintenance">General Maintenance & Repairs</option>
                    <option value="cleaning">Cleaning & Janitorial</option>
                    <option value="landscaping">Grounds & Landscaping</option>
                    <option value="exterior">Exterior & Structural Work</option>
                    <option value="turnover">Property Turnover</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="scheduled">Scheduled Maintenance</option>
                    <option value="inspection">Inspections & Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" placeholder="Tell us about your property needs..." required disabled={formStatus === 'submitting'}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={formStatus === 'submitting'}>
                  <i className={formStatus === 'submitting' ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}></i>
                  {formStatus === 'submitting' ? ' Sending...' : ' Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Fix <span>Syndicate</span></h3>
            <p>Your trusted partner for comprehensive property maintenance and management services across residential, commercial, and industrial sectors.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f" /></a>
              <a href="#"><i className="fab fa-instagram" /></a>
              <a href="#"><i className="fab fa-linkedin-in" /></a>
              <a href="#"><i className="fab fa-twitter" /></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#home"); }} href="#home">Home</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Services</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#about"); }} href="#about">About Us</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Maintenance</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Cleaning</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Landscaping</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Inspections</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:0416493356">0416 493 356</a></li>
              <li><a href="mailto:rapidshiftdev@gmail.com">rapidshiftdev@gmail.com</a></li>
              <li><a href="#">Mon - Sat: 7AM - 6PM</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Fix Syndicate Property Maintenance & Management. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button ref={scrollTopRef} className="scroll-top" id="scrollTop" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up" />
      </button>
    </>
  );
}

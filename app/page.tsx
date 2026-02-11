"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLElement | null>(null);
  const scrollTopRef = useRef<HTMLButtonElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [stats, setStats] = useState({
    properties: 0,
    satisfaction: 0,
    support: 0,
    experience: 0
  });

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

  // Counter Animation for Stats
  useEffect(() => {
    const statsSection = statsRef.current;
    if (!statsSection) return;

    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;

            // Animate properties (500+)
            const animateCounter = (
              target: number,
              setter: (value: number) => void,
              duration: number = 2000
            ) => {
              const steps = 50;
              const stepValue = target / steps;
              const stepDuration = duration / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += stepValue;
                if (current >= target) {
                  setter(target);
                  clearInterval(timer);
                } else {
                  setter(Math.floor(current));
                }
              }, stepDuration);
            };

            animateCounter(500, (val) => setStats(prev => ({ ...prev, properties: val })));
            animateCounter(98, (val) => setStats(prev => ({ ...prev, satisfaction: val })));
            animateCounter(24, (val) => setStats(prev => ({ ...prev, support: val })));
            animateCounter(15, (val) => setStats(prev => ({ ...prev, experience: val })));
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);

    return () => {
      observer.disconnect();
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formWrapper = e.currentTarget;
    setFormStatus('submitting');
    setFormMessage('');

    const formData = new FormData(formWrapper);
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

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to parse error message
        let errorMessage = 'Something went wrong. Please try again or call us directly.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }

        setFormStatus('error');
        setFormMessage(errorMessage);
        return;
      }

      await response.json(); // Parse to ensure it's valid JSON
      setFormStatus('success');
      setFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      formWrapper.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
      setFormMessage('Failed to send message. Please try again or contact us by phone.');
    }
  }

  // Carousel items based on public images (before/after pairs)
  const carouselItems = [
    { src: '/img/before-property.jpg', title: 'Before - Backyard', text: 'Lawn needing maintenance' },
    { src: '/img/after-property-maintenance.jpg', title: 'After - Backyard', text: 'Beautifully maintained' },

    { src: '/img/before-side-yard.jpg', title: 'Before - Side Yard', text: 'Overgrown pathway' },
    { src: '/img/after-side-yard.jpg', title: 'After - Side Yard', text: 'Clean and cleared' },

    { src: '/img/before-paving.jpg', title: 'Before - Paving', text: 'Algae and grime buildup' },
    { src: '/img/after-paving.jpg', title: 'After - Paving', text: 'Pressure cleaned' },

    { src: '/img/before-garden.jpg', title: 'Before - Garden', text: 'Overgrown bushes' },
    { src: '/img/after-garden.jpg', title: 'After - Garden', text: 'Trimmed and tidy' },

    { src: '/img/before-gutter.jpg', title: 'Before - Gutter', text: 'Clogged with debris' },
    { src: '/img/after-gutter.jpg', title: 'After - Gutter', text: 'Clean and clear' },

    { src: '/img/before-tree.jpg', title: 'Before - Tree Work', text: 'Fallen branches' },
    { src: '/img/after-tree.jpg', title: 'After - Tree Work', text: 'Cleared and maintained' },

    { src: '/img/before-lawn.jpg', title: 'Before - Lawn', text: 'Overgrown grass' },
    { src: '/img/after-lawn.jpg', title: 'After - Lawn', text: 'Freshly mowed' },
  ];

  // Duplicate for seamless loop (like index.html)
  const carouselLoop = carouselItems.concat(carouselItems);

  // Services list adapted from index.html
  const services = [
    { icon: 'fas fa-tools', title: 'General Maintenance', text: 'Complete repair and maintenance solutions' },
    { icon: 'fas fa-trash-alt', title: 'Rubbish Removal', text: 'Fast and efficient waste removal' },
    { icon: 'fas fa-paint-roller', title: 'Plastering & Gyprocking', text: 'Expert wall and ceiling work' },
    { icon: 'fas fa-brush', title: 'Painting Services', text: 'Interior and exterior painting' },
    { icon: 'fas fa-hammer', title: 'Carpentry', text: 'Skilled woodwork and repairs' },
    { icon: 'fas fa-spray-can', title: 'Carpet Cleaning', text: 'Deep cleaning for fresh floors' },
    { icon: 'fas fa-water', title: 'High-Pressure Cleaning', text: 'Powerful exterior cleaning' },
    { icon: 'fas fa-home', title: 'Roofing & Gutter Cleaning', text: 'Roof and gutter maintenance' },
    { icon: 'fas fa-th-large', title: 'Tiling & Flooring', text: 'Professional floor installation' },
    { icon: 'fas fa-umbrella-beach', title: 'Verandas & Decking', text: 'Outdoor living spaces' },
    { icon: 'fas fa-warehouse', title: 'Sheds & Carports', text: 'Quality structures built' },
    { icon: 'fas fa-bath', title: 'Bathroom & Kitchen Reno', text: 'Complete renovations' },
    { icon: 'fas fa-drafting-compass', title: 'Home Renovation', text: 'Full property makeovers' },
    { icon: 'fas fa-leaf', title: 'Garden Maintenance', text: 'Landscaping and upkeep' },
    { icon: 'fas fa-door-open', title: 'Door & Window Repairs', text: 'Repair and replacement' },
    { icon: 'fas fa-lock', title: 'Locks & Screens', text: 'Security and screens' },
    { icon: 'fas fa-couch', title: 'Furniture Assembly', text: 'Professional assembly' },
    { icon: 'fas fa-border-all', title: 'Fencing', text: 'Installation and repairs' },
    { icon: 'fas fa-faucet', title: 'Plumbing', text: 'Repairs and maintenance' },
    { icon: 'fas fa-phone-volume', title: 'Emergency Services', text: '24/7 urgent response' },
  ];

  return (
    <>
      <nav id="navbar" ref={navbarRef} aria-label="Main navigation">
        <a href="#home" className="nav-logo" aria-label="Fix Syndicate Home">
          FIX <span>SYNDICATE</span>
        </a>
        <ul className="nav-links" role="list">
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#home"); }} href="#home" aria-label="Navigate to Home section">Home</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services" aria-label="Navigate to Services section">Services</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#about"); }} href="#about" aria-label="Navigate to About section">About</a>
          </li>
          <li>
            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact" aria-label="Navigate to Contact section">Contact</a>
          </li>
          <li>
            <a href="tel:0416493356" className="nav-cta" aria-label="Call us now">Call Now</a>
          </li>
        </ul>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
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
                <i className="fas fa-paper-plane" /> Get Free Quote
              </a>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services" className="btn btn-outline">
                <i className="fas fa-arrow-right" /> Explore Services
              </a>
            </div>
          </div>

          <div className="hero-image">
            <Image src="/img/after-property-maintenance.jpg" alt="After - Property Maintenance" className="hero-image-main" width={900} height={650} priority />
            <Image src="/img/before-property.jpg" alt="Before - Property" className="hero-image-before" width={450} height={300} />

            <div className="hero-floating-card card-2">
              <div className="floating-icon">
                <i className="fas fa-star" aria-hidden="true" />
              </div>
              <div className="floating-text">
                <h4>98%</h4>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-down" onClick={() => scrollToTarget("#portfolio")} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToTarget("#portfolio"); }} aria-label="Scroll down to portfolio">
          <span>Scroll Down</span>
          <i className="fas fa-chevron-down" aria-hidden="true" />
        </div>
      </section>

      <section className="carousel-section" id="portfolio">
        <div className="section-header">
          <span className="section-badge">Our Portfolio</span>
          <h2 className="section-title">Before & After Transformations</h2>
          <p className="section-subtitle">See the quality of our work through real project results</p>
        </div>

        <div className="carousel-container">
          <div className="carousel-track" ref={carouselTrackRef}>
            {carouselLoop.map((item, idx) => (
              <div className="carousel-item" key={`${item.src}-${idx}`}>
                <Image src={item.src} alt={item.title} width={800} height={600} />
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

      <section className="stats" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-building" aria-hidden="true" /></div>
            <span className="stat-number">{stats.properties}+</span>
            <div className="stat-label">Properties Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-smile" aria-hidden="true" /></div>
            <span className="stat-number">{stats.satisfaction}%</span>
            <div className="stat-label">Client Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-clock" aria-hidden="true" /></div>
            <span className="stat-number">{stats.support}/7</span>
            <div className="stat-label">Emergency Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-award" aria-hidden="true" /></div>
            <span className="stat-number">{stats.experience}+</span>
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
            {services.map((svc, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon"><i className={svc.icon} aria-hidden="true" /></div>
                <h3>{svc.title}</h3>
                <p>{svc.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <div className="about-images">
            <Image src="/img/after-property-maintenance.jpg" alt="After - Property" className="about-img-main" width={900} height={650} />
            <Image src="/img/before-property.jpg" alt="Before - Property" className="about-img-secondary" width={500} height={400} />
            <div className="about-experience">
              <span>15+</span>
              <p>Years Experience</p>
            </div>
          </div>
          <div className="about-text">
            <span className="section-badge">About Us</span>
            <h2>Your Trusted Property Care Partner</h2>
            <p>At FIX SYNDICATE, we understand that your property is more than just a building – it&apos;s an investment. Our dedicated team provides comprehensive maintenance and management services for residential, commercial, and industrial properties.</p>

            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-shield-alt" aria-hidden="true" />
                </div>
                <span>Licensed & Insured</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-dollar-sign" aria-hidden="true" />
                </div>
                <span>Transparent Pricing</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-medal" aria-hidden="true" />
                </div>
                <span>Quality Guaranteed</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">
                  <i className="fas fa-bolt" aria-hidden="true" />
                </div>
                <span>Fast Response</span>
              </div>
            </div>

            <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact" className="btn btn-primary">
              <i className="fas fa-arrow-right" /> Get Started Today
            </a>
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center', marginBottom: '20px'}}>
            <span className="section-badge">Why Us</span>
            <h2 className="section-title">Why Choose FIX SYNDICATE?</h2>
            <p className="section-subtitle">We deliver exceptional value through quality, reliability, and customer focus</p>
          </div>

          <div className="why-grid">
            <div className="why-item">
              <i className="fas fa-gem" aria-hidden="true" />
              <h4>Premium Quality</h4>
              <p>Superior results on every project, big or small.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-stopwatch" aria-hidden="true" />
              <h4>Timely Delivery</h4>
              <p>Punctual arrivals and efficient completion.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-hand-holding-usd" aria-hidden="true" />
              <h4>Best Value</h4>
              <p>Transparent pricing with no hidden fees.</p>
            </div>
            <div className="why-item">
              <i className="fas fa-headset" aria-hidden="true" />
              <h4>Always Available</h4>
              <p>Round-the-clock emergency support.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Property?</h2>
          <p>Get in touch today for a free consultation and quote. Let us take care of all your property maintenance needs.</p>
          <a href="tel:0416493356" className="btn btn-primary">
            <i className="fas fa-phone-alt" /> Call Now: 0416 493 356
          </a>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header" style={{textAlign: 'center'}}>
            <span className="section-badge">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">Reach out for a free quote today!</p>
          </div>

          <div className="contact-wrapper">
            <div className="contact-info">
              <h3>Let&apos;s Talk About Your Property</h3>
              <p>Have a question or need a quote? We&apos;re here to help.</p>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-phone-alt" aria-hidden="true" />
                </div>
                <div className="contact-item-text">
                  <h4>Phone</h4>
                  <a href="tel:0416493356">0416 493 356</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-envelope" aria-hidden="true" />
                </div>
                <div className="contact-item-text">
                  <h4>Email</h4>
                  <a href="mailto:jeffreyindindi@gmail.com">jeffreyindindi@gmail.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-clock" aria-hidden="true" />
                </div>
                <div className="contact-item-text">
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 7AM - 6PM | Emergency: 24/7</p>
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
                    <option value="maintenance">General Maintenance</option>
                    <option value="rubbish">Rubbish Removal</option>
                    <option value="painting">Painting Services</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="pressure">High-Pressure Cleaning</option>
                    <option value="roofing">Roofing & Gutter Cleaning</option>
                    <option value="garden">Garden Maintenance</option>
                    <option value="renovation">Renovation</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="other">Other</option>
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
            <h3>FIX <span>SYNDICATE</span></h3>
            <p>Your trusted partner for comprehensive property maintenance and management services across residential, commercial, and industrial sectors.</p>
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
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Renovations</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Landscaping</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Cleaning</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:0416493356">0416 493 356</a></li>
              <li><a href="mailto:jeffreyindindi@gmail.com">jeffreyindindi@gmail.com</a></li>
              <li>Mon - Sat: 7AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 FIX SYNDICATE Property Maintenance & Management. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button ref={scrollTopRef} className="scroll-top" id="scrollTop" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up" />
      </button>
    </>
  );
}

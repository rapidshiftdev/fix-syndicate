"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const carouselTrackRef = useRef<HTMLDivElement | null>(null);
  const navbarRef = useRef<HTMLElement | null>(null);
  const scrollTopRef = useRef<HTMLButtonElement | null>(null);
  const [scrollAmount, setScrollAmount] = useState(0);

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
              <div className="service-icon"><i className="fas fa-building" /></div>
              <h3>Exterior & Structural</h3>
              <p>Maintain and restore your building's exterior to ensure safety and aesthetics.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-undo" /></div>
              <h3>Property Turnover</h3>
              <p>Efficient turnover services for rental properties, including cleaning and repairs.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-life-ring" /></div>
              <h3>Emergency Services</h3>
              <p>24/7 emergency maintenance and repair services to address urgent issues.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-search" /></div>
              <h3>Property Inspections</h3>
              <p>Thorough inspections to identify and address potential maintenance issues.</p>
            </div>

            <div className="service-card">
              <div className="service-icon"><i className="fas fa-calendar-check" /></div>
              <h3>Preventive Maintenance</h3>
              <p>Proactive maintenance plans to prevent issues and extend the life of your property.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">About Us</span>
            <h2 className="section-title">Who We Are</h2>
            <p className="section-subtitle">Learn more about our company and values</p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3>Committed to Excellence</h3>
              <p>
                At Fix Syndicate, we are dedicated to providing top-notch property maintenance and management services. Our team of experts is committed to ensuring your property is well-maintained, safe, and aesthetically pleasing.
              </p>
              <p>
                With years of experience in the industry, we understand the unique needs of each property and tailor our services accordingly. We pride ourselves on our attention to detail, reliability, and customer satisfaction.
              </p>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> Contact Us
              </a>
            </div>

            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1588702547920-7b8f3f3f3f3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="About Us"
                className="about-image-main"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">We'd love to hear from you</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Details</h3>
              <p>
                <i className="fas fa-map-marker-alt"></i> 123 Main Street, Hometown, USA
              </p>
              <p>
                <i className="fas fa-phone"></i> (123) 456-7890
              </p>
              <p>
                <i className="fas fa-envelope"></i> info@fixsyndicate.com
              </p>
            </div>

            <div className="contact-form">
              <h3>Send Us a Message</h3>
              <form action="#" method="POST">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <a href="#home">
                Fix <span>Syndicate</span>
              </a>
            </div>
            <div className="footer-links">
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#home"); }} href="#home">Home</a>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#services"); }} href="#services">Services</a>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#about"); }} href="#about">About</a>
              <a onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); }} href="#contact">Contact</a>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2027 Fix Syndicate Property Maintenance & Management. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button ref={scrollTopRef} className="scroll-top" id="scrollTop" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fas fa-arrow-up" />
      </button>
    </>
  );
}

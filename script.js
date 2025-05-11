// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // GSAP Animations
  document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.from('.hero h1', { duration: 1.2, y: 50, opacity: 0, ease: 'power3.out' });
    gsap.from('.hero p', { duration: 1.2, y: 50, opacity: 0, delay: 0.3, ease: 'power3.out' });
    gsap.from('.feature-card', { 
      duration: 1, 
      y: 100, 
      opacity: 0, 
      stagger: 0.2, 
      scrollTrigger: {
        trigger: '.features',
        start: 'top 80%'
      }
    });
    gsap.from('.storz-card', { 
      duration: 1, 
      y: 100, 
      opacity: 0, 
      stagger: 0.2, 
      scrollTrigger: {
        trigger: '.storz',
        start: 'top 80%'
      }
    });
    gsap.utils.toArray('.feature-card, .storz-card').forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { rotation: 2, duration: 0.3, ease: 'power1.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { rotation: 0, duration: 0.3, ease: 'power1.out' }));
    });
    document.body.classList.add('loaded');
  
    // Parallax Effect for Hero
    gsap.to('.parallax-bg', {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        markers: false
      }
    });
  
    // Swiper for Testimonials
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  
    // Countdown Timer
    let countDownDate = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    let x = setInterval(() => {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      document.getElementById('timer').innerText = `${days} days`;
      if (distance < 0) {
        clearInterval(x);
        document.getElementById('timer').innerText = 'Now!';
      }
    }, 1000);
  });
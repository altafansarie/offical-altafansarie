/**
 * ALTAF ALAM - OFFICIAL PROFILE WEBSITE
 * Core Interactive & Cinematic Engine
 * Features: Lenis Smooth Scroll, GSAP ScrollTrigger, Web Audio Synth, 3D Tilt, Lightbox, vCard
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* -------------------------------------------------------------
     1. PRELOADER & HERO ENTRANCE
  ------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderNumber = document.getElementById('preloaderNumber');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      if (preloaderProgress) preloaderProgress.style.width = '100%';
      if (preloaderNumber) preloaderNumber.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
        initHeroAnimations();
      }, 400);
    } else {
      if (preloaderProgress) preloaderProgress.style.width = `${progress}%`;
      if (preloaderNumber) preloaderNumber.textContent = `${progress}%`;
    }
  }, 50);

  /* -------------------------------------------------------------
     2. SMOOTH SCROLL (LENIS) + GSAP SCROLLTRIGGER SYNC
  ------------------------------------------------------------- */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* -------------------------------------------------------------
     3. SCROLL PROGRESS INDICATOR
  ------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }
  });

  /* -------------------------------------------------------------
     4. CURSOR SPOTLIGHT TRACKING
  ------------------------------------------------------------- */
  const spotlight = document.getElementById('cursorSpotlight');
  if (spotlight && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  }

  /* -------------------------------------------------------------
     5. HERO ENTRANCE & DOWN-SWIPE CINEMATIC ANIMATIONS
  ------------------------------------------------------------- */
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Hero element timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl
      .fromTo('#heroBadge', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo('.hero-title-line', { y: 80, opacity: 0, rotateX: 25 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.15 }, '-=0.5')
      .fromTo('#heroSubtitle', { opacity: 0, y: 25 }, { opacity: 1, y: 0 }, '-=0.7')
      .fromTo('#heroImageWrapper', { opacity: 0, scale: 0.85, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4 }, '-=1')
      .fromTo('#heroStats', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1 }, '-=0.8')
      .fromTo('#heroCta', { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, '-=0.7');

    // Crazy Cinematic Down-Swipe / Scroll Zoom Animation
    if (typeof ScrollTrigger !== 'undefined') {
      // Hero Zoom & Depth Transition on Down Scroll
      gsap.to('#heroImage', {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        scale: 1.25,
        y: 80,
        filter: 'brightness(0.6) blur(2px)',
      });

      gsap.to('#heroContent', {
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '80% top',
          scrub: 1,
        },
        y: -100,
        opacity: 0.2,
      });

      // Parallax text watermarks
      gsap.utils.toArray('.section-watermark').forEach((watermark) => {
        gsap.fromTo(
          watermark,
          { x: 80 },
          {
            x: -80,
            scrollTrigger: {
              trigger: watermark.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        );
      });

      // Section titles reveal
      gsap.utils.toArray('.reveal-title').forEach((title) => {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });

      // Staggered Cards Reveal
      gsap.utils.toArray('.reveal-stagger').forEach((container) => {
        const items = container.querySelectorAll('.reveal-item');
        if (items.length) {
          gsap.from(items, {
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
          });
        }
      });

      // Timeline Fill Animation
      const timelineTrack = document.getElementById('timelineProgressLine');
      const timelineContainer = document.getElementById('journeySection');
      if (timelineTrack && timelineContainer) {
        gsap.to(timelineTrack, {
          scrollTrigger: {
            trigger: timelineContainer,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.8,
          },
          height: '100%',
          ease: 'none',
        });
      }

      // Educational milestones pop-in
      gsap.utils.toArray('.education-milestone').forEach((node) => {
        gsap.from(node, {
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          scale: 0.85,
          opacity: 0,
          duration: 0.7,
          ease: 'back.out(1.7)',
        });
      });
    }
  }

  /* -------------------------------------------------------------
     6. 3D TILT EFFECT ON CARDS
  ------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* -------------------------------------------------------------
     7. NATIVE WEB AUDIO SYNTHESIZER (CINEMATIC SFX)
  ------------------------------------------------------------- */
  let audioCtx = null;
  let isMuted = true;
  let ambientOsc1 = null;
  let ambientOsc2 = null;
  let ambientGain = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Generate futuristic micro blip/swoosh on user interaction
  function playUiSound(type = 'blip') {
    if (isMuted) return;
    initAudio();

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Ambient Sci-Fi Drone Generator
  function startAmbientDrone() {
    initAudio();
    if (ambientOsc1) return;

    try {
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 3);

      // Filter for warm, deep cinematic texture
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);

      ambientGain.connect(filter);
      filter.connect(audioCtx.destination);

      // Fundamental Drone Note (F# / 92.5 Hz)
      ambientOsc1 = audioCtx.createOscillator();
      ambientOsc1.type = 'sawtooth';
      ambientOsc1.frequency.setValueAtTime(92.5, audioCtx.currentTime);
      ambientOsc1.connect(ambientGain);
      ambientOsc1.start();

      // Soft Harmonizing Fifth (C# / 138.6 Hz)
      ambientOsc2 = audioCtx.createOscillator();
      ambientOsc2.type = 'sine';
      ambientOsc2.frequency.setValueAtTime(138.6, audioCtx.currentTime);
      ambientOsc2.connect(ambientGain);
      ambientOsc2.start();
    } catch (err) {
      console.warn('Ambient drone error:', err);
    }
  }

  function stopAmbientDrone() {
    if (ambientGain && audioCtx) {
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (ambientOsc1) {
          ambientOsc1.stop();
          ambientOsc1.disconnect();
          ambientOsc1 = null;
        }
        if (ambientOsc2) {
          ambientOsc2.stop();
          ambientOsc2.disconnect();
          ambientOsc2 = null;
        }
      }, 1000);
    }
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audioToggle');
  const soundWaveIndicator = document.getElementById('soundWaveContainer');
  const audioStatusText = document.getElementById('audioStatusText');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      isMuted = !isMuted;

      if (!isMuted) {
        startAmbientDrone();
        if (soundWaveIndicator) soundWaveIndicator.classList.add('sound-playing');
        if (audioStatusText) audioStatusText.textContent = 'SOUND: ON';
        playUiSound('click');
      } else {
        stopAmbientDrone();
        if (soundWaveIndicator) soundWaveIndicator.classList.remove('sound-playing');
        if (audioStatusText) audioStatusText.textContent = 'SOUND: OFF';
      }
    });
  }

  // Attach sound triggers to interactive elements
  document.querySelectorAll('button, a, .gallery-card, .family-card, .hobby-card').forEach((el) => {
    el.addEventListener('mouseenter', () => playUiSound('hover'));
    el.addEventListener('click', () => playUiSound('click'));
  });

  /* -------------------------------------------------------------
     8. DYNAMIC CANVAS PARTICLE CONSTELLATION
  ------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 20 + 5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.6 ? '#00f2fe' : Math.random() > 0.3 ? '#4facfe' : '#c084fc';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 3;
            this.y -= forceDirectionY * force * 3;
          }
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.18 - distance / 700})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* -------------------------------------------------------------
     9. FAMILY CIRCLE FILTERING TABS
  ------------------------------------------------------------- */
  const familyFilterBtns = document.querySelectorAll('.family-filter-btn');
  const familyCards = document.querySelectorAll('.family-card');

  familyFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      familyFilterBtns.forEach((b) => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      });

      btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');

      const filter = btn.getAttribute('data-filter');

      familyCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* -------------------------------------------------------------
     10. PHOTO GALLERY LIGHTBOX SYSTEM
  ------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-card'));
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const card = galleryItems[index];
    const img = card.querySelector('img');
    const title = card.getAttribute('data-title') || 'Altaf Alam Portrait';
    const desc = card.getAttribute('data-desc') || 'Official Portrait Collection';

    if (lightboxImg) lightboxImg.src = img.src;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* -------------------------------------------------------------
     11. VCARD (.VCF) GENERATION & DOWNLOAD
  ------------------------------------------------------------- */
  const downloadVcardBtn = document.getElementById('downloadVcardBtn');
  const heroVcardBtn = document.getElementById('heroVcardBtn');

  function generateAndDownloadVcard() {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Alam;Altaf;;;
FN:Altaf Alam
TITLE:BCA Graduate | Master's Candidate
ORG:MMHAP University (Patna, Bihar)
EMAIL;TYPE=INTERNET,HOME:smartaltafalam363@gmail.com
TEL;TYPE=CELL,VOICE,PREF:+919122013960
URL:https://www.instagram.com/altafansarie/
X-SOCIALPROFILE;type=instagram:https://www.instagram.com/altafansarie/
NOTE:Official Profile of Altaf Alam. BCA from MMHAP University, Patna. Pursuing Master's. Instagram: @altafansarie. Hobbies: Sojourning new places, Exploring new things, Cinema, Fitness & Gym, Social Media.
ADR;TYPE=HOME:;;Katihar & Patna;Bihar;;India
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Altaf_Alam_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (downloadVcardBtn) downloadVcardBtn.addEventListener('click', generateAndDownloadVcard);
  if (heroVcardBtn) heroVcardBtn.addEventListener('click', generateAndDownloadVcard);

  /* -------------------------------------------------------------
     12. CONTACT FORM & DIRECT DISPATCH (WHATSAPP & GMAIL)
  ------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const dispatchWhatsApp = document.getElementById('dispatchWhatsApp');
  const dispatchEmail = document.getElementById('dispatchEmail');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
      const emailVal = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
      const subjectVal = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
      const messageVal = document.getElementById('message') ? document.getElementById('message').value.trim() : '';

      // Construct WhatsApp message URL
      const waText = `Hello Altaf!%0A%0AMy Name: ${encodeURIComponent(nameVal)}%0AEmail: ${encodeURIComponent(emailVal)}%0ASubject: ${encodeURIComponent(subjectVal)}%0A%0AMessage:%0A${encodeURIComponent(messageVal)}`;
      const waUrl = `https://wa.me/919122013960?text=${waText}`;

      // Construct Gmail mailto URL
      const mailSubject = encodeURIComponent(`[Website Contact] ${subjectVal}`);
      const mailBody = encodeURIComponent(`Hi Altaf,\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}\n\n---\nSent from Altaf Alam Official Profile`);
      const mailtoUrl = `mailto:smartaltafalam363@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      if (dispatchWhatsApp) dispatchWhatsApp.href = waUrl;
      if (dispatchEmail) dispatchEmail.href = mailtoUrl;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Formatting Channels...</span>`;
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        submitBtn.innerHTML = `<span class="flex items-center gap-2 text-emerald-400"><i data-lucide="check-circle" class="w-4 h-4"></i> Ready to Send!</span>`;
        if (window.lucide) window.lucide.createIcons();
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
        }

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          if (window.lucide) window.lucide.createIcons();
        }, 3500);
      }, 600);
    });
  }

  /* -------------------------------------------------------------
     13. MOBILE MENU TOGGLE
  ------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});

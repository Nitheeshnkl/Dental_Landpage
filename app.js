/**
 * YOUR DENTAL CLINIC by S2 — Luxury Dental Experience Engine
 * Cinematic Background Video Hero, Frosted Navbar, 3D Mascot & Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initFrostedNavbar();
  initHeroBackgroundVideo();
  initLiveClinicStatus();
  initTreatmentsExplorer();
  initBookingModal();
  initPatientJourney();
  initPatientComfort();
  initDentalConcierge();
  initMascotInteractions();
  initMobileNav();
  initCopyrightYear();
});

/* ==========================================================================
   1. FROSTED-GLASS NAVBAR DYNAMIC SCROLL TRANSITION
   ========================================================================== */
function initFrostedNavbar() {
  const navbar = document.getElementById('main-navbar');
  const heroSection = document.getElementById('hero');
  if (!navbar) return;

  function updateNavbar() {
    const scrollY = window.scrollY;
    // Calculate where the hero ends
    const heroEnd = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight - 90) : 500;

    if (scrollY > heroEnd) {
      // Over light content sections
      navbar.classList.add('scrolled-light');
    } else {
      // Over dark hero video section
      navbar.classList.remove('scrolled-light');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ==========================================================================
   2. PRIMARY HERO: BACKGROUND VIDEO & REFINED NATURAL SCROLL
   ========================================================================== */
function initHeroBackgroundVideo() {
  const video = document.getElementById('hero-background-video');
  const heroSection = document.getElementById('hero');
  if (!video || !heroSection) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure autoplay on load, catch any browser policy restrictions gracefully
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented; fallback poster image is visible
      console.log('Video autoplay prevented by browser; fallback poster active.');
    });
  }

  // Smooth loop handling without visual jumps
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  // Performance optimization: Pause video when hero is scrolled out of view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isReducedMotion) video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroSection);
  }

  // Subtle natural scroll parallax (Lightweight, non-blocking)
  if (!isReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = heroSection.offsetHeight;
          if (scrollY <= heroHeight) {
            const translateY = scrollY * 0.22;
            video.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(1.05)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   3. LIVE CLINIC OPERATING STATUS (IST / BENGALURU LOCAL TIME)
   ========================================================================== */
function initLiveClinicStatus() {
  const statusElements = document.querySelectorAll('.live-clinic-status');
  if (!statusElements.length) return;

  function checkStatus() {
    // Determine current time in Bengaluru (Asia/Kolkata timezone)
    try {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hour12: false };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(now);
      const hourPart = parts.find(p => p.type === 'hour');
      const hours = hourPart ? parseInt(hourPart.value, 10) : now.getHours();

      const isOpen = hours >= 10 && hours < 21;

      statusElements.forEach(el => {
        if (isOpen) {
          el.innerHTML = `
            <span class="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]"></span>
            <span class="text-teal-100 font-semibold text-xs tracking-wide">Open Today in Madiwala · 10 AM – 9 PM</span>
          `;
        } else {
          el.innerHTML = `
            <span class="inline-flex w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]"></span>
            <span class="text-amber-100 font-semibold text-xs tracking-wide">Opens Daily at 10:00 AM · Appointments Available</span>
          `;
        }
      });
    } catch (e) {
      // Fallback
      statusElements.forEach(el => {
        el.innerHTML = `
          <span class="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span class="text-teal-100 font-semibold text-xs">Open 10:00 AM – 9:00 PM Daily</span>
        `;
      });
    }
  }

  checkStatus();
  setInterval(checkStatus, 60000);
}

/* ==========================================================================
   4. INTERACTIVE TREATMENT EXPLORER & DETAIL DRAWER
   ========================================================================== */
const treatmentsDatabase = {
  'smile-correction': {
    title: 'Smile Correction & Alignment',
    category: 'Alignment & Aesthetics',
    badge: 'Transparent & Traditional Options',
    description: 'A comprehensive approach designed to address tooth crowding, irregular spacing, and smile proportion through individualized assessment and state-of-the-art diagnostic imaging.',
    indications: ['Uneven tooth alignment', 'Midline misalignment', 'Diastema (spaces between teeth)', 'Bite asymmetry'],
    procedureSteps: [
      'Digital Smile Evaluation: High-resolution assessment of teeth symmetry, facial contour, and lip dynamics.',
      'Custom Treatment Plan: Step-by-step projection of alignment milestones.',
      'Gentle Precision Guidance: Periodic check-ups to verify natural settling and comfort.'
    ],
    duration: '6 to 18 months depending on clinical complexity',
    comfortNote: 'Designed around low-force, gradual movement for minimal disruption to daily life.'
  },
  'braces': {
    title: 'Braces & Orthodontics',
    category: 'Orthodontic Solutions',
    badge: 'Ceramic & Low-Profile Brackets',
    description: 'Modern orthodontic care utilizing ceramic aesthetic brackets or precision low-friction metal systems to correct complex bite dynamics, crossbites, and tooth trajectories.',
    indications: ['Overbite, underbite, or crossbite', 'Rotated or ectopic teeth', 'Jaw alignment imbalances', 'Adolescent & adult orthodontics'],
    procedureSteps: [
      'Full arch analysis and cephalometric evaluation.',
      'Placement of precision ceramic or mini-metal brackets.',
      'Routine gentle wire adjustments with transparent progress reviews.'
    ],
    duration: '12 to 24 months with retention planning',
    comfortNote: 'Smooth-edge bracket designs maximize mucosal comfort and simplify daily hygiene.'
  },
  'fillings': {
    title: 'Biomimetic Dental Fillings',
    category: 'Restorative Dentistry',
    badge: 'Tooth-Coloured Composites',
    description: 'Restoration of cavities or chipped tooth enamel using micro-hybrid tooth-colored composite resins that mirror the light transmission and hardness of natural enamel.',
    indications: ['Dental caries (cavities)', 'Minor enamel fractures', 'Replacement of degraded fillings', 'Enamel erosion restoration'],
    procedureSteps: [
      'Painless preparation and thorough bacterial decontamination.',
      'Selective adhesive conditioning of dentin and enamel.',
      'Layered biomimetic resin sculpting and high-gloss polish.'
    ],
    duration: 'Single 30–45 minute consultation',
    comfortNote: 'Done under local gentleness with immediate normal chewing capability.'
  },
  'veneers': {
    title: 'Veneers & Smile Enhancement',
    category: 'Aesthetic Enhancement',
    badge: 'Porcelain & Ceramic Veneer Shells',
    description: 'Ultra-thin, custom-sculpted ceramic shells bonded to the front surfaces of teeth to enhance shape, symmetry, shade, and radiant light reflection.',
    indications: ['Persistent deep tetracycline/fluorosis staining', 'Chipped or worn incisal edges', 'Irregular tooth proportions', 'Aesthetic smile redesign'],
    procedureSteps: [
      'Aesthetic smile architecture consultation and shade matching.',
      'Minimal micro-preparation preserving maximum natural tooth enamel.',
      'Precision ceramic bonding with dual-cure medical adhesive.'
    ],
    duration: 'Typically 2 to 3 unhurried appointments',
    comfortNote: 'Meticulously crafted for natural fluorescence and soft gum margins.'
  },
  'root-canal': {
    title: 'Root Canal Treatment (Endodontics)',
    category: 'Endodontic Care',
    badge: 'Gentle Nerve & Pulp Restoration',
    description: 'Comfort-conscious therapy designed to relieve deep tooth pain, eliminate internal pulp infections, and preserve your natural tooth root without extraction.',
    indications: ['Severe toothache or persistent throbbing', 'Prolonged sensitivity to hot and cold', 'Deep decay reaching the nerve chamber', 'Pulp necrosis or abscess'],
    procedureSteps: [
      'Gentle local anesthesia ensuring a relaxed, pain-free appointment.',
      'Rotary micro-cleansing and chemical disinfection of root canals.',
      'Hermetic biocompatible sealing with gutta-percha and protective crown.'
    ],
    duration: 'Single or two gentle appointments',
    comfortNote: 'Our clinic prioritizes gentle, pain-conscious care with transparent step-by-step communication.'
  },
  'implants': {
    title: 'Dental Implants',
    category: 'Tooth Replacement',
    badge: 'Titanium Root & Zirconia Crown',
    description: 'The gold standard for permanent tooth replacement. A biocompatible titanium fixture integrates naturally with jawbone to support an authentic, high-strength zirconia crown.',
    indications: ['Single or multiple missing teeth', 'Unstable removable partial dentures', 'Preservation of adjacent natural teeth', 'Restoration of full bite force'],
    procedureSteps: [
      'Bone density and anatomical nerve mapping assessment.',
      'Minimally invasive placement of medical-grade titanium fixture.',
      'Osseointegration period followed by custom zirconia crown placement.'
    ],
    duration: 'Staged care plan with complete lifetime stability',
    comfortNote: 'Eliminates bone loss associated with missing teeth and looks indistinguishable from natural teeth.'
  }
};

function initTreatmentsExplorer() {
  const filterBtns = document.querySelectorAll('.treatment-filter-btn');
  const cards = document.querySelectorAll('.treatment-card-v2');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-deepTeal', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });
      btn.classList.add('bg-deepTeal', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

      const filter = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const drawerBackdrop = document.getElementById('treatment-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('treatment-drawer-close');
  const openButtons = document.querySelectorAll('.open-treatment-drawer-btn');

  function openDrawer(treatmentKey) {
    const data = treatmentsDatabase[treatmentKey];
    if (!data || !drawerBackdrop) return;

    document.getElementById('drawer-treatment-title').textContent = data.title;
    document.getElementById('drawer-treatment-category').textContent = data.category;
    document.getElementById('drawer-treatment-badge').textContent = data.badge;
    document.getElementById('drawer-treatment-desc').textContent = data.description;
    document.getElementById('drawer-treatment-duration').textContent = data.duration;
    document.getElementById('drawer-treatment-comfort').textContent = data.comfortNote;

    const indList = document.getElementById('drawer-treatment-indications');
    if (indList) {
      indList.innerHTML = data.indications.map(ind => `
        <li class="flex items-center gap-2 text-xs text-slate-700">
          <svg class="w-4 h-4 text-primaryMint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <span>${ind}</span>
        </li>
      `).join('');
    }

    const stepsList = document.getElementById('drawer-treatment-steps');
    if (stepsList) {
      stepsList.innerHTML = data.procedureSteps.map((step, idx) => `
        <div class="flex items-start gap-3 p-3 rounded-2xl bg-paleMint/30 border border-teal-100">
          <span class="w-5 h-5 rounded-full bg-deepTeal text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            ${idx + 1}
          </span>
          <p class="text-xs text-slate-700 leading-relaxed">${step}</p>
        </div>
      `).join('');
    }

    const bookBtn = document.getElementById('drawer-book-cta');
    if (bookBtn) {
      bookBtn.onclick = () => {
        closeDrawer();
        openBookingModalWithTreatment(data.title);
      };
    }

    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawerBackdrop) return;
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-treatment-key');
      if (key) openDrawer(key);
    });
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }
}

/* ==========================================================================
   5. APPOINTMENT BOOKING MODAL & INTERACTIVE SUBMISSION
   ========================================================================== */
function initBookingModal() {
  const modalBackdrop = document.getElementById('booking-modal-backdrop');
  const closeBtn = document.getElementById('booking-modal-close');
  const triggerBtns = document.querySelectorAll('.open-booking-modal-btn');
  const bookingForm = document.getElementById('interactive-booking-form');
  const confirmationCard = document.getElementById('booking-confirmation-card');
  const resetBtn = document.getElementById('booking-reset-btn');

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openBookingModalWithTreatment = function(treatmentName) {
    openModal();
    const select = document.getElementById('booking-treatment-select');
    if (select) {
      for (let option of select.options) {
        if (option.text.toLowerCase().includes(treatmentName.toLowerCase().slice(0, 8))) {
          select.value = option.value;
          break;
        }
      }
    }
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  const slotButtons = document.querySelectorAll('.time-slot-pill');
  const slotHiddenInput = document.getElementById('booking-slot-input');

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        b.classList.remove('bg-deepTeal', 'text-white', 'border-deepTeal');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('bg-deepTeal', 'text-white', 'border-deepTeal');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      if (slotHiddenInput) {
        slotHiddenInput.value = btn.getAttribute('data-slot') || 'Morning';
      }
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('booking-name');
      const phoneInput = document.getElementById('booking-phone');
      const treatmentSelect = document.getElementById('booking-treatment-select');
      const submitBtn = document.getElementById('booking-submit-btn');

      let isValid = true;
      if (!nameInput.value.trim()) {
        showInputError(nameInput, 'Please enter your full name');
        isValid = false;
      } else {
        clearInputError(nameInput);
      }

      const phoneRegex = /^[0-9+\s-]{8,15}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        showInputError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearInputError(phoneInput);
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Securing Consultation Slot...</span>
        `;
      }

      setTimeout(() => {
        const refId = `S2-BLR-${Math.floor(1000 + Math.random() * 9000)}`;
        
        document.getElementById('confirm-ref-id').textContent = refId;
        document.getElementById('confirm-patient-name').textContent = nameInput.value.trim();
        document.getElementById('confirm-treatment-name').textContent = treatmentSelect.options[treatmentSelect.selectedIndex].text;
        document.getElementById('confirm-date-time').textContent = `${dateInput.value} (${slotHiddenInput ? slotHiddenInput.value : 'Selected slot'})`;

        bookingForm.classList.add('hidden');
        if (confirmationCard) confirmationCard.classList.remove('hidden');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Submit Consultation Request</span>`;
        }
      }, 1000);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.classList.remove('hidden');
      }
      if (confirmationCard) confirmationCard.classList.add('hidden');
    });
  }

  function showInputError(input, message) {
    input.classList.add('border-red-400', 'ring-2', 'ring-red-100');
    let errEl = input.parentElement.querySelector('.input-error-msg');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'input-error-msg text-[11px] text-red-500 mt-1 font-medium';
      input.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  function clearInputError(input) {
    input.classList.remove('border-red-400', 'ring-2', 'ring-red-100');
    const errEl = input.parentElement.querySelector('.input-error-msg');
    if (errEl) errEl.remove();
  }
}

/* ==========================================================================
   6. PATIENT JOURNEY INTERACTIVE STAGES
   ========================================================================== */
function initPatientJourney() {
  const steps = document.querySelectorAll('.journey-step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
}

/* ==========================================================================
   7. PATIENT COMFORT & FIRST VISIT ACCORDION / PILLARS
   ========================================================================== */
function initPatientComfort() {
  const comfortCards = document.querySelectorAll('.comfort-card');
  comfortCards.forEach(card => {
    card.addEventListener('click', () => {
      comfortCards.forEach(c => {
        c.classList.remove('border-primaryMint', 'bg-paleMint/20', 'shadow-md');
        c.classList.add('border-teal-900/10', 'bg-white');
      });
      card.classList.remove('border-teal-900/10', 'bg-white');
      card.classList.add('border-primaryMint', 'bg-paleMint/20', 'shadow-md');
    });
  });
}

/* ==========================================================================
   8. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const links = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('hidden');
    setTimeout(() => {
      mobileDrawer.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    setTimeout(() => {
      mobileDrawer.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeMenu();
    });
  }

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   9. CURRENT YEAR UPDATER
   ========================================================================== */
function initCopyrightYear() {
  const yearEls = document.querySelectorAll('.current-year-display');
  const yr = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = yr;
  });
}

/* ==========================================================================
   10. CENTRALIZED IMAGE FALLBACK & ERROR HANDLER (NO BROKEN VISUALS)
   ========================================================================== */
function initImageFallbacks() {
  const inlineSvgFallback = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23002B2B'/%3E%3Crect x='10' y='10' width='580' height='380' rx='16' fill='%23073C38' stroke='%232DD4BF' stroke-opacity='0.25' stroke-width='2'/%3E%3Cpath d='M300 130c-25 0-45 15-53 38-12 34-6 72 2 97 7 21 17 25 25 25 12 0 17-17 26-17s14 17 26 17c8 0 18-4 25-25 8-25 14-63 2-97-8-23-28-38-53-38z' fill='none' stroke='%232DD4BF' stroke-width='6' stroke-linejoin='round'/%3E%3Ctext x='300' y='320' fill='%23CFF8EE' font-family='sans-serif' font-size='16' font-weight='bold' text-anchor='middle' letter-spacing='1'%3EYOUR DENTAL CLINIC BY S2%3C/text%3E%3Ctext x='300' y='345' fill='%23A9C5B7' font-family='sans-serif' font-size='12' text-anchor='middle'%3EMadiwala, Bengaluru%3C/text%3E%3C/svg%3E";

  window.handleImageFallback = function(img) {
    if (!img) return;
    img.onerror = null; // Prevent infinite error recursion
    img.src = inlineSvgFallback;
    img.classList.add('img-fallback-active');
  };

  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    // If image has already failed before JS execution
    if (img.complete && img.naturalWidth === 0) {
      window.handleImageFallback(img);
    } else {
      img.addEventListener('error', () => {
        window.handleImageFallback(img);
      });
    }
  });
}

/* ==========================================================================
   11. FLOATING DENTAL CONCIERGE & QUICK FAQ PANEL
   ========================================================================== */
function initDentalConcierge() {
  const triggerBtn = document.getElementById('concierge-trigger');
  const panel = document.getElementById('concierge-panel');
  const closeBtn = document.getElementById('concierge-close');
  const faqToggles = document.querySelectorAll('.concierge-faq-q');

  if (!triggerBtn || !panel) return;

  function togglePanel() {
    const isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
    } else {
      panel.classList.add('open');
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
    });
  }

  // Close when clicking outside panel
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Accordion behavior for quick FAQ questions
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.parentElement;
      const answer = parent.querySelector('.concierge-faq-a');
      const arrow = toggle.querySelector('.faq-arrow');
      const isExpanded = !answer.classList.contains('hidden');

      // Collapse all answers in concierge
      document.querySelectorAll('.concierge-faq-a').forEach(a => a.classList.add('hidden'));
      document.querySelectorAll('.faq-arrow').forEach(arr => arr.classList.remove('rotate-180'));

      if (!isExpanded) {
        answer.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   12. MASCOT MICRO-INTERACTIONS
   ========================================================================== */
function initMascotInteractions() {
  const mascots = document.querySelectorAll('.mascot-interactive');
  mascots.forEach(mascot => {
    mascot.addEventListener('mouseenter', () => {
      mascot.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      mascot.style.transform = 'translateY(-6px) scale(1.04) rotate(1.5deg)';
    });
    mascot.addEventListener('mouseleave', () => {
      mascot.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
  });
}

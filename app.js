/**
 * YOUR DENTAL CLINIC by S2 — Luxury Dental Experience Engine
 * Scroll-Controlled Video Scrubbing, Frosted Navbar & Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initFrostedNavbar();
  initScrollControlledHeroVideo();
  initLiveClinicStatus();
  initTreatmentsExplorer();
  initBookingModal();
  initPatientJourney();
  initTestimonialsSlider();
  initMobileNav();
  initCopyrightYear();
});

/* ==========================================================================
   1. FROSTED-GLASS NAVBAR DYNAMIC SCROLL TRANSITION
   ========================================================================== */
function initFrostedNavbar() {
  const navbar = document.getElementById('main-navbar');
  const heroContainer = document.getElementById('hero-scrolly-container');
  if (!navbar) return;

  function updateNavbar() {
    const scrollY = window.scrollY;
    // Calculate where the hero container ends
    const heroEnd = heroContainer ? (heroContainer.offsetTop + heroContainer.offsetHeight - 120) : 600;

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
   2. PRIORITY 2: SCROLL-CONTROLLED 10-SECOND TOOTH VIDEO ANIMATION
   ========================================================================== */
function initScrollControlledHeroVideo() {
  const container = document.getElementById('hero-scrolly-container');
  const video = document.getElementById('hero-tooth-video');
  const scrubFill = document.getElementById('scroll-progress-fill');
  const scrubPercent = document.getElementById('scroll-progress-percent');
  const beatPills = document.querySelectorAll('.scroll-beat-pip');

  if (!container || !video) return;

  let targetTime = 0;
  let currentScrubTime = 0;
  let currentProgress = 0;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure video is paused so it never autoplays independently of scroll
  video.pause();
  video.currentTime = 0;

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    if (maxScroll <= 0) return;

    // Normalized progress (0 to 1) through the pinned hero section
    const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));
    currentProgress = progress;

    const duration = video.duration || 10.0;
    targetTime = progress * duration;
  }

  // Animation Loop: Updates video frame seeking with smooth lerp
  function renderLoop() {
    if (!isReducedMotion && video.readyState >= 1) {
      // Smooth interpolation for silky scrubbing
      currentScrubTime += (targetTime - currentScrubTime) * 0.22;

      // Only seek if difference is noticeable and video is not currently seeking
      if (Math.abs(video.currentTime - currentScrubTime) > 0.04 && !video.seeking) {
        try {
          video.currentTime = currentScrubTime;
        } catch (e) {
          // Ignore seeking abort errors during rapid scrolls
        }
      }
    }

    // Update narrative beats
    updateNarrativeBeats(currentProgress);

    // Update scrub indicators
    if (scrubFill) {
      scrubFill.style.width = `${currentProgress * 100}%`;
    }
    if (scrubPercent) {
      scrubPercent.textContent = `${Math.round(currentProgress * 100)}%`;
    }

    requestAnimationFrame(renderLoop);
  }

  // Narrative Beats synced to scroll position
  const beats = [
    { id: 'beat-1', start: 0.00, end: 0.25 }, // Establishing Molar & Pedestal
    { id: 'beat-2', start: 0.25, end: 0.50 }, // Orbital Turquoise Ring
    { id: 'beat-3', start: 0.50, end: 0.75 }, // Enamel Macro Crystallography
    { id: 'beat-4', start: 0.75, end: 1.00 }  // Final Resolution & Centered Tooth
  ];

  function updateNarrativeBeats(progress) {
    beats.forEach((beat, index) => {
      const el = document.getElementById(beat.id);
      if (!el) return;

      const isActive = progress >= beat.start && progress <= beat.end;
      if (isActive) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }

      // Update scrub pips
      if (beatPills[index]) {
        if (isActive) {
          beatPills[index].classList.add('text-primaryMint', 'border-primaryMint', 'bg-primaryMint/20');
          beatPills[index].classList.remove('text-slate-400', 'border-transparent');
        } else {
          beatPills[index].classList.remove('text-primaryMint', 'border-primaryMint', 'bg-primaryMint/20');
          beatPills[index].classList.add('text-slate-400', 'border-transparent');
        }
      }
    });
  }

  // Click Beat Pips to Smoothly Scroll to that Moment
  beatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetPct = parseFloat(pill.getAttribute('data-target-pct') || '0');
      const rect = container.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      const targetY = window.scrollY + rect.top + (targetPct * maxScroll);
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Initialize
  onScroll();
  requestAnimationFrame(renderLoop);
}

/* ==========================================================================
   3. LIVE CLINIC OPERATING STATUS
   ========================================================================== */
function initLiveClinicStatus() {
  const statusElements = document.querySelectorAll('.live-clinic-status');
  if (!statusElements.length) return;

  function checkStatus() {
    const now = new Date();
    const hours = now.getHours();
    const isOpen = hours >= 10 && hours < 21;

    statusElements.forEach(el => {
      if (isOpen) {
        el.innerHTML = `
          <span class="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-teal-200 font-medium">Open Today until 9:00 PM</span>
        `;
      } else {
        el.innerHTML = `
          <span class="inline-flex w-2 h-2 rounded-full bg-amber-400"></span>
          <span class="text-amber-200 font-medium">Opens Tomorrow at 10:00 AM</span>
        `;
      }
    });
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
   7. PATIENT TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const sliderTrack = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonials-prev');
  const nextBtn = document.getElementById('testimonials-next');
  if (!sliderTrack || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = sliderTrack.children;
  const totalCards = cards.length;

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 24;
    sliderTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    const maxVisible = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1);
    const maxIndex = Math.max(0, totalCards - maxVisible);
    if (currentIndex < maxIndex) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    const maxVisible = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1);
    const maxIndex = Math.max(0, totalCards - maxVisible);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = maxIndex;
    }
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
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

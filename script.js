let deferredInstallPrompt = null;

// Capture the PWA install prompt and show custom banner
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;

  const banner = document.getElementById('pwaInstallBanner');
  if (banner) {
    banner.hidden = false;
  }
});

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) {
    banner.hidden = true;
  }
  deferredInstallPrompt = null;
});

// Simple accessible navigation toggle for mobile and PWA banner actions
document.addEventListener('DOMContentLoaded', function () {
  const toggles = document.querySelectorAll('.nav-toggle');

  toggles.forEach(btn => {
    const controls = btn.getAttribute('aria-controls');
    const nav = document.getElementById(controls) || btn.nextElementSibling;

    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-open');
    });
  });

  // Close nav when a nav link is clicked (use event delegation)
  document.addEventListener('click', function (e) {
    if (e.target.matches('.nav-link')) {
      if (document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        const togg = document.querySelector('.nav-toggle[aria-expanded="true"]');
        if (togg) togg.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Contact form: set email subject dynamically based on dropdown + name
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      const subjectSelect = contactForm.querySelector('#subject');
      const nameInput = contactForm.querySelector('#fullName');
      const hiddenSubject = contactForm.querySelector('#emailSubject');

      if (subjectSelect && hiddenSubject) {
        const selectedOption = subjectSelect.options[subjectSelect.selectedIndex];
        const subjectText = selectedOption ? selectedOption.text : 'New message';
        const nameText = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Someone';
        hiddenSubject.value = subjectText + ' — message from ' + nameText;
      }
    });
  }

  // PWA install banner buttons
  const installBtn = document.getElementById('pwaInstallBtn');
  const dismissBtn = document.getElementById('pwaDismissBtn');
  const banner = document.getElementById('pwaInstallBanner');

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;

      deferredInstallPrompt.prompt();
      try {
        await deferredInstallPrompt.userChoice;
      } catch (e) {
        // ignore
      }
      deferredInstallPrompt = null;
      if (banner) {
        banner.hidden = true;
      }
    });
  }

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.hidden = true;
    });
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // ignore registration errors for now
    });
  });
}

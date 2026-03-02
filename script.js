// Simple accessible navigation toggle for mobile
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
});

const steps = Array.from(document.querySelectorAll('.step'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const form = document.getElementById('deregForm');
const stepLabel = document.getElementById('stepLabel');
const progressBar = document.getElementById('progressBar');
const formError = document.getElementById('formError');
const summaryGrid = document.getElementById('summaryGrid');
const successBox = document.getElementById('successBox');

let currentStep = 1;
const totalSteps = steps.length;

const summaryMap = [
  ['License plate number', 'licensePlate'],
  ['VIN / Chassis number', 'vin'],
  ['Registration certificate security code', 'regCode'],
  ['License plate security code 1', 'plateCode1'],
  ['License plate security code 2', 'plateCode2'],
  ['First name', 'firstName'],
  ['Last name', 'lastName'],
  ['Email address', 'email'],
  ['Phone number', 'phone'],
  ['Address (optional)', 'address']
];

function updateStepView() {
  steps.forEach((step) => {
    const isActive = Number(step.dataset.step) === currentStep;
    step.classList.toggle('active', isActive);
  });

  stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
  progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;

  prevBtn.disabled = currentStep === 1;

  if (currentStep === totalSteps) {
    nextBtn.hidden = true;
    buildSummary();
  } else {
    nextBtn.hidden = false;
  }

  formError.textContent = '';
}

function getCurrentStepInputs() {
  const activeStep = document.querySelector(`.step[data-step="${currentStep}"]`);
  return activeStep ? Array.from(activeStep.querySelectorAll('input[required], textarea[required], select[required]')) : [];
}

function validateCurrentStep() {
  const requiredInputs = getCurrentStepInputs();
  let isValid = true;

  requiredInputs.forEach((input) => {
    const empty = input.type === 'checkbox' ? !input.checked : !input.value.trim();
    if (empty) {
      isValid = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  });

  if (!isValid) {
    formError.textContent = 'Please complete all required fields before continuing.';
  }

  return isValid;
}

function readValueByName(name) {
  const field = form.querySelector(`[name="${name}"]`);
  return field ? field.value.trim() : '';
}

function buildSummary() {
  const rows = summaryMap.map(([label, field]) => {
    const value = readValueByName(field) || 'Not provided';
    return `<div class="summary-item"><span>${label}</span><strong>${value}</strong></div>`;
  }).join('');

  summaryGrid.innerHTML = `${rows}<div class="summary-item"><span>Service Fee</span><strong>€29.95</strong></div>`;
}

nextBtn.addEventListener('click', () => {
  if (!validateCurrentStep()) return;
  if (currentStep < totalSteps) {
    currentStep += 1;
    updateStepView();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep -= 1;
    updateStepView();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (currentStep !== totalSteps) return;

  if (!validateCurrentStep()) return;

  successBox.hidden = false;
  formError.textContent = '';
  nextBtn.hidden = true;
  prevBtn.disabled = true;
  form.querySelectorAll('input, button').forEach((el) => {
    if (el.id !== 'prevBtn') {
      el.disabled = true;
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

updateStepView();

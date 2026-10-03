/**
 * Modern Auth System - Interactions & Validation Script
 * Handles Tab Sliding, Theme Toggling, Password Strength, Validation, and Notifications.
 */

// ================= DOM ELEMENTS =================
const formsTrack = document.getElementById('formsTrack');
const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const sliderIndicator = document.getElementById('sliderIndicator');
const cardContainer = document.getElementById('cardContainer');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Login Form Elements
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const rememberMe = document.getElementById('rememberMe');

// Register Form Elements
const registerForm = document.getElementById('registerForm');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');
const termsAgree = document.getElementById('termsAgree');
const regNameError = document.getElementById('regNameError');
const regEmailError = document.getElementById('regEmailError');
const regPasswordError = document.getElementById('regPasswordError');
const regConfirmError = document.getElementById('regConfirmError');
const termsError = document.getElementById('termsError');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');
const strengthMeterContainer = document.getElementById('strengthMeterContainer');
const strengthProgress = document.getElementById('strengthProgress');
const strengthValue = document.getElementById('strengthValue');

// Forgot Password Modal Elements
const forgotModal = document.getElementById('forgotModal');
const openForgotModalBtn = document.getElementById('openForgotModal');
const closeForgotModalBtn = document.getElementById('closeForgotModal');
const forgotForm = document.getElementById('forgotForm');
const forgotEmail = document.getElementById('forgotEmail');
const forgotEmailError = document.getElementById('forgotEmailError');
const forgotSubmitBtn = document.getElementById('forgotSubmitBtn');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// ================= THEME TOGGLE LOGIC =================
function initTheme() {
  const savedTheme = localStorage.getItem('modernAuthTheme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('modernAuthTheme', nextTheme);
  showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
});

initTheme();

// ================= TAB SWITCHING LOGIC =================
function switchTab(mode) {
  if (mode === 'register') {
    formsTrack.classList.add('show-register');
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    registerTabBtn.setAttribute('aria-selected', 'true');
    loginTabBtn.setAttribute('aria-selected', 'false');
    sliderIndicator.style.transform = 'translateX(100%)';
  } else {
    formsTrack.classList.remove('show-register');
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
    loginTabBtn.setAttribute('aria-selected', 'true');
    registerTabBtn.setAttribute('aria-selected', 'false');
    sliderIndicator.style.transform = 'translateX(0%)';
  }
  clearValidationErrors();
}

loginTabBtn.addEventListener('click', () => switchTab('login'));
registerTabBtn.addEventListener('click', () => switchTab('register'));

// ================= PASSWORD EYE TOGGLE =================
document.querySelectorAll('.eye-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.classList.toggle('active', isPassword);
  });
});

// ================= PASSWORD STRENGTH METER =================
function calculatePasswordStrength(pass) {
  let score = 0;
  if (!pass) return { score: 0, text: 'Too weak', color: '#ef4444', percent: 0 };

  if (pass.length >= 8) score += 25;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25;
  if (/\d/.test(pass)) score += 25;
  if (/[^A-Za-z0-9]/.test(pass)) score += 25;

  let text = 'Too weak';
  let color = '#ef4444'; // Red

  if (score === 50) {
    text = 'Fair';
    color = '#f59e0b'; // Amber
  } else if (score === 75) {
    text = 'Good';
    color = '#10b981'; // Green
  } else if (score === 100) {
    text = 'Strong & Secure';
    color = '#6366f1'; // Indigo
  }

  return { score, text, color, percent: score };
}

regPassword.addEventListener('input', (e) => {
  const val = e.target.value;
  if (val.length > 0) {
    strengthMeterContainer.classList.add('active');
  } else {
    strengthMeterContainer.classList.remove('active');
  }

  const { percent, text, color } = calculatePasswordStrength(val);
  strengthProgress.style.width = `${percent}%`;
  strengthProgress.style.backgroundColor = color;
  strengthValue.textContent = text;
  strengthValue.style.color = color;
});

// ================= VALIDATION UTILITIES =================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(inputElement, errorElement, message) {
  const wrapper = inputElement.closest('.input-wrapper');
  if (wrapper) wrapper.classList.add('has-error');
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

function clearError(inputElement, errorElement) {
  const wrapper = inputElement.closest('.input-wrapper');
  if (wrapper) wrapper.classList.remove('has-error');
  errorElement.textContent = '';
  errorElement.classList.remove('visible');
}

function clearValidationErrors() {
  document.querySelectorAll('.input-wrapper').forEach(w => w.classList.remove('has-error'));
  document.querySelectorAll('.error-msg').forEach(e => {
    e.textContent = '';
    e.classList.remove('visible');
  });
}

function triggerShake() {
  cardContainer.classList.remove('shake');
  void cardContainer.offsetWidth; // Trigger reflow
  cardContainer.classList.add('shake');
}

// Clear errors on input typing
[loginEmail, loginPassword].forEach(input => {
  input.addEventListener('input', () => {
    clearError(input, input === loginEmail ? loginEmailError : loginPasswordError);
  });
});

[regName, regEmail, regPassword, regConfirmPassword].forEach(input => {
  input.addEventListener('input', () => {
    if (input === regName) clearError(regName, regNameError);
    if (input === regEmail) clearError(regEmail, regEmailError);
    if (input === regPassword) clearError(regPassword, regPasswordError);
    if (input === regConfirmPassword) clearError(regConfirmPassword, regConfirmError);
  });
});

termsAgree.addEventListener('change', () => {
  termsError.classList.remove('visible');
});

// ================= TOAST NOTIFICATION SYSTEM =================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `;

  if (type === 'success') {
    icon = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === 'error') {
    icon = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  toast.innerHTML = `${icon}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}

// ================= FORM SUBMISSION: LOGIN =================
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let hasError = false;

  const emailVal = loginEmail.value.trim();
  const passVal = loginPassword.value;

  if (!emailVal) {
    setError(loginEmail, loginEmailError, 'Please enter your email');
    hasError = true;
  } else if (!isValidEmail(emailVal)) {
    setError(loginEmail, loginEmailError, 'Please enter a valid email address');
    hasError = true;
  }

  if (!passVal) {
    setError(loginPassword, loginPasswordError, 'Please enter your password');
    hasError = true;
  } else if (passVal.length < 6) {
    setError(loginPassword, loginPasswordError, 'Password must be at least 6 characters');
    hasError = true;
  }

  if (hasError) {
    triggerShake();
    return;
  }

  // Simulate network authentication request
  loginSubmitBtn.classList.add('loading');
  loginSubmitBtn.disabled = true;

  setTimeout(() => {
    loginSubmitBtn.classList.remove('loading');
    loginSubmitBtn.disabled = false;

    if (rememberMe.checked) {
      localStorage.setItem('savedUserEmail', emailVal);
    } else {
      localStorage.removeItem('savedUserEmail');
    }

    showToast(`Signed in successfully as ${emailVal}!`, 'success');
  }, 1200);
});

// Auto-populate saved email if Remember Me was previously checked
const savedEmail = localStorage.getItem('savedUserEmail');
if (savedEmail) {
  loginEmail.value = savedEmail;
  rememberMe.checked = true;
}

// ================= FORM SUBMISSION: REGISTER =================
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let hasError = false;

  const nameVal = regName.value.trim();
  const emailVal = regEmail.value.trim();
  const passVal = regPassword.value;
  const confirmVal = regConfirmPassword.value;

  if (!nameVal) {
    setError(regName, regNameError, 'Please enter your full name');
    hasError = true;
  }

  if (!emailVal) {
    setError(regEmail, regEmailError, 'Please enter your email address');
    hasError = true;
  } else if (!isValidEmail(emailVal)) {
    setError(regEmail, regEmailError, 'Please enter a valid email address');
    hasError = true;
  }

  if (!passVal) {
    setError(regPassword, regPasswordError, 'Please create a password');
    hasError = true;
  } else if (passVal.length < 8) {
    setError(regPassword, regPasswordError, 'Password must be at least 8 characters');
    hasError = true;
  }

  if (!confirmVal) {
    setError(regConfirmPassword, regConfirmError, 'Please confirm your password');
    hasError = true;
  } else if (confirmVal !== passVal) {
    setError(regConfirmPassword, regConfirmError, 'Passwords do not match');
    hasError = true;
  }

  if (!termsAgree.checked) {
    termsError.textContent = 'You must agree to the Terms & Privacy Policy';
    termsError.classList.add('visible');
    hasError = true;
  }

  if (hasError) {
    triggerShake();
    return;
  }

  // Simulate account creation
  registerSubmitBtn.classList.add('loading');
  registerSubmitBtn.disabled = true;

  setTimeout(() => {
    registerSubmitBtn.classList.remove('loading');
    registerSubmitBtn.disabled = false;

    showToast(`Account created for ${nameVal}! You can now sign in.`, 'success');
    registerForm.reset();
    strengthMeterContainer.classList.remove('active');
    
    // Switch to login tab smoothly
    setTimeout(() => {
      switchTab('login');
      loginEmail.value = emailVal;
    }, 600);
  }, 1400);
});

// ================= FORGOT PASSWORD MODAL =================
function openModal() {
  forgotModal.classList.add('open');
  forgotEmail.focus();
}

function closeModal() {
  forgotModal.classList.remove('open');
  clearError(forgotEmail, forgotEmailError);
}

openForgotModalBtn.addEventListener('click', openModal);
closeForgotModalBtn.addEventListener('click', closeModal);

forgotModal.addEventListener('click', (e) => {
  if (e.target === forgotModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && forgotModal.classList.contains('open')) {
    closeModal();
  }
});

forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailVal = forgotEmail.value.trim();

  if (!emailVal || !isValidEmail(emailVal)) {
    setError(forgotEmail, forgotEmailError, 'Please enter a valid email address');
    return;
  }

  forgotSubmitBtn.classList.add('loading');
  forgotSubmitBtn.disabled = true;

  setTimeout(() => {
    forgotSubmitBtn.classList.remove('loading');
    forgotSubmitBtn.disabled = false;
    closeModal();
    forgotForm.reset();
    showToast(`Password reset link sent to ${emailVal}!`, 'success');
  }, 1000);
});

// ================= MOCK SOCIAL & LEGAL HANDLERS =================
function mockSocialAuth(provider) {
  showToast(`Connecting to ${provider} authentication...`, 'info');
  setTimeout(() => {
    showToast(`Successfully verified with ${provider}!`, 'success');
  }, 1000);
}

function mockTerms(e) {
  e.preventDefault();
  showToast('Terms and Privacy: Standard modern data privacy agreement.', 'info');
}

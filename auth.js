// DOM Elements
const authContainer = document.getElementById('authContainer');
const authTitle = document.getElementById('authTitle');
const authButton = document.getElementById('authButton');
const authSwitch = document.getElementById('authSwitch');
const usernameInput = document.getElementById('usernameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const googleLogin = document.getElementById('googleLogin');
const forgotPassword = document.getElementById('forgotPassword');
const authForm = document.getElementById('authForm');
const resetForm = document.getElementById('resetForm');
const resetEmailInput = document.getElementById('resetEmailInput');
const resetPasswordButton = document.getElementById('resetPasswordButton');
const backToAuth = document.getElementById('backToAuth');

// State
let isSignup = true;

// Check Session on Load
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    console.log('Session found, redirecting to dashboard');
    window.location.href = 'dashboard.html';
  }
});

// Toggle Between Signup and Login with Event Delegation
authSwitch.addEventListener('click', (e) => {
  if (e.target.id === 'switchToLogin') {
    e.preventDefault();
    isSignup = !isSignup;
    authTitle.textContent = isSignup ? 'Sign Up' : 'Login';
    authButton.textContent = isSignup ? 'Sign Up' : 'Login';
    usernameInput.classList.toggle('hidden', !isSignup);
    authSwitch.innerHTML = isSignup
      ? 'Already have an account? <a href="#" id="switchToLogin">Login</a>'
      : 'Need an account? <a href="#" id="switchToLogin">Sign Up</a>';
  }
});

// Signup/Login Handler
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = usernameInput.value.trim();

  if (!email || !password || (isSignup && !username)) {
    alert('Please fill in all required fields.');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isSignup) {
    console.log('Attempting signup with:', { email, username });
    if (users.find(u => u.email === email)) {
      alert('Email already registered.');
      return;
    }
    const newUser = { email, password, username };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    console.log('Signup successful');
    alert('Signup successful! Redirecting...');
    window.location.href = 'dashboard.html';
  } else {
    console.log('Attempting login with:', { email });
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      console.log('Login successful');
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid email or password.');
    }
  }
});

// Google Login (Mock)
googleLogin.addEventListener('click', () => {
  console.log('Initiating Google login (mock)');
  alert('Google login not implemented in mock mode. Use email/password.');
});

// Forgot Password (Mock)
forgotPassword.addEventListener('click', (e) => {
  e.preventDefault();
  authForm.parentElement.classList.add('hidden');
  resetForm.parentElement.classList.remove('hidden');
});

backToAuth.addEventListener('click', (e) => {
  e.preventDefault();
  resetForm.parentElement.classList.add('hidden');
  authForm.parentElement.classList.remove('hidden');
});

resetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = resetEmailInput.value.trim();
  if (!email) {
    alert('Please enter your email.');
    return;
  }
  console.log('Sending password reset email to:', email);
  alert('Password reset link sent! (Mock) Check your email to reset.');
  resetForm.parentElement.classList.add('hidden');
  authForm.parentElement.classList.remove('hidden');
});
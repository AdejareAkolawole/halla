// Initialize Supabase (Replace with your Supabase URL and Key)
const { createClient } = Supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

// DOM Elements
const authContainer = document.getElementById('authContainer');
const authTitle = document.getElementById('authTitle');
const authButton = document.getElementById('authButton');
const authSwitch = document.getElementById('authSwitch');
const switchToLogin = document.getElementById('switchToLogin');
const usernameInput = document.getElementById('usernameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const googleLogin = document.getElementById('googleLogin');
const forgotPassword = document.getElementById('forgotPassword');
const authForm = document.querySelector('.auth-form');
const resetForm = document.querySelector('.reset-form');
const resetEmailInput = document.getElementById('resetEmailInput');
const resetPasswordButton = document.getElementById('resetPasswordButton');
const backToAuth = document.getElementById('backToAuth');

// State
let isSignup = true;

// Check Session on Load
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
});

// Toggle Between Signup and Login
switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  isSignup = !isSignup;
  authTitle.textContent = isSignup ? 'Sign Up' : 'Login';
  authButton.textContent = isSignup ? 'Sign Up' : 'Login';
  usernameInput.classList.toggle('hidden', !isSignup);
  authSwitch.innerHTML = isSignup
    ? 'Already have an account? <a href="#" id="switchToLogin">Login</a>'
    : 'Need an account? <a href="#" id="switchToLogin">Sign Up</a>';
});

// Signup/Login Handler
authButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = usernameInput.value.trim();

  if (!email || !password || (isSignup && !username)) {
    alert('Please fill in all required fields.');
    return;
  }

  if (isSignup) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/auth.html',
      },
    });
    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({ id: data.user.id, username, bio: 'Hey, I\'m new to Halla!' });
      if (profileError) {
        alert('Profile creation failed: ' + profileError.message);
      } else {
        alert('Signup successful! Check your email to confirm.');
        isSignup = false;
        authTitle.textContent = 'Login';
        authButton.textContent = 'Login';
        usernameInput.classList.add('hidden');
        authSwitch.innerHTML = 'Need an account? <a href="#" id="switchToLogin">Sign Up</a>';
      }
    }
  } else {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      window.location.href = 'dashboard.html';
    }
  }
});

// Google Login
googleLogin.addEventListener('click', async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html',
    },
  });
  if (error) {
    alert('Google Login failed: ' + error.message);
  }
});

// Forgot Password
forgotPassword.addEventListener('click', (e) => {
  e.preventDefault();
  authForm.classList.add('hidden');
  resetForm.classList.remove('hidden');
});

backToAuth.addEventListener('click', (e) => {
  e.preventDefault();
  resetForm.classList.add('hidden');
  authForm.classList.remove('hidden');
});

resetPasswordButton.addEventListener('click', async () => {
  const email = resetEmailInput.value.trim();
  if (!email) {
    alert('Please enter your email.');
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/auth.html',
  });
  if (error) {
    alert('Password reset failed: ' + error.message);
  } else {
    alert('Password reset link sent! Check your email.');
    resetForm.classList.add('hidden');
    authForm.classList.remove('hidden');
  }
});

// Handle Redirects
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    window.location.href = 'dashboard.html';
  }
});
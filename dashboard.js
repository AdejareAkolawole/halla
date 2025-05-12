// Tab Switching
document.querySelectorAll('.tab-button, .nav-item').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    document.querySelectorAll('.tab-button, .nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(btn => btn.classList.add('active'));
    document.getElementById(tabId).classList.add('active');
    gsap.from(`#${tabId}`, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
  });
});

// Storz Subtab Switching
document.querySelectorAll('.subtab-button').forEach(button => {
  button.addEventListener('click', () => {
    const subtabId = button.getAttribute('data-subtab');
    document.querySelectorAll('.subtab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(subtabId).classList.add('active');
    gsap.from(`#${subtabId}`, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
  });
});

// Search Functionality
document.getElementById('searchIcon').addEventListener('click', () => {
  document.querySelector('.search-bar').classList.remove('hidden');
  document.querySelector('.header').classList.add('hidden');
  gsap.from('.search-bar', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.out' });
});

document.getElementById('backFromSearch').addEventListener('click', () => {
  document.querySelector('.search-bar').classList.add('hidden');
  document.querySelector('.header').classList.remove('hidden');
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.chat-item').forEach(item => item.style.display = 'flex');
  gsap.from('.header', { opacity: 0, y: -10, duration: 0.3, ease: 'power2.out' });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.chat-item').forEach(item => {
    const username = item.getAttribute('data-username').toLowerCase();
    if (username.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
});

// Chat Functionality
let currentUser = null;
let currentChat = null;
let messages = JSON.parse(localStorage.getItem('messages') || '[]');

// Check Session on Load
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    console.log('No session found, redirecting to auth.html');
    window.location.href = 'auth.html';
    return;
  }
  currentUser = user;
  console.log('Current user:', currentUser);
  loadProfile();
  loadChats();
});

// Load Profile
function loadProfile() {
  document.getElementById('profileUsername').textContent = `@${currentUser.username}`;
  document.getElementById('profileBio').textContent = currentUser.bio || 'No bio set.';
  editUsernameInput.value = currentUser.username;
  editBioInput.value = currentUser.bio || '';
}

// Edit Profile
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileForm = document.getElementById('editProfileForm');
const editUsernameInput = document.getElementById('editUsernameInput');
const editBioInput = document.getElementById('editBioInput');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

editProfileBtn.addEventListener('click', () => {
  editProfileForm.classList.remove('hidden');
});

cancelEditBtn.addEventListener('click', () => {
  editProfileForm.classList.add('hidden');
});

saveProfileBtn.addEventListener('click', () => {
  const username = editUsernameInput.value.trim();
  const bio = editBioInput.value.trim();
  if (!username) {
    alert('Username cannot be empty.');
    return;
  }
  currentUser.username = username;
  currentUser.bio = bio;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  loadProfile();
  editProfileForm.classList.add('hidden');
});

// Load Chats (Mock)
function loadChats() {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = '';
  const mockChats = [
    { username: 'JohnDoe', lastMessage: 'New chat started 🚀' },
    { username: 'JaneSmith', lastMessage: 'Hey, let’s talk!' },
  ];
  mockChats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.setAttribute('data-username', `@${chat.username}`);
    chatItem.innerHTML = `
      <div class="chat-avatar">
        <i class="fa fa-user-circle"></i>
        <div class="status-dot online"></div>
      </div>
      <div class="chat-info">
        <h3>@${chat.username}</h3>
        <p>${chat.lastMessage}</p>
      </div>
      <div class="chat-meta">
        <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `;
    chatItem.addEventListener('click', () => openChat(chat.username));
    chatList.appendChild(chatItem);
    gsap.from(chatItem, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.out' });
  });
}

// Open Chat
function openChat(username) {
  currentChat = username;
  document.getElementById('chatUsername').textContent = username;
  document.getElementById('chatWindow').classList.remove('hidden');
  document.getElementById('chatWindow').classList.add('active');
  document.getElementById('chatMessages').innerHTML = '';
  loadChatHistory();
}

// Load Chat History (Mock)
function loadChatHistory() {
  const chatHistory = messages.filter(m => 
    (m.sender === currentUser.username && m.receiver === currentChat) || 
    (m.sender === currentChat && m.receiver === currentUser.username)
  );
  chatHistory.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${msg.sender === currentUser.username ? 'sent' : 'received'}`;
    messageDiv.textContent = msg.content;
    document.getElementById('chatMessages').appendChild(messageDiv);
  });
  document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

// Send Message
document.getElementById('sendMessage').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message && currentChat) {
    const newMessage = {
      sender: currentUser.username,
      receiver: currentChat,
      content: message,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message sent';
    messageDiv.textContent = message;
    document.getElementById('chatMessages').appendChild(messageDiv);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
    messageInput.value = '';
  }
});

document.getElementById('new-dm-btn').addEventListener('click', () => {
  const username = prompt('Enter username to start a new DM:');
  if (username && !['JohnDoe', 'JaneSmith'].includes(username)) {
    alert('Starting DM with ' + username + ' (mock)');
    loadChats(); // Reload to simulate adding a new chat
  } else if (username) {
    alert('Already chatting with ' + username + '!');
  } else {
    alert('Please enter a valid username.');
  }
});

document.getElementById('backFromChat').addEventListener('click', () => {
  gsap.to('#chatWindow', { opacity: 0, x: '100%', duration: 0.3, ease: 'power2.out', onComplete: () => {
    document.getElementById('chatWindow').classList.remove('active');
    document.getElementById('chatWindow').classList.add('hidden');
    currentChat = null;
  }});
});

// Additional Actions
document.getElementById('callIcon').addEventListener('click', () => {
  alert('Calling ' + currentChat + '!');
});

document.getElementById('videoIcon').addEventListener('click', () => {
  alert('Starting video call with ' + currentChat + '!');
});

document.getElementById('notificationIcon').addEventListener('click', () => {
  alert('You have new notifications!');
});

document.getElementById('settingsIcon').addEventListener('click', () => {
  alert('Opening settings...');
});

document.getElementById('voiceSearch').addEventListener('click', () => {
  alert('Voice search activated!');
});

document.getElementById('attachIcon').addEventListener('click', () => {
  alert('Attach a file or media!');
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'auth.html';
});
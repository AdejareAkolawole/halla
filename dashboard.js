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
  let currentChat = null;
  document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
      currentChat = item.getAttribute('data-username');
      document.getElementById('chatUsername').textContent = currentChat;
      document.getElementById('chatWindow').classList.add('active');
      document.getElementById('chatMessages').innerHTML = `
        <div class="chat-message received">Hi there! What's up? 😊</div>
        <div class="chat-message sent">Hello! Just checking in. 🔥</div>
      `;
      gsap.from('#chatWindow', { opacity: 0, x: 50, duration: 0.3, ease: 'power2.out' });
    });
  });
  
  document.getElementById('backFromChat').addEventListener('click', () => {
    document.getElementById('chatWindow').classList.remove('active');
    currentChat = null;
    gsap.to('#chatWindow', { opacity: 0, x: 50, duration: 0.3, ease: 'power2.out', onComplete: () => {
      document.getElementById('chatWindow').classList.add('hidden');
    }});
  });
  
  document.getElementById('sendMessage').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message && currentChat) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message sent';
      messageDiv.textContent = message;
      document.getElementById('chatMessages').appendChild(messageDiv);
      messageInput.value = '';
      document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
      setTimeout(() => {
        const receivedDiv = document.createElement('div');
        receivedDiv.className = 'chat-message received';
        receivedDiv.textContent = 'Thanks for the message! 😊';
        document.getElementById('chatMessages').appendChild(receivedDiv);
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
      }, 1000);
    }
  });
  
  document.getElementById('new-dm-btn').addEventListener('click', () => {
    const username = prompt('Enter username to start a new DM:');
    if (username) {
      const newChat = document.createElement('div');
      newChat.className = 'chat-item';
      newChat.setAttribute('data-username', `@${username}`);
      newChat.innerHTML = `
        <div class="chat-avatar">
          <i class="fas fa-user-circle"></i>
          <div class="status-dot online"></div>
        </div>
        <div class="chat-info">
          <h3>@${username}</h3>
          <p>New chat started 🚀</p>
        </div>
        <div class="chat-meta">
          <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `;
      document.getElementById('chatList').prepend(newChat);
      newChat.click();
      gsap.from(newChat, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.out' });
    }
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
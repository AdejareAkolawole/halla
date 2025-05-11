// Initialize Supabase (Replace with your Supabase URL and Key)
const { createClient } = Supabase;
const supabaseClient = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

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
    document.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('hidden'));
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

// Check Session on Load
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'auth.html';
    return;
  }
  currentUser = session.user;
  await loadProfile(currentUser.id);
  loadChats();
});

// Load Profile
async function loadProfile(userId) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('username, bio')
    .eq('id', userId)
    .single();
  if (data) {
    document.getElementById('profileUsername').textContent = `@${data.username}`;
    document.getElementById('profileBio').textContent = data.bio || 'No bio set.';
    editUsernameInput.value = data.username;
    editBioInput.value = data.bio || '';
  }
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

saveProfileBtn.addEventListener('click', async () => {
  const username = editUsernameInput.value.trim();
  const bio = editBioInput.value.trim();
  if (!username) {
    alert('Username cannot be empty.');
    return;
  }

  const { error } = await supabaseClient
    .from('profiles')
    .update({ username, bio })
    .eq('id', currentUser.id);
  if (error) {
    alert('Profile update failed: ' + error.message);
  } else {
    await loadProfile(currentUser.id);
    editProfileForm.classList.add('hidden');
  }
});

// Load Chats
async function loadChats() {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = '';
  const { data: fellows, error: fellowsError } = await supabaseClient
    .from('fellows')
    .select('fellow_id')
    .eq('user_id', currentUser.id);
  if (fellowsError) {
    console.error('Failed to load fellows:', fellowsError);
    return;
  }

  for (const fellow of fellows || []) {
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', fellow.fellow_id)
      .single();
    if (profile) {
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-item';
      chatItem.setAttribute('data-username', `@${profile.username}`);
      chatItem.innerHTML = `
        <div class="chat-avatar">
          <i class="fa fa-user-circle"></i>
          <div class="status-dot online"></div>
        </div>
        <div class="chat-info">
          <h3>@${profile.username}</h3>
          <p>New chat started 🚀</p>
        </div>
        <div class="chat-meta">
          <span class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `;
      chatItem.addEventListener('click', () => openChat(fellow.fellow_id, profile.username));
      chatList.appendChild(chatItem);
      gsap.from(chatItem, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.out' });
    }
  }
}

// Open Chat
function openChat(fellowId, username) {
  currentChat = fellowId;
  document.getElementById('chatUsername').textContent = username;
  document.getElementById('chatWindow').classList.remove('hidden');
  document.getElementById('chatWindow').classList.add('active');
  document.getElementById('chatMessages').innerHTML = '';
  loadChatHistory();
  supabaseClient
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      if ((payload.new.sender === currentUser.id && payload.new.receiver === currentChat) ||
          (payload.new.sender === currentChat && payload.new.receiver === currentUser.id)) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${payload.new.sender === currentUser.id ? 'sent' : 'received'}`;
        messageDiv.textContent = payload.new.content;
        document.getElementById('chatMessages').appendChild(messageDiv);
        document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
      }
    })
    .subscribe();
}

// Load Chat History
async function loadChatHistory() {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .or(`sender.eq.${currentUser.id},receiver.eq.${currentUser.id}`)
    .eq('receiver', currentChat)
    .order('created_at', { ascending: true });
  if (data) {
    data.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${msg.sender === currentUser.id ? 'sent' : 'received'}`;
      messageDiv.textContent = msg.content;
      document.getElementById('chatMessages').appendChild(messageDiv);
    });
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
  }
}

// Send Message
document.getElementById('sendMessage').addEventListener('click', async () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message && currentChat) {
    const { error } = await supabaseClient
      .from('messages')
      .insert({
        sender: currentUser.id,
        receiver: currentChat,
        content: message,
      });
    if (!error) {
      messageInput.value = '';
    }
  }
});

document.getElementById('new-dm-btn').addEventListener('click', async () => {
  const username = prompt('Enter username to start a new DM:');
  if (username) {
    const { data: fellow } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();
    if (fellow) {
      const { error } = await supabaseClient
        .from('fellows')
        .insert({
          user_id: currentUser.id,
          fellow_id: fellow.id,
        });
      if (!error) {
        loadChats();
      }
    } else {
      alert('User not found.');
    }
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
document.getElementById('logoutBtn').addEventListener('click', async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (!error) {
    window.location.href = 'auth.html';
  }
});
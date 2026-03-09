// --- Data & State ---
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let posts = JSON.parse(localStorage.getItem('posts')) || [
    {
        id: 1,
        user: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        time: '2 hours ago',
        content: 'Just started learning web development! 🚀',
        image: 'https://via.placeholder.com/600x300',
        likes: 12,
        liked: false
    },
    {
        id: 2,
        user: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
        time: '5 hours ago',
        content: 'Beautiful sunset today! 🌅',
        image: 'https://via.placeholder.com/600x400',
        likes: 45,
        liked: true
    }
];

let contacts = [
    { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
    { name: 'Bob Brown', avatar: 'https://via.placeholder.com/40' },
    { name: 'Charlie Davis', avatar: 'https://via.placeholder.com/40' }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('currentUserName').textContent = currentUser.name;
        document.getElementById('navProfileImg').src = currentUser.avatar || 'https://via.placeholder.com/40';
        renderStories();
        renderFeed();
        renderContacts();
    }
});

// --- Authentication ---
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// --- Rendering Functions ---
function renderStories() {
    const container = document.getElementById('storiesContainer');
    let html = `
        <div class="story-card">
            <img src="https://via.placeholder.com/110x180" alt="Story">
            <div class="user-avatar" style="background-image: url('${currentUser.avatar}'); background-size: cover;"></div>
            <div class="add-story">Create Story</div>
        </div>
    `;
    
    // Add dummy stories
    contacts.forEach(contact => {
        html += `
            <div class="story-card">
                <img src="${contact.avatar}" alt="Story">
                <div class="user-avatar" style="background-image: url('${contact.avatar}'); background-size: cover;"></div>
                <div class="add-story">${contact.name}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderFeed() {
    const feed = document.getElementById('feedContent');
    feed.innerHTML = '';

    posts.forEach(post => {
        const likeClass = post.liked ? 'liked' : '';
        const likeIcon = post.liked ? 'fas fa-heart' : 'far fa-heart';
        
        const postHTML = `
            <div class="post">
                <div class="post-header">
                    <img src="${post.avatar}" alt="User">
                    <div>
                        <h4>${post.user}</h4>
                        <span>${post.time}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                    ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
                </div>
                <div class="post-actions">
                    <button class="action-btn ${likeClass}" onclick="toggleLike(${post.id})">
                        <i class="${likeIcon}"></i> ${post.likes} Likes
                    </button>
                    <button class="action-btn">Comment</button>
                    <button class="action-btn">Share</button>
                </div>
            </div>
        `;
        feed.innerHTML += postHTML;
    });
}

function renderContacts() {
    const list = document.getElementById('contactsList');
    list.innerHTML = '';
    contacts.forEach(contact => {
        list.innerHTML += `
            <div class="contact" onclick="openChat('${contact.name}')">
                <div class="contact-wrapper">
                    <img src="${contact.avatar}" alt="${contact.name}">
                    <span class="online-dot"></span>
                </div>
                <span>${contact.name}</span>
            </div>
        `;
    });
}

// --- Interactions ---

// 1. Create Post
function createPost() {
    const input = document.getElementById('postInput');
    const text = input.value.trim();
    
    if (text) {
        const newPost = {
            id: Date.now(),
            user: currentUser.name,
            avatar: currentUser.avatar || 'https://via.placeholder.com/40',
            time: 'Just now',
            content: text,
            image: null,
            likes: 0,
            liked: false
        };

        // Add to beginning of array
        posts.unshift(newPost);
        
        // Save to LocalStorage
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Clear input and re-render
        input.value = '';
        renderFeed();
    }
}

// 2. Toggle Like
function toggleLike(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.liked = !post.liked;
        post.likes = post.liked ? post.likes + 1 : post.likes - 1;
        
        // Save to LocalStorage
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Re-render feed
        renderFeed();
    }
}

// 3. Dynamic Content Loading (Sidebar)
function loadContent(type) {
    const feed = document.getElementById('feedContent');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Update active state in sidebar
    menuItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Clear current feed
    feed.innerHTML = '';

    // Simulate loading different content
    if (type === 'feed') {
        renderFeed();
    } else {
        feed.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #65676b;">
                <i class="fas fa-info-circle" style="font-size: 3rem; margin-bottom: 10px;"></i>
                <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <p>This section is under construction in this demo.</p>
            </div>
        `;
    }
}

// 4. Chat System
let currentChatUser = null;

function openChat(userName) {
    currentChatUser = userName;
    document.getElementById('chatWith').textContent = `Chatting with ${userName}`;
    document.getElementById('chatPopup').classList.add('active');
    loadChatMessages();
}

function closeChat() {
    document.getElementById('chatPopup').classList.remove('active');
    currentChatUser = null;
}

function loadChatMessages() {
    const chatBody = document.getElementById('chatBody');
    const key = `chat_${currentChatUser}`;
    const messages = JSON.parse(localStorage.getItem(key)) || [];

    chatBody.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        div.textContent = msg.text;
        chatBody.appendChild(div);
    });
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (text && currentChatUser) {
        const key = `chat_${currentChatUser}`;
        const messages = JSON.parse(localStorage.getItem(key)) || [];
        
        messages.push({
            sender: 'me',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        localStorage.setItem(key, JSON.stringify(messages));
        input.value = '';
        loadChatMessages();
        
        // Simulate a reply after 2 seconds
        setTimeout(() => {
            const replyKey = `chat_${currentChatUser}`;
            const replyMsgs = JSON.parse(localStorage.getItem(replyKey)) || [];
            replyMsgs.push({
                sender: 'them',
                text: `This is an auto-reply from ${currentChatUser}!`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem(replyKey, JSON.stringify(replyMsgs));
            loadChatMessages();
        }, 2000);
    }
}

// Handle Enter key in chat
document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
// 模拟数据
var favoriteData = {
  music: [
  
    {
      id: 102,
      title: '卡农',
      artist: '古典乐团',
      duration: 256,
      cover: './Journey.png',
      type: 'music'
    }
  ],
  video: [
  
    {
      id: 205, 
      title: '美食制作教程',
      artist: '厨艺大师',
      duration: 480,
      cover: './video_cover2.jpg',
      type: 'video',
      
    }
  ]
};

var WS = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
WS.onopen = () => {
  log('Connected to server');
  sendMessage();
};
WS.onmessage = (event) => {
  log('Received: ' + event.data);
  if(event.data=="DeletedeM"){
    sendMessage();
  }
  else{
      if(JSON.parse(event.data).action=="FavLists"){
        favoriteData = JSON.parse(event.data);
        renderList("music");
      }
  }
};
document.addEventListener('keydown', function (event) {

switch (event.key) {
    case 'Tab':
        event.preventDefault();
        break;}});
// 原有代码保持不变，新增以
WS.onclose = () => {
  log('Connection closed');
};
function sendMessage() {
  console.log("Refresh");
  // 1. 构造JSON对象
  const jsonData = {
      action: "GetFavLists",
      timestamp: Date.now()
  };
  // 2. 转换为JSON字符串并发送
  WS.send(JSON.stringify(jsonData));
}
function log(text) {
  console.log(text);
}
function UpdatePlaylists() {
  sendMessage();
}
// 初始化函数
function initFavoritePage() {
  // 绑定选项卡切换
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderList(this.dataset.type);
    });
  });

  // 初始渲染音乐列表
  renderList('music');
  updateCount('music'); // 新增初始化数量显示
  initSwipeHandlers();


}

// 渲染列表函数
function renderList(type) {
  // 隐藏所有列表
document.querySelectorAll('.byy').forEach(list => {
  list.classList.add('HideL');
  setTimeout(() => {
    list.style.display = 'none';
  }, 300);
});

// 显示目标列表
const container = document.getElementById(`${type}-list`);
if (container) {
  container.classList.remove('HideL');
  setTimeout(() => {
    container.style.display = 'block';
  }, 300);
}

  container.innerHTML = favoriteData[type].map(item => `
    <li data-item-id="${item.id}" data-type="${type}">
      <a href="#" id="${item.url}">
        <img class="song-cover" src="${item.cover?item.cover:'../BackDrop/UnknD.png'}" alt="封面">
        <span class="song-info">
          <p class="song-title">${item.title}</p>
          <p class="song-artist">${item.artist?item.artist:'未知歌手'}</p>
         
        </span>
        <div class="song-duration">
          ${formatDuration(item.duration)}
        </div>
        ${item.tags ? `
        <div class="tags">
          <div class="song-tags">
            ${item.tags.slice(0,2).map(tag => `
              <span class="tag">${tag}</span>
            `).join('')}
          </div>
        </div>` : ''}
      </a>
      <div class="song-actions">
        <button class="action-btn delete-song-btn"><img src="./Delete.png"></button>
      </div>
    </li>
  `).join('');

  // 绑定事件
  bindItemEvents(type);
  // 新增：更新数量显示
  updateCount(type);
}

// 新增：更新数量函数
function updateCount(type) {
if(type === 'music'){
  const count = favoriteData[type].length;
  document.getElementById('playlist-count').textContent = `共${count}首`;
}
else{
  const count = favoriteData[type].length;
  document.getElementById('playlist-count').textContent = `共${count}个`;
}
 
}



// 绑定事件函数
function bindItemEvents(type) {
  const container = document.getElementById(`${type}-list`);

  // 删除功能
  container.querySelectorAll('.delete-song-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      
      WS.send(JSON.stringify({"action":"ReMoveL","name":this.closest('li').querySelector("a").id,"List":"喜欢的音乐"}));
      renderList(type);    
      updateCount(type); // 删除后立即更新数量
    });
  });

  // 播放功能
  container.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', function(e) {
      if (!e.target.closest('.song-actions')) {
        const itemId = parseInt(this.dataset.itemId);
        playItem(itemId, type);
      }
    });
  });
}

// 播放功能
function playItem(itemId, type) {
  const item = favoriteData[type].find(i => i.id === itemId);
  console.log(`正在播放${type === 'music' ? '音乐' : '视频'}：`, item.title);
}

// 初始化执行
document.addEventListener('DOMContentLoaded', () => {
  initFavoritePage();
  
  // 添加滚动检测
  setTimeout(() => {
    document.querySelectorAll('.song-title').forEach(titleEl => {
      titleEl.dataset.overflow = titleEl.scrollWidth > titleEl.offsetWidth;
    });
  }, 100);
});



function initSwipeHandlers() {
  // 滑动处理逻辑（与歌单页面相同）
  let touchStartX = 0;
  let isSwiping = false;
  let currentLi = null;

  document.addEventListener('touchstart', e => {
    const li = e.target.closest('li');
    if (!li) return;
    
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
    currentLi = li;
    li.classList.remove('swiped');
  });

  document.addEventListener('touchmove', e => {
    if (!isSwiping || !currentLi) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    
    if (Math.abs(deltaX) > 30) e.preventDefault();
    if (deltaX < -30) currentLi.classList.add('swiped');
  });

  document.addEventListener('touchend', () => {
    isSwiping = false;
    if (!currentLi?.classList.contains('swiped')) resetAllItems();
    currentLi = null;
  });

  // 鼠标事件处理
  document.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const li = e.target.closest('li');
    if (!li) return;
    
    touchStartX = e.clientX;
    isSwiping = true;
    currentLi = li;
    li.classList.remove('swiped');
  });

  document.addEventListener('mousemove', e => {
    if (!isSwiping || !currentLi) return;
    const deltaX = e.clientX - touchStartX;
    if (deltaX < -30) currentLi.classList.add('swiped');
  });

  document.addEventListener('mouseup', () => {
    isSwiping = false;
    if (!currentLi?.classList.contains('swiped')) resetAllItems();
    currentLi = null;
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.action-btn')) resetAllItems();
  });

  function resetAllItems() {
    document.querySelectorAll('li').forEach(li => {
      li.classList.remove('swiped');
    });
  }
}

// 时长格式化函数
function formatDuration(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return `${mins}:${secs.toFixed(0).padStart(2, '0')}`;
}
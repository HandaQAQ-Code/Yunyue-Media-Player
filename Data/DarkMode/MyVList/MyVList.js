var playlists = [
    {
        id: 1,
        name: '加载中，请稍后',
        songCount: 0,
        cover: './Journey.png',
        songs: []
    },
];

var WS = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
WS.onopen = () => {
    log('Connected to server');
    sendMessage();
};
WS.onmessage = (event) => {
    if(event.data=="Updated" || event.data=="DeletedeM"){
        sendMessage();
    }
    else{
        if(JSON.parse(event.data)[0].action=="VideoLists"){
            playlists = JSON.parse(event.data);
            console.log(playlists);
            renderPlaylists();
        }
    }
};
WS.onclose = () => {
    log('Connection closed');
};
function sendMessage() {
    console.log("Refresh");
    // 1. 构造JSON对象
    const jsonData = {
        action: "GetVideoLists",
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
// 渲染列表列表
function renderPlaylists() {
    const list = document.getElementById('playlist-list');
    list.innerHTML = '';
    playlists.forEach(playlist => {
        const li = document.createElement('li');
        if(playlist.name=="历史记录" || playlist.name=="喜欢的视频"){
            li.innerHTML = `
            <a href="#">
               
                <span class="music-name-container">
                    <p class="music-name">${playlist.name}</p>
                </span>
              
            </a>
        `;

        }
        else{
        li.innerHTML = `
            <a href="#">
               
                <span class="music-name-container">
                    <p class="music-name">${playlist.name}</p>
                </span>
            
                <div class="song-actions">
                    <button class="action-btn delete-btn"><img src="./Delete.png"></button>
                    <button class="action-btn edit-btn"><img src="./Edit.png"></button>
                </div>
            </a>
        `;
       
        // 绑定删除事件
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            // 过滤掉当前列表
            WS.send(JSON.stringify({action:"ReMoveML",name:playlist.name}));
            playlists = playlists.filter(p => p.id !== playlist.id);
            // 重新渲染列表
            renderPlaylists();
        });


        // 绑定编辑事件
        li.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    showRenameDialog(playlist);
                });

            }   
         // 添加双击事件
         li.addEventListener('dblclick', () => {
                    showPlaylistPage(playlist.id);
                 });        
        
        list.appendChild(li);
    });

    // 添加滚动效果检测
    setTimeout(() => {
        document.querySelectorAll('.music-name').forEach(nameEl => {
            nameEl.dataset.overflow = nameEl.scrollWidth > nameEl.offsetWidth;
        });
    }, 100);

}

document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            break;}});
// 原有代码保持不变，新增以
function initSwipeHandlers() {
    let touchStartX = 0;
    let isSwiping = false;
    let currentLi = null;
 
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
        
        // 只允许左滑
        if (deltaX < -30) {
            currentLi.classList.add('swiped');
        }
    });

    document.addEventListener('mouseup', () => {
        isSwiping = false;
        if (!currentLi) return;
        
        if (!currentLi.classList.contains('swiped')) {
            resetAllItems();
        }
        currentLi = null;
    });

 

}

    document.addEventListener('DOMContentLoaded', () => {

      
        initSwipeHandlers();
        renderPlaylists();
    });



// 新增代码开始 ================================
// 对话框操作
const addPlaylistBtn = document.querySelector('.add-playlist-btn');
const createDialog = document.querySelector('.create-playlist-dialog');
const renameDialog = document.querySelector('.rename-dialog');
const closeBtns = document.querySelectorAll('.close-btnn');

// 显示创建列表弹窗
addPlaylistBtn.addEventListener('click', () => {
    createDialog.classList.add('active');
    document.getElementById('new-playlist-name').value = '';
});

// 关闭弹窗逻辑
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.bian-ji').classList.remove('active');
    });
});

// 创建新列表
document.querySelector('.confirm-create').addEventListener('click', () => {
    const name = document.getElementById('new-playlist-name').value.trim();
    if (name.length > 15) {
        window.top.Alert('输入的名称不能超过 15 个字，请重新输入。');
        return;
    }
    if (name) {
        // 生成新ID
        const newId = playlists.length > 0 ? Math.max(...playlists.map(p => p.id)) + 1 : 1;
        
        playlists.push({
            id: newId,
            name: name,
            songCount: 0,
            songs: [],      // 新增空歌曲数组
            cover: './default-cover.jpg'
        });
        
        renderPlaylists();
        createDialog.classList.remove('active');
    }
});

// 重命名功能
let currentEditPlaylist = null;

function showRenameDialog(playlist) {
    currentEditPlaylist = playlist;
    renameDialog.classList.add('active');
    document.getElementById('rename-input').value = playlist.name;
}

document.querySelector('.confirm-rename').addEventListener('click', () => {
    const newName = document.getElementById('rename-input').value.trim();
    if (newName.length > 15) {
        window.top.Alert('输入的名称不能超过 15 个字，请重新输入。');
        return;
    }
    document.querySelectorAll(".music-name").forEach(el => {
        if(el.innerHTML==newName){
            document.querySelector(".confirm-create").innerHTML="列表名已存在";
        setTimeout(() => {
            document.querySelector(".confirm-create").innerHTML="创建列表";
        }, 1000);
        return;
        }
    })
    if (newName && currentEditPlaylist) {
        SubmitR(currentEditPlaylist.name,newName);
        currentEditPlaylist.name = newName;
        renderPlaylists();
        renameDialog.classList.remove('active');
    }
});

// 点击外部关闭弹窗
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('bian-ji')) {
        e.target.classList.remove('active');
    }
});
// 新增代码结束 ================================



// 新增页面切换逻辑
function showPlaylistPage(playlistId) {
    // 隐藏列表列表
    document.querySelector('.main-menu').classList.remove('active');
    // 显示播放列表
    document.querySelector('.playlist-page').classList.add('active');
    // 这里可以添加加载具体列表数据的逻辑
}

// 绑定返回事件
document.querySelector('.playlist-page .back-btn').addEventListener('click', () => {
    document.querySelector('.playlist-page').classList.remove('active');
    document.querySelector('.main-menu').classList.add('active');
});




function showPlaylistPage(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    
    // 更新播放列表信息
    document.getElementById('playlist-title').textContent = playlist.name;
    document.getElementById('playlist-count').textContent = `共${playlist.songCount}个`;
    
    // 隐藏列表列表
    document.querySelector('.main-menu').classList.remove('active');
    // 显示播放列表
    document.querySelector('.playlist-page').classList.add('active');
    
    // 这里可以添加实际加载歌曲列表的逻辑
    const songsList = document.getElementById('playlist-songs');
    songsList.innerHTML = Array.from({length: playlist.songCount}, (_,i) => `
        <li class="byyl">歌曲 ${i+1}</li>
    `).join('');

}


function Submit(){
    let value=document.getElementById('new-playlist-name').value;
    if(value==" " || value=="" || value==null){
        document.querySelector(".confirm-create").innerHTML="请输入列表名";
        setTimeout(() => {
            document.querySelector(".confirm-create").innerHTML="创建列表";
        }, 1000);
        return;
    }
    document.querySelectorAll(".music-name").forEach(el => {
        if(el.innerHTML==value){
            document.querySelector(".confirm-create").innerHTML="列表名已存在";
            setTimeout(() => {
                document.querySelector(".confirm-create").innerHTML="创建列表";
            }, 1000);
            return;
        }
    })
    WS.send(JSON.stringify({
        action: 'addMLV',
        name: value
    }));
}
function PlayAll(el){
    window.top.Loading();
 
    window.top.PlayAllLV(el.parentElement.querySelector("#playlist-title").textContent);
  }
function SubmitR(el,bl){
    
    WS.send(JSON.stringify({
        action: 'reMLV',
        name: bl,
        prename: el
    }));
}
function showPlaylistPage(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    
    // 更新播放列表信息
    document.getElementById('playlist-title').textContent = playlist.name;
    document.getElementById('playlist-count').textContent = `共${playlist.songs.length}个`;
    if(playlist.songs.length > 0){
        document.getElementById('album-cover').src = playlist.songs[0].cover;
    }
    else{
        document.getElementById('album-cover').src = '../BackDrop/Default.jpg';
    }
    if(playlist.name=="播放历史"){document.getElementById('album-cover').src = '../BackDrop/His.png';}
    if(playlist.name=="喜欢的音乐"){document.getElementById('album-cover').src = '../BackDrop/Fav.png';}
    // 隐藏列表列表，显示播放列表
    document.querySelector('.main-menu').classList.remove('active');
    document.querySelector('.playlist-page').classList.add('active');

    // 生成歌曲列表
    const songsList = document.getElementById('playlist-songs');
    songsList.innerHTML = playlist.songs.map(song => `
        <li data-song-id="${song.id}">
            <a href="#" id="${song.url}">
                <img class="song-cover" src="${song.cover?song.cover:'../BackDrop/UnknD.png'}" alt="专辑封面">
                <span class="song-info">
                    <p class="song-title">${song.title}</p>
                </span>
                <div class="song-duration">
                    ${formatDuration(song.duration)}
                </div>
                <div class="tags">
                ${
                    song.tags?.length 
                    ? `<div class="song-tags">
                        ${song.tags.slice(0, 2).map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                       </div>`
                    : ''
                }
                </div>
            </a>
            <div class="song-actions">
                <button class="action-btn delete-song-btn"><img src="./Delete.png"></button>
            </div>
        </li>
    `).join('');

    // 绑定事件
    bindSongEvents();
    // 添加滚动效果检测
setTimeout(() => {
    document.querySelectorAll('.song-title').forEach(titleEl => {
        titleEl.dataset.overflow = titleEl.scrollWidth > titleEl.offsetWidth;
    });
}, 100);
}

// 新增时长格式化函数
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(0).padStart(2, '0')}`;
}

// 绑定歌曲事件
function bindSongEvents() {
    const songsList = document.getElementById('playlist-songs');
    
    // 删除歌曲
    songsList.querySelectorAll('.delete-song-btn').forEach(btn => {
        btn.addEventListener('click', function() {
 
            WS.send(JSON.stringify({"action":"ReMoveV","name":this.closest('li').querySelector(".song-title").innerHTML,"List":document.querySelector("#playlist-title").innerHTML}));
            const songId = parseInt(this.closest('li').dataset.songId);
            const playlist = playlists.find(p => p.songs.some(s => s.id === songId));
            playlist.songs = playlist.songs.filter(s => s.id !== songId);

            document.querySelector('.playlist-page').classList.remove('active');
            document.querySelector('.main-menu').classList.add('active');
            this.closest('li').remove();
           
        });
    });

    // 播放歌曲
    songsList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function (e) {
            // 确保点击的是歌曲标题或其他指定区域，而不是子元素（如删除按钮）
            if (e.target.closest('.action-btn')) {
               
            }
            else{
                playSong(this);
            }
        });
    });
}


var Occ=false;
function playSong(element) {
    if(Occ==false){
        document.querySelectorAll('li').forEach(li => li.classList.remove('playing'));
        // 添加当前播放歌曲高亮
        element.classList.add('playing');
        var albumCover = element.querySelector('.song-cover');
        console.log(albumCover);
           const playMessage = {
            action: "PlayVideo",
            name: element.querySelector("a").id
        };
        console.log(playMessage);
        window.top.clear();
        window.top.Loading();
        window.top.AddPlay(element.querySelector("a").id, element.querySelector(".song-title").textContent);
   
        window.top.Video(JSON.stringify(playMessage));
        WS.send(JSON.stringify(playMessage));
        var src = albumCover ? albumCover.getAttribute('src') : '';

        if(src.toString()=="../BackDrop/UnknD.png"){src="./BackDrop/UnKnD.png";}
        window.top.Plas(src);
        Occ = true
    setTimeout(() => {
        Occ=false;
    }, 1000);
    }
}




function resetAllItems(){
    }
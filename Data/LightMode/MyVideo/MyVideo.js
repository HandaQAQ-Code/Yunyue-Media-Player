var Notrrans=0;
// 视频信息更新模块
// =============================================
function  initFilterAndSort(){
   
}
// 1. DOM元素缓存（提升性能）
const musicElements = {
   name: document.getElementById('music-name'),
   author: document.getElementById('author'),
   cover: document.getElementById('album-cover'),
   duration: document.querySelector('#duration p')
};
// 编辑功能
document.querySelectorAll('.edit-icon').forEach(icon => {
   console.log(icon);
   icon.addEventListener('click', function() {

       const input = this.previousElementSibling;
       const isEditing = !input.disabled;
       input.disabled = isEditing;
       this.querySelector('path').setAttribute('d', 
           isEditing ? 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z': 'M5 12l5 5L20 7' 
       );
   });
});

UpdateFilter();
function UpdateFilter(){
   document.querySelector(".Fil").value=window.top.getFilter();

}

// 4. 时长格式化工具
function formatDuration(seconds) {
   const mins = Math.floor(parseInt(seconds) / 60);
   const secs = parseInt(seconds) % 60;
   return `${mins}:${secs.toFixed(0).toString().padStart(2, '0')}`;
}

// 5. 初始化与事件绑定
function initMusicUpdater() {
   
}

// 6. 启动
document.addEventListener('DOMContentLoaded', initMusicUpdater);

// 获取图片主色、配色和互补色的函数
function getImageColors(imageUrl) {
   return new Promise((resolve, reject) => {
       const img = new Image();
       img.crossOrigin = "Anonymous";
       img.src = imageUrl;
       img.onload = () => {
           const canvas = document.createElement('canvas');
           const ctx = canvas.getContext('2d');
           canvas.width = img.width;
           canvas.height = img.height;
           ctx.drawImage(img, 0, 0);
           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
           const data = imageData.data;
           const colorCount = {};
           for (let i = 0; i < data.length; i += 4) {
               const r = data[i];
               const g = data[i + 1];
               const b = data[i + 2];
               const rgb = `${r},${g},${b}`;
               colorCount[rgb] = (colorCount[rgb] || 0) + 1;
           }
           let maxCount = 0;
           let mainColor = '';
           for (const [color, count] of Object.entries(colorCount)) {
               if (count > maxCount) {
                   maxCount = count;
                   mainColor = color;
               }
           }
           const [r, g, b] = mainColor.split(',').map(Number);
           const complementR = 255 - r;
           const complementG = 255 - g;
           const complementB = 255 - b;
           const complementColor = `${complementR},${complementG},${complementB}`;
           const palette = generatePalette(mainColor);
           resolve({ mainColor, palette, complementColor });
       };
       img.onerror = reject;
   });
}

// 生成配色方案的函数
function generatePalette(mainColor) {
   // 这里可以使用更复杂的算法来生成配色方案
   const [r, g, b] = mainColor.split(',').map(Number);
   const palette = [
       `${Math.max(r - 50, 0)},${Math.max(g - 50, 0)},${Math.max(b - 50, 0)}`,
       `${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 50, 255)}`,
       `${Math.max(r - 25, 0)},${Math.min(g + 25, 255)},${b}`,
       `${Math.min(r + 25, 255)},${g},${Math.max(b - 25, 0)}`
   ];
   return palette;
}


// 获取所有 tab 元素
const tabs = document.querySelectorAll('.tab');
       
// 为每个 tab 绑定点击事件
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // 先移除所有 tab 的 active 状态
        tabs.forEach(t => t.classList.remove('active'));
        // 再为当前点击的 tab 添加 active 状态
        this.classList.add('active');

    });
});
// 新增视频播放功能模块
// =============================================

// 1. 初始化音频播放器

let currentPlayingLi = null;
var Occ=false;

// 2. 视频点击处理函数
function handleSongClick(element) {
   if(Notrrans){return;}
   if(Occ==false){

       document.querySelectorAll('li').forEach(li => li.classList.remove('playing'));
       // 添加当前播放视频高亮
       element.classList.add('playing');
       var albumCover = element.querySelector('.album-cover');
       console.log(albumCover);
       const playMessage = {
           action: "PlayVideo",
           name:element.querySelector("a").id
       };
       window.top.AddPlay(element.querySelector("a").id, element.querySelector(".music-name").textContent);
     
       ws.send(JSON.stringify(playMessage));
       window.top.Video(JSON.stringify(playMessage));
       window.top.Loading();
       var src = albumCover ? albumCover.getAttribute('src') : '';
       if(src.toString()=="../BackDrop/UnknD.png"){src="./BackDrop/UnKnD.png";}
       window.top.Plas(src);
       Occ = true
   setTimeout(() => {
       Occ=false;
   }, 1000);
   }
}































function RefreshM(){
   sendMessage();
}


var WS = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
WS.onopen = () => {
   log('Connected to server');
   sendMessage();
};

WS.onmessage = (event) => {
   if(event.data=="DeletedeM" || event.data=="Updated"){
       sendMessage();
   }
   if(event.data=="UpdatedVideo"){
       document.querySelector(".Loc").innerHTML="保存成功";
       setTimeout(() => {
           document.querySelector(".Loc").innerHTML="保存元数据";
       }, 1000);
       RefreshM();
   }
   else{

       if(JSON.parse(event.data)[0].action=="VideoList"){
           localPlaylist = JSON.parse(event.data);
           log('Received: ' + event.data);
           console.log(localPlaylist);
           updatePlaylist(localPlaylist);

       }
   }
};
function RefreshM(){

}
WS.onclose = () => {
   log('Connection closed');
};
function sendMessage() {
   console.log("Refresh");
   // 1. 构造JSON对象
   const jsonData = {
       action: "GetVideoList",
       timestamp: Date.now()
   };
   // 2. 转换为JSON字符串并发送
   WS.send(JSON.stringify(jsonData));
}
function log(text) {
   console.log(text);
}


// 歌单数据示例
var localPlaylist=[

];


function RefreshM(){
   console.log("Refresh");
   // 1. 构造JSON对象
   const jsonData = {
       action: "GetMusicList",
       timestamp: Date.now()
   };
   // 2. 转换为JSON字符串并发送
   WS.send(JSON.stringify(jsonData));


}



const onlinePlaylist = [

];


// 更新歌单显示
function updatePlaylist(playlist) {
   const localList = document.getElementById('local-playlist');
   const onlineList = document.getElementById('online-playlist');

     // 清空当前显示的歌单
     localList.classList.remove('fade-in', 'fade-out');
     onlineList.classList.remove('fade-in', 'fade-out');
     if (playlist === localPlaylist) {
       onlineList.classList.add('fade-out');
   } else {
       localList.classList.add('fade-out');
      
   }
   // 添加淡入淡出效果
   setTimeout(() => {
       localList.innerHTML = '';
       onlineList.innerHTML = '';
        // 填充新的歌单数据
   playlist.forEach(song => {
       const li = document.createElement('li');
       li.dataset.src = song.src;  // 添加data-src属性
       li.addEventListener('click',   function (e) {
           // 确保点击的是歌曲标题或其他指定区域，而不是子元素（如删除按钮）
           if (e.target.closest('.action-btn')) {
              
           }
           else{
               handleSongClick(li);
           }});
       if(song.img==""){
           song.img="../BackDrop/UnknD.png";
       }
       console.log(song.tags);
       li.innerHTML = `
           <a href="#" id="${song.url}">
               <div class="Album" id="${song.album}">
                   <img class="album-cover" src="${song.img}">
               </div>
               <span class="fj">
                   <p class="music-name">${song.name}</p>
               </span>
               <div class="time">
                   <p>${formatDuration(song.duration)}</p>
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
               <button class="action-btn delete-btn" onclick="Remove(this)" data-action="delete"> <img class="de"src="./Delete.png"></button>
               <button class="action-btn edit-btn" data-action="edit"><img src="./Edit.png"></button>
           </div>


       `;
       // 在更新播放列表后添加此代码
   document.querySelectorAll('.music-name').forEach(nameEl => {
   // 检测文本是否溢出
   const isOverflowing = nameEl.scrollWidth > window.innerWidth*0.75;
   
   // 动态添加溢出标记
       if (isOverflowing) {
           nameEl.dataset.overflow = 'true';
       }
   });

       if (playlist === localPlaylist) {
           localList.appendChild(li);
       } else {
           onlineList.appendChild(li);
       }
       requestAnimationFrame(() => {
           const nameEl = li.querySelector('.music-name');
           if (nameEl && nameEl.scrollWidth > window.innerWidth*0.75) {
               nameEl.dataset.overflow = 'true';
           }
       });
       Filt(21, document.querySelector(".Fil").value);
   });

   localList.classList.add('fade-in');
   onlineList.classList.add('fade-in');
   let tmp=window.top.GetNow();
 
   document.querySelectorAll(`#${tmp}`).forEach(a=>{
       console.log(a);
       if(a.id==tmp){
           a.parentElement.classList.add('playing');
           return;
       }
   })
   }, 400);

}
document.addEventListener('keydown', function (event) {

   switch (event.key) {
       case 'Tab':
           event.preventDefault();
           break;}});
// 原有代码保持不变，新增以
function Remove(el){
   var nameD =el.parentElement.parentElement.querySelector("a").id;
   console.log(nameD);
   ws.send(JSON.stringify({action:"RemoveV",name:nameD}));
}
var type=21;
var fc = document.querySelector(".fc");
fc.addEventListener("input", (event) => {   console.log(fc.value);
       Filt(type,fc.value);
});
function resort(type,a1){
   
   var localList = document.getElementById('local-playlist');
   // 获取所有 li 元素
   var lis = Array.from(localList.children);
   // 排序 li 元素
   if(type==13){
       lis.sort((a, b) => {
           const textA = a.querySelector(".music-name").innerHTML.toUpperCase();
           const textB = b.querySelector(".music-name").innerHTML.toUpperCase();
           if (textA < textB) {
               return -1*a1;
           }
           if (textA > textB) {
               return 1*a1;
           }
           return 0;
       });
   }
   if(type==12){
       lis.sort((a, b) => {
           const textA = a.querySelector(".time").innerHTML;
           const textB = b.querySelector(".time").innerHTML;
           if (textA < textB) {
               return -1*a1;
           }
           if (textA > textB) {
               return 1*a1;
           }
           return 0;
       });
   }
   if(type==11){
       lis.sort((a, b) => {
           const textA = a.querySelector(".artist").innerHTML;
           const textB = b.querySelector(".artist").innerHTML;
           if (textA < textB) {
               return -1*a1;
           }
           if (textA > textB) {
               return 1*a1;
           }
           return 0;
       });
   }
   console.log(lis);
   // 清空 ul 元素
   while (localList.firstChild) {
       localList.removeChild(localList.firstChild);
   }
   // 重新插入排序后的 li 元素
   lis.forEach(li => localList.appendChild(li));
}
function Filt(type, key) {
   var localList = document.getElementById('local-playlist');
   var lis = Array.from(localList.children);
   if (type == 21) {
       lis.forEach(function (li) {
           if (!li.querySelector(".music-name").innerHTML.includes(key)) {
               li.classList.add('hidel');
           } else {
               li.classList.remove('hidel');
           }
       });
    
   }
   if(type==22){
       lis.forEach(function (li) {
           if (!li.querySelector(".artist").innerHTML.includes(key)) {
               li.classList.add('hidel');
           } else {
               li.classList.remove('hidel');
           }
       });
    
   }
   if (type == 23) {
       lis.forEach(function (li) {
           const tags = li.querySelectorAll(".tag");
           const matches = Array.from(tags).some(tag => tag.innerHTML.includes(key));
           if (!matches) {
               li.classList.add('hidel');
           } else {
               li.classList.remove('hidel');
           }
       });
    
   }

   
}
// 切换歌单类型
function switchPlaylistType(type) {
   const tabs = document.querySelectorAll('.tab');
   tabs.forEach(tab => tab.classList.remove('active'));
   document.querySelector(`.tab[data-type="${type}"]`).classList.add('active');
   if (type === 'local') {
       updatePlaylist(localPlaylist);
   } else if (type === 'online') {
       updatePlaylist(onlinePlaylist);
   }
   Resize();
}

// 初始化歌单显示
function initPlaylist() {
   updatePlaylist(localPlaylist); // 默认显示本地歌单
   document.querySelectorAll('.tab').forEach(tab => 
       tab.addEventListener('click', () => switchPlaylistType(tab.dataset.type))
   );
   initSwipeHandlers();
   initFilterAndSort(); // 调用筛选和排序初始化函数
   
}



// 在DOMContentLoaded事件中调用初始化函数
document.addEventListener('DOMContentLoaded', () => {

   initMusicUpdater(); // 现有的初始化代码
   initPlaylist(); // 新增的歌单初始化代码
});

//ScrollBar Default
function Resize(){
   var scrollBar=document.querySelector('.scroll');
   var scrollBarC=document.querySelector('.scrollcon');
   var body=document.querySelector('body');
   scrollBar.style.position = 'relative'; 
   if(window.innerHeight/body.offsetHeight>0.95){
       scrollBarC.style.opacity = 0;
   }
   else{
       scrollBarC.style.opacity = 1;
   }
   scrollBar.style.height = `${window.innerHeight/body.offsetHeight*100}%`; 
}
Resize();

//Update ScrollBar
function Update(){
   var body=document.querySelector('body');
   scrollBar.style.top =`${window.pageYOffset/body.offsetHeight*100}%`; 
}

var scrollBar=document.querySelector('.scroll');
window.addEventListener('scroll', function() {
   var body=document.querySelector('body');
   scrollBar.style.top =`${window.pageYOffset/body.offsetHeight*100}%`; 
});

var isDraggingY = false;
scrollBar.addEventListener("mousedown", function (e) {
   e.preventDefault();
   scrollBar.requestPointerLock();
   isDraggingY = true;
});
document.addEventListener("mousemove", function (e) {
   e.preventDefault();
   if (isDraggingY == true) {
       if (e.movementY === 0) {
           return;
       }
       const scrollStep = 10;

   }
   Update();
});
scrollBar.addEventListener("mouseup", function (e) {
   e.preventDefault();
   document.exitPointerLock();
   isDraggingY = false;
});





// 在MyList.js中添加以下代码


var Name;
document.addEventListener('click', e => {
   if (e.target.classList.contains('de')) {
       console.log(e.target.closest('li').querySelector('.music-name').textContent);
       e.target.closest('li').remove();
   } else {
       const btn = e.target.closest('[data-action="edit"]'); // 修改选择器
       if (!btn) return;
       const li = e.target.closest('li');

       var tmp=new Array();
       li.querySelectorAll('.tag').forEach(tag=> {
           if(typeof tag !=undefined ){
               tmp.push(tag.innerHTML);
           }
       });
       // 获取视频信息
       const songData = {
           name: li.querySelector('.music-name').textContent,
           albumArt: li.querySelector('.album-cover').src,
           tags:tmp
       };
       Notrrans=0;
       console.log(songData.filePath);
       Name=li.querySelector("a").id;
       console.log(Name);
       // 调用编辑器
       showMusicEditor(songData);
   }
});
var tags = [];
function showMusicEditor(songData){
   document.querySelector('#song-name').value=songData.name;
   document.querySelector('.Dea').src = songData.albumArt;
   base64Data=songData.albumArt;
   if (songData.tags.length > 0) {
       document.querySelectorAll('.tag-container .delete-btn').forEach(deleteBtn => {
           deleteBtn.parentElement.remove(); // 只删除标签本身
       });
       songData.tags.forEach(tagText => {
           if(tagText==" "||tagText==""){return;}
           const newTag = document.createElement('div');
           newTag.className = 'tag';
           newTag.innerHTML = `${tagText}<span class="delete-btn">×</span>`;
           tagContainer.insertBefore(newTag, addBtn);
           tagInput.value = '';
           tagForm.classList.add('hideS');
           bindDeleteEvent(); // 新增标签后重新绑定事件
       });
       checkTagCount(); 
   }
}

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
       Notrrans=0;
       li.classList.remove('swiped');
   });

   document.addEventListener('mousemove', e => {
       if (!isSwiping || !currentLi) return;
       
       const deltaX = e.clientX - touchStartX;
       
       // 只允许左滑
       if (deltaX < -30) {
           Notrrans=1;
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

   

   // 按钮点击处理
   // 修改后的编辑按钮点击事件
document.addEventListener('click', e => {
   const btn = e.target.closest('.edit-btn');
   if (!btn) return;
   
   // 强制显示主编辑弹窗
   document.querySelector('.bian-ji').classList.remove('hide');
   document.querySelector('.bian-ji').classList.add('active');

   // 确保其他弹窗关闭
   document.querySelector('.editor-container').classList.add('hide');
});
}

function resetAllItems() {
   document.querySelectorAll('.lie-biao li').forEach(li => {
       li.classList.remove('swiped');
   });
}










       
   document.addEventListener('DOMContentLoaded', () => {
   // 弹窗显示
   document.addEventListener('click', (e) => {
       if (e.target.closest('.edit-btn')) {
           document.querySelector('.bian-ji').classList.add('active');
       }
   });

   


   document.querySelector('.close-btnn').addEventListener('click', () => {
       // 完全隐藏主编辑弹窗
       document.querySelector('.bian-ji').classList.add('hide');
       document.querySelector('.bian-ji').classList.remove('active');
   });
   });




 






       
const cover = document.getElementById('album-cover-local');
const fileInput = document.getElementById('file-input-local');

cover.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function(e) {
   const file = e.target.files[0];
   if (file) {
       const reader = new FileReader();
       reader.onload = function(event) {
           base64Data = reader.result;
           const img = new Image();
           img.src = event.target.result;

           img.onload = () => {
               cover.querySelector('img')?.remove();
               cover.appendChild(img);
           }
       }
       reader.readAsDataURL(file);
   }
});


// 新增针对在线编辑器弹窗的封面处理
const editorCover = document.getElementById('album-cover-editor');


// 绑定点击事件
editorCover.addEventListener('click', () => editorFileInput.click());




















// 标签系统
var tagsContainer = document.querySelector('.tags-container');


tagsContainer.addEventListener('click', e => {
   if(e.target.closest('#add-tag')) {
       if(tags.length >= 2) return alert('最多只能添加2个标签');
       
       const newTag = prompt('请输入标签（最多3个字）:');
       if(newTag && newTag.length <= 3) {
           tags.push(newTag);
           renderTags();
       }
   }
   
   if(e.target.closest('.remove-btn')) {
       const tagItem = e.target.closest('.tag-item');
       const tagText = tagItem.firstChild.textContent.trim();
       tags = tags.filter(t => t !== tagText);
       renderTags();
   }
});

function renderTags() {
   console.log(tags);
   tagsContainer.innerHTML = tags.map(tag => `
       <div class="tag-item">
           ${tag}
           <svg class="remove-btn" viewBox="0 0 24 24">
               <path d="M18 6L6 18M6 6l12 12"/>
           </svg>
       </div>
   `).join('') + `<div class="add-tag" id="add-tag">+ 添加标签</div>`;
}
var base64Data;
// 自动提交功能
function submitData() {
   
   document.querySelectorAll(".bian-ji .tag").forEach(tag => {
       tags.push(tag.textContent);
   });

   const fullData = {
       action: "UpdateMetaV",
       timestamp: Date.now(),
       Meta: {
           prename:Name,
           name: document.querySelector('.bian-ji #song-name').value,
           pic:base64Data,
           tags: tags,
       }
   };
   document.querySelector(".Loc").innerHTML="提交中";
   ws.send(JSON.stringify(fullData));
   tags=[];
}
var Lyric;

function Expand(){
   var el =document.querySelector(".sub")
   el.style.height = "160px"
}





var Lyric;

var parsedLyrics;
function initScrollEffect() {
    const list = document.getElementById("My");
    let items = list.querySelectorAll('li'); // 重新获取动态生成的li元素
    let currentIndex = 0;

     
// 新增：视口中心位置计算
const viewportCenter = window.innerHeight / 2;
// 新增：实时更新歌词行模糊和透明度
function updateBlurAndOpacity() {
    items
.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);
        const maxDistance = viewportCenter * 0.8; // 控制最大影响距离

        // 动态计算模糊和透明度
        const blurValue = Math.min(8, (distance / maxDistance) * 8); // 最大模糊8px
        const opacityValue = Math.max(0.3, 1 - (distance / maxDistance)); // 最小透明度0.3

        item
.style.filter = `blur(${blurValue}px)`;
        item
.style.opacity = opacityValue;
    });
}

// 新增：监听滚动事件
window
.addEventListener('scroll', () => {
    requestAnimationFrame(updateBlurAndOpacity); // 优化性能
});

// 初始化时调用一次
updateBlurAndOpacity();

    // 初始化样式
    items.forEach(item => {
        item.style.filter = 'blur(2px)';
        item.style.transition = 'all 0.4s';
    });
    if(items.length > 0) {
        items[currentIndex].style.filter = 'none';
        items[currentIndex].style.transform = 'scale(1.2)';
    }

    // 滚轮事件监听
    window.addEventListener('wheel', handleWheel);
    
    // 点击事件监听
    list.addEventListener('click', handleClick);

    function handleWheel(event) {
        event.preventDefault();
        if (event.deltaY > 0) {
            scrollToNextItem();
        } else {
            scrollToPrevItem();
        }
    }

    function handleClick(event) {
        if (event.target.tagName === 'LI') {
            const clickedIndex = Array.from(items).indexOf(event.target);
            const steps = clickedIndex - currentIndex;
            if(steps > 0) {
                for(let i=0; i<steps; i++) scrollToNextItem();
            } else {
                for(let i=0; i<Math.abs(steps); i++) scrollToPrevItem();
            }
        }
    }

    function scrollToNextItem() {
        if(currentIndex >= items.length -1) return;
        updateItemStyle(currentIndex, false);
        currentIndex++;
        updateItemStyle(currentIndex, true);
        smoothScrollToItem(items[currentIndex]);
    }

    function scrollToPrevItem() {
        if(currentIndex <= 0) return;
        updateItemStyle(currentIndex, false);
        currentIndex--;
        updateItemStyle(currentIndex, true);
        smoothScrollToItem(items[currentIndex]);
    }

    function updateItemStyle(index, isActive) {
        items[index].style.transform = isActive ? 'scale(1.2)' : 'scale(1)';
        items[index].style.filter = isActive ? 'blur(0)' : 'blur(2px)';
        items[index].style.marginLeft = isActive ? '50px' : '0';
    }


        

        
    // }
    function smoothScrollToItem(item) {
        const itemRect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        window.parent.Jmp2(item.id);
        // 计算理想居中位置
        const targetScrollTop = item.offsetTop - (windowHeight/2) + (itemRect.height/2);
        
        // 计算最大允许滚动位置
        const maxScroll = documentHeight - windowHeight;
        
        // 确保不超出文档范围
        window.scrollTo({
            top: Math.min(targetScrollTop, maxScroll),
            behavior: 'smooth'
        });
    }
}

function SetColor(colors){
    document.getElementById('My').querySelectorAll("li").forEach(item => {
        item.style.color =  `rgba(${colors.complementaryColor[0]},${colors.complementaryColor[1]},${colors.complementaryColor[2]},1)`;
    });
}
 
function parseLrc(lrc) {
    if(!lrc || lrc === '') {return;}
    const lines = lrc.split('\n');
    const lyricList = [];

    for (let line of lines) {
        const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2}))?]/g;
        const matches = [...line.matchAll(timeRegex)];
        const text = line.replace(timeRegex, '').trim();

        if (text) {
            for (let match of matches) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = match[3]? parseInt(match[3], 10) : 0;
                const timestamp = minutes * 60 + seconds + milliseconds / 100;

                lyricList.push({
                    timestamp: timestamp,
                    text: text
                });
            }
        }
    }
    
    lyricList.sort((a, b) => a.timestamp - b.timestamp);
    return lyricList;
}

function TransLric(lyrics){
      // 清空现有内容
   
    const list = document.getElementById('My');

    if(lyrics=="404"){
        list.innerHTML = '';
        var li = document.createElement('li');
        li.textContent = "暂无歌词";
        list.appendChild(li);
        return;
    }
    list.innerHTML = '';
    parsedLyrics = parseLrc(lyrics);
 
 

            
      // 插入新歌词
      parsedLyrics.forEach(line => {
          var li = document.createElement('li');
          li.textContent = line.text;
          li.id=line.timestamp;
          // 处理空行（原文件中的<br>）
          if(line === '') {
              li.innerHTML = '<br>';
          }
          list.appendChild(li);

      });

    initScrollEffect(); 
}
document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            break;}});
// 原有代码保持不变，新增以
function UpdateLric(currentTime) {
    if (!parsedLyrics || parsedLyrics.length === 0) {
        return;
    }
// 找到最接近当前时间的歌词行
    let closestLine = null;

    parsedLyrics.forEach(line => {

    if (line.timestamp-currentTime <=0.5) {
        closestLine = line;
    }
    });

    // 如果找到了接近的歌词行，滚动到该行
    if (closestLine) {
    const listItems = document.querySelectorAll('#My li');
    listItems.forEach((item, index) => {
        item.style.transform ='scale(1)';
        item.style.filter = 'blur(2px)';
        item.style.marginLeft ='0';
        if (parsedLyrics[index].timestamp === closestLine.timestamp) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            item.style.transform ='scale(1.2)';
            item.style.filter = 'blur(0px)';
            item.style.marginLeft ='50';
            return;
        }
    });
    }
}

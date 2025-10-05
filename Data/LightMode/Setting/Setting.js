const ws = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
var Setting;
ws.onopen = () => {
    ws.send("Settings");}
ws.onmessage = (event) => {
    if(JSON.parse(event.data).action=="Setting"){
        Setting=JSON.parse(event.data);
        UpdateSett();
        return;
    }
}
var Balance=0;
var subitem= document.querySelectorAll('.subitem');
subitem.forEach(function(item){
    item.addEventListener('click', function () {
        item.classList.add('activeS');
        subitem.forEach(function (otherItem) {
            if (otherItem !== item) {
                otherItem.classList.remove('activeS');
            }
        });
    });
});

function UpdateSett(){
     
    if(Setting.GPUBoost=="1"){document.querySelector('.GPUBoost').checked = true;}
    else{document.querySelector('.GPUBoost').checked = false;}

    if(Setting.History=="1"){document.querySelector('.History').checked = true;}
    else{document.querySelector('.History').checked = false;}
 
    
    if(Setting.Logs=="1"){document.querySelector('.Log').checked = true;}
    else{document.querySelector('.Log').checked = false;}

    if(Setting.VolumeBalance=="1"){document.querySelector('.SoundBalance').checked = true;}
    else{document.querySelector('.SoundBalance').checked = false;}
 

    subitem.forEach(function (otherItem) {
        otherItem.classList.remove('activeS');
    });
    
    switch(Setting.VolumeEffect){
        case '0':
            Reset();
            
        
            break;
        case '1':
            Low();
       
          
            break;
        case '2':
            High();
           
      
            break;
        case '3':
            Voval();
      
          
            break;
        
    }
    document.querySelector('.Pau').textContent=Setting.QuickPause;
    document.querySelector('.VU').textContent=Setting.QuickVolumeU;
    document.querySelector('.VD').textContent=Setting.QuickVolumeD;
    document.querySelector('.VL').textContent=Setting.QuickBacks;
    document.querySelector('.VR').textContent=Setting.QuickForward;
    
    var silder1 = document.getElementById('leftSlider');
    var VL=Setting.VolumeLeft;
    silder1.value = VL/2*100+50;
    updateSlider(silder1);
}
 
document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            break;}});
// 原有代码保持不变，新增以
// 页面切换逻辑
function showPage(targetClass) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.querySelector(`.${targetClass}`);

    // 添加离开动画
    currentPage.classList.add('leave');
    currentPage.classList.remove('active');

    // 显示目标页面
    targetPage.classList.add('active');
    targetPage.classList.remove('settings-page');
}

// 返回逻辑
function goBack() {
    const currentPage = document.querySelector('.page.active');
    const mainMenu = document.querySelector('.main-menu');

    // 当前页面向右滑出
    currentPage.classList.add('settings-page');
    currentPage.classList.remove('active');

    // 主菜单从左侧滑入
    mainMenu.classList.remove('leave');
    mainMenu.classList.add('active');
}

// 绑定菜单点击事件
document.querySelectorAll('.lb[data-target]').forEach(item => {
    item.addEventListener('click', () => showPage(item.dataset.target));
});

// 绑定返回按钮
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', goBack);
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
        if(this.nextElementSibling){
            this.nextElementSibling.classList.toggle('hide');
        }
    
    });
});
var TheB=false;
function Hides(){
    if(TheB){
        document.querySelector(".BGS").style.display = "flex";
        TheB=false;
    }
    else{
        document.querySelector(".BGS").style.display = "none";
        TheB=true;
    }
}
document.querySelectorAll('.shortcut-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // 阻止事件冒泡到父元素
        if (e.target.tagName === 'INPUT') return;
        
        const inputContainer = this.querySelector('.shortcut-input-container');
        const displaySpan = this.querySelector('.shortcut-display');
        const input = inputContainer.querySelector('input');

        // 切换显示状态
        displaySpan.style.display = 'none';
        inputContainer.style.display = 'block';
        input.focus();
    });
});
function SubAll(){
    var Quick="";
    document.querySelectorAll('.shortcut-display').forEach(input => {
        Quick=Quick+input.textContent+"|";
    });
    ws.send(JSON.stringify({"action":"QuickUpdate","List":Quick}));
    
}
document.querySelectorAll('.shortcut-input').forEach(input => {
    // 阻止点击输入框时触发父元素点击事件
    input.addEventListener('click', e => e.stopPropagation());

    input.addEventListener('blur', saveShortcut);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') saveShortcut(e);
    });
});

function saveShortcut(e) {
    const input = e.target;
    const shortcutValues = Array.from(document.querySelectorAll('.shortcut-input')).map(input => input.value.trim());
    const hasDuplicate = shortcutValues.filter(value => value && shortcutValues.indexOf(value) !== shortcutValues.lastIndexOf(value)).length > 0;
    const displaySpan = input.closest('.shortcut-item').querySelector('.shortcut-display');
    if (hasDuplicate) {
        window.top.Alert('快捷键值不能重复，请重新设置。');
        input.value = displaySpan.textContent;
          // 失去焦点时保持显示
        input.parentElement.style.display = 'none';
        displaySpan.style.display = 'block';
        return;
    }

    displaySpan.textContent = input.value;
    // 失去焦点时保持显示
    input.parentElement.style.display = 'none';
    displaySpan.style.display = 'block';

    // 空值恢复之前状态
    if (!input.value.trim() || hasDuplicate) {
        input.value = displaySpan.textContent;
    }
    window.top.ChangeK(input.classList[1],input.value);

}

document.querySelectorAll('.shortcut-input').forEach(input => {
    input.addEventListener('keydown', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const modifiers = [];
        let key = event.key;

        // 处理修饰键
        if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl');
        if (event.shiftKey) modifiers.push('Shift');
        if (event.altKey) modifiers.push('Alt');

        // 过滤单独按下的修饰键
        if (['Control', 'Shift', 'Alt'].includes(key)) {
            key = '';
        }

        // 单独处理回车键
        if (event.key === 'Enter') {
            // 获取当前已构建的快捷键（排除回车）
            const currentShortcut = this.value;
            if (currentShortcut) {
                // 同步到显示区域并保存
                saveShortcut(event);
            }
            return;
        }

        // 过滤纯修饰键和回车
        if (['Enter', 'Control', 'Shift', 'Alt'].includes(key)) return;

        // 处理特殊键名
        const keyMap = {
            ' ': 'Space',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→'
        };
        key = keyMap[key] || key;

        // 构建组合键
        let shortcut = '';
        if (modifiers.length > 0) {
            shortcut = modifiers.join('+');
            if (key) {
                shortcut += `+${key}`;
            }
        } else {
            shortcut = key;
        }

        // 更新输入框和显示区域
        this.value = shortcut;
    });
});


// 阻止子菜单中input点击事件冒泡
document.querySelectorAll('.submenu input').forEach(input => {
    input.addEventListener('click', e => e.stopPropagation());
});





// 修改后的 IP 输入验证
document.querySelector('.cxx1[type="text"]').addEventListener('input', function(e) {
    const value = e.target.value;
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // 新增：清空时不验证
    if (value === "") {
        e.target.setCustomValidity('');
        e.target.style.border = "";
        return;
    }

    if(!ipPattern.test(value)) {
        e.target.setCustomValidity('无效的IPv4地址');
        e.target.style.border = "solid 2px rgba(122, 38, 38, 0.61)";
     
    } else {
        e.target.setCustomValidity('');
        e.target.style.border = "";
    }
});

// 修改后的端口输入验证
document.querySelector('.cxx2').addEventListener('input', function(e) {
    const value = e.target.value;
    const portPattern = /^[1-9]\d{3}$/;
    
    // 新增：清空时不验证
    if (value === "") {
        e.target.setCustomValidity('');
        e.target.style.border = "";
        return;
    }

    if(!portPattern.test(value)) {
        e.target.setCustomValidity('端口号必须为 4 位数字');
        e.target.style.border =  "solid 2px rgba(122, 38, 38, 0.61)";
    } else {
        e.target.setCustomValidity('');
        e.target.style.border = "";
    }
});

function Reset(){
    document.querySelector('.Defa').classList.add('activeS');
    window.top.ClearUpVocals();
    if(!ws.readyState==ws.OPEN){return;}
    ws.send('V0');
}
function Low(){
    document.querySelector('.LowS').classList.add('activeS');
    window.top.setupBassBoost();
    if(!ws.readyState==ws.OPEN){return;}
    ws.send('V1');
}
function High(){

    document.querySelector('.HighS').classList.add('activeS');
    window.top.setupTrebleBoost();  
    if(!ws.readyState==ws.OPEN){return;}
    ws.send('V2');
}
function Voval(){

    document.querySelector('.VocS').classList.add('activeS');
    window.top.setupClearVocals();
    if(!ws.OPEN){return;}
    ws.send('V3');
}

function SetLVolume(Vol){
    window.top.setVolumeBalance(Vol);
}
// 新增：点击确定按钮时的验证
document.querySelector('.qdan').addEventListener('click', function(e) {
    // 获取输入框元素
    const ipInput = document.querySelector('.cxx1');
    const portInput = document.querySelector('.cxx2');
    
    // 强制触发实时验证更新
    ipInput.dispatchEvent(new Event('input'));
    portInput.dispatchEvent(new Event('input'));
    
    // 检查是否有红色边框（表示验证失败）
    const hasIPError = ipInput.style.border.includes('red');
    const hasPortError = portInput.style.border.includes('red');
    
    // 如果有任意错误则弹出警告
    if (hasIPError || hasPortError) {
        alert('输入内容不符合要求，请检查后重试！');
        e.preventDefault(); // 阻止默认行为
        return false;
    }
    
    // 此处添加原本的保存逻辑...
});

function Bg(e){
    console.log(e);
    if(ws.readyState==ws.OPEN){
    ws.send("BG"+e.toString());}
   window.top.SetBg(e);
}

function Toggle(){
    Balance=Balance?0:1;
    window.top.SoundBalance(Balance);
    ws.send("SoundBalance");
}

const sliders = document.querySelectorAll('.slider');

function updateSlider(slider) {
    var value = slider.value;
    const progress = (value / 100) * 100;
    // 使用CSS变量动态更新进度
    slider.style.setProperty('--progress', `${progress}%`);
    if(slider.id=="leftSlider"){
        volume=value/100;
        document.getElementById("rightSlider").value=100-value;
        document.getElementById("rightSlider").style.setProperty('--progress', `${((100-value) / 100) * 100}%`);
        value-=50;
        SetLVolume(value/100*2);
    }
    else{
        volume=value/100*-1;
        document.getElementById("leftSlider").value=100-value;
        document.getElementById("leftSlider").style.setProperty('--progress', `${((100-value) / 100) * 100}%`);
        value-=50;
        SetLVolume((value*-1)/100*2);
    }
}


// 左声道事件监听
document.getElementById('leftSlider').addEventListener('input', (e) => {
    updateSlider(e.target);
});
document.getElementById('leftSlider').addEventListener('mouseup', (e) => {
    let slider =document.getElementById('leftSlider');
    console.log("SendedVolume");
    ws.send(JSON.stringify({"action":"VolumeLeft","data":((slider.value-50)/100*2).toString()}));

});
document.getElementById('rightSlider').addEventListener('mouseup', (e) => {
    let slider =document.getElementById('leftSlider');
    ws.send(JSON.stringify({"action":"VolumeLeft","data":((slider.value-50)/100*-1*2).toString()}));
 
});
// 右声道事件监听
document.getElementById('rightSlider').addEventListener('input', (e) => {
    updateSlider(e.target);
});

 

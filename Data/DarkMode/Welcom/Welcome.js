document.querySelector('.s2 img').addEventListener('click', function() {
    document.querySelector('.le').style.opacity = '0';
    // 修改为 flex 布局显示
    document.querySelector('.DL').style.display = 'flex'; // 关键修改！
    setTimeout(() => {
        document.querySelector('.le').style.display = 'none';
        document.querySelector('.DL').style.opacity = '1';
    }, 500);
});
document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            break;}});
// 原有代码保持不变，新增以下内容
         // 头像上传逻辑
         const avatarInput = document.getElementById('avatar-input');
         const avatarPreview = document.getElementById('avatar-preview');
         const uploader = document.querySelector('.avatar-uploader');
 
         // 点击上传区域触发文件选择
         uploader.addEventListener('click', () => avatarInput.click());
 
         // 文件选择变化处理
         avatarInput.addEventListener('change', function(e) {
             const file = e.target.files[0];
             if (!file) return;
 
             if (!file.type.startsWith('image/')) {
                 Alert('请选择图片文件');
                 return;
             }
 
             const reader = new FileReader();
             reader.onload = (e) => {
                 avatarPreview.src = e.target.result;
                 Res=e.target.result;
             };
             reader.readAsDataURL(file);
         });

var alerted=document.querySelector(".alertBox");
var ContentA=document.querySelector(".ContentA");
function Alert(things){
    alerted.style.opacity=1;
    alerted.style.pointerEvents="all";
    ContentA.innerHTML=things;
}
function AletFinish(){
    alerted.style.opacity=0;
    alerted.style.pointerEvents="none";
}
 
var Res;
  // 开始界面.js 新增部分
document.querySelector('.qy').addEventListener('click', handleSubmit);
const ws = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
ws.onopen = () => {
    console.log('Connected to server');
    
};
ws.onmessage = (event) => {
 
};
ws.onclose = () => {
     
};
function handleSubmit() {
    const username = document.querySelector('.mzz input').value.trim();
    const avatarFile = document.getElementById('avatar-input').files[0];

    // 简单验证
    if (!username) {
        Alert('请输入您的名称');
        return;
    }
    if (!avatarFile) {
        Alert('请选择头像');
        return;
    }
 
        console.log(Res);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({"action":"UserInfo","Name":username,"Avatar":Res}));
            
           
   
        } 
    try {
        // 添加加载状态
        const confirmBtn = document.querySelector('.qy');
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.7';

     

        if (!response.ok) throw new Error('上传失败');
  
        
    } catch (error) {
 
    } finally {
        const confirmBtn = document.querySelector('.qy');
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        // 新增重置文件输入

    }
}

// 新增：允许回车键提交
document.querySelector('.mzz input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});




var alerted=document.querySelector(".alertBox");
var ContentA=document.querySelector(".ContentA");
function Alert(things){
    alerted.style.opacity=1;
    alerted.style.pointerEvents="all";
    ContentA.innerHTML=things;
}
function AletFinish(){
    alerted.style.opacity=0;
    alerted.style.pointerEvents="none";
}
 
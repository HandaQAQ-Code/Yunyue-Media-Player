    // 模拟数据
    var Tes=false;
    var mockData = {
    };
    const ws = new WebSocket('ws://localhost:9005'); 
    ws.onopen = () => {
        console.log('Recommand');
        ws.send('Recommand');
    }
    ws.onmessage = (event) => {
        console.log(event.data);
        if(event.data=="NoneRec"){
            Tes=true;
            mockData = {
                CoverPicture: "../BackDrop/UnknD.png",
                musicName: "暂无推荐",
                author: "先播放点什么吧",
            };
            loadMusicData();
        }
       if(JSON.parse(event.data).action == "RecommandB"){
        Tes=false;
        mockData = JSON.parse(event.data);

        loadMusicData();
    }
    }
    ws.onclose = () => {
        console.log('Disconnected from server');
    }
    // 动态数据加载函数
    function loadMusicData() {
        // 使用模拟数据更新DOM元素
        document.getElementById('cover-picture').src = mockData.CoverPicture?mockData.CoverPicture:"../BackDrop/UnknD.png";
        document.getElementById('music-name').textContent = mockData.musicName;
        document.getElementById('author').textContent = mockData.author;
        document.querySelector('.zt').textContent = mockData.description;
    }

    // 元素定位函数
    function updateXAPosition() {
        const img = document.querySelector('#album-cover');
        const xa = document.querySelector('.xa');
        if(img && xa) {
            xa.style.top = `${img.offsetTop + img.offsetHeight + 20}px`;
        }
    }

    // 初始化
    window.addEventListener('DOMContentLoaded', () => {
        loadMusicData();
        updateXAPosition();
    });
function Play(){

    if(Tes){
        return;
    }
    const playMessage = {
        action: "PlayMusic",
        name: mockData.url
    };
    console.log(mockData);
    window.top.AddPlay(mockData.url, mockData.musicName);
    ws.send(JSON.stringify(playMessage));
}
    // 响应窗口尺寸变化
    window.addEventListener('resize', updateXAPosition);


    document.addEventListener('keydown', function (event) {

        switch (event.key) {
            case 'Tab':
                event.preventDefault();
                break;}});


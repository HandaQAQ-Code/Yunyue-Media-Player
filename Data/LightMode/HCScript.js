const Hide = document.getElementsByClassName("Hide");
const Side = document.getElementsByClassName("Side");
const User = document.querySelector(".UserInfo h1");
const Ifno = document.querySelector(".UserInfo");
const li = document.querySelectorAll(".Side li");
var progressB = document.querySelector('.ProgressB');
var Cov=document.querySelector('.leftI');
var cover=document.querySelector('.cover');
var audio=document.querySelector('audio');
var FullMode=document.querySelector(".FullMode");
var curTime;
var Duration;
var PlaySr;
var hids = 0;
var Fast='ArrowRight';
var Back2='ArrowLeft';
var PauseK=' ';
var VolumeU='ArrowUp';
var VolumeD='ArrowDown';
const keyMap = {
    '↑': 'ArrowUp',
    '↓':'ArrowDown' ,
    '←':'ArrowLeft' ,
    '→':'ArrowRight',
};
var Per=0;
var CurrentPosition=0;
var PlayList=new Array();
var PlayListFake=new Array();
var flag=1;
var Contr = document.querySelector(".pd");
var currentPlay=0;//0=audio,1=video
var Cd=document.querySelector(".Cd");
var video=document.querySelector(".video");
var vc=document.querySelector(".volume-container");
var Control=document.querySelector(".Control");
var zt=document.querySelector(".zt");
var GTimer;
var CurrVolume=1;
var SearchB=document.querySelector(".searchBar");
var SearchM=document.querySelector(".SearchB");
var ListN=document.querySelector(".ListN");
var setting;
var NextPl=document.querySelector(".NextPl");
var NPR;
var ControlUp = document.querySelector(".ControlUp");
const ws = new WebSocket('ws://localhost:9005'); // 与Qt服务器端口一致
const videoserver = new WebSocket('ws://localhost:9006'); // 与Qt服务器端口一致
function clear(){
    PlayList=[];
    PlayListFake=[];
    CurrentPosition=0;
    RefreshNow();
}
function Video(el){

    videoserver.send(el);
    console.log(el);
}

function AddPlay(el,na){
    PlayList=[];
    PlayListFake=[];
    document.querySelector(".MyPlayList h1").innerHTML=`正在播放<br>${na}`
    NPR=el;
    GUID=NPR;
    RefreshNow();
}
function GetNow(){
    return NPR;
}
window.addEventListener("DOMContentLoaded",function(){
    document.querySelector(".TransPort").style.opacity="0";
document.querySelector(".TransPort").style.pointerEvents="none";
});
function ChangeMD(){
    document.querySelector(".TransPort").style.opacity="1";
    document.querySelector(".TransPort").style.pointerEvents="all";
}
function RefreshNow() {
    NextPl.innerHTML=''
    PlayListFake.forEach((song,index) => {
        if(index >= CurrentPosition){
            const songItem = document.createElement('div');
            songItem.id=index;
            songItem.classList.add('SongLis');
            if(index==CurrentPosition){
                songItem.classList.add('Songact');
            }
            songItem.addEventListener('click',function(){
                Loading();
                CurrentPosition=this.id;
                CurrentPosition=CurrentPosition%PlayList.length;
                var nextSong=PlayList[CurrentPosition];
                if(currentPlay==0){
                    var playMessage = {
                        action: "PlayMusic",
                        name: nextSong,
                    };
                }
                else{
                    var playMessage = {
                        action: "PlayVideo",
                        name: nextSong,
                    };
                }
                ws.send(JSON.stringify(playMessage));
                videoserver.send(JSON.stringify(playMessage));
            })
            songItem.innerHTML=song;
            NextPl.appendChild(songItem);
        }
    });
}
var LL,En;
En=true;
videoserver.onopen = () => {

    ws.send("Settings");
};
ws.onopen = () => {
    log('Connected to server');
    sendMessage();
    ws.send("Settings");
};


videoserver.onmessage=(ev)=>{
    console.log(ev.data);
    if(ev.data=="VideoDis"){
        Loaded();
        Alert("视频不存在");
        video.pause();
        video.src="";
        return;
    }
    if(ev.data=="VideoOverSize"){
        Loaded();
        Alert("视频过大");
        video.pause();
        video.src="";
        return;
    }
    if (typeof ev.data === 'string') {
        const info = JSON.parse(ev.data);

    }
    if (ev.data instanceof Blob) {

            PlayClickV(ev.data);
            audio.pause();
            RefreshNow();
            Loaded();
            return;


    }

}
ws.onmessage = (event) => {


    if(event.data=="VideoDis"){
        Loaded();
        return;
    }
    if(event.data=="MusicDis"){
        Loaded();
        audio.pause();
        audio.src="";
        Alert("音乐不存在")
        return;
    }
    if(event.data=="Backto"){
        document.querySelector('body').style.webkituserd
        document.querySelector('.cover').style.opacity="0";
        document.querySelector('.cover').style.zIndex="-10";
        Main.style.transform="translateY(0)";
        Main.style.display="flex";
    }
    if(event.data=="Coming"){
        Main.style.display="none";
    }
    if(event.data=="Justify"){
        document.querySelector('.cover').style.zIndex="2000";
        document.querySelector('.cover').style.opacity="1";

        cover.innerHTML=`<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 24C4 35.0457 12.9543 44 24 44V44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36V36" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <div class="Inform">
                    <h1 id="NameI">边界调整中</h1>
                </div>`
        document.querySelector('.cover').style.transition="all 0s";
        return;
    }
    if(event.data=="FinishJ"){
       document.querySelector('.cover').style.transition="all 0.4s";
        document.querySelector('.cover').style.zIndex="2000";
        document.querySelector('.cover').style.opacity="0";

        cover.innerHTML=`<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#ffffff" stroke-width="4"/><path d="M26 14V28" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 28.6655C14 26.6411 15.9341 25 18.32 25H26V29.3345C26 31.3589 24.0659 33 21.68 33H18.32C15.9341 33 14 31.3589 14 29.3345V28.6655Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/><path d="M32 15L26 14" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="Inform">
            <h1 id="NameI">松开鼠标</h1>
            <h1>播放文件</h1>
        </div>`
        return;
    }
    if (event.data instanceof Blob) {
        currentPlay=0;
        console.log("Music");
        PlayClick(event.data);
        video.pause();
        RefreshNow();

        return;


    }

    if(JSON.parse(event.data).action=="Setting"){
        setting = JSON.parse(event.data);
        document.querySelector(".Head").src=setting.Avatar;
        document.querySelector(".User").innerHTML=setting.Name;
        SetBg(parseInt(setting.CustomBG));
        console.log(setting);
        audio.volume=parseFloat(setting.Volume);
        video.volume=audio.volume;
        document.querySelector(".volume-progress").style.width=`${setting.Volume*100}%`;
        if(setting.VolumeBalance=="1"){Balance=1;SoundBalance();}
        switch(setting.VolumeEffect){
            case '0':
                ClearUpVocals();
                break;
            case '1':
                setupBassBoost();

                break;
            case '2':
                setupTrebleBoost();

                break;
            case '3':
                setupClearVocals();
                break;

        }
        PauseK=keyMap[setting.QuickPause]||setting.QuickPause;

        VolumeU=keyMap[setting.QuickVolumeU]||setting.QuickVolumeU;
        console.log(VolumeU);
        VolumeD=keyMap[setting.QuickVolumeD]||setting.QuickVolumeD;
        Back2=keyMap[setting.QuickBacks]||setting.QuickBacks;
        Fast=keyMap[setting.QuickForward]||setting.QuickForward;
        setVolumeBalance(parseInt(setting.VolumeLeft));

        return;
    }
    if (JSON.parse(event.data)[0].action == "MusicListsL") {
        document.querySelector('.PlayList').innerHTML='';
        JSON.parse(event.data).forEach(element => {
            if(element.name!=""&&element.name!=" "){
                const songItem = document.createElement('div');
                songItem.classList.add('Def');
                songItem.innerHTML=element.name;

                if(element.include=='1'){
                    songItem.classList.add('Added');
                }
                if(currentPlay==0){
                    songItem.addEventListener('click',function(){

                        ws.send(JSON.stringify({"action":"AddMTL","name":NPR,"List": this.innerHTML}));
                    });
                    document.querySelector('.PlayList').appendChild(songItem);
                }
                else{
                    songItem.addEventListener('click',function(){
                        ws.send(JSON.stringify({"action":"AddVTL","name":NPR,"List": this.innerHTML}));
                    });
                    document.querySelector('.PlayList').appendChild(songItem);
                }
            }
        });
        return;
    }

    if(JSON.parse(event.data)[0].action=="PlayMusicB"){

        var tmp=JSON.parse(event.data)[0];
        console.log(tmp);
        Title=tmp.name;
        Artist=tmp.artist;
        Album=tmp.album;
        console.log("MetadS");

        if(tmp.Lyrics!="" ){
            window.frames["childPage"].LyricsTrans(tmp.Lyrics);
            LL=true;
        }
        else{
            LL=false;
        }
        if(tmp.img==""){
            PlaySr="./BackDrop/UnKnD.png";
        }
        else{
            PlaySr=tmp.img;
        }
        document.querySelector(".MyPlayList h1").innerHTML=`正在播放<br>${tmp.name}`
        return;
    }
    if(JSON.parse(event.data)[0].action=="PlayMusicV"){
        var tmp=JSON.parse(event.data)[0];
        Title=tmp.name;
        if(tmp.img==""){
            PlaySr="./BackDrop/UnKnD.png";
        }
        else{
            PlaySr=tmp.img;
        }
        if(PlaySr){
            Plas(PlaySr);
        }
        else{
            Plas(404);
        }

        document.querySelector(".MyPlayList h1").innerHTML=`正在播放<br>${tmp.name}`
        return;
    }

    if(JSON.parse(event.data)[0].action=="MusicPL"){
        currentPlay=0;
        PlayList=[];
        console.log(event.data);
        JSON.parse(event.data)[1].forEach(element => {
            if(element!=""&&element!=" "){
                PlayList.push(element);
            }
        });
        JSON.parse(event.data)[2].forEach(element => {
            if(element!=""&&element!=" "){
                PlayListFake.push(element);
            }
        });
        CurrentPosition=0;
        const playMessage = {
            action: "PlayMusic",
            name: PlayList[0],
        };

        ws.send(JSON.stringify(playMessage));

    }
    if(JSON.parse(event.data)[0].action=="VideoPL"){
        currentPlay=1;
        PlayList=[];
        JSON.parse(event.data)[1].forEach(element => {
            if(element!=""&&element!=" "){
                PlayList.push(element);
            }
        });
        JSON.parse(event.data)[2].forEach(element => {
            if(element!=""&&element!=" "){
                PlayListFake.push(element);
            }
        });
        CurrentPosition=0;
        const playMessage = {
            action: "PlayVideo",
            name: PlayList[0],
        };
        videoserver.send(JSON.stringify(playMessage));
        ws.send(JSON.stringify(playMessage));

    }
};
ws.onclose = () => {
    log('Connection closed');
};
var Get=false

function sendMessage() {
    const message = "Hello World";
    ws.send(message);
    log('Sent: ' + message);
}
function log(text) {
    console.log(text);
}
function sendMusicMetaJson(name,singer,album,duration,tags,Pic,GUID) {

    console.log("Sened");

    // 1. 构造JSON对象
    const jsonData = {
        action: "WriteMetaM",
        timestamp: Date.now(),
        Meta: {
            name: name,
            singer: singer,
            album: album,
            duration: duration.toString(),
            tags: tags,
            pic:Pic,
            Guid:GUID
        }
    };

    // 2. 转换为JSON字符串并发送
    console.log(JSON.stringify(jsonData));
    ws.send(JSON.stringify(jsonData));
    SR="";
    console.log("Emptied");
}
function sendVideoMetaJson(name,duration,tags,Pic,GUID) {
    // 1. 构造JSON对象
    const jsonData = {
        action: "WriteMetaV",
        timestamp: Date.now(),
        Meta: {
            name: name,
            duration: duration.toString(),
            tags: tags,
            pic:Pic,
            Guid:GUID
        }
    };
    // 2. 转换为JSON字符串并发送
    console.log(JSON.stringify(jsonData));
    ws.send(JSON.stringify(jsonData));
}
function PlayAllLM(Lis){

    ws.send(JSON.stringify({action:"PlayAllM",List:Lis}));
}
function PlayAllLV(Lis){
    ws.send(JSON.stringify({action:"PlayAllV",List:Lis}));
}
ChangII();
function ChangII(){
    if(audio.volume<=0.50 && audio.volume>0){
        document.querySelector(".Max").style.opacity="0";
        document.querySelector(".Min").style.opacity="1";
        document.querySelector(".Mute").style.opacity="0";
    }
    if(audio.volume<=0.00){
        document.querySelector(".Max").style.opacity="0";
        document.querySelector(".Min").style.opacity="0";
        document.querySelector(".Mute").style.opacity=" 1";
    }
    if(audio.volume>0.5){
        document.querySelector(".Max").style.opacity="1";
        document.querySelector(".Min").style.opacity="0";
        document.querySelector(".Mute").style.opacity="0";
    }
}


Hide[0].addEventListener("click", function () {
    if (hids == 0) {
        SearchM.style.left="75px";
        ListN.style.left="165px";
        Side[0].style.width = "70px";
        Ifno.style.paddingRight = "20px";
        User.style.marginLeft = "-150px";
        Hide[0].style.left = "10px";
        Hide[0].querySelector("svg").style.rotate = "180deg";
        li.forEach(element => {
            element.querySelector("a").style.fontSize = "0px";
            element.querySelector("a").style.paddingTop = "4vh";
            element.querySelector("a").style.paddingBottom = "2vh";
            element.querySelector("a").style.paddingLeft = "13vh";
            element.querySelector("svg").style.scale = "1.1";
            element.querySelector("svg").style.paddingLeft = "12px";
        });
        document.querySelector(".customM").style.left = "100px";
        document.querySelector(".customM").style.width = " calc(100% - 120px)";
        hids = 1;
    }
    else {
        SearchM.style.left="205px";
        ListN.style.left="300px";
        Side[0].style.width = "200px";
        User.style.display = "flex";
        User.style.marginLeft = "10px";
        Ifno.style.paddingRight = "0px";
        Hide[0].style.left = "135px";
        Hide[0].querySelector("svg").style.rotate = "0deg";
        li.forEach(element => {
            element.querySelector("a").style.fontSize = "25px";
            element.querySelector("a").style.padding = "10px";
            element.querySelector("a").style.paddingLeft = "20%";
            element.querySelector("a").style.paddingRight = "8%";
            element.querySelector("svg").style.scale = "1";
            element.querySelector("svg").style.paddingLeft = "10px";
        });
        document.querySelector(".customM").style.left = "230px";
        document.querySelector(".customM").style.width = "  calc(100% - 250px)";
        hids = 0;
    }
});
li.forEach(element => {
    element.querySelector("a").addEventListener("mouseover", function () {
        if (hids == 0) {
            element.querySelector("a").style.paddingLeft = "30%";
        }
        else {
            element.querySelector("a").style.paddingLeft = "50%";
        }
    });
    element.querySelector("a").addEventListener("mouseout", function () {
        if (hids == 0) {
            element.querySelector("a").style.paddingLeft = "20%";
        }
        else {
            element.querySelector("a").style.paddingLeft = "39%";
        }
    });
});
var Condi = 1;//0=play,1=pause
var IsFull=false;
var Play = document.querySelector(".PlayS");
var Pause = document.querySelectorAll(".PauseS");
Play.addEventListener('animationend', function () {
    Play.style.animation = "";
    if (Condi == 0) {
        Play.style.opacity = "0";
    }
    else {
        Play.style.opacity = "0.5";
    }
});
Pause.forEach(pauseElement => {
    pauseElement.addEventListener('animationend', function () {
        pauseElement.style.animation = "";
        if (Condi == 0) {
            pauseElement.style.opacity = "0.5";
        }
        else {
            pauseElement.style.opacity = "0";
        }
    });
});
function PlayS(){
    if (!audio.src || audio.src === "") {
        return;
    }
    else{
        audioCtx.resume();
        audio.play();
        Play.style.animation = "playTransform 0.2s reverse";
        Pause.forEach(pauseElement => {
            pauseElement.style.animation = "pauseTransform 0.2s reverse";
        });
        Contr.classList.add("Pause");
        Contr.classList.remove("Play");
        Condi = 0;
  }
}
function PlayVV(){
    if (!video.src || video.src === "") {
        return;
    }
    else{
        video.play();
        Play.style.animation = "playTransform 0.2s reverse";
        Pause.forEach(pauseElement => {
            pauseElement.style.animation = "pauseTransform 0.2s reverse";
        });
        Contr.classList.add("Pause");
        Contr.classList.remove("Play");
        Condi = 0;
    }
}
function Ctr(){
    if (Condi == 0) {
        Play.style.animation = "playTransform 0.2s ";
        Pause.forEach(pauseElement => {
            pauseElement.style.animation = "pauseTransform 0.2s ";
        });
        Condi = 1;

        if(currentPlay==0){
            audio.pause();
        }
        else{
            video.pause();
        }
    }
    else {
        if(currentPlay==0){
            PlayS();
        }
        else{
            PlayVV();
        }
    }
}
Contr.addEventListener("click", function(){
    if (Condi == 0) {

        Play.style.animation = "playTransform 0.2s ";
        Pause.forEach(pauseElement => {
            pauseElement.style.animation = "pauseTransform 0.2s ";
        });
        Condi = 1;

        if(currentPlay==0){
            audio.pause();
        }
        else{
            video.pause();
        }
    }
    else {
        if(currentPlay==0){
            PlayS();
        }
        else{
            PlayVV();
        }
    }
});

var Nxt = document.querySelector(".Nxt");
var NxtB = document.querySelector(".NxtSB");
var NxtA = document.querySelector(".NxtSF");
Nxt.addEventListener("click", function () {
    Nxt.style.animation = " NxtTransform 0.4s ease-in-out";
    NxtA.style.animation = " NxtTransformA 0.4s ease-in-out";
    NxtB.style.animation = " NxtTransformB 0.4s ease-in-out";
});
NxtB.addEventListener('animationend', function () {
    NxtB.style.animation = "";
});
NxtA.addEventListener('animationend', function () {
    NxtA.style.animation = "";
});
Nxt.addEventListener('animationend', function () {
    Nxt.style.animation = "";
});

var Bc = document.querySelector(".Bc");
var BcB = document.querySelector(".BcB");
var BcA = document.querySelector(".BcA");
Bc.addEventListener("click", function () {
    Bc.style.animation = " BcTransform 0.4s ease-in-out";
    BcA.style.animation = " NxtTransformA 0.4s ease-in-out";
    BcB.style.animation = " NxtTransformB 0.4s ease-in-out";
});
BcB.addEventListener('animationend', function () {
    BcB.style.animation = "";
});
BcA.addEventListener('animationend', function () {
    BcA.style.animation = "";
});
Bc.addEventListener('animationend', function () {
    Bc.style.animation = "";
});

/*Progress Bar*/
var handle = document.querySelector(".handle");
var ProgressB = document.querySelector(".ProgressB");
var progress = document.querySelector(".progress");
var Plu = document.querySelector(".Plu");
let isDragging = false;
let startX, scrollLeft;
var pre = 0;


function jumpToTime(e) {
    const rect = ProgressB.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    var percentage = (offsetX / rect.width).toFixed(2);

    if (currentPlay === 0) {
            audio.currentTime = (percentage * audio.duration);

    } else {
            video.currentTime = (percentage * video.duration);

    }
    progress.style.width = `${percentage * 100}%`;
}

// Add click event listener to ProgressB for jumping to time
ProgressB.addEventListener("click", jumpToTime);

handle.addEventListener("mousedown", function (e) {
    if(audio.src=="" &&video.src==""){
        return;
    }
    if(currentPlay=="0"){
        pre = audio.currentTime;
    }
    else{
        clearTimeout(hideComponentsAfterDelay.timerId);
        pre = video.currentTime;
    }
    Ctr()
    ws.send("HideCur");
    const rect = ProgressB.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    isDragging = true;
    progress.style.transition = "none";
    handle.style.transition = "none";
    Plu.style.opacity = "1";
});
document.addEventListener("mousemove", function (e) {
    if (isDragging == true) {
        if (e.movementX == 0) {
            return;
        }
        if(currentPlay=="0"){
            audio.currentTime=audio.currentTime+(e.movementX/50);
            progress.style.width = `${curTime/Duration}%`;
            Plu.innerHTML = `${(audio.currentTime-pre).toFixed(0)}s`;
        }
        else{
            video.currentTime=video.currentTime+(e.movementX/10);
            progress.style.width = `${curTime/Duration}%`;
            Plu.innerHTML = `${(video.currentTime-pre).toFixed(0)}s`;
        }

    }
});
document.querySelector(".lower").addEventListener("mouseleave", function (e) {
    if(isDragging==true){
        if(currentPlay=="0"){
        }
        else{
            hideComponentsAfterDelay();
        }
        Ctr();
        isDragging = false;
        ws.send("ShowCur");
        Plu.style.opacity = "0";
        progress.style.transition = "all 0.4s";
        handle.style.transition = "all 0.4s";
    }
});
document.addEventListener("mouseup", function (e) {
    if(isDragging==true){
        if(currentPlay=="0"){
        }
        else{
            hideComponentsAfterDelay();
        }
        Ctr();
        isDragging = false;
        ws.send("ShowCur");
        Plu.style.opacity = "0";
        progress.style.transition = "all 0.4s";
        handle.style.transition = "all 0.4s";
    }
});

video.addEventListener('animationend', function () {
    video.style.animation = "";
    video.style.opacity="1";
    video.style.left="0";
    video.style.zIndex="698";
    video.style.pointerEvents="all";
    video.style.top="0";
    document.querySelector(".BackV").style.opacity="1";
    document.querySelector(".BackV").style.pointerEvents="all";
});
/*Music Play Drag*/
function playAudio(fileUrl) {
    if (fileUrl) {
        document.getElementById('audio').src = fileUrl;
        console.log(fileUrl);
        document.getElementById('audio').play();

    } else {
        console.log('No file selected.');
    }
};
var GUID;
var RealName;
var read=true;
var Title, Artist,Album,SR;
Title="Unknown";
var searchbar=document.querySelector(".searchBar");
function dropHandler(ev) {
    Main.style.transform="translateY(0)";
    Main.style.display="flex";
    ev.preventDefault();
    document.querySelector('.cover').style.opacity = "1";
    if (ev.dataTransfer.items) {
        for (var i = 0; i <=0; i++) {
            if (ev.dataTransfer.items[i].kind === "file") {
                var file = ev.dataTransfer.items[i].getAsFile();
                PlayList=[];
                GUID = new Date().getTime().toString(36);
                if (file.type.startsWith('audio/')) {
                    BackV();
                    Cov.style.animation = "Jump 1s ease-in-out";
                    currentPlay=0;
                    RealName=file.name;
                    audio.src = URL.createObjectURL(file);
                    video.pause();
                    PlayS();

                    new jsmediatags.Reader(file)
                    .read({
                         onSuccess: function (tag) {
                             var { title, artist,album,picture,lyrics} = tag.tags;
                            if(lyrics){
                                window.frames["childPage"].LyricsTrans(lyrics.lyrics);
                            }
                            else{
                                window.frames["childPage"].LyricsTrans(404);
                            }

                            if (title||!typeof title == "undefined" || !title=="") {
                                Title =title;
                            }
                            else{
                                Title="Unknown";
                            }
                            Artist = artist;
                             Album=album;
                             let base64String = "";
                             var imgSrc="1";
                             AddPlay(GUID,Title);
                             if (picture) {
                                for (let i = 0; i < picture.data.length; i++) {

                                    base64String += String.fromCharCode(picture.data[i]);
                                }
                                imgSrc = `data:${picture.format};base64,${window.btoa(base64String)}`;

                                Cd.src = imgSrc;
                                SR=imgSrc;

                                window.frames["childPage"].MetaTrans(Title,artist,album,imgSrc);
                            }
                            else{
                                imgSrc = "./BackDrop/UnknD.png";
                                Cd.src = imgSrc;
                                SR="";
                                window.frames["childPage"].MetaTrans(Title,artist,album,"../BackDrop/UnknD.png");
                            }

                              },
                         onError: function (error) {
                            Title="Unknown";
                            Artist = "Unknown";
                            Album="Unknown";
                             console.error("读取元数据时出错:", error);


                         }
                     });


                } else if (file.type.startsWith('video/')) {
                    currentPlay=1;

                    IsFull = true;
                    video.src = URL.createObjectURL(file);
                    Title = file.name;

                    AddPlay(GUID, Title);
                    PlayList=[];
                    video.play();
                    PlayVV()
                    audio.pause();
                    console.log(window.innerWidth);
                    video.style.animation = "PlayV 1s ease-in-out";
                    searchbar.style.opacity="0";
                    TripleB.style.opacity="0";
                    cover.style.animation = "Play 1s ease-in-out";


                    if(window.innerWidth<865){
                        return;
                    }
                    Control.style.left = "50%";
                    Cov.style.transform="translateY(150px)";
                    Control.style.position = "absolute";

                    Control.style.transform = "translateX(-60%)";

                    ControlUp.style.left="25vw";
                    hideComponentsAfterDelay() ;

                } else {
                    /*Errs*/
                }

            }
        }
    }
    cover.style.animation = "Play 1s ease-in-out";
}


audio.addEventListener('canplaythrough', () => {
    if(Title=="Unknown"){
        Title=RealName;
    }
    Loaded();

    sendMusicMetaJson(Title,Artist,Album,audio.duration,"",SR,GUID);

})
video.addEventListener('canplaythrough', () => {
    if(Title=="Unknown"){
        Title=RealName;
    }
    Loaded();
    sendVideoMetaJson(Title,video.duration,"",SR,GUID);

  })

// Functions to Control Video
function hideComponentsAfterDelay() {
    if( window.innerWidth<865){
        return;
    }
    GTimer = setTimeout(() => {
        if( window.innerWidth<865){
            return;
        }
        Control.style.transform = "translateX(-60%) translateY(200px)";
        document.body.style.cursor = "none";
        vc.style.top="-100px";
        document.querySelector(".BackV").style.opacity = "0";
        console.log("hideComponentsAfterDelay");
    }, 5000);
}
function Bc(){
    if(IsFull==true && window.innerWidth>865){
        vc.style.top="30px";
        document.body.style.cursor = "default";
        Control.style.transform = "translateX(-60%)translateY(0px)"
        if(currentPlay=="1"){
        document.querySelector(".BackV").style.opacity="1";
        }
        clearTimeout(GTimer);
        GTimer = setTimeout(() => {
            Control.style.transform="translateX(-60%)translateY(200px)";
            document.body.style.cursor = "none";
            vc.style.top="-100px";
            document.querySelector(".BackV").style.opacity="0";
            console.log("hideComponentsAfterDelay");
        }, 5000);
    }
    if(IsFull==true && window.innerWidth<=865){
        vc.style.top="30px";
        document.body.style.cursor = "default";
        if(currentPlay=="1"){
            document.querySelector(".BackV").style.opacity="1";
        }
        clearTimeout(GTimer);
    }
}
function Re(){
    if(IsFull==true && window.innerWidth>865){
        vc.style.top="30px";
        document.body.style.cursor = "default";
        Control.style.transform = "translateX(-60%)translateY(0px)"
        if(currentPlay=="1"){
            document.querySelector(".BackV").style.opacity="1";
        }
        clearTimeout(GTimer);
    }
    if(IsFull==true && window.innerWidth<865){
        vc.style.top="30px";
        document.body.style.cursor = "default";
        if(currentPlay=="1"){
            document.querySelector(".BackV").style.opacity="1";
        }
        clearTimeout(GTimer);
    }
}
function reset() {
    if(window.innerWidth<865){
        return;
    }
    if(IsFull==true){
    vc.style.top="30px";
    document.body.style.cursor = "default";
    Control.style.transform = "translateX(-60%)translateY(0px)"
    if(currentPlay=="1"){
    document.querySelector(".BackV").style.opacity="1";
    }
    clearTimeout(GTimer);
    GTimer = setTimeout(() => {
        if( window.innerWidth<865){
            return;
        }
        Control.style.transform="translateX(-60%)translateY(200px)";
        document.body.style.cursor = "none";
        vc.style.top="-100px";
        document.querySelector(".BackV").style.opacity="0";
        console.log("hideComponentsAfterDelay");
    }, 5000);
}
}
video.addEventListener('mousemove', function (e) {
    if( window.innerWidth<865){
        return;
    }
    reset();
});

video.addEventListener('timeupdate', function () {
    var curTime = video.currentTime;
    var toMin = Math.floor(curTime / 60);
    var toSec = Math.floor(curTime % 60);
    var Duration = video.duration;
    var percent = (curTime / Duration) * 100;
    document.querySelector('.progress').style.width = percent + "%";
    document.querySelector('.Detail').innerHTML = toMin.toString().padStart(2, '0') + ":" + toSec.toString().padStart(2, '0') + "/" + Math.floor(Duration / 60).toString().padStart(2, '0') + ":" + Math.floor(Duration % 60).toString().padStart(2, '0');
}
);


const canva = document.getElementById('canvas');
video.addEventListener('loadeddata', function () {
    let width = video.videoWidth;
    let height = video.videoHeight;

    let size = Math.min(width, height);
    let sx = (width - size) / 2;
    let sy = (height - size) / 2;

    canva.width = size;
    canva.height = size;
    const ctx = canva.getContext('2d');
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataURL = canva.toDataURL('image/jpeg');
    SR=dataURL;
    Cd.src = dataURL;
});
video.addEventListener('ended', function () {
    if(Condi==0){
        Ctr();
        }
});
audio.addEventListener("timeupdate", function () {
    var curTime = audio.currentTime;
    var toMin = Math.floor(curTime / 60);
    var toSec = Math.floor(curTime % 60);
    window.frames["childPage"].Upd(curTime);
    var Duration = audio.duration;
    var percent = (curTime / Duration) * 100;
    document.querySelector('.progress').style.width = percent + "%";


    document.querySelector('.Detail').innerHTML = toMin.toString().padStart(2, '0') + ":" + toSec.toString().padStart(2, '0') + "/" + Math.floor(Duration / 60).toString().padStart(2, '0') + ":" + Math.floor(Duration % 60).toString().padStart(2, '0');
});
Cov.addEventListener("animationend", (event) => {
    Cov.style.animation="";
});
cover.addEventListener("animationend", (event) => {
    cover.style.animation="";
    cover.style.zIndex="-10";
    cover.style.opacity="0";
});
function dragOverHandler(event) {
    event.preventDefault();
    document.querySelector('.cover').style.zIndex="2000";
    document.querySelector('.cover').style.opacity="1";
}

function dragOut(){
    document.querySelector('.cover').style.opacity="0";
    document.querySelector('.cover').style.zIndex="-10";
}

/*Video Cover*/
var canvas=document.querySelector(".canvas");
video.addEventListener('loadeddata', function () {

});






const Main =document.getElementById("MainShow");
Main.addEventListener('animationend', handle2, false)
function handle2(){
    Main.style.animation="";
}

var OCC=false;

/*Change*/
function MyF(node) {
    console.log(node);
    if(OCC==false){
        OCC=true;
        Main.classList.add('Trans');
        node.classList.add('active');
        for (const tab of document.getElementsByClassName('side')) {
        if (tab.id !== node.id) {
            tab.classList.remove('active');
        }
        }
        setTimeout(() => {
            if(node.id=="Rec"){
                Main.src = "./Recomm/Recommand.html";
            }
            if(node.id=="MyMusi"){
                Main.src = "./MyMusic/MyMusic.html";
            }
            if(node.id=="MyLis"){
                Main.src = "./MyMList/MyMList.html";
            }
            if(node.id=="Fav"){
                Main.src = "./MyFav/MyFav.html";
            }
            if(node.id=="PlayL"){
                Main.src = "./MyVList/MyVList.html";
            }
            if(node.id=="MyVide"){
                Main.src = "./MyVideo/MyVideo.html";
            }
            if(node.id=="Setting"){
                Main.src = "./Setting/Setting.html";
            }
        }, 500);
        setTimeout(() => {
            Main.classList.remove('Trans');
            OCC=false;
        }, 800);
    }
}
var File1=document.querySelector(".File");
var Search=document.querySelector(".Search");
var Filter=document.querySelector(".Filter");
var Back1=document.querySelector(".Back");

var ListN=document.querySelector(".ListN");
/*Search Clicked*/
var Con=0;
var SearchHistory=document.querySelector(".SearchHistory");
function Expand(){
    if(Con==0){
        Search.style.width="40vw";
        File1.style.width="500vw";
        Filter.style.opacity="1";
        ListN.style.opacity="0";
        Back1.style.opacity="1";
        File1.style.height = "500vh";
        Filter.style.pointerEvents="all";
        document.querySelector(".SearchB").style.zIndex="2697";
        File1.style.backdropFilter = "blur(6px) brightness(0.5)";
        Search.disabled = false;
        vc.style.top = "-100px";
        TripleB.style.opacity="0";
        TripleB.style.zIndex="100";
        Con++;
    }else{
        Back();
        if(Cur!=1){
            MyF(document.querySelector("#MyMusi"));
        }
        else{
            MyF(document.querySelector("#MyVide"));
        }

        Con=0;
    }
}
function getFilter(){
    var Vla=document.querySelector(".Search").value;
    document.querySelector(".Search").value="";
    return Vla;
}
var ListNp=document.querySelector(".ListN p");
function Expan2(){
    if(Con==0){
        ListNp.style.transition="all 0.9s";
        ListN.style.width="40vw";
        ListN.style.zIndex="2697";
        document.querySelector(".SearchB").style.zIndex="1000";
        ListNp.style.opacity="1";
        File1.style.width="500vw";
        Back1.style.opacity="1";
        File1.style.height = "500vh";
        File1.style.backdropFilter = "blur(6px) brightness(0.5)";
        SearchB.style.opacity="0";
        vc.style.top = "-100px";
        TripleB.style.opacity="0";
        TripleB.style.zIndex="100";
        document.querySelector(".MyPlayList").classList.remove('HotHide');
        Con++;
        }else{

        }
}

var TripleB=document.querySelector(".TripleB");
var Filter=document.querySelector(".Filter");
var Filtersvg=document.querySelector(".Filter svg");
var Con2=0;


/*File*/
function Exp(){
    if(Con2==0){
        Filtersvg.style.rotate="180deg";
        Filter.style.height="85px";
        Con2=1;
    }
    else{
        Filtersvg.style.rotate="0deg";
        Filter.style.height="40px";
        Con2=0;
    }
}
var Cur=1;
var options=document.querySelector(".option");
var node3=document.querySelector(".a3");
function Change(node){
    console.log(Cur);
    if(node.id=="1" || node.id=="a3"){
        if(Cur!=1){
            Cur=1;
            options.style.transform="translateY(0px)";
            node3.style.opacity="0";
        }
    }
    if(node.id=="2"){
        if(Cur!=2){
            Cur=2;
            options.style.transform="translateY(-38px)";
            node3.style.opacity="1";
        }
    }
    Exp();
}
function Back(){
    ListNp.style.opacity="0";
    ListN.style.opacity="1";
    ListN.style.pointerEvents="all";
    ListNp.style.transition="all 0.2s";
    Search.style.width="0px";
    File1.style.width="0px";
    Filter.style.opacity="0";
    Filter.style.pointerEvents="none";
    Back1.style.opacity="0";
    Search.style.opacity="1";
    ListN.style.opacity="1";
    ListN.style.width="45px";
    File1.style.height = "0";
    SearchB.style.opacity="1";
    Search.disabled = true;
    TripleB.style.opacity="1";
    TripleB.style.zIndex="901";
    vc.style.top = "30px";
    vc.style.right="140px";
    Con=0
    ListN.style.zIndex="3000";
    SearchHistory.classList.add('HotHide');
    document.querySelector(".MyPlayList").classList.add('HotHide');
    document.querySelector(".SearchB").style.zIndex="697";
    IsFull=false;
}
function Resizd(){
    if(this.window.innerWidth<800){
        SearchM.style.left="75px";
        ListN.style.left="165px";
        Side[0].style.width = "70px";
        Ifno.style.paddingRight = "20px";
        User.style.marginLeft = "-150px";
        Hide[0].style.left = "10px";
        Hide[0].querySelector("svg").style.rotate = "180deg";
        li.forEach(element => {
            element.querySelector("a").style.fontSize = "0px";
            element.querySelector("a").style.paddingTop = "4vh";
            element.querySelector("a").style.paddingBottom = "2vh";
            element.querySelector("a").style.paddingLeft = "13vh";
            element.querySelector("svg").style.scale = "1.1";
            element.querySelector("svg").style.paddingLeft = "12px";
        });
        document.querySelector(".customM").style.left = "100px";
        document.querySelector(".customM").style.width = " calc(100% - 120px)";
        hids = 1;
    }
    else{
        SearchM.style.left="205px";
        ListN.style.left="300px";
        Side[0].style.width = "200px";
        User.style.display = "flex";
        User.style.marginLeft = "10px";
        Ifno.style.paddingRight = "0px";
        Hide[0].style.left = "135px";
        Hide[0].querySelector("svg").style.rotate = "0deg";
        li.forEach(element => {
            element.querySelector("a").style.fontSize = "25px";
            element.querySelector("a").style.padding = "10px";
            element.querySelector("a").style.paddingLeft = "20%";
            element.querySelector("a").style.paddingRight = "8%";
            element.querySelector("svg").style.scale = "1";
            element.querySelector("svg").style.paddingLeft = "10px";
        });
        document.querySelector(".customM").style.left = "230px";
        document.querySelector(".customM").style.width = "  calc(100% - 250px)";
        hids = 0;
    }
}
var FullMode = document.querySelector(".FullMode");
window.addEventListener('load', function(){
    Resizd();

});

window.addEventListener('resize', function () {
    if(this.window.innerWidth<865){
        Control.style.transform = "translateX(0px) translateY(0px)"
        Control.style.left = ""
    }
    else{
        Control.style.left = ""
    }
    if(IsFull==true && window.innerWidth<865){
        vc.style.top="30px";
        document.body.style.cursor = "default";
        Control.style.transform = "translateX(0)translateY(0px)"
            Control.style.left = ""
        if(currentPlay=="1"){
            document.querySelector(".BackV").style.opacity="1";
        }
        clearTimeout(GTimer);
    }
    else if(IsFull==true && window.innerWidth>=865){
        vc.style.top="30px";
            Control.style.left = ""

        document.body.style.cursor = "default";
        Control.style.transform = "translateX(-60%)translateY(0px)"
        if(currentPlay=="1"){
            document.querySelector(".BackV").style.opacity="1";
        }
    }
    Resizd();
});
var ListN=document.querySelector(".ListN");
function Trans() {
    IsFull=true;
    if(audio.src=="" && video.src==""){
        return;
    }
    if(currentPlay==0){
        if(audio.src==""){
            return;
        }
        ListN.style.opacity="0";
        ListN.style.pointerEvents="none";
        FullMode.style.borderRadius="0px";
        FullMode.style.transition = "all 0.6s cubic-bezier(0.67, 1.31, 0.08, 0.90)";
        FullMode.style.transform="translateY(0px)";
        FullMode.style.opacity="1";
        searchbar.style.transform = "translateY(-60px)";
        TripleB.style.transform = "translateY(-60px)";

        if( window.innerWidth<865){
            return;
        }

        Control.style.position = "fixed";
        Control.style.left = "50%";
        Cov.style.transform="translateY(100px)";
        ControlUp.style.left="25vw";


        hideComponentsAfterDelay() ;

    }
    else{
        if(video.src==""){
            return;
        }
        ListN.style.opacity="0";
        ListN.style.pointerEvents="none";
        video.style.animation = "PlayV 1s ease-in-out";
        searchbar.style.opacity="0";
        TripleB.style.opacity="0";
        TripleB.style.pointerEvents="none";
        document.querySelector(".BackV").style.opacity="1";
        document.querySelector(".BackV").style.pointerEvents="all";
        flag=1;

        if( window.innerWidth<865){
            return;
        }

        Cov.style.transform="translateY(100px)";
        Control.style.position = "absolute";

        ControlUp.style.left="25vw";
        Control.style.left = "50%";
        Control.style.transform = "translateX(-60%)";

        hideComponentsAfterDelay() ;
    }
}

function smallF(){
    FullMode.style.transition = "all 0.6s cubic-bezier(0.49, -0.02, 0.49, -0.28)";
    FullMode.style.transform="translateY(100vh)";
    FullMode.style.opacity="0";
    ListN.style.opacity="1";
    ListN.style.pointerEvents="all";
    searchbar.style.transform = "translateY(0%)";
    TripleB.style.transform = "translateY(0%)";
    vc.style.top = "30px";
    Cov.style.transform="translateY(0px)";
    vc.style.right="140px";
    IsFull=false;
    if( window.innerWidth<865){
        return;
    }

    Control.style.position = "fixed";
    Control.style.left = "35vw";
    ControlUp.style.left="40vw";

    clearTimeout(GTimer);
    Control.style.transform = "translateX(0px)";

}

function BackV(){
    if(!IsFull){return;}
    video.style.opacity="0";
    searchbar.style.opacity="1";
    TripleB.style.opacity="1";
    video.style.top="100vh";
    ListN.style.opacity="1";
    ListN.style.pointerEvents="all";
    TripleB.style.pointerEvents="all";
    video.style.pointerEvents="none";
    document.querySelector(".BackV").style.opacity="0";
    document.querySelector(".BackV").style.pointerEvents="none";
    Control.style.transform = "translateX(0px)";
    Cov.style.transform="translateY(0px)";
    IsFull=false;
    if(window.innerWidth<865){
        return;
    }

    Control.style.position = "fixed";
    Control.style.left = "35vw";
    vc.style.top = "30px";
    ControlUp.style.left="40vw";
    vc.style.right="140px";

    clearTimeout(GTimer);


}
var isDraggingY=false;
var vp1=document.querySelector(".volume-progress");
var vp=document.querySelector(".volume-track");
vp1.style.width = `${CurrVolume*100}%`;
audio.volume = CurrVolume;
function handleScroll(event) {
    const scrollY = event.deltaY;
    const volumeStep = 0.01;
    const maxVolume = 1;
    const minVolume = 0;

    if (scrollY > 0 && audio.volume > minVolume) {
        audio.volume = Math.max(minVolume, audio.volume - volumeStep);
    } else if (scrollY < 0 && audio.volume < maxVolume) {
        audio.volume = Math.min(maxVolume, audio.volume + volumeStep);
    }
    video.volume = audio.volume;
    const volumePercentage = audio.volume * 100;
    vp1.style.width = `${volumePercentage}%`;
}

vp.onwheel=handleScroll;

function ChangeK(name,newl){

    newl=keyMap[newl]  || newl;
    if(newl=="Space"){
        newl=" ";
    }
    switch (name) {
        case "Pause":
            PauseK=newl;
            break;
        case "VolumeU":
            VolumeU=newl;
            break;
        case "VolumeD":
            VolumeD=newl;
            break;
        case "Fast":
            Fast=newl;
            break;
        case "Back":
            Back2=newl;
            break;
    }
}

/*Keyboard*/
document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            break;
        case 'Escape':
            break;
        case Fast:
            // Handle right arrow key press
            if (currentPlay == 1 && video.currentTime + 5 <= video.duration) {
                video.currentTime += 10;
            } else if (currentPlay == 0 && audio.currentTime + 5 <= audio.duration) {
                audio.currentTime += 10;
            }
            break;
        case Back2:
            if (currentPlay == 1 && video.currentTime + 5 <= video.duration) {
                video.currentTime -= 5;
            } else if (currentPlay == 0 && audio.currentTime + 5 <= audio.duration) {
                audio.currentTime -= 5;
            }
            break;
        case PauseK:
            Ctr();
            break;
        case VolumeU:
            audio.volume = Math.min(1, audio.volume + 0.05);
            video.volume = audio.volume;
            vp1.style.width = `${audio.volume * 100}%`;
            break;
        case VolumeD:
            audio.volume = Math.max(0, audio.volume -0.05);
            video.volume = audio.volume;
            vp1.style.width = `${audio.volume * 100}%`;
            break;
    }
});

vp.addEventListener("mousedown", function (e) {
    ws.send("HideCur");
    console.log("down");
    isDraggingY = true;
});
document.addEventListener("mousemove", function (e) {
    if (isDraggingY == true) {
        if (e.movementX == 0) {
            return;
        }
        console.log(audio.volume);
        ChangII();
        const volumeStep = 0.01;
        const maxVolume = 1;
        const minVolume = 0;

        if (e.movementX < 0 && audio.volume > minVolume) {
            audio.volume = Math.max(minVolume, audio.volume - volumeStep);
        } else if (e.movementX > 0 && audio.volume < maxVolume) {
            audio.volume = Math.min(maxVolume, audio.volume + volumeStep);
        }
        video.volume = audio.volume;

        const volumePercentage = audio.volume * 100;
        vp1.style.width = `${volumePercentage}%`;
    }
});

vp.addEventListener("mouseleave", function (e) {
    if(isDraggingY==true){
    ws.send("ShowCur");
    isDraggingY = false;
    }
});
document.addEventListener("mouseup", function (e) {
    if(isDraggingY==true){
    ws.send("ShowCur");
    isDraggingY = false;
    }
});

/*Play Insed*/
function Plas(data) {
    if(data==404||data==""||typeof data=="undefined"){
        Cd.src="./BackDrop/UnKnD.png"
    }
    Cov.classList.add('Rec');
    setTimeout(() => {
        Cd.src=data;
    }, 500);
    setTimeout(() => {
        Cov.classList.remove('Rec');
    }, 1000);
}

function Jump(now){
    console.log(now);
    audio.currentTime = now;
}
const volumeTrack = document.querySelector('.volume-track'); // Assuming there's an element with id 'volume-track'

volumeTrack.addEventListener('click', function (e) {
    const rect = volumeTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // X coordinate of the click within the volume track
    const width = rect.width;
    const newVolume = clickX / width;

    audio.volume = Math.min(1, Math.max(0, newVolume));
    video.volume = audio.volume;
    vp1.style.width = `${audio.volume * 100}%`;
});

/*PlaySpeed*/
function speed(){
    ControlUp.classList.add('OutS')

    document.querySelector(".Speed").style.opacity="1";
}
document.querySelectorAll(".speed li").forEach((li) => {
    li.addEventListener("click", function () {
        // Remove active class from all sibling elements
        this.parentElement.querySelectorAll('li').forEach(sibling => {
            sibling.classList.remove('Lactive');
        });
        document.querySelector(".Speed").style.opacity="1";
        this.classList.add('Lactive');
        document.querySelector(".Speed").style.opacity="0.5";
        ControlUp.classList.remove('OutS')

        if(this.classList[0]=="SS"){audio.playbackRate =0.5;video.playbackRate =0.5;}
        if(this.classList[0]=="NN"){audio.playbackRate =1.0;video.playbackRate =1.0;}
        if(this.classList[0]=="SF"){audio.playbackRate =3.0;video.playbackRate =3.0;}
        if(this.classList[0]=="LF"){audio.playbackRate =1.5;video.playbackRate =1.5;}
        if(this.classList[0]=="FF"){audio.playbackRate =2.0;video.playbackRate =2.0;}
    });
});
var Mode=0;//0:CycleOne 1:RandomPlay 2:CycleList
/*Song Control*/
audio.addEventListener("ended", function () {
    if(Condi==0){
        Ctr();
        switch(Mode){
            case 0:
                PlayS();
                break;
            case 1:
                const randomIndex = Math.floor(Math.random() * PlayList.length);
                var nextSong = PlayList[randomIndex];
                console.log(nextSong);
                break;
            case 2:
                CurrentPosition++;
                CurrentPosition=CurrentPosition%PlayList.length;
                var nextSong=PlayList[CurrentPosition];
                console.log(nextSong);
                break;
        }
    }
});
function Before(){

        switch(Mode){
            case 0:

                break;
            case 1:
                Loading();
                const randomIndex = Math.floor(Math.random() * PlayList.length);
                var nextSong = PlayList[randomIndex];
                if(currentPlay==0){
                    var playMessage = {
                        action: "PlayMusic",
                        name: nextSong,
                    };
                }
                else{
                    var playMessage = {
                        action: "PlayVideo",
                        name: nextSong,
                    };
                    videoserver.send(JSON.stringify(playMessage));
                }


                ws.send(JSON.stringify(playMessage));
                break;
            case 2:
                Loading();
                CurrentPosition--;
                if(CurrentPosition<0){
                    CurrentPosition=PlayList.length-1;}
                CurrentPosition=CurrentPosition%PlayList.length;
                var nextSong=PlayList[CurrentPosition];
                if(currentPlay==0){
                    var playMessage = {
                        action: "PlayMusic",
                        name: nextSong,
                    };
                }
                else{
                    var playMessage = {
                        action: "PlayVideo",
                        name: nextSong,
                    };
                    videoserver.send(JSON.stringify(playMessage));
                }

                ws.send(JSON.stringify(playMessage));
                break;
        }
}
function Next(){

        switch(Mode){
            case 0:

                break;
            case 1:
                Loading();
                const randomIndex = Math.floor(Math.random() * PlayList.length);
                var nextSong = PlayList[randomIndex];
                if(currentPlay==0){
                    var playMessage = {
                        action: "PlayMusic",
                        name: nextSong,
                    };
                }
                else{
                    var playMessage = {
                        action: "PlayVideo",
                        name: nextSong,
                    };
                    videoserver.send(JSON.stringify(playMessage));
                }

                ws.send(JSON.stringify(playMessage));

                break;
            case 2:
                Loading();
                CurrentPosition++;
                CurrentPosition=CurrentPosition%PlayList.length;
                var nextSong=PlayList[CurrentPosition];
                if(currentPlay==0){
                    var playMessage = {
                        action: "PlayMusic",
                        name: nextSong,
                    };
                }
                else{
                    var playMessage = {
                        action: "PlayVideo",
                        name: nextSong,
                    };
                    videoserver.send(JSON.stringify(playMessage));
                }
                ws.send(JSON.stringify(playMessage));

                break;
        }
    }
video.addEventListener("ended", function () {
    if(Condi==0){
        Ctr();
         switch(Mode){
            case 0:
                PlayS();
                break;
            case 1:
                const randomIndex = Math.floor(Math.random() * PlayList.length);
                var nextSong = PlayList[randomIndex];

                break;
            case 2:
                CurrentPosition++;
                CurrentPosition=CurrentPosition%PlayList.length;
                var nextSong=PlayList[CurrentPosition];

                break;
        }
    }
});

function AutoN(){

}
/*Mode Control*/
function Swap(element) {
    const children = element.children;
    let nextIndex = (Mode + 1) % 3;
    children[Mode].classList.remove('Show');
    children[nextIndex].classList.add('Show');
    Mode=nextIndex;
}


/*Sound Setting*/
var audioCtx;

var Initial=false;
/*Sound Effect*/
var bassFilter;
var compressor;
var trebleFilter;
var vocalFilter,panner,analyser;
var animationId;
var ctx,Canvas;
Canvas = document.querySelector('.MusicVis'); // Ensure you have a canvas element with this ID
var adjust,merger;
drawVisualizer();
function InitialFilter() {

// 创建并配置低音增强滤波器
    bassFilter = audioCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.setValueAtTime(200, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);

// 创建并配置高音增强滤波器
    trebleFilter = audioCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.setValueAtTime(2000, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(0, audioCtx.currentTime);

// 创建并配置清晰人声滤波器
    vocalFilter = audioCtx.createBiquadFilter();
    vocalFilter.type = "peaking";
    vocalFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    vocalFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    vocalFilter.Q.setValueAtTime(1, audioCtx.currentTime);
}



function InitializeB() {
   // 创建声像器节点
    panner = audioCtx.createStereoPanner();
   // 设置声道平衡，这里设置为默认居中
   panner.pan.value = 0;


   }
// 为低音增强按钮添加点击事件监听器
function setupBassBoost() {
    vocalFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(4, audioCtx.currentTime);
}

// 为高音增强按钮添加点击事件监听器
function setupTrebleBoost() {
    vocalFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(6, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);
}

// 为清晰人声按钮添加点击事件监听器
function setupClearVocals() {
    vocalFilter.gain.setValueAtTime(6, audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);
}
function ClearUpVocals(){
    vocalFilter.gain.setValueAtTime(0,audioCtx.currentTime);
    trebleFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);
}
function setSoundBalance() {
 if(!Initial){
        audioCtx = new (window.AudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        Initial=true;
    }
     // 创建压缩器节点，用于响度平衡
     compressor= audioCtx.createDynamicsCompressor();
     compressor.threshold.setValueAtTime(1000, audioCtx.currentTime); // 设置一个非常高的阈值，音频信号很难超过
compressor.ratio.setValueAtTime(1, audioCtx.currentTime); // 压缩比为 1:1，不进行压缩
compressor.attack.setValueAtTime(1, audioCtx.currentTime);
compressor.release.setValueAtTime(1, audioCtx.currentTime);
compressor.knee.setValueAtTime(0, audioCtx.currentTime);
}
function CancelSoundBalace(){
    compressor.threshold.setValueAtTime(100, audioCtx.currentTime); // 设置一个非常高的阈值，音频信号很难超过
    compressor.ratio.setValueAtTime(1, audioCtx.currentTime); // 压缩比为 1:1，不进行压缩
    compressor.attack.setValueAtTime(1, audioCtx.currentTime);
    compressor.release.setValueAtTime(1, audioCtx.currentTime);
    compressor.knee.setValueAtTime(0, audioCtx.currentTime);
}
function ApplySoundBalace(){
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
}
function SoundBalance(Balance){
    if(Balance){
        ApplySoundBalace();
    }
    else{
        CancelSoundBalace();
    }
}
//setSoundBalance();



/*Music Balance*/

// 调节左声道音量
function setVolumeBalance(volume) {
    panner.pan.value=volume;
    console.log(volume);
}
/*Music Visualize*/
function drawVisualizer() {
    ctx = Canvas.getContext('2d');
    if(!Initial){
        audioCtx = new (window.AudioContext);
        source = audioCtx.createMediaElementSource(audio);
        Initial=true;
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    // 用于保存上一帧的音高数据
    const previousDataArray = new Uint8Array(bufferLength);

    // Connect the audio element to the analyser
    InitialFilter();
    InitializeB();
    setSoundBalance();
    source.connect(analyser);
    analyser.connect(bassFilter);
    bassFilter.connect(trebleFilter);
    trebleFilter.connect(vocalFilter);
    vocalFilter.connect(compressor);
    compressor.connect(panner);
    panner.connect(audioCtx.destination);
    // 缓动系数，值越接近 1 缓动越慢
    const easingFactor = 0.2;

    function draw() {
        animationId=requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, Canvas.width, Canvas.height);

        const barWidth = ((window.innerWidth-250) / bufferLength);
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            // 线性插值实现缓动
            previousDataArray[i] = previousDataArray[i] + (dataArray[i] - previousDataArray[i]) * easingFactor;
            barHeight = previousDataArray[i];
            ctx.fillStyle = `rgba(128, 128, 128,${barHeight / Canvas.height})`;
            ctx.fillRect(x, Canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    }

    draw();


}
var IsVisual = false;
function VisS(el) {
    if(IsVisual){
        el.style.opacity = "0.5";
        IsVisual = false;
        Canvas.style.opacity = "0";
    }
    else{
        IsVisual=true;
        el.style.opacity="1";
        Canvas.style.opacity = "1";

    }
}

function Loading(){
    document.querySelector('.cover2').style.opacity = "1";
    document.querySelector('.cover2').style.zIndex = "9000";
    document.querySelector('.cover2 svg').style.animation = ` Rote 1s infinite linear`;
}
function Loaded(){
    document.querySelector('.cover2').style.opacity = "0";
    document.querySelector('.cover2').style.zIndex = "-100";
    document.querySelector('.cover2 svg').style.animation = ` `;
}
function Choose(love){
    if (!audio.src && !video.src) {
        return;
    }

    if(currentPlay==0){
        ws.send(JSON.stringify({"action":"GetMusicListsLite","name":NPR}));
        console.log("SendedM");
    }
    else{
        ws.send(JSON.stringify({"action":"GetVideoListsLite","name":NPR}));
        console.log("SendedV");
    }
    document.querySelector('.PlayList').style.opacity = "1";
    love.style.marginTop = "-240px";
    love.style.marginRight = "-30px";
    love.style.height="350px";
    love.style.width="350px";
}
function MinT(love){
    document.querySelector('.PlayList').style.opacity = "0";
    love.style.marginTop = "0px";
    love.style.marginRight = "0px";
    love.style.height="30px";
    love.style.width="30px";
}

function Fill(el){
    Search.value=el.innerHTML;
}

function Chage(ell){
    ell.classList.add('Songact');
    document.querySelectorAll('.SongLis').forEach((el)=>{
        if(el!=ell){
            el.classList.remove('Songact');
        }
    })
}

function Jump2M(){
    Back();
}

function SetBg(e){
    console.log(e);
    switch(e){
        case 0:
            document.querySelector('.BG').style.backgroundImage = `url(./BackDrop/Default.jpg)`;
            break;
        case 1:
            document.querySelector('.BG').style.backgroundImage = `url(./BackDrop/Food.jpg)`;
            break;
        case 2:
            document.querySelector('.BG').style.backgroundImage = `url(./BackDrop/SeaSide.jpg)`;
            break;
    }
}

/*Play Click*/
function PlayClick(URL2){


    audio.src = URL.createObjectURL(URL2);


    const blob = new Blob([URL2], { type: 'audio/mp3' });

    const file = new File([blob], 'audio.mp3', { type: 'audio/mp3' });


    const reader = new FileReader();

    reader.onload = function (event) {
        const arrayBuffer = event.target.result;

        new jsmediatags.Reader(file)
        .read({
                onSuccess: function (tag) {
                    var {lyrics} = tag.tags;
                    if(lyrics){
                        window.frames["childPage"].LyricsTrans(lyrics.lyrics);
                    }
                    else if(LL){}
                    else{
                        window.frames["childPage"].LyricsTrans(404);
                    }

                    if(PlaySr){
                        window.frames["childPage"].MetaTrans(Title,Artist,Album,PlaySr);
                        Plas(PlaySr);
                    }
                    else{
                        window.frames["childPage"].MetaTrans(Title,Artist,Album,404);
                        Plas("./BackDrop/UnknD.png");
                    }

                },
                onError: function (error) {
                    console.error('读取元数据失败:', error);
                    if(PlaySr){
                        window.frames["childPage"].MetaTrans(Title,Artist,Album,PlaySr);
                        Plas(PlaySr);
                    }
                    else{
                        window.frames["childPage"].MetaTrans(Title,Artist,Album,404);
                        Plas(404);
                    }
                }
            });
    };
    currentPlay=0;
    // 读取 File 对象为 ArrayBuffer
    reader.readAsArrayBuffer(file);

    PlayS();
}

function PlayClickV(ev){

    URL2 = new Blob([ev],{ type: 'video/mp4' });

    const videoUrl = URL.createObjectURL(URL2);


    video.src = videoUrl;

    currentPlay=1;

    PlayVV();
}

var BF=0;
/*Close*/
function Miny(){

    ws.send("Min");
}
function Close(){

    ws.send(JSON.stringify({"action":"Volume","volume":audio.volume.toFixed(2).toString()}));
    ws.send("Close");
    ws.close();
}
function FullM(){
    if(BF==0){
        ws.send("Middle");
        BF=1;
    }
    else{
        ws.send("Small");
        BF=0;
    }
}



var Alerted=document.querySelector(".alertBox");
var ContentA=document.querySelector(".ContentA");
function Alert(things){
    Alerted.style.opacity=1;
    Alerted.style.pointerEvents="all";
    ContentA.innerHTML=things;
}
function AletFinish(){
    Alerted.style.opacity=0;
    Alerted.style.pointerEvents="none";
}

function Small(){
    window.top.smallF();
}

// 计算垂直位置
function getVolumeFromEvent(e) {
    const rect = track.getBoundingClientRect();
    const clickY = rect.bottom - e.clientY;
    return Math.round((clickY / rect.height) * 100);
}



function LyricsTrans(lyrics){

    if(lyrics=="404"){
        window.frames["childPage2"].TransLric("404");
    }
    window.frames["childPage2"].TransLric(lyrics);
}
function MetaTrans(name,artist,album,headPic){
    if(headPic=="./BackDrop/UnKnD.png"){
        headPic="../BackDrop/UnKnD.png";
    }
    var Name = document.querySelector('.Name');
    var Name2 = document.querySelector('.Name2');
    var Artist = document.querySelector('.Artist');
    var Album = document.querySelector('.Album');
    var HeadPic = document.querySelector('.HeadPic');
    if(name=="" || typeof name=="undefined"||name=="未知歌曲"){Name.innerText = "未知歌曲";}
    else{
        Name.innerText = name.trim();
        /*Name2.innerText = name.trim();
        if (name.length > 10) {
            Name.style.opacity = 0;
            Name2.style.opacity = 1;
        }
        else{
            Name.style.opacity = 1;
            Name2.style.opacity = 0;
        }*/
    }
    if(artist=="" || typeof artist=="undefined"||artist=="未知歌手"){Artist.innerText = "未知歌手";}
    else{
        Artist.innerText = artist;

    }if(album=="" || typeof album=="undefined"||album=="未知专辑"){Album.innerText = "未知专辑";}
    else{
        Album.innerText = album;


    }

    if(headPic!=404 && headPic!="undefined"){
        console.log(headPic);
        HeadPic.style.backgroundImage = `url(${headPic})`;
        document.body.style.backgroundImage = `url(${headPic})`;
        analyzeImageColors(headPic)
        .then
        (colors => {
            window.frames["childPage2"].SetColor(colors);
            document.querySelector('.Name').style.color=`rgba(${colors.complementaryColor[0]},${colors.complementaryColor[1]},${colors.complementaryColor[2]},1)`;
            document.querySelector('.Name2').style.color=`rgba(${colors.complementaryColor[0]},${colors.complementaryColor[1]},${colors.complementaryColor[2]},1)`;
            document.querySelector('.Artist').style.color=`rgba(${colors.complementaryColor[0]},${colors.complementaryColor[1]},${colors.complementaryColor[2]},1)`;
            document.querySelector('.Album').style.color=`rgba(${colors.complementaryColor[0]},${colors.complementaryColor[1]},${colors.complementaryColor[2]},1)`;
        })
        .catch(error => {
            console.log(error);
        });
    }

}
function analyzeImageColors(base64Data) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Data;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const colorCounts = {};

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const color = `${r},${g},${b}`;
                if (!colorCounts[color]) {
                    colorCounts[color] = 0;
                }
                colorCounts[color]++;
            }

            const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
            const dominantColor = sortedColors[0][0].split(',').map(Number);
            const complementaryColor = [255 - dominantColor[0], 255 - dominantColor[1], 255 - dominantColor[2]];

            // 降低饱和度函数
            function desaturate(color, factor = 0.5) {
                const r = color[0];
                const g = color[1];
                const b = color[2];
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                const newR = Math.round(gray + (r - gray) * factor);
                const newG = Math.round(gray + (g - gray) * factor);
                const newB = Math.round(gray + (b - gray) * factor);
                return [newR, newG, newB];
            }

            const lowSatDominant = desaturate(dominantColor);
            const lowSatComplementary = desaturate(complementaryColor);
            // 这里配色直接使用互补色逻辑，如果有其他配色算法可替换
            const lowSatMatching = lowSatComplementary;

            resolve({
                dominantColor: lowSatDominant,
                complementaryColor: lowSatComplementary,
                matchingColor: lowSatMatching
            });
        };

        img.onerror = function () {
            reject(new Error('图片加载失败'));
        };
    });
}
document.body.addEventListener('mousemove', function (e) {

    window.top.reset();
});

function Upd(curTime){
    window.frames["childPage2"].UpdateLric(curTime);
}
function Jmp2(now){
    window.top.Jump(now);
}

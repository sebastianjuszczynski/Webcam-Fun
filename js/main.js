
const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");
const photo = document.querySelector(".takePhoto");
const redColor = document.querySelector(".redChange");
const rgbEffect = document.querySelector(".rgbChange");

const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`OH NO!!!`, err);
        });
};


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
}
const noEffects = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
}
const redEffects = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = redEffect(pixels);
    ctx.putImageData(pixels, 0, 0);
}
const rgbEffects = () => {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = rgbSplit(pixels);
    ctx.putImageData(pixels, 0, 0);
}

const defaultEffect = setInterval(noEffects, 16);

let redBackground;
let ghostEffect;

function changeOnRed() {
    redBackground = setInterval(redEffects, 16);
    clearInterval(defaultEffect);
    clearInterval(ghostEffect);
};
function changeOnGhost() {
    ghostEffect = setInterval(rgbEffects, 16);
    clearInterval(defaultEffect);
    clearInterval(redBackground);
};


function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "photo");
    link.innerHTML = `<img src="${data}" alt="photo" />`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 550] = pixels.data[i + 2];
    }
    return pixels;
}
function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}
function rgbChange() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const rgbEffects = () => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = rgbSplit(pixels);
        ctx.putImageData(pixels, 0, 0);
    }

    return setInterval(rgbEffects, 16);
}


getVideo();
photo.addEventListener("click", takePhoto);
video.addEventListener("canplay", paintToCanvas);
redColor.addEventListener("click", changeOnRed);
rgbEffect.addEventListener("click", changeOnGhost);
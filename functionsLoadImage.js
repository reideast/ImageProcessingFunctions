const DEFAULT_FILE = 'images/cookiemonster.jpg';

let isImageLoaded = false;

let elLoadButton = document.getElementById('loadDefaultImageButton');
elLoadButton.addEventListener('click', loadImageByDefaultFilename);
elLoadButton.innerText = 'Load \'' + DEFAULT_FILE + '\'';
document.getElementById('filename').addEventListener('change', loadImageByFileInput);
document.getElementById('reloadButton').addEventListener('click', loadImageByFileInput);

setStylesUnloaded();

function loadImageByFileInput() {
    const fileListItem = document.getElementById('filename').files[0];
    if (fileListItem) {
        const reader = new FileReader();
        reader.readAsDataURL(fileListItem);
        reader.onload = (event) => {
            if (event.target.readyState === FileReader.DONE) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => paintLoadedImage(img, fileListItem.name);
            }
        };

        document.getElementById('reloadButton').innerText = 'Reload \'' + fileListItem.name + '\'';
        document.getElementById('reloadButton').style.display = 'inline-block';
    } else {
        console.error('No filename');
    }
}

function loadImageByDefaultFilename() {
    const img = new Image();
    img.src = DEFAULT_FILE;
    img.onload = () => paintLoadedImage(img, DEFAULT_FILE);
}

function paintLoadedImage(img, filenameDescription) {
    width = img.naturalWidth;  // DEBUG: is this actually changing the GLOBAL width?
    height = img.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    setStylesLoaded();
    saveOp('Load ' + filenameDescription);
}

function setStylesLoaded() {
    isImageLoaded = true;
    const operationButtons = document.getElementById("processImageOperations").childNodes;
    for (let i = 0; i < operationButtons.length; ++i) {
        operationButtons.item(i).disabled = false;
    }
}

function setStylesUnloaded() {
    isImageLoaded = false;
    const operationButtons = document.getElementById("processImageOperations").childNodes;
    for (let i = 0; i < operationButtons.length; ++i) {
        operationButtons.item(i).disabled = true;
    }
}

const DEFAULT_FILE = 'images/cookiemonster.jpg';

let isImageLoaded = false;

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
    isGreyscale = isBinary = false;
    setStylesLoaded();
    saveOp('Load ' + filenameDescription);
}

const DISABLED = true, ENABLED = false;
 function setStylesLoaded() {
    isImageLoaded = true;
    const opContainers = document.getElementsByClassName("opContainer");
    for (let i = 0; i < opContainers.length; ++i) {
        recursiveToggleDisable(opContainers[i], ENABLED);
    }
}

 function setStylesUnloaded() {
    isImageLoaded = false;
    const opContainers = document.getElementsByClassName("opContainer");
    for (let i = 0; i < opContainers.length; ++i) {
        recursiveToggleDisable(opContainers[i], DISABLED);
    }
}

function recursiveToggleDisable(el, state) {
    if (el.tagName === "INPUT" || el.tagName === "BUTTON") {
        el.disabled = state;
    }
    let potentialChildren = el.childNodes;
    for (let j = 0; j < potentialChildren.length; ++j) {
        if (potentialChildren[j].nodeType === Node.ELEMENT_NODE) {
            recursiveToggleDisable(potentialChildren[j], state);
        }
    }
}

// **************************************************************************
// DOM Setup with these encapsulated methods
// **************************************************************************

let elLoadButton = document.getElementById('loadDefaultImageButton');
elLoadButton.addEventListener('click', loadImageByDefaultFilename);
elLoadButton.innerText = 'Load \'' + DEFAULT_FILE + '\'';
document.getElementById('filename').addEventListener('change', loadImageByFileInput);
document.getElementById('reloadButton').addEventListener('click', loadImageByFileInput);

setStylesUnloaded();

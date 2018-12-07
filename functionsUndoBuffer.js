let imgDataHistory = [];  // Scheme: { operation: str - op name, data: canvas img data }
let pointInHistory = 0;

// DEBUG: Undo buffer indices visualisation
// 0 is the blank canvas op
// initial:
// 0             <- length is 1
// ^ pointInHistory is 1
// 0, 1, 2, 3     <- length is 4
//          ^ pointInHistory is 3
// saveOp: simple push, no slice
// 0, 1, 2, 3, 4     <- length is 5
//             ^ pointInHistory is 4
// undo: 4 - 1 = 3
// 0, 1, 2, 3, 4     <- length is 5
//          ^ pointInHistory is 3
// saveOp a: slice(0, 3 + 1): up to but not including index 4
// 0, 1, 2, 3     <- length is 4
// saveOp b: push
// 0, 1, 2, 3, 4'     <- length is 5
//             ^ pointInHistory is 3

 function saveOp(opDescription) {
    if (pointInHistory !== imgDataHistory.length - 1) {
        // A new op wipes out the redo buffer
        imgDataHistory = imgDataHistory.slice(0, pointInHistory + 1);  // +1 so as to not include pointInHistory
    }
    imgDataHistory.push({ operation: opDescription, data: ctx.getImageData(0, 0, width, height) });
    pointInHistory += 1;
    document.getElementById('lastOp').innerText = 'Last operation: ' + opDescription;
    buttonUndo.disabled = false;
    buttonRedo.disabled = true;
}

 function undo() {
    if (pointInHistory !== 0) {  // Should be prevented by button being disabled, but being cautious
        pointInHistory -= 1;
        const previousOp = imgDataHistory[pointInHistory];
        width = previousOp.data.width;
        height = previousOp.data.height;
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(previousOp.data, 0, 0);
        buttonRedo.disabled = false;
        if (pointInHistory === 0) {  // Blank canvas will be first Op. Never let that be undone
            buttonUndo.disabled = true;
            document.getElementById('lastOp').innerText = '';
            setStylesUnloaded();
        } else {
            document.getElementById('lastOp').innerText = 'Last operation: ' + previousOp.operation;
        }
    } else {
        console.warn('Undo buffer is empty');
    }
}

 function redo() {
    if (pointInHistory !== imgDataHistory.length - 1) {
        pointInHistory += 1;
        const nextOp = imgDataHistory[pointInHistory];
        width = nextOp.data.width;
        height = nextOp.data.height;
        canvas.width = width;
        canvas.height = height;
        document.getElementById('lastOp').innerText = 'Last operation: ' + nextOp.operation;
        buttonUndo.disabled = false;
        if (!isImageLoaded) {
            setStylesLoaded();
        }
        ctx.putImageData(nextOp.data, 0, 0);
        if (pointInHistory === imgDataHistory.length - 1) {
            buttonRedo.disabled = true;
        }
    } else {
        console.warn('Redo buffer is empty');
    }
}

// **************************************************************************
// DOM Setup with these encapsulated methods
// **************************************************************************

const buttonUndo = document.getElementById('undoButton');
const buttonRedo = document.getElementById('redoButton');

buttonUndo.addEventListener('click', undo);
buttonRedo.addEventListener('click', redo);

buttonUndo.disabled = true;
buttonRedo.disabled = true;

imgDataHistory.push({ operation: 'init', data: ctx.getImageData(0, 0, 500, 500) });

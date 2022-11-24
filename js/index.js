const loadFileURIName = 'y1.output'; // file to load by default
const loadFileURI = "../finite_automaton/sample_data_file/" + loadFileURIName;

const fileNumRange = [1, 10]
let fileNum = 2;
let downloadFileURIName = 'y' + fileNum + '.output'
let downloadFileURI = "../finite_automaton/sample_data_file/" + loadFileURIName;

const delay = ms => new Promise(res => setTimeout(res, ms));

let renderingEntireGraph = true;

function renderCheckBoxClicked() {
    renderingEntireGraph = document.getElementById("show_entire_graph_input").checked === true;

    if (!anyState_Transition_btn_selected()) {
        generateEntireGraph(-1);
    }
}

function uploadFile(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
        return function(e) {
            parse_y_output(e.target.result);
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function displayCode(fileURI) {
    // initialize with existing file
    fetch(fileURI)
        .then(response => response.text())
        .then(text => parse_y_output(text))
}

function downloadSampleFile() {
    downloadFileURIName = 'y' + fileNum + '.output'
    downloadFileURI = "../finite_automaton/sample_data_file/" + loadFileURIName;

    const link = document.createElement("a");
    link.download = downloadFileURIName;
    link.href = downloadFileURI;
    link.setAttribute("target", "_blank");
    link.click();
    link.remove();

    incrementDownloadCount();
}

function incrementDownloadCount() {
    let minNum = fileNumRange[0];
    let maxNum = fileNumRange[1];

    if (fileNum + 1 > maxNum) {
        fileNum = minNum;
    } else {
        fileNum = fileNum + 1;
    }
}

async function graphOnlyView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");
    const graphCodeView = document.getElementById("graphAndCode");

    graphView.style.width = "90%";
    codeView.style.width = "0%";

    await delay(300);

    graphView.style.width = "100%";
    codeView.style.width = "0%";

    graphCodeView.style.marginLeft = "16px";
    graphCodeView.style.paddingLeft = "0px";
}

async function codeOnlyView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");
    const graphCodeView = document.getElementById("graphAndCode");

    graphView.style.width = "0%";
    codeView.style.width = "90%";

    await delay(300);

    graphView.style.width = "0%";
    codeView.style.width = "100%";

    graphCodeView.style.marginLeft = "0px";
    graphCodeView.style.paddingLeft = "16px";
}

async function graphAndCodeView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");
    const graphCodeView = document.getElementById("graphAndCode");

    if (graphView.style.width === "100%") {
        graphView.style.width = "60%";
        codeView.style.width = "30%";
    } else {
        graphView.style.width = "30%";
        codeView.style.width = "60%";
    }

    await delay(300);

    graphView.style.width = "50%";
    codeView.style.width = "49%"; /* with 50% it goes to the next line */

    graphCodeView.style.marginLeft = "16px";
    graphCodeView.style.paddingLeft = "0px";
}

document.getElementById('upload-btn_input').addEventListener('change', uploadFile, false);

displayCode(loadFileURI);

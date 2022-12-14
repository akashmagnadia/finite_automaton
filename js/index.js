const loadFileURIName = 'y3.output'; // file to load by default
const loadFileURI = "../finite_automaton/sample_data_file/" + loadFileURIName;

const fileNumRange = [1, 10]
let fileNum = 2; // change this number to load a different sample file by default
let downloadFileURIName = 'y' + fileNum + '.output'
let downloadFileURI = "../finite_automaton/sample_data_file/" + loadFileURIName;

// if integrated then it will read the file from the compiler
// if not integrated then it will read the file from the sample_dat_file
const integrated = false;
const integratedCompilerFile = "C:/cygwin64/home/Akash/CS473/cs473-f22-a2-akashmagnadia/y.output";

// let tokenToCreateClusterFor = ["IF", "WHILE", "REPEAT", "VAR", "FUN", "exp"];
let tokenToCreateClusterFor = [];

const delay = ms => new Promise(res => setTimeout(res, ms));

let renderingEntireGraph = true;

function renderCheckBoxClicked() {
    renderingEntireGraph = document.getElementById("show_entire_graph_input").checked === true;

    if (!anyState_Transition_btn_selected() && renderingEntireGraph) {
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

function fetchInternalFile() {
    fetch(loadFileURI)
        .then(response => response.text())
        .then(text => parse_y_output(text))
}
function displayCode() {
    if (integrated) {
        fetch(integratedCompilerFile)
            .then(response => response.text())
            .then(text => parse_y_output(text))
            .catch(() => {
                confirm("Couldn't fetch file from integrated compiler. Therefore loading a sample file.");
                fetchInternalFile();
            })
    } else {
        fetchInternalFile();
    }
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

function showUnderstandDialog() {
    document.getElementById('understand_dialog').style.visibility = "visible";
    document.getElementById('understand_dialog').style.width = "92%"
}

async function hideUnderstandDialog() {
    document.getElementById('understand_dialog').style.width = "0%"
    await delay(300);
    document.getElementById('understand_dialog').style.visibility = "hidden";
}

document.getElementById('upload-btn_input').addEventListener('change', uploadFile, false);

displayCode();

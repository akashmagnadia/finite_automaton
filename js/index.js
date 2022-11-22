const sampleFileURIName = 'y1.output'; // file to load by default
const sampleFileURI = "../finite_automaton/sample_data_file/" + sampleFileURIName;

const delay = ms => new Promise(res => setTimeout(res, ms));

let renderingEntireGraph = true;

function renderCheckBoxClicked() {
    renderingEntireGraph = document.getElementById("show_entire_graph_input").checked === true;
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
    const link = document.createElement("a");
    link.download = sampleFileURIName;
    link.href = sampleFileURI;
    link.setAttribute("target", "_blank");
    link.click();
    link.remove();
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

displayCode(sampleFileURI);

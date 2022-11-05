const sampleFileURI = "sample_data_file/y.output";
const sampleFileURIName = 'y.output';

function uploadFile(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
        return function(e) {
            document.querySelector('#y_output').textContent = e.target.result;
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function downloadSampleFile() {
    const link = document.createElement("a");
    link.download = sampleFileURIName;
    link.href = sampleFileURI;
    link.setAttribute("target", "_blank");
    link.click();
    link.remove();
}

function graphOnlyView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");

    graphView.style.width = "100%";
    codeView.style.width = "0%";
}

function codeOnlyView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");

    graphView.style.width = "0%";
    codeView.style.width = "100%";
}

function graphAndCodeView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");

    graphView.style.width = "50%";
    codeView.style.width = "50%";
}

document.getElementById('upload-btn').addEventListener('change', uploadFile, false);
document.getElementById('sample_download-btn').addEventListener('click', downloadSampleFile, false);

// initialize with existing file
fetch(sampleFileURI)
    .then(response => response.text())
    .then(text => document.querySelector('#y_output').textContent = text)

// initialize with existing file
fetch(sampleFileURI)
    .then(response => response.text())
    .then(text => document.querySelector('#temp_y_output').textContent = text)

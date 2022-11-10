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
            parsed_y_output = parse_y_output(e.target.result);
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function displayCode(fileURI) {
    // initialize with existing file
    fetch(fileURI)
        .then(response => response.text())
        .then(text => document.querySelector('#y_output').textContent = text)

    // initialize with existing file
    fetch(fileURI)
        .then(response => response.text())
        .then(text => document.querySelector('#temp_y_output').textContent = text)
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

document.getElementById('upload-btn_input').addEventListener('change', uploadFile, false);
document.getElementById('sample_download-btn').addEventListener('click', downloadSampleFile, false);

displayCode(sampleFileURI);

function highlightButtonListener(button_group, button_class) {
    // Add active class to the current button (highlight it)
    const group = document.getElementById(button_group);
    const stateButtons = group.getElementsByClassName(button_class);
    for (let i = 0; i < stateButtons.length; i++) {
        stateButtons[i].addEventListener("click", function () {
            const current = group.getElementsByClassName("active");

            if (current.length > 0 && this === current[0]) {
                // if selecting an already selected button
                current[0].className = current[0].className.replace(" active", "");
            } else if (current.length > 0) {
                // if selecting a button different from an already selected button
                current[0].className = current[0].className.replace(" active", "");
                this.className += " active";
            } else {
                // if selecting a button when nothing else is selected
                this.className += " active";
            }
        });
    }
}

highlightButtonListener("stateButtonsGroup", "stateButton");
highlightButtonListener("transitionButtonsGroup", "transitionButton");

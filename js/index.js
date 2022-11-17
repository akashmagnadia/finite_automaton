const sampleFileURIName = 'y5.output'; // file to load by default
const sampleFileURI = "../sample_data_file/" + sampleFileURIName;

const delay = ms => new Promise(res => setTimeout(res, ms));

function uploadFile(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
        return function(e) {
            myGrammar = parse_y_output(e.target.result);

            // TODO: modify it
            // temporary here for alpha testing
            if (f.name === "y1.output") {
                dotToGraph = dots;
            } else {
                dotToGraph = dots1;
            }
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function displayCode(fileURI) {
    // initialize with existing file
    fetch(fileURI)
        .then(response => response.text())
        .then(text => myGrammar = parse_y_output(text))
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

    graphView.style.width = "90%";
    codeView.style.width = "0%";

    await delay(300);

    graphView.style.width = "100%";
    codeView.style.width = "0%";
}

async function codeOnlyView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");

    graphView.style.width = "0%";
    codeView.style.width = "90%";

    await delay(300);

    graphView.style.width = "0%";
    codeView.style.width = "100%";
}

async function graphAndCodeView() {
    const graphView = document.getElementById("graph_screen");
    const codeView = document.getElementById("code_screen");

    graphView.style.width = "30%";
    codeView.style.width = "60%";

    await delay(300);

    graphView.style.width = "50%";
    codeView.style.width = "49%"; /* with 50% it goes to the next line */
}

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

document.getElementById('upload-btn_input').addEventListener('change', uploadFile, false);
document.getElementById('sample_download-btn').addEventListener('click', downloadSampleFile, false);

displayCode(sampleFileURI);

highlightButtonListener("stateButtonsGroup", "stateButton");
highlightButtonListener("transitionButtonsGroup", "transitionButton");

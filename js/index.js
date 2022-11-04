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
    link.download = 'y.output';
    link.href = "sample_data_file/y.output";
    link.setAttribute("target", "_blank");
    link.click();
    link.remove();
}

document.getElementById('upload-btn').addEventListener('change', uploadFile, false);
document.getElementById('sample_download-btn').addEventListener('click', downloadSampleFile, false);

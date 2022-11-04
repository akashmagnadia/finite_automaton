function handleFileSelect(evt) {
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

document.getElementById('upload-btn').addEventListener('change', handleFileSelect, false);

// let reader = new FileReader();
// reader.readAsText()
// document.querySelector('#y_output').textContent = reader.readAsText("sample_data_file/y.output");
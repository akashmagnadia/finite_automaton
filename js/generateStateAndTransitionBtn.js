function generateStateAndTransitionBtn() {
    function addHTMLLinesToCodeScreen(element, linesToAdd) {
        for (let i = 0; i < linesToAdd.length; i++) {
            element.innerHTML += linesToAdd[i];
        }
    }

    function generateButtons(linkButtonToCodeView, highlightButtonListener) {
        document.getElementById('stateButtonsGroup').innerText = "";
        document.getElementById('transitionButtonsGroup').innerText = "";

        let statesToAdd = [];
        let transitionsToAdd = [];
        let _transitionsToAdd = [];
        for (let i = 0; i < myGrammar.states.length; i++) {
            statesToAdd.push('<button id="btn_State_' + i + '" class="filterButtonGroup">' + myGrammar.states[i].currentState + '</button>');

            let currState = myGrammar.states[i];

            // iterate through all shift mapping and avoid duplicate transition tokens
            for (let j = 0; j < currState.shift_mapping.length; j++) {
                if (!transitionsToAdd.includes(currState.shift_mapping[j].token)) {
                    transitionsToAdd.push(currState.shift_mapping[j].token);
                }
            }

            // iterate through all transition mapping and avoid duplicate transition tokens
            for (let j = 0; j < currState.transition_mapping.length; j++) {
                if (!transitionsToAdd.includes(currState.transition_mapping[j].token)) {
                    transitionsToAdd.push(currState.transition_mapping[j].token);
                }
            }
        }

        for (let i = 0; i < transitionsToAdd.length; i++) {
            _transitionsToAdd.push(
                '<button id="btn_Transition_' + transitionsToAdd[i] + '" class="filterButtonGroup">' + transitionsToAdd[i] + '</button>'
            )
        }

        addHTMLLinesToCodeScreen(document.getElementById("stateButtonsGroup"), statesToAdd);
        addHTMLLinesToCodeScreen(document.getElementById("transitionButtonsGroup"), _transitionsToAdd);

        // only link them after buttons have been created
        linkButtonToCodeView();

        highlightButtonListener("stateButtonsGroup");
        highlightButtonListener("transitionButtonsGroup");
    }

    function highlightButtonListener(button_group) {

        // Add active class to the current button (highlight it)
        const group = document.getElementById(button_group);
        const stateButtons = group.getElementsByClassName("filterButtonGroup");

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

    function linkButtonToCodeView() {
        // create and link buttons to the output

        for (let i = 0; i < myGrammar.states.length; i++) {
            document.getElementById("btn_State_" + i).onclick = function () {
                document.getElementById("State " + i).scrollIntoView({
                    behavior: "smooth"
                });
            };
        }

    }

    generateButtons(linkButtonToCodeView, highlightButtonListener);
}
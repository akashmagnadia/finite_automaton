function addHTMLLinesToCodeScreen(element, linesToAdd) {
    for (let i = 0; i < linesToAdd.length; i++) {
        element.innerHTML += linesToAdd[i];
    }
}

function generateButtons(linkButtonToCodeView, highlightButtonListener) {
    document.getElementById('stateButtonsGroup').innerText = "";
    document.getElementById('transitionButtonsGroup').innerText = "";

    let statesToAdd = ['<div class="buttonsName">States: &nbsp;</div>'];
    let transitionsToAdd = [];
    let _transitionsToAdd = ['<div class="buttonsName">Transitions: &nbsp;</div>'];
    for (let i = 0; i < myGrammar.states.length; i++) {
        statesToAdd.push(
            '<button id="btn_State_' + i +
            '" class="filterButtonGroup">' +
            myGrammar.states[i].currentState + ' - ' + myGrammar.states[i].state_num +
            '</button>');

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

    // Add button active class to the current button (highlight it)
    const group = document.getElementById(button_group);
    const stateButtons = group.getElementsByClassName("filterButtonGroup");

    for (let i = 0; i < stateButtons.length; i++) {

        stateButtons[i].addEventListener("click", function () {

            const current = group.getElementsByClassName("btn_active");
            if (current.length > 0 && this === current[0]) {
                // if selecting an already selected button
                current[0].className = current[0].className.replace(" btn_active", "");
            } else if (current.length > 0) {
                // if selecting a button different from an already selected button
                current[0].className = current[0].className.replace(" btn_active", "");
                this.className += " btn_active";
            } else {
                // if selecting a button when nothing else is selected
                this.className += " btn_active";
            }

        });
    }
}

function unSelectActive(idToLookInside, classToRemove) {
    const group = document.getElementById(idToLookInside);
    const activeButtons = group.getElementsByClassName(classToRemove);

    while (activeButtons.length > 0) {
        activeButtons[0].className = activeButtons[0].className.replace(" " + classToRemove, "");
    }
}

function anyState_Transition_btn_selected() {
    let activeButtons = document.getElementById("transitionButtonsGroup").getElementsByClassName("btn_active");
    if (activeButtons.length > 0) { return true; }

    activeButtons = document.getElementById("stateButtonsGroup").getElementsByClassName("btn_active");
    return activeButtons.length > 0;
}

function linkButtonToCodeView() {

    // create and link buttons to the output
    // when state button is clicked unselect transition button and any active state
    // then select the state that was clicked on and make it active in code screen
    let statesButtonGroup = document.getElementById("stateButtonsGroup");
    let statesButtons = statesButtonGroup.getElementsByClassName("filterButtonGroup");

    for (let i = 0; i < statesButtons.length; i++) {
        let statesNum = parseInt(statesButtons[i].id.replace("btn_State_", ""));
        let stateCode = document.getElementById("State " + statesNum);
        let statesButton = document.getElementById(statesButtons[i].id);

        statesButton.onclick = function () {

            if (statesButton.classList.contains("btn_active")) {

                // if the state button was active then deactivate button and all state
                unSelectActive("code_screen", "code_state_active");
                unSelectActive("transitionButtonsGroup", "btn_active");

                if (renderingEntireGraph === true) {
                    generateEntireGraph(-1);
                }
            } else {

                // if the state button was active then deactivate button and all state
                unSelectActive("code_screen", "code_state_active");
                unSelectActive("transitionButtonsGroup", "btn_active");

                // if no state was active or different button was clicked then activate the corresponding state
                stateCode.scrollIntoView({
                    behavior: "smooth"
                });

                stateCode.className += " code_state_active";

                if (renderingEntireGraph === true) {
                    generateEntireGraph(statesNum);
                } else {
                    generateGraphForState(statesNum);
                }
            }
        };
    }

    // when transition button is clicked unselect state button and any active state
    // then select the state that contains all the transition of the one that was selected and
    // make it active in code screen
    let transitionButtonGroup = document.getElementById("transitionButtonsGroup");
    let transitionButtons = transitionButtonGroup.querySelectorAll("*");

    for (let i = 0; i < transitionButtons.length; i++) {
        let transitionName = transitionButtons[i].id.replace("btn_Transition_", "");
        let transitionButton = document.getElementById(transitionButtons[i].id);

        if (transitionButton === null) {
            continue;
        }

        transitionButton.onclick = function () {

            if (transitionButton.classList.contains("btn_active")) {

                // if the transition button was active then deactivate button and all state
                unSelectActive("code_screen", "code_state_active");
                unSelectActive("stateButtonsGroup", "btn_active");

                if (renderingEntireGraph === true) {
                    generateEntireGraph(-1);
                }
            } else {

                // if the transition button was active then deactivate button and all state
                unSelectActive("code_screen", "code_state_active");
                unSelectActive("stateButtonsGroup", "btn_active");

                // and then found out what states need to be highlighted
                let states = getStatesWithTransition(transitionName);

                // scroll to the first state where the transition exists
                document.getElementById("State " + states[0]).scrollIntoView({
                    behavior: "smooth"
                })

                // highlight all states with transition
                for (let j = 0; j < states.length; j++) {
                    let stateCode = document.getElementById("State " + states[j]);
                    stateCode.className += " code_state_active";
                }

                if (renderingEntireGraph === true) {
                    generateGraphWithTransition(transitionName);
                }
            }
        }
    }
}

function generateStateAndTransitionBtn() {
    generateButtons(linkButtonToCodeView, highlightButtonListener);
}
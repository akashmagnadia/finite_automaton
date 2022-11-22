let dotIndex = 0;
let dotGraphToRender = null;

const graphviz = d3
    .select("#graph")
    .graphviz()
    .transition(function () {
        return d3.transition("main")
            .ease(d3.easeLinear)
            .duration(500);
    })
    .logEvents(false);

function render() {
    console.log(dotGraphToRender);

    const dotLines = dotGraphToRender[dotIndex];
    const dot = dotLines.join("");
    graphviz.renderDot(dot).on("end", function () {
        console.log("Finished rendering");
    });
}

function defaultDotStarter() {
    return [
        [
            "digraph {",
            'layout="dot"',
            'node [style="filled"]',
        ],
    ]
}

function dotGeneratorForReduceMapping(i, dots, highLightStateBool) {
    let stringToAdd = '';

    if (myGrammar.states[i].leaf_state === true) {
        let string = '';

        // usually only one reduce rule but also taking care of case for when multiple
        for (let m = 0; m < myGrammar.states[i].reduce_mapping.length; m++) {
            // if multiple reduce rule then go to the next line
            if (string !== '') {
                string += "\n";
            }

            string += myGrammar.states[i].reduce_mapping[m].token;
            string += ' reduce using ' + myGrammar.states[i].reduce_mapping[m].ruleNum;
            string += ' (' + myGrammar.states[i].reduce_mapping[m].ruleName + ')';
        }

        if (myGrammar.states[i].accept_state === true) {
            string = "$default accept";
        }

        stringToAdd += 'fillcolor = \"#EE4B2B\" tooltip = \"' + string + '\"';
    } else {
        // if not reduce state then color the state gray
        stringToAdd += 'fillcolor = \"#eeeeee\" ';
    }

    if (highLightStateBool === true) {
        stringToAdd += ' color = \"RoyalBlue\" penwidth = 3'
    }

    let lineToPush = (myGrammar.states[i].state_num)
        + ' [xlabel=\"' + (myGrammar.states[i].currentState) + '\" '
        + stringToAdd
        + ']';
    dots[0].push(lineToPush);
}

function dotGeneratorForShift_Transition_Mapping(i, dots, transitionToHighlight, mapping, mappingType) {
    let modification = "";

    if (mappingType === "transition") {
        modification = "penwidth = 3";
    } else if (mappingType === "shift") {
        modification = "penwidth = 3";
    }

    for (let k = 0; k < mapping.length; k++) {

        // if trying to highlight transition with their color
        if (transitionToHighlight === mapping[k].token) {

            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (mapping[k].state)
                + '[label=\"' + (mapping[k].token)
                + '\" color = "RoyalBlue" ' + modification + ' len = 1.5]');
        } else {

            // if not trying to highlight the transition
            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (mapping[k].state)
                + '[label=\"' + (mapping[k].token)
                + '\" len = 1.5]');
        }
    }
}

// if statenum is null then nothing to highlight
function generateEntireGraph(stateNumToHighlight) {
    const myDotGraph = defaultDotStarter();

    // go through all the states and create reduce states with tooltips
    for (let i = 0; i < myGrammar.states.length; i++) {
        if (i === stateNumToHighlight) {
            dotGeneratorForReduceMapping(i, myDotGraph, true);
        } else {
            dotGeneratorForReduceMapping(i, myDotGraph, false);
        }
    }

    // go through all the states
    for (let i = 0; i < myGrammar.states.length; i++) {

        // create transitions for shift states
        // TODO: make different kind of arrow for shift and add legend for it
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].shift_mapping, "shift");

        // create transition for regular transitions
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].transition_mapping, "transition");
    }

    // end digraph opening bracket
    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}

function generateGraphForState(i) {
    const myDotGraph = defaultDotStarter();

    dotGeneratorForReduceMapping(i, myDotGraph, false);

    // create transitions for shift states
    dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].shift_mapping, "shift");

    // create transition for regular transitions
    dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].transition_mapping, "transition");

    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}

function generateGraphWithTransition(transitionName) {
    const myDotGraph = defaultDotStarter();

    // go through all the states and create reduce states with tooltips
    for (let i = 0; i < myGrammar.states.length; i++) {
        dotGeneratorForReduceMapping(i, myDotGraph, false);
    }

    // go through all the states
    for (let i = 0; i < myGrammar.states.length; i++) {
        // create transitions for shift states
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, transitionName, myGrammar.states[i].shift_mapping, "shift");

        // create transition for regular transitions
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, transitionName, myGrammar.states[i].transition_mapping, "transition");
    }

    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}
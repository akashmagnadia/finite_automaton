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
            'rankdir=LR;',
            'bgcolor="#eeeeee"',
            'layout="dot"',
            'node [style="filled"]',

            'subgraph cluster_01 { margin=20 label = "Legend";',
            '"Start State" [shape = "doublecircle" fillcolor = "White" ]',
            '"Leaf State" [shape = "circle" fillcolor = "#FFA695" ]',
            '"Start State" -> "Leaf State" [label="Regular Transition" penwidth=1 style=solid]',
            '"Start State" -> "Leaf State" [label="Shift Transition" penwidth=3 style=solid]',
            '}'
        ],
    ]
}

function dotGeneratorForCreatingEachStates(i, dots, highLightStateBool) {

    let stringToAdd = '';

    if (myGrammar.states[i].leaf_state) {
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

        if (myGrammar.states[i].accept_state) {
            string = "$default accept";
        }

        stringToAdd += 'shape = \"circle\" fillcolor = \"#FFA695\" tooltip = \"' + string + '\"';

    } else if (myGrammar.states[i].start_state) {
        stringToAdd += 'shape = \"doublecircle\" fillcolor = \"White\" ';

    } else {
        // if not reduce state then color the state gray
        stringToAdd += 'shape = \"circle\" fillcolor = \"White\" ';
    }

    if (highLightStateBool) {
        stringToAdd += ' color = \"blue\"';
        // adding this since it's becoming harder to read the larger the graph gets
        if (myGrammar.states.length < 20) {
            stringToAdd += ' penwidth = 3'
        } else if (myGrammar.states.length < 50) {
            stringToAdd += ' penwidth = 6'
        } else {
            stringToAdd += ' penwidth = 10'
        }
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
        modification = "penwidth = 1";
    } else if (mappingType === "shift") {
        modification = "penwidth = 3";
    }

    for (let k = 0; k < mapping.length; k++) {

        // if trying to highlight transition with their color
        if (transitionToHighlight === mapping[k].token) {

            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (mapping[k].state)
                + '[label=\"' + (mapping[k].token)
                + '\" color = \"blue\" penwidth = 4 len = 1.5]');
        } else {

            // if not trying to highlight the transition
            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (mapping[k].state)
                + '[label=\"' + (mapping[k].token)
                + '\"' + modification + ' len = 1.5]');
        }
    }
}

// if statenum is null then nothing to highlight
function generateEntireGraph(stateNumToHighlight) {
    const myDotGraph = defaultDotStarter();

    // go through all the states and create reduce states with tooltips
    for (let i = 0; i < myGrammar.states.length; i++) {
        if (i === stateNumToHighlight) {
            dotGeneratorForCreatingEachStates(i, myDotGraph, true);
        } else {
            dotGeneratorForCreatingEachStates(i, myDotGraph, false);
        }
    }

    // go through all the states
    for (let i = 0; i < myGrammar.states.length; i++) {

        // create transitions for shift states
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].shift_mapping, "shift");

        // create transition for regular transitions
        dotGeneratorForShift_Transition_Mapping(i, myDotGraph, "", myGrammar.states[i].transition_mapping, "transition");
    }

    // end digraph opening bracket
    myDotGraph[0].push("}");
    dotGraphToRender = myDotGraph;

    promptForRenderingEntireGraph();
}

function promptForRenderingEntireGraph() {
    let checkBoxStatus = document.getElementById("show_entire_graph_input").checked;
    if (myGrammar.states.length > 50 && checkBoxStatus === true) {
        if (confirm("Rendering entire graph with " + myGrammar.states.length + " states may take some time. Are you sure you would like proceed?")) {
            render();
        } else {
            document.getElementById("show_entire_graph_input").checked = false;
        }
    } else {
        render();
    }
}

function generateGraphForState(i) {
    const myDotGraph = defaultDotStarter();

    dotGeneratorForCreatingEachStates(i, myDotGraph, false);

    for (let j = 0; j < myGrammar.states[i].shift_mapping.length; j++) {
        dotGeneratorForCreatingEachStates(myGrammar.states[i].shift_mapping[j].state, myDotGraph, false);
    }

    for (let j = 0; j < myGrammar.states[i].transition_mapping.length; j++) {
        dotGeneratorForCreatingEachStates(myGrammar.states[i].transition_mapping[j].state, myDotGraph, false);
    }


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
        dotGeneratorForCreatingEachStates(i, myDotGraph, false);
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

    promptForRenderingEntireGraph();
}
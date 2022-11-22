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

function dotGeneratorForReduceMapping(i, dots) {
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

        dots[0].push('' + (myGrammar.states[i].state_num)
            + ' [xlabel=\"' + (myGrammar.states[i].currentState)
            + '\" fillcolor = \"#EE4B2B\" tooltip = \"'
            + string
            + '\"]');

    } else {
        dots[0].push('' + (myGrammar.states[i].state_num)
            + ' [xlabel=\"' + (myGrammar.states[i].currentState)
            + '\"]');
    }
}

function dotGeneratorForShiftMapping(i, dots, transitionToHighlight) {
    // create transitions for shift states
    // TODO: make different kind of arrow for shift and add legend for it

    for (let k = 0; k < myGrammar.states[i].shift_mapping.length; k++) {

        // if trying to highlight transition with their color
        if (transitionToHighlight === myGrammar.states[i].shift_mapping[k].token) {

            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (myGrammar.states[i].shift_mapping[k].state)
                + '[label=\"' + (myGrammar.states[i].shift_mapping[k].token)
                + '\" color = "blue" len = 1.5]');
        } else {

            // if not trying to highlight the transition
            dots[0].push('    ' + (myGrammar.states[i].state_num)
                + ' -> ' + (myGrammar.states[i].shift_mapping[k].state)
                + '[label=\"' + (myGrammar.states[i].shift_mapping[k].token)
                + '\" len = 1.5]');
        }
    }
}

function dotGeneratorForTransitionMapping(i, dots) {
    // create transition for regular transitions
    for (let k = 0; k < myGrammar.states[i].transition_mapping.length; k++) {
        dots[0].push('    ' + (myGrammar.states[i].state_num)
            + ' -> ' + (myGrammar.states[i].transition_mapping[k].state)
            + '[label=\"' + (myGrammar.states[i].transition_mapping[k].token)
            + '\" len = 1.5]');
    }
}

function generateGraph() {
    const myDotGraph = defaultDotStarter();

    // go through all the states and create reduce states with tooltips
    for (let i = 0; i < myGrammar.states.length; i++) {
        dotGeneratorForReduceMapping(i, myDotGraph);
    }

    // go through all the states
    for (let i = 0; i < myGrammar.states.length; i++) {
        dotGeneratorForShiftMapping(i, myDotGraph, "");
        dotGeneratorForTransitionMapping(i, myDotGraph);
    }

    // end digraph opening bracket
    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}

function stateClick(i) {
    const myDotGraph = defaultDotStarter();

    dotGeneratorForReduceMapping(i, myDotGraph);
    dotGeneratorForShiftMapping(i, myDotGraph, "");
    dotGeneratorForTransitionMapping(i, myDotGraph);

    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}

function transClick(transitionName) {
    const myDotGraph = defaultDotStarter();

    // go through all the states and create reduce states with tooltips
    for (let i = 0; i < myGrammar.states.length; i++) {
        dotGeneratorForReduceMapping(i, myDotGraph);
    }

    // go through all the states
    for (let i = 0; i < myGrammar.states.length; i++) {
        dotGeneratorForShiftMapping(i, myDotGraph, transitionName);
        dotGeneratorForTransitionMapping(i, myDotGraph);
    }

    myDotGraph[0].push("}");

    dotGraphToRender = myDotGraph;
    render();
}
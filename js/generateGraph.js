let dotIndex = 0;
const graphviz = d3
    .select("#graph")
    .graphviz()
    .transition(function () {
        return d3.transition("main")
            .ease(d3.easeLinear)
            .duration(1000);
    })
    .logEvents(false);

let dotToGraph = null;

function render(dotToGraph) {
    const dotLines = dotToGraph[dotIndex];
    // const dot = dotToGraph.join("");
    const dot = dotLines.join("");
    console.log(dot);
    graphviz
        .renderDot(dot).on("end", function () {
            console.log("Finished rendering");
            // if (dotIndex === 0) {
            //     dotIndex = 1;
            //     render(dotToGraph);
            // }
    });
}

// function myFunction() {
//     for (let j = 0; j < myGrammar.states.length; j++) {
//         for (let k = 0; k < myGrammar.states[j].shift_mapping.length; k++) {
//             console.log(myGrammar.states[j].shift_mapping[k].token);

//         }
//     }
// }
function dotArray() {
    const dots = [
        [
            "digraph {",
            'layout="dot"',
            'node [style="filled"]',
        ],
    ];

    for (let i = 0; i < myGrammar.states.length; i++) {

        if (myGrammar.states[i].leaf_state == true && myGrammar.states[i].reduce_mapping.length != 0) {
            for (let m = 0; m < myGrammar.states[i].reduce_mapping.length; m++) {
                string = '';
                string += myGrammar.states[i].reduce_mapping[m].token;
                string += ' reduce using ' + myGrammar.states[i].reduce_mapping[m].ruleNum;
                string += ' (' + myGrammar.states[i].reduce_mapping[m].ruleName + ')';
            }
            dots[0].push('' + (myGrammar.states[i].state_num)
                + ' [xlabel=\"' + (myGrammar.states[i].currentState)
                + '\" fillcolor = \"#EE4B2B\" tooltip = \"'
                + string
                + '\"]');

        }
        else {
            dots[0].push('' + (myGrammar.states[i].state_num)
                + ' [xlabel=\"' + (myGrammar.states[i].currentState)
                + '\"]');
        }
    }
    for (let j = 0; j < myGrammar.states.length; j++) {
        if (myGrammar.states[j].shift_mapping.length != 0) {
            for (let k = 0; k < myGrammar.states[j].shift_mapping.length; k++) {
                dots[0].push('    ' + (myGrammar.states[j].state_num)
                    + ' -> ' + (myGrammar.states[j].shift_mapping[k].state)
                    + '[label=\"' + (myGrammar.states[j].shift_mapping[k].token)
                    + '\" len = 1.5]');
            }
        }
        if (myGrammar.states[j].transition_mapping.length != 0) {

            for (let k = 0; k < myGrammar.states[j].transition_mapping.length; k++) {
                dots[0].push('    ' + (myGrammar.states[j].state_num)
                    + ' -> ' + (myGrammar.states[j].transition_mapping[k].state)
                    + '[label=\"' + (myGrammar.states[j].transition_mapping[k].token)
                    + '\" len = 1.5]');
            }
        }


    }
    dots[0].push("}");
    // const fs = require('fs')
    // for (n = 0; n < dots[0].length; n++) {
    //     fs.writeFile('dot.txt', dots[0][n], (err) => {
    //         if (err) throw err;
    //     })
    // }
    // dots.map(x => "'" + x + "'").toString();


    dotToGraph = dots;

    // temp - testing
    // dotToGraph = [
    //     [
    //         'digraph  {',
    //         '    node [style="filled"]',
    //         '    a [fillcolor="#d62728"]',
    //         '    c [fillcolor="#2ca02c"]',
    //         '    b [fillcolor="#1f77b4"]',
    //         '    a -> b',
    //         '    a -> c',
    //         '}'
    //     ],
    //     [
    //         'digraph  {',
    //         '    node [style="filled"]',
    //         '    a [fillcolor="#d62728"]',
    //         '    b [fillcolor="#1f77b4"]',
    //         '    a -> b',
    //         '}'
    //     ],
    //
    // ]

    // dotToGraph = [
    //     [
    //         "digraph {",
    //         'layout="dot"',
    //         'node [style="filled"]',
    //         '0 [xlabel="Start State" fillcolor = "#EE4B2B" tooltip = "$default reduce using 3 (stmts)"]',
    //         '1 [xlabel="RETURN"]',
    //         '2 [xlabel="program"]',
    //         '3 [xlabel="stmts" fillcolor = "#EE4B2B" tooltip = "$default reduce using 1 (program)"]',
    //         '4 [xlabel="stmt" fillcolor = "#EE4B2B" tooltip = "$default reduce using 2 (stmts)"]',
    //         '5 [xlabel="INT_CONSTANT" fillcolor = "#EE4B2B" tooltip = "$default reduce using 5 (exp)"]',
    //         '6 [xlabel="RETURN exp"]',
    //         '7 [xlabel="program $end"]',
    //         '8 [xlabel="RETURN exp SEMICOLON" fillcolor = "#EE4B2B" tooltip = "$default reduce using 4 (stmt)"]',
    //         '    0 -> 1[label="RETURN" len = 1.5]',
    //         '    0 -> 2[label="program" len = 1.5]',
    //         '    0 -> 3[label="stmts" len = 1.5]',
    //         '    0 -> 4[label="stmt" len = 1.5]',
    //         '    1 -> 5[label="INT_CONSTANT" len = 1.5]',
    //         '    1 -> 6[label="exp" len = 1.5]',
    //         '    2 -> 7[label="$end" len = 1.5]',
    //         '    6 -> 8[label="SEMICOLON" len = 1.5]',
    //         "}",
    //     ]
    // ]

    console.log(dotToGraph);
    render(dotToGraph);
}

function stateClick(i) {
    const selectedDot = [
        [
            "digraph {",
            'layout="neato"',
            'node [style="filled"]',
        ],
    ];

    let string = '';

    if (myGrammar.states[i].leaf_state == true && myGrammar.states[i].reduce_mapping.length != 0) {
        for (let m = 0; m < myGrammar.states[i].reduce_mapping.length; m++) {
            string += myGrammar.states[i].reduce_mapping[m].token;
            string += ' reduce using ' + myGrammar.states[i].reduce_mapping[m].ruleNum;
            string += ' (' + myGrammar.states[i].reduce_mapping[m].ruleName + ')';
        }
        selectedDot[0].push((myGrammar.states[i].state_num)
            + ' [xlabel=\"' + (myGrammar.states[i].currentState)
            + '" fillcolor = "#EE4B2B" tooltip = "'
            + string
            + '"]');

    }
    else {
        selectedDot[0].push((myGrammar.states[i].state_num)
            + ' [xlabel="' + (myGrammar.states[i].currentState)
            + '"]');
    }

    if (myGrammar.states[i].shift_mapping.length != 0) {
        for (let k = 0; k < myGrammar.states[i].shift_mapping.length; k++) {
            selectedDot[0].push((myGrammar.states[i].state_num)
                + " -> " + (myGrammar.states[i].shift_mapping[k].state)
                + ' [xlabel="' + (myGrammar.states[i].shift_mapping[k].token)
                + '" len = 1.5]');
        }
    }
    if (myGrammar.states[i].transition_mapping.length != 0) {
        for (let k = 0; k < myGrammar.states[i].transition_mapping.length; k++) {
            selectedDot[0].push((myGrammar.states[i].state_num)
                + " -> " + (myGrammar.states[i].transition_mapping[k].state)
                + ' [xlabel="' + (myGrammar.states[i].transition_mapping[k].token)
                + '" len = 1.5]');
        }
    }

    selectedDot[0].push("}");
    console.log((myGrammar.states[i].currentState) + ' Button Clicked');
    console.log("this is state")
    // console.log(selectedDot);

    //rendering subgraph
    dotToGraph = selectedDot;
    console.log(dotToGraph);
    render(dotToGraph);
}

function transClick(transitionName) {
    const newDot = [
        [
            "digraph {",
            'layout="dot"',
            'node [style="filled"]',
        ],
    ];
    let string = '';
    for (let i = 0; i < myGrammar.states.length; i++) {

        if (myGrammar.states[i].leaf_state == true && myGrammar.states[i].reduce_mapping.length != 0) {
            for (let m = 0; m < myGrammar.states[i].reduce_mapping.length; m++) {
                string = '';
                string += myGrammar.states[i].reduce_mapping[m].token;
                string += ' reduce using ' + myGrammar.states[i].reduce_mapping[m].ruleNum;
                string += ' (' + myGrammar.states[i].reduce_mapping[m].ruleName + ')';
            }
            newDot[0].push((myGrammar.states[i].state_num)
                + ' [xlabel=\"' + (myGrammar.states[i].currentState)
                + '\" fillcolor = \"#EE4B2B\" tooltip = \"'
                + string
                + '\"]');
        }
        else {
            newDot[0].push((myGrammar.states[i].state_num)
                + ' [xlabel=\"' + (myGrammar.states[i].currentState)
                + '\"]');
        }
    }
    for (let j = 0; j < myGrammar.states.length; j++) {
        if (myGrammar.states[j].shift_mapping.length != 0) {
            for (let k = 0; k < myGrammar.states[j].shift_mapping.length; k++) {
                if (transitionName == myGrammar.states[j].shift_mapping[k].token) {
                    newDot[0].push((myGrammar.states[j].state_num)
                        + " -> " + (myGrammar.states[j].shift_mapping[k].state)
                        + ' [xlabel="' + (myGrammar.states[j].shift_mapping[k].token)
                        + '" color = "blue" len = 1.5]');
                }
                else {
                    newDot[0].push((myGrammar.states[j].state_num)
                        + " -> " + (myGrammar.states[j].shift_mapping[k].state)
                        + ' [xlabel="' + (myGrammar.states[j].shift_mapping[k].token)
                        + '" len = 1.5]');
                }
            }
        }
        if (myGrammar.states[j].transition_mapping.length != 0) {
            for (let k = 0; k < myGrammar.states[j].transition_mapping.length; k++) {
                if (transitionName == myGrammar.states[j].transition_mapping[k].token) {
                    newDot[0].push((myGrammar.states[j].state_num)
                        + " -> " + (myGrammar.states[j].transition_mapping[k].state)
                        + ' [xlabel=\"' + (myGrammar.states[j].transition_mapping[k].token)
                        + '\" color = \"blue\" len = 1.5]');
                }
                else {
                    newDot[0].push((myGrammar.states[j].state_num)
                        + " -> " + (myGrammar.states[j].transition_mapping[k].state)
                        + ' [xlabel=\"' + (myGrammar.states[j].transition_mapping[k].token)
                        + '\" len = 1.5]');
                }
            }
        }

    }
    newDot[0].push("}");

    console.log("Transition Click: newdot")
    render(newDot)
    console.log(newDot);
}
// function transClick(transitionName) {
//     const newDot = [
//         [
//             "digraph {",
//             'layout="dot"',
//             'node [style="filled"]',
//         ],
//     ];
//     for (o = 0; o < myGrammar.states.length; o++) {

//         if (myGrammar.states[o].leaf_state == true && myGrammar.states[o].reduce_mapping.length != 0) {
//             for (let m = 0; m < myGrammar.states[o].reduce_mapping.length; m++) {
//                 let string = '';
//                 string += myGrammar.states[o].reduce_mapping[m].token;
//                 string += ' reduce using ' + myGrammar.states[o].reduce_mapping[m].ruleNum;
//                 string += ' (' + myGrammar.states[o].reduce_mapping[m].ruleName + ')';
//             }
//             newDot[0].push((myGrammar.states[o].state_num)
//                 + ' [xlabel=\"' + (myGrammar.states[o].currentState)
//                 + '" fillcolor = "#EE4B2B" tooltip = "'
//                 + string
//                 + '"]');

//         }
//         else {
//             newDot[0].push((myGrammar.states[o].state_num)
//                 + ' [xlabel="' + (myGrammar.states[o].currentState)
//                 + '"]');
//         }


//         if (myGrammar.states[o].shift_mapping.length != 0) {
//             for (let k = 0; k < myGrammar.states[o].shift_mapping.length; k++) {
//                 if (transitionName == myGrammar.states[o].shift_mapping.token) {
//                     newDot[0].push((myGrammar.states[o].state_num)
//                         + " -> " + (myGrammar.states[o].shift_mapping[k].state)
//                         + ' [xlabel="' + (myGrammar.states[o].shift_mapping[k].token)
//                         + '" color = "blue" len = 1.5]');
//                 }
//                 else {
//                     newDot[0].push((myGrammar.states[o].state_num)
//                         + " -> " + (myGrammar.states[o].shift_mapping[k].state)
//                         + ' [xlabel="' + (myGrammar.states[o].shift_mapping[k].token)
//                         + ' len = 1.5]');
//                 }

//             }
//         }
//         if (myGrammar.states[o].transition_mapping.length != 0) {
//             for (let k = 0; k < myGrammar.states[o].transition_mapping.length; k++) {
//                 if (transitionName == myGrammar.states[o].shift_mapping.token) {
//                     newDot[0].push((myGrammar.states[o].state_num)
//                         + " -> " + (myGrammar.states[o].transition_mapping[k].state)
//                         + ' [xlabel="' + (myGrammar.states[o].transition_mapping[k].token)
//                         + '" color = "blue" len = 1.5]');
//                 }
//             }
//         }

//     }
//     newDot[0].push('"}"');
//     console.log(transitionName + ' Button Clicked');
//     console.log("this is transistion")
//     console.log(newDot);
// }


// const dots = [
//     [
//         "digraph  {",
//         '    label = "y1.output viz"',
//         // '    concentrate=true',
//         // 'rotate = 90',
//         '    layout="neato"',
//         '    node [style="filled"]',
//         // '    layout ="sfdp"',
//         // '    beautify = true',
//         '    0 [xlabel="$accept"]',
//         '    1 [xlabel ="RETURN"]',
//         '    2 [xlabel="$accept"]',
//         '    3 [xlabel="stmts" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    4 [xlabel="stmt" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    5 [xlabel="INT_CONSTANT"]',
//         '    6 [xlabel="exp"]',
//         '    7 [xlabel="$end"]',
//         '    8 [xlabel="SEMICOLON"]',
//         '    9 [xlabel="XOR"]',
//         '    10 [xlabel="LT"]',
//         '    11 [xlabel="LE" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    12 [xlabel="GT" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    13 [xlabel="GE" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    14 [xlabel="NE" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    15 [xlabel="EQ" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',
//         '    16 [xlabel="exp" fillcolor="#EE4B2B" tooltip = "$default  reduce using rule 3 (stmts)"]',

//         '    0 -> 1 [label="RETURN" len=1.5]',
//         '    0 -> 2 [label="program" len=1.5]',
//         '    0 -> 3 [label="stmts" len=1.5]',
//         '    0 -> 4 [label="stmt" len=1.5]',
//         '    1 -> 5 [label="INT_CONSTANT" len=1.5]',
//         '    1 -> 6 [label="exp" len=1.5]',
//         '    2 -> 7 [label="$end" len=1.5]',
//         '    2 -> 9 [label="exp" len=1.5]',
//         '    6 -> 8 [label="SEMICOLON" len=1.5]',
//         '    2 -> 10 [label="$end" len=1.5]',
//         '    9 -> 11 [label="$end" len=1.5]',
//         '    8 -> 15 [label="exp EQ" len=1.5]',
//         '    6 -> 10 [label="exp LT" len=1.5]',
//         '    10 -> 16 [label="exp" len=1.5]',
//         '    8 -> 12 [label="GT" len=1.5]',
//         '    6 -> 13 [label="GE" len=1.5]',
//         '    1 -> 14 [label="NE" len=1.5]',
//         '    7 -> 11 [label="NE" len=1.5]',
//         '    5 -> 14 [label="NE" len=1.5]',

//         "}",
//     ],
// ];

// const dots1 = [
//     [
//         "digraph  {",
//         // '    layout="fdp"',
//         '    node [style="filled"]',
//         '    0 [xlabel="$accept"]',
//         '    1 [xlabel="RETURN"]',
//         '    2 [xlabel="WHILE"]',
//         '    3 [xlabel="REPEAT"]',
//         '    4 [xlabel="IF"]',
//         '    5 [xlabel="program"]',
//         '    6 [xlabel="stmts" fillcolor="#EE4B2B" tooltip="reduce using rule 1 (program)"]',
//         '    7 [xlabel="stmt" fillcolor="#EE4B2B" tooltip="reduce using rule 3 (stmts)"]',
//         '    8 [xlabel="INT_CONSTANT" fillcolor="#EE4B2B" tooltip="reduce using rule 8 (exp)"]',
//         '    9 [xlabel="exp"]',
//         '    10 [xlabel="WHILE LEFT_PAR"]',
//         '    11 [xlabel="REPEAT LEFT_PAR"]',
//         '    12 [xlabel="LEFT_PAR"]',
//         '    13 [xlabel="$end"]',
//         '    14 [xlabel="stmt" fillcolor="#EE4B2B" tooltip="reduce using rule 2 (stmts)"]',
//         '    15 [xlabel="SEMICOLON" fillcolor="#EE4B2B" tooltip="reduce using rule 2 (stmts)"]',
//         '    16 [xlabel="exp"]',
//         '    17 [xlabel="exp"]',
//         '    18 [xlabel="exp"]',
//         '    19 [xlabel="RIGHT_PAR"]',
//         '    20 [xlabel="RIGHT_PAR"]',
//         '    21 [xlabel="RIGHT_PAR"]',
//         '    22 [xlabel="LEFT_BRAC"]',
//         '    23 [xlabel="LEFT_BRAC"]',
//         '    24 [xlabel="LEFT_BRAC"]',
//         '    25 [xlabel="stmts"]',
//         '    26 [xlabel="stmts"]',
//         '    27 [xlabel="stmts"]',
//         '    28 [xlabel="RIGHT_BRAC" fillcolor="#EE4B2B" tooltip="reduce using rule 6 (stmts)"]',
//         '    29 [xlabel="RIGHT_BRAC" fillcolor="#EE4B2B" tooltip="reduce using rule 7 (stmts)"]',
//         '    30 [xlabel="RIGHT_BRAC" fillcolor="#EE4B2B" tooltip="reduce using rule 5 (stmts)"]',
//         '    0 -> 1[label="RETURN" len = 1.5]',
//         '    0 -> 2 [label="WHILE" len = 1.5]',
//         '    0 -> 3 [label="REPEAT" len = 1.5]',
//         '    0 -> 4 [label="IF" len = 1.5]',
//         '    0 -> 5 [label="program" len = 1.5]',
//         '    0 -> 6 [label="stmts" len = 1.5]',
//         '    0 -> 7 [label="stmt" len = 1.5]',
//         '    1 -> 8 [label="INT_CONSTANT" len = 1.5]',
//         '    1 -> 9 [label="exp" len = 1.5]',
//         '    2 -> 10 [label="LEFT_PAR" len = 1.5]',
//         '    3 -> 11 [label="LEFT_PAR" len = 1.5]',
//         '    4 -> 12 [label="LEFT_PAR" len = 1.5]',
//         '    5 -> 13 [label="$end" len = 1.5]',
//         '    6 -> 1 [label="RETURN" len = 1.5]',
//         '    6 -> 2 [label="WHILE" len = 1.5]',
//         '    6 -> 3 [label="REPEAT" len = 1.5]',
//         '    6 -> 4 [label="IF" len = 1.5]',
//         '    6 -> 14 [label="stmt" len = 1.5]',
//         '    9 -> 15 [label="SEMICOLON" len = 1.5]',
//         '    10 -> 8 [label="INT_CONSTANT" len = 1.5]',
//         '    10 -> 16 [label="exp" len = 1.5]',
//         '    11 -> 8 [label="INT_CONSTANT" len = 1.5]',
//         '    11 -> 17 [label="exp" len = 1.5]',
//         '    12 -> 8 [label="INT_CONSTANT" len = 1.5]',
//         '    16 -> 19 [label="RIGHT_PAR" len = 1.5]',
//         '    17 -> 20 [label="RIGHT_PAR" len = 1.5]',
//         '    18 -> 21 [label="RIGHT_PAR" len = 1.5]',
//         '    19 -> 22 [label="LEFT_BRAC" len = 1.5]',
//         '    20 -> 23 [label="LEFT_BRAC" len = 1.5]',
//         '    21 -> 24 [label="LEFT_BRAC" len = 1.5]',
//         '    22 -> 1 [label="RETURN" len = 1.5]',
//         '    22 -> 2 [label="WHILE" len = 1.5]',
//         '    22 -> 3 [label="REPEAT" len = 1.5]',
//         '    22 -> 4 [label="IF" len = 1.5]',
//         '    22 -> 25 [label="stmts" len = 1.5]',
//         '    22 -> 7 [label="stmt" len = 1.5]',
//         '    23 -> 1 [label="RETURN" len = 1.5]',
//         '    23 -> 2 [label="WHILE" len = 1.5]',
//         '    23 -> 3 [label="REPEAT" len = 1.5]',
//         '    23 -> 4 [label="IF" len = 1.5]',
//         '    23 -> 26 [label="stmts" len = 1.5]',
//         '    23 -> 7 [label="stmt" len = 1.5]',
//         '    24 -> 1 [label="RETURN" len = 1.5]',
//         '    24 -> 2 [label="WHILE" len = 1.5]',
//         '    24 -> 3 [label="REPEAT" len = 1.5]',
//         '    24 -> 4 [label="IF" len = 1.5]',
//         '    24 -> 27 [label="stmts" len = 1.5]',
//         '    24 -> 7 [label="stmt" len = 1.5]',
//         '    25 -> 1 [label="RETURN" len = 1.5]',
//         '    25 -> 2 [label="WHILE" len = 1.5]',
//         '    25 -> 3 [label="REPEAT" len = 1.5]',
//         '    25 -> 4 [label="IF" len = 1.5]',
//         '    25 -> 28 [label="RIGHT_BRAC" len = 1.5]',
//         '    25 -> 14 [label="stmt" len = 1.5]',
//         '    26 -> 1 [label="RETURN" len = 1.5]',
//         '    26 -> 2 [label="WHILE" len = 1.5]',
//         '    26 -> 3 [label="REPEAT" len = 1.5]',
//         '    26 -> 4 [label="IF" len = 1.5]',
//         '    26 -> 29 [label="RIGHT_BRAC" len = 1.5]',
//         '    26 -> 14 [label="stmt" len = 1.5]',
//         '    27 -> 1 [label="RETURN" len = 1.5]',
//         '    27 -> 2 [label="WHILE" len = 1.5]',
//         '    27 -> 3 [label="REPEAT" len = 1.5]',
//         '    27 -> 4 [label="IF" len = 1.5]',
//         '    27 -> 30 [label="RIGHT_BRAC" len = 1.5]',
//         '    27 -> 14 [label="stmt" len = 1.5]',
//         "}",
//     ],
// ];

// dotToGraph = dots;
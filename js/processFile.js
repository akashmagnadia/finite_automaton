let myGrammar;

class state {
    state_num = -1; // state number
    currentState = ""; // first block
    shift_mapping = []; // second block
    reduce_mapping = []; // third block
    transition_mapping = []; // forth block

    start_state = false;
    leaf_state = false;
    accept_state = false;

    parsed_lines = [];
    parsing_l0 = false;
    parsing_shift = false;
    parsing_reduce = false;
    parsing_transition = false;

    constructor(parsed_lines, state_num) {
        this.parsed_lines = parsed_lines;
        this.state_num = state_num;

        this.parse_blocks();

        if (this.shift_mapping.length === 0 && this.transition_mapping.length === 0) {
            this.leaf_state = true;
        }

        if (this.reduce_mapping.length === 0 && this.leaf_state === true) {
            this.accept_state = true;
        }
    }

    determineParsingStatus(i) {
        if (this.parsed_lines[i] === "") {
            this.parsing_l0 = false;
            this.parsing_shift = false;
            this.parsing_reduce = false;
            this.parsing_transition = false;
            return true;
        }

        // if parsing flag is set to false for all blocks
        if (!((this.parsing_l0 === true || this.parsing_shift === true || this.parsing_reduce === true || this.parsing_transition))) {
            if (this.parsed_lines[i].includes("�") ||
                this.parsed_lines[i].includes("•")) {
                this.parsing_l0 = true;
            } else if (this.parsed_lines[i].includes("shift, and go to state")) {
                this.parsing_shift = true;
            } else if (this.parsed_lines[i].includes("reduce using rule ")) {
                this.parsing_reduce = true;
            } else if (this.parsed_lines[i].includes("go to state")){
                this.parsing_transition = true;
            }
        }

        return false;
    }

    parse_blocks() {
        for (let i = 0; i < this.parsed_lines.length; i++) {

            if (this.determineParsingStatus(i) === true) {
                continue;
            }

            if (this.parsing_l0 === true) {
                let line = "";
                if (this.parsed_lines[i].includes("�")) {
                    line = this.parsed_lines[i].split("�"); // bullet point is read as question mark
                } else if (this.parsed_lines[i].includes("•")) {
                    line = this.parsed_lines[i].split("•");
                }
                const arr = line[0].trimStart().trimEnd().split(" ");

                if (this.currentState === "") {

                    let startAdding = 0;

                    // add all tokens as current state left of the bullet point
                    for (let j = 0; j < arr.length; j++) {
                        if (startAdding === 0) {

                            if (arr[j].includes(":")) {
                                startAdding = 1;
                            }

                        } else if (startAdding === 1) {

                            if (this.currentState !== "") {
                                this.currentState += " " + arr[j];
                            } else {
                                this.currentState += arr[j];
                            }
                        }
                    }

                    // if still empty at the end then it's state 0
                    if (this.currentState === "") {
                        this.currentState = "Start State";
                        this.start_state = true;
                    }
                }
            }

            if (this.parsing_shift === true) {
                const line = this.parsed_lines[i].split("shift, and go to state"); // bullet point is read as question mark
                this.shift_mapping.push({
                        token: line[0].trimStart().trimEnd(),
                        state: parseInt(line[1])
                    });
            }

            if (this.parsing_reduce === true) {
                const line = this.parsed_lines[i].split("reduce using rule "); // bullet point is read as question mark
                const line2 = line[1].split(" ");
                this.reduce_mapping.push({
                    token: line[0].trimStart().trimEnd(),
                    ruleNum: parseInt(line2[0]),
                    ruleName: line2[1].replace("(", "").replace(")", "")
                });
            }

            if (this.parsing_transition === true) {
                const line = this.parsed_lines[i].split("go to state"); // bullet point is read as question mark
                this.transition_mapping.push({
                    token: line[0].trimStart().trimEnd(),
                    state: parseInt(line[1])
                });
            }
        }
    }
}

class grammar {
    stateCounter = 0;

    parsing_unused_terminals = false;
    unused_terminals = [];

    parsing_grammar = false;
    _grammar = [];

    parsing_used_terminals = false;
    used_terminals = [];

    parsing_used_nonTerminals = false;
    used_nonTerminals = [];

    parsing_states = false
    parsed_state_lines = [];

    states = []

    not_parsing_anything() {
        this.parsing_unused_terminals = false;
        this.parsing_grammar = false;
        this.parsing_used_terminals = false;
        this.parsing_used_nonTerminals = false;
        // once parsing state, it's the last big block to be parse so need to set to false
    }

    check_if_in_block(line) {
        // return true if you want to go to the next line and false otherwise
        if (line === "Terminals unused in grammar") {
            myGrammar.parsing_unused_terminals = true;
            return true;
        } else if (line === "Grammar") {
            myGrammar.parsing_grammar = true;
            return true;
        } else if (line === "Terminals, with rules where they appear") {
            myGrammar.parsing_used_terminals = true;
            return true;
        } else if (line === "Nonterminals, with rules where they appear") {
            myGrammar.parsing_used_nonTerminals = true;
            return true;
        } else if (line.includes("State ")) {
            if (myGrammar.parsed_state_lines.length > 0) {
                myGrammar.states.push(new state(myGrammar.parsed_state_lines, myGrammar.stateCounter));
                myGrammar.stateCounter++; // increment state counter after each push
            }

            myGrammar.parsing_states = true;
            myGrammar.parsing_next_state = true;
            myGrammar.parsed_state_lines = [];
            return true;
        }

        return false;
    }

    add_line_to_respective_list(line) {
        if (myGrammar.parsing_unused_terminals === true) {
            myGrammar.unused_terminals.push(line);
        } else if (myGrammar.parsing_grammar === true) {
            myGrammar._grammar.push(line);
        } else if (myGrammar.parsing_used_terminals === true) {
            myGrammar.used_terminals.push(line);
        } else if (myGrammar.parsing_used_nonTerminals === true) {
            myGrammar.used_nonTerminals.push(line);
        } else if (myGrammar.parsing_states === true) {
            myGrammar.parsed_state_lines.push(line);
        }
    }
}

function parse_y_output(parsed_text) {
    myGrammar = new grammar();

    let arr = parsed_text.split(/\r?\n/);

    for (let i = 0; i < arr.length; i++) {

        if (arr[i] === "" && arr[i+1] === "") {
            myGrammar.not_parsing_anything();
            i++;
            continue; // we are done with one block if we see two empty spaces
        } else if (arr[i] === "" && myGrammar.parsing_states === false) {
            continue; // skip over empty spaces
        }

        // check which block currently inside, if not then continue to parse
        if (myGrammar.check_if_in_block(arr[i]) === true) {
            continue;
        }

        myGrammar.add_line_to_respective_list(arr[i]);
    }

    // last parsed state
    if (myGrammar.parsed_state_lines.length > 0) {
        myGrammar.states.push(new state(myGrammar.parsed_state_lines, myGrammar.stateCounter));
    }

    console.log(myGrammar);

    // if there are too many states then don't create the entire graph
    if (myGrammar.states.length > 35) {
        // by default start off with the start state which is state 0
        generateGraphForState(0);

        document.getElementById("show_entire_graph_input").checked = false;
        renderingEntireGraph = false;
    } else {
        // start off with the entire graph
        generateEntireGraph(-1);

        document.getElementById("show_entire_graph_input").checked = true;
        renderingEntireGraph = true;
    }

    generateHTML_Y_output();
    generateStateAndTransitionBtn();
}

function getStatesWithTransition(transitionName) {
    let stateToReturn = [];

    for (let i = 0; i < myGrammar.states.length; i++) {
        let currState = myGrammar.states[i];

        for (let j = 0; j < currState.shift_mapping.length; j++) {
            if (currState.shift_mapping[j].token === transitionName) {
                if (!stateToReturn.includes(currState.state_num)) {
                    stateToReturn.push(currState.state_num);
                }
            }
        }

        for (let j = 0; j < currState.transition_mapping.length; j++) {
            if (currState.transition_mapping[j].token === transitionName) {
                if (!stateToReturn.includes(currState.state_num)) {
                    stateToReturn.push(currState.state_num);
                }
            }
        }
    }

    return stateToReturn;
}
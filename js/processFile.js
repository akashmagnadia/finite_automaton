const {readFileSync} = require('fs');
let parsed_y_output = null;

class state {
    state_num = -1;

    start_state = false;
    leaf_state = false;

    parsed_lines = [];
    currentState = "";

    // first block
    parsing_l0 = false;

    // second block
    parsing_shift = false;

    // third block
    parsing_reduce = false;

    // forth block
    parsing_transition = false;

    constructor(parsed_lines, state_num) {
        this.parsed_lines = parsed_lines;
        this.state_num = state_num;

        this.parsing_l0 = true; // first block always exists
        this.parse_blocks();
    }

    parse_blocks() {
        for (let i = 0; i < this.parsed_lines.length; i++) {
            if (this.parsing_l0 === true) {
                const line = this.parsed_lines[i].split("�"); // bullet point is read as question mark
                const arr = line[0].split(" ");

                if (arr.length > 2 && this.currentState === "") {
                    this.currentState = arr[arr.length - 2];
                    this.currentState = this.currentState.replace(":", "");
                }
            }
        }
    }
}

class grammar {
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
                myGrammar.states.push(new state(myGrammar.parsed_state_lines, myGrammar.get_state_num(line)));
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
            myGrammar.unused_terminals.push(line.replace("    ", ""));
        } else if (myGrammar.parsing_grammar === true) {
            myGrammar._grammar.push(line.replace("    ", ""));
        } else if (myGrammar.parsing_used_terminals === true) {
            myGrammar.used_terminals.push(line.replace("    ", ""));
        } else if (myGrammar.parsing_used_nonTerminals === true) {
            myGrammar.used_nonTerminals.push(line.replace("    ", ""));
        } else if (myGrammar.parsing_states === true) {
            myGrammar.parsed_state_lines.push(line.replace("    ", ""));
        }
    }

    get_state_num(line) {
        const arr = line.split(" ");
        return parseInt(arr[1]); // int number of state
    }
}

let myGrammar = new grammar();

function parse_y_output(parsed_text) {
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
        myGrammar.states.push(new state(myGrammar.parsed_state_lines));
    }

    return parsed_text;
}

const contents = readFileSync("../sample_data_file/y.output", 'utf-8');
parse_y_output(contents);
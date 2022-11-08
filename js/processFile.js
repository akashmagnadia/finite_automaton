const {readFileSync} = require('fs');
let parsed_y_output = null;

class state {
    parsed_lines = [];
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
    parsing_next_state = false;
    parsed_state_lines = [];

    constructor() {
        this.states = new state();
    }

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
                this.states.parsed_lines.push(myGrammar.parsed_state_lines);
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
}

let myGrammar = new grammar();

function parse_y_output(parsed_text) {
    let arr = parsed_text.split(/\r?\n/);

    for (let i = 0; i < arr.length; i++) {

        if (arr[i] === "" && arr[i+1] === "") {
            myGrammar.not_parsing_anything();
            i++;
            continue; // we are done with one block if we see two empty spaces
        } else if (arr[i] === "") {
            continue; // skip over empty spaces
        }

        // check which block currently inside, if not then continue to parse
        if (myGrammar.check_if_in_block(arr[i]) === true) {
            continue;
        }

        myGrammar.add_line_to_respective_list(arr[i]);
    }

    return parsed_text;
}

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    parse_y_output(contents);
}

syncReadFile("../sample_data_file/y.output");
function generateHTML_Y_output() {
    function addHTMLLinesToCodeScreen(element, linesToAdd) {
        for (let i = 0; i < linesToAdd.length; i++) {
            element.innerHTML += linesToAdd[i];
        }
    }

    document.getElementById('code_screen').innerText = "";

    // print out Terminal Unused in Grammar
    let unused_terminals = myGrammar.unused_terminals;

    if (unused_terminals !== []) {
        let id = "terminals_unused_in_grammar";
        addHTMLLinesToCodeScreen(document.getElementById('code_screen'),
            ['<div id="' + id + '">']);

        let linesToAdd = [];
        linesToAdd.push('Terminal Unused in Grammar <br> <br>');

        for (let i = 0; i < unused_terminals.length; i++) {
            linesToAdd.push("&nbsp;&nbsp;&nbsp;&nbsp;" + unused_terminals[i] + "<br>");
        }

        linesToAdd.push('<br> <br> </div>');

        addHTMLLinesToCodeScreen(document.getElementById('terminals_unused_in_grammar'), linesToAdd);
    }

    // print out the Grammar
    let _grammar = myGrammar._grammar;

    if (_grammar !== []) {
        let id = "_grammar";
        addHTMLLinesToCodeScreen(document.getElementById('code_screen'),
            ['<div id="' + id + '">']);

        let linesToAdd = [];
        linesToAdd.push('Grammar <br>');

        for (let i = 0; i < _grammar.length; i++) {

            if (!_grammar[i].includes("|")) {
                linesToAdd.push("<br>");
            }

            linesToAdd.push(_grammar[i].replaceAll(" ", "&nbsp;") + "<br>");
        }

        linesToAdd.push('<br> <br> </div>');

        addHTMLLinesToCodeScreen(document.getElementById('_grammar'), linesToAdd);
    }

    // print out Terminals with rules where they appear
    let terminals = myGrammar.used_terminals;

    if (terminals !== []) {
        let id="used_terminals";
        addHTMLLinesToCodeScreen(document.getElementById('code_screen'),
            ['<div id="' + id + '">']);

        let linesToAdd = [];
        linesToAdd.push('Terminals, with rules where they appear <br> <br>');

        for (let i = 0; i < terminals.length; i++) {
            linesToAdd.push("&nbsp;&nbsp;&nbsp;&nbsp;" + terminals[i] + "<br>");
        }

        linesToAdd.push('<br> <br> </div>');
        addHTMLLinesToCodeScreen(document.getElementById('used_terminals'), linesToAdd);
    }

    // print out Nonterminals with rules where they appear
    let nonTerminals = myGrammar.used_nonTerminals;

    if (nonTerminals !== []) {
        let id = "used_nonTerminals";
        addHTMLLinesToCodeScreen(document.getElementById('code_screen'),
            ['<div id="' + id + '">']);

        let linesToAdd = [];
        linesToAdd.push('Nonterminals, with rules where they appear <br> <br>');

        for (let i = 0; i < nonTerminals.length; i++) {
            linesToAdd.push(nonTerminals[i].replaceAll(" ", "&nbsp;") + "<br>");
        }

        linesToAdd.push('<br> <br> </div>');
        addHTMLLinesToCodeScreen(document.getElementById(id), linesToAdd);
    }

    // print out states
    let states = myGrammar.states;

    if (states !== []) {

        // iterate through each state
        for (let i = 0; i < states.length; i++) {
            let id = "State " + states[i].state_num;
            addHTMLLinesToCodeScreen(document.getElementById('code_screen'),
                ['<div id="' + id + '">']);

            let linesToAdd = [];
            linesToAdd.push('State ' + states[i].state_num + '<br>');

            // iterate through parsed lines within each state
            for (let j = 0; j < states[i].parsed_lines.length; j++) {
                if (states[i].parsed_lines[j] === "") {
                    linesToAdd.push("<br>");
                } else {
                    let toPush = states[i].parsed_lines[j];
                    toPush = toPush
                        .replaceAll(" ", "&nbsp;")
                        .replaceAll("�", "&#x2022;") + '<br>';

                    // if (states[i].parsed_lines[j].includes(":") && states[i].parsed_lines[j].includes("�")) {
                    //     toPush.replace("&nbsp;&nbsp;&nbsp;&nbsp;", "");
                    // }
                    //
                    // if (states[i].parsed_lines[j].includes("|") && states[i].parsed_lines[j].includes("�")) {
                    //     toPush.replace("|", "&nbsp;&nbsp;&nbsp;&nbsp;|");
                    // }


                    linesToAdd.push(toPush);
                }
            }

            linesToAdd.push('<br> <br> </div>');
            addHTMLLinesToCodeScreen(document.getElementById(id), linesToAdd);
        }
    }
}

def grammar(g, t, lines): # simple list for grammar
    grammar_list = []
    for i in range(g + 1, t):
        grammar_list.append(lines[i])
    return grammar_list


def terminal(t, n, lines): # simple list for terminals
    terminal_list = []
    for i in range(t + 1, n):
        terminal_list.append(lines[i])
    return terminal_list


def nonterminal(n, s, lines): # dictionary of dictionaries for each non-terminal
    nonterminal_list = {}
    i = n + 1
    while i < s: # iterating through all the lines in non terminals
        while 'on' not in lines[i]:
            key = lines[i]
            nonterminal_list[key] = {}
            i += 1
        while 'on' in lines[i]:
            if 'on left' in lines[i]:
                nonterminal_list[key]['on left'] = list(map(int, lines[i].strip('on left: ').split()))
                i += 1
            elif 'on right' in lines[i]:
                nonterminal_list[key]['on right'] = list(map(int, lines[i].strip('on right: ').split()))
                i += 1
    return nonterminal_list


def states(s, lines):  # dictionary for states: key being a state, value being a list of statements under the state
    state_list = {}
    i = s
    while i < len(lines):
        count = 0
        while 'State' in lines[i]:
            key = lines[i]
            state_list[key] = []
            count += 1
            i += 1
        while i < len(lines) and 'State' not in lines[i]:
            state_list[key].append(lines[i])
            i += 1
    return state_list


with open('y.output') as f:  # driver code
    lines = [line.strip() for line in f if line.strip()]  # stripping whitespace
    for i in range(len(lines)):
        if lines[i] == 'Grammar':
            g = i
        elif lines[i] == 'Terminals, with rules where they appear':
            t = i
        elif lines[i] == 'Nonterminals, with rules where they appear':
            n = i
        elif lines[i] == 'State 0':
            s1 = i

grammar = grammar(g, t, lines)
print('grammar list: ', grammar)
terminal = terminal(t, n, lines)
print('terminal list: ', terminal)
non_terminal = nonterminal(n, s1, lines)
print('nonterminals: ', non_terminal)
states = states(s1, lines)
print('states: ', states)

print('')

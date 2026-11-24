// Example DFA: Binary strings ending in 1

const dfa = {
    // Set of all states
    states: ["q0", "q1"],

    // Input alphabet
    alphabet: ["0", "1"],

    // Transition function
    transitions: {
        q0: {
            "0": "q0",
            "1": "q1"
        },

        q1: {
            "0": "q0",
            "1": "q1"
        }
    },

    // Initial state
    initialState: "q0",

    // Set of final states
    finalStates: ["q1"]
};

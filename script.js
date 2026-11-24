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



// PART 1: DFA CONFIGURATION VALIDATION


function validateDFA(dfa) {

    // Check whether states are provided
    if (!Array.isArray(dfa.states) || dfa.states.length === 0) {
        throw new Error("DFA must contain at least one state.");
    }

    // Check whether alphabet is provided
    if (!Array.isArray(dfa.alphabet) || dfa.alphabet.length === 0) {
        throw new Error("Alphabet cannot be empty.");
    }

    // Check for duplicate states
    if (new Set(dfa.states).size !== dfa.states.length) {
        throw new Error("Duplicate states are not allowed.");
    }

    // Check for duplicate alphabet symbols
    if (new Set(dfa.alphabet).size !== dfa.alphabet.length) {
        throw new Error("Duplicate alphabet symbols are not allowed.");
    }

    // Check initial state
    if (!dfa.states.includes(dfa.initialState)) {
        throw new Error("Initial state is invalid.");
    }

    // Check final states
    if (!Array.isArray(dfa.finalStates)) {
        throw new Error("Final states must be an array.");
    }

    for (const state of dfa.finalStates) {
        if (!dfa.states.includes(state)) {
            throw new Error(`Invalid final state: ${state}`);
        }
    }

    // Check transition function
    if (!dfa.transitions || typeof dfa.transitions !== "object") {
        throw new Error("Transition function is missing.");
    }

    for (const state of dfa.states) {

        // Every state must have transitions
        const stateTransitions = dfa.transitions[state];

        if (!stateTransitions || typeof stateTransitions !== "object") {
            throw new Error(`Transitions missing for state ${state}.`);
        }

        // Every alphabet symbol must have exactly one transition
        for (const symbol of dfa.alphabet) {

            if (!Object.hasOwn(stateTransitions, symbol)) {
                throw new Error(
                    `Missing transition for state ${state} and symbol ${symbol}.`
                );
            }

            const destination = stateTransitions[symbol];

            // Destination must be a valid state
            if (!dfa.states.includes(destination)) {
                throw new Error(
                    `Invalid destination state: ${destination}`
                );
            }
        }

        // No extra transition symbols are allowed
        for (const symbol of Object.keys(stateTransitions)) {
            if (!dfa.alphabet.includes(symbol)) {
                throw new Error(
                    `Invalid alphabet symbol in transition: ${symbol}`
                );
            }
        }
    }

    // No transitions for undefined states
    for (const state of Object.keys(dfa.transitions)) {
        if (!dfa.states.includes(state)) {
            throw new Error(`Transition defined for unknown state: ${state}`);
        }
    }

    return true;
}
try {
    validateDFA(dfa);
    console.log("DFA configuration is valid!");
} catch (error) {
    console.log("DFA Error:", error.message);
}



// PART 2: DFA SIMULATION ALGORITHM


function simulateDFA(dfa, inputString) {

    // First validate the DFA configuration
    validateDFA(dfa);

    // Check whether input is a string
    if (typeof inputString !== "string") {
        throw new Error("Input must be a string.");
    }

    // Check whether every input symbol belongs to the alphabet
    for (const symbol of inputString) {
        if (!dfa.alphabet.includes(symbol)) {
            throw new Error(`Invalid input symbol: ${symbol}`);
        }
    }

    // Start simulation from the initial state
    let currentState = dfa.initialState;

    // Store the sequence of visited states
    const statePath = [currentState];

    // Store individual execution steps
    const steps = [];

    // Process input one symbol at a time
    for (const symbol of inputString) {

        // Get the next state using the transition function
        const nextState = dfa.transitions[currentState][symbol];

        // Store the current execution step
        steps.push({
            from: currentState,
            input: symbol,
            to: nextState
        });

        // Move to the next state
        currentState = nextState;

        // Add the new state to the path
        statePath.push(currentState);
    }

    // Check whether the final state is accepting
    const accepted = dfa.finalStates.includes(currentState);

    // Return the complete simulation result
    return {
        input: inputString,
        accepted: accepted,
        result: accepted ? "ACCEPTED" : "REJECTED",
        finalState: currentState,
        statePath: statePath,
        steps: steps
    };
}

// Test invalid input
try {
    console.log(simulateDFA(dfa, "102"));
} catch (error) {
    console.log("Input Error:", error.message);
}



// TEST DFA SIMULATION


// ==========================================
// TEST DFA SIMULATION
// ==========================================

const testInputs = ["101", "111", "100", "000", ""];

for (const input of testInputs) {

    // Run DFA simulation
    const result = simulateDFA(dfa, input);

    console.log("\nInput:", input === "" ? "Empty String" : input);
    console.log("Result:", result.result);
    console.log("Final State:", result.finalState);
    console.log("State Path:", result.statePath.join(" -> "));

    // Display step-by-step execution
    console.log("Execution Steps:");

    result.steps.forEach((step, index) => {
        console.log(
            `Step ${index + 1}: ${step.from} --${step.input}--> ${step.to}`
        );
    });
}






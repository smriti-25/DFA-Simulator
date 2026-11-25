//DFA Validation and Simulation




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

    // Check that state names are valid strings
    for (const state of dfa.states) {
        if (typeof state !== "string" || state.trim() === "") {
            throw new Error("State names cannot be empty.");
        }
    }

    // Check that alphabet symbols are valid strings
    for (const symbol of dfa.alphabet) {
        if (typeof symbol !== "string" || symbol.trim() === "") {
            throw new Error("Alphabet symbols cannot be empty.");
        }
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

    // Check transitions for every state
    for (const state of dfa.states) {

        const stateTransitions = dfa.transitions[state];

        // Every state must have transitions
        if (
            !stateTransitions ||
            typeof stateTransitions !== "object" ||
            Array.isArray(stateTransitions)
        ) {
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
            throw new Error(
                `Transition defined for unknown state: ${state}`
            );
        }
    }

    return true;
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



// PART 3: READ DFA CONFIGURATION FROM HTML


// Get comma-separated values from an HTML input
function getCommaSeparatedValues(inputId) {

    const inputElement = document.getElementById(inputId);
    const value = inputElement.value;

    return value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");
}


// Read DFA configuration entered by the user
function getDFAFromHTML() {

    // Read states, alphabet, initial state and final states
    const states = getCommaSeparatedValues("statesInput");

    const alphabet = getCommaSeparatedValues("alphabetInput");

    const initialState = document
        .getElementById("initialStateInput")
        .value.trim();

    const finalStates = getCommaSeparatedValues("finalStatesInput");

    // Store all transitions
    const transitions = {};

    // Read every row from the transition table
    const rows = document.querySelectorAll(
        "#transitionTableBody tr"
    );

    rows.forEach(row => {

        const from = row
            .querySelector(".transition-from")
            .value.trim();

        const symbol = row
            .querySelector(".transition-symbol")
            .value.trim();

        const to = row
            .querySelector(".transition-to")
            .value.trim();

        // Do not allow incomplete transition rows
        if (from === "" || symbol === "" || to === "") {
            throw new Error(
                "Please complete every transition table row."
            );
        }

        // Create an object for the current state if needed
        if (!transitions[from]) {
            transitions[from] = {};
        }

        // Do not allow duplicate transitions
        if (Object.hasOwn(transitions[from], symbol)) {
            throw new Error(
                `Duplicate transition for state ${from} and symbol ${symbol}.`
            );
        }

        // Store the transition
        transitions[from][symbol] = to;
    });

    // Create the DFA object
    const dfa = {
        states: states,
        alphabet: alphabet,
        transitions: transitions,
        initialState: initialState,
        finalStates: finalStates
    };

    return dfa;
}


// ============================================================
// PART 4: HTML SIMULATION AND RESULT DISPLAY
// ============================================================

if (typeof document !== "undefined") {

    // Get the Simulate button
    const simulateButton = document.getElementById("simulateBtn");

    // Run simulation when the user clicks the button
    simulateButton.addEventListener("click", function () {

        const resultStatus = document.getElementById("resultStatus");

        const executionPath = document.getElementById("executionPath");

        const errorMessage = document.getElementById("errorMessage");

        // Clear previous messages
        errorMessage.textContent = "";

        resultStatus.textContent = "Processing...";

        executionPath.textContent = "";

        try {

            // Read DFA configuration from HTML
            const dfa = getDFAFromHTML();

            // Read the input string
            // Empty string is allowed
            const inputString = document
                .getElementById("inputString")
                .value;

            // Validate and simulate the DFA
            const result = simulateDFA(dfa, inputString);

            // Display ACCEPTED or REJECTED
            resultStatus.textContent = result.result;

            // Display execution path
            if (result.steps.length === 0) {

                executionPath.textContent =
                    `Empty string: Start state ${result.finalState}`;

            } else {

                executionPath.textContent = result.steps
                    .map(step =>
                        `${step.from} --${step.input}--> ${step.to}`
                    )
                    .join(" | ");
            }

            // Make simulation data available to visualization.js
            window.currentDFA = dfa;

            window.lastDFAResult = result;
            // Clear previous DFA visualization
            DFAVisualizer.clear();

            // Render DFA diagram and highlight simulation
            DFAVisualizer.render(dfa);
            DFAVisualizer.update(result);
            // Notify visualization.js that simulation is complete
            document.dispatchEvent(
                new CustomEvent("dfa:simulated", {
                    detail: {
                        dfa: dfa,
                        result: result
                    }
                })
            );

        } catch (error) {

            // Display validation or input errors
            resultStatus.textContent = "Simulation failed";

            executionPath.textContent = "";

            errorMessage.textContent = error.message;
        }
    });

    // Make DFA functions available to other browser scripts
    window.DFAEngine = {
        validateDFA: validateDFA,
        simulateDFA: simulateDFA
    };
}


// ============================================================
// PART 5: NODE.JS TESTING
// These tests run only in Node.js, not in the browser.
// ============================================================

if (typeof window === "undefined") {

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


    // Test DFA configuration
    console.log("==================================");
    console.log("DFA CONFIGURATION VALIDATION");
    console.log("==================================");

    try {

        validateDFA(dfa);

        console.log("DFA configuration is valid!");

    } catch (error) {

        console.log("DFA Error:", error.message);
    }


    // Test invalid input
    console.log("\n==================================");
    console.log("INVALID INPUT TEST");
    console.log("==================================");

    try {

        console.log(simulateDFA(dfa, "102"));

    } catch (error) {

        console.log("Input Error:", error.message);
    }


    // Test DFA simulation
    console.log("\n==================================");
    console.log("DFA SIMULATION TESTS");
    console.log("==================================");

    const testInputs = ["101", "111", "100", "000", ""];

    for (const input of testInputs) {

        // Run DFA simulation
        const result = simulateDFA(dfa, input);

        console.log(
            "\nInput:",
            input === "" ? "Empty String" : input
        );

        console.log("Result:", result.result);

        console.log("Final State:", result.finalState);

        console.log("State Path:", result.statePath.join(" -> "));

        // Display step-by-step execution
        console.log("Execution Steps:");

        if (result.steps.length === 0) {

            console.log("No transitions. Input is empty.");

        } else {

            result.steps.forEach((step, index) => {

                console.log(
                    `Step ${index + 1}: ${step.from} --${step.input}--> ${step.to}`
                );
            });
        }
    }


    // ========================================================
    // PART 6: TEST INVALID DFA CONFIGURATIONS
    // ========================================================

    function testInvalidDFA(name, testDFA) {

        console.log("\nTesting:", name);

        try {

            validateDFA(testDFA);

            console.log("Unexpected: DFA was accepted.");

        } catch (error) {

            console.log("Correctly rejected:", error.message);
        }
    }


    // Test 1: Missing transition
    const missingTransitionDFA = {
        ...dfa,

        transitions: {
            q0: { "0": "q0" },
            q1: { "0": "q0", "1": "q1" }
        }
    };

    testInvalidDFA("Missing Transition", missingTransitionDFA);


    // Test 2: Invalid destination state
    const invalidDestinationDFA = {
        ...dfa,

        transitions: {
            q0: { "0": "q0", "1": "q5" },
            q1: { "0": "q0", "1": "q1" }
        }
    };

    testInvalidDFA("Invalid Destination", invalidDestinationDFA);


    // Test 3: Invalid initial state
    const invalidInitialDFA = {
        ...dfa,

        initialState: "q5"
    };

    testInvalidDFA("Invalid Initial State", invalidInitialDFA);


    // Test 4: Invalid final state
    const invalidFinalDFA = {
        ...dfa,

        finalStates: ["q5"]
    };

    testInvalidDFA("Invalid Final State", invalidFinalDFA);


    // Test 5: Duplicate states
    const duplicateStatesDFA = {
        ...dfa,

        states: ["q0", "q1", "q1"]
    };

    testInvalidDFA("Duplicate States", duplicateStatesDFA);


    // Test 6: Duplicate alphabet symbols
    const duplicateAlphabetDFA = {
        ...dfa,

        alphabet: ["0", "1", "1"]
    };

    testInvalidDFA("Duplicate Alphabet Symbols", duplicateAlphabetDFA);
}

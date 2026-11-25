# DFA Simulator – Test Cases

**Project:** DFA Simulator  
**Milestone:** 2  
**Member:** Member 3 – DFA Visualization and Testing

## 1. Objective
To test the DFA simulator using a DFA that accepts binary strings ending in 1 and rejects strings ending in 0.

## 2. Functional Test Cases

| Test Case ID | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-01 | 101 | Accepted | Accepted | PASS |
| TC-02 | 111 | Accepted | Accepted | PASS |
| TC-03 | 100 | Rejected | Rejected | PASS |
| TC-04 | 000 | Rejected | Rejected | PASS |
| TC-05 | Empty String | Rejected | Rejected | PASS |
| TC-06 | Invalid symbol (10a1) | Invalid input error | Invalid input symbol: a | PASS |
## 3. Invalid Configuration Test Cases

| Test Case ID | Condition | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-06 | Invalid symbol (10a1) | Invalid input error | Invalid input symbol: a | PASS |
| TC-07 | Missing transition | Validation error | Please complete every transition table row | PASS |
| TC-08 | Invalid initial state | Validation error | Initial state is invalid | PASS |
| TC-09 | Invalid final state | Validation error | Invalid final state: q5 | PASS |
| TC-10 | Invalid transition destination | Validation error | Invalid destination state: q5 | PASS |

## 4. Testing Procedure

1. Open the DFA Simulator using Live Server.
2. Configure the DFA.
3. Enter the test input.
4. Click the Simulate button.
5. Compare the actual output with the expected result.
6. Record the result and mark Pass or Fail.

## 5. Conclusion

All test cases from TC-01 to TC-10 were executed successfully. The DFA simulator correctly accepts valid inputs, rejects invalid inputs, and displays validation errors for invalid configurations. All test cases passed successfully.
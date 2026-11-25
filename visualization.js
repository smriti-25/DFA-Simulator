
// ==========================================
// MEMBER 3: DFA VISUALIZATION
// ==========================================

const DFAVisualizer = (() => {
    let currentDFA = null;
    let currentResult = null;

    const NS = "http://www.w3.org/2000/svg";

    function createSVGElement(tag, attributes = {}) {
        const element = document.createElementNS(NS, tag);

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });

        return element;
    }

    function render(dfa) {
        const container = document.getElementById("dfa-visualization");

        if (!container) {
            console.error("DFA visualization container not found!");
            return;
        }

        if (!dfa || !Array.isArray(dfa.states) || dfa.states.length === 0) {
            container.textContent = "No DFA states available.";
            return;
        }

        currentDFA = dfa;
        currentResult = null;

        const width = 750;
        const height = 450;
        const radius = 35;
        const centerX = width / 2;
        const centerY = height / 2;

        const svg = createSVGElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            role: "img",
            "aria-label": "DFA State Diagram"
        });

        // Arrow marker
        const defs = createSVGElement("defs");
        const marker = createSVGElement("marker", {
            id: "dfa-arrow",
            markerWidth: 10,
            markerHeight: 10,
            refX: 8,
            refY: 3,
            orient: "auto"
        });

        marker.appendChild(createSVGElement("path", {
            d: "M0,0 L0,6 L9,3 z",
            fill: "#64748b"
        }));

        defs.appendChild(marker);
        svg.appendChild(defs);

        // Calculate state positions
        const positions = {};
        const count = dfa.states.length;

        dfa.states.forEach((state, index) => {
            const angle = (2 * Math.PI * index / count) - Math.PI / 2;

            positions[state] = {
                x: count === 1 ? centerX : centerX + 230 * Math.cos(angle),
                y: count === 1 ? centerY : centerY + 145 * Math.sin(angle)
            };
        });

        // Draw initial state incoming arrow
        const initialPosition = positions[dfa.initialState];

        if (initialPosition) {
            const startX = initialPosition.x - 85;
            const startY = initialPosition.y;

            svg.appendChild(createSVGElement("path", {
                d: `M ${startX} ${startY} L ${initialPosition.x - radius - 5} ${initialPosition.y}`,
                stroke: "#16a34a",
                "stroke-width": 2.5,
                fill: "none",
                "marker-end": "url(#dfa-arrow)"
            }));
        }

        // Draw transitions
        const transitions = dfa.transitions || {};

        Object.entries(transitions).forEach(([from, symbols]) => {
            Object.entries(symbols).forEach(([symbol, to]) => {
                if (!positions[from] || !positions[to]) return;

                const a = positions[from];
                const b = positions[to];

                if (from === to) {
                    const loop = createSVGElement("path", {
                        d: `M ${a.x - 20} ${a.y - 28}
                            C ${a.x - 85} ${a.y - 100},
                              ${a.x + 85} ${a.y - 100},
                              ${a.x + 20} ${a.y - 28}`,
                        stroke: "#64748b",
                        "stroke-width": 2,
                        fill: "none",
                        "marker-end": "url(#dfa-arrow)",
                        class: "dfa-transition"
                    });

                    svg.appendChild(loop);

                    const label = createSVGElement("text", {
                        x: a.x,
                        y: a.y - 90,
                        "text-anchor": "middle",
                        class: "dfa-transition-label"
                    });

                    label.textContent = symbol;
                    svg.appendChild(label);

                } else {
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const startX = a.x + dx / distance * radius;
                    const startY = a.y + dy / distance * radius;
                    const endX = b.x - dx / distance * (radius + 5);
                    const endY = b.y - dy / distance * (radius + 5);

                    const line = createSVGElement("path", {
                        d: `M ${startX} ${startY} L ${endX} ${endY}`,
                        stroke: "#64748b",
                        "stroke-width": 2,
                        fill: "none",
                        "marker-end": "url(#dfa-arrow)",
                        class: "dfa-transition",
                        "data-from": from,
                        "data-to": to,
                        "data-symbol": symbol
                    });

                    svg.appendChild(line);

                    const label = createSVGElement("text", {
                        x: (startX + endX) / 2,
                        y: (startY + endY) / 2 - 9,
                        "text-anchor": "middle",
                        class: "dfa-transition-label"
                    });

                    label.textContent = symbol;
                    svg.appendChild(label);
                }
            });
        });

        // Draw states
        dfa.states.forEach(state => {
            const position = positions[state];
            const group = createSVGElement("g", {
                class: "dfa-state",
                "data-state": state
            });

            // Final states have double circles
            if (dfa.finalStates.includes(state)) {
                group.appendChild(createSVGElement("circle", {
                    cx: position.x,
                    cy: position.y,
                    r: radius + 6,
                    class: "dfa-final-ring"
                }));
            }

            group.appendChild(createSVGElement("circle", {
                cx: position.x,
                cy: position.y,
                r: radius,
                class: "dfa-state-circle"
            }));

            const text = createSVGElement("text", {
                x: position.x,
                y: position.y + 5,
                "text-anchor": "middle",
                class: "dfa-state-label"
            });

            text.textContent = state;
            group.appendChild(text);

            svg.appendChild(group);
        });

        container.replaceChildren(svg);
    }

    // Highlight simulation execution
    function update(result) {
        const container = document.getElementById("dfa-visualization");

        if (!container || !currentDFA || !result) return;

        currentResult = result;

        const path = result.statePath || [];
        const finalState = result.finalState;

        container.querySelectorAll(".dfa-state").forEach(group => {
            const state = group.getAttribute("data-state");

            group.classList.remove("visited", "current", "accepted", "rejected");

            if (path.includes(state)) {
                group.classList.add("visited");
            }

            if (state === finalState) {
                group.classList.add(result.accepted ? "accepted" : "rejected");
                group.classList.add("current");
            }
        });

        // Highlight executed transitions
        container.querySelectorAll(".dfa-transition").forEach(line => {
            line.classList.remove("path-active");
        });

        (result.steps || []).forEach(step => {
            const line = Array.from(
                container.querySelectorAll(".dfa-transition")
            ).find(item =>
                item.getAttribute("data-from") === step.from &&
                item.getAttribute("data-to") === step.to &&
                item.getAttribute("data-symbol") === step.input
            );

            if (line) line.classList.add("path-active");
        });
    }

    function updateDFA(newDFA) {
        render(newDFA);
    }

    function clear() {
        const container = document.getElementById("dfa-visualization");

        if (container) container.replaceChildren();

        currentDFA = null;
        currentResult = null;
    }

    return {
        render,
        update,
        updateDFA,
        clear
    };
})();


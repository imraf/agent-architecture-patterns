# Agent Architecture Patterns
![Agent Architecture Patterns Thumbnail](thumbnail.jpg)

## Project Overview
**Agent Architecture Patterns** is a condensed guide designed to help developers understand and implement multi-agent systems. It explores common orchestration patterns and provides examples.

The project is served as a responsive web interface to explore different patterns, including:
*   **Sequential**: Step-by-step pipelines.
*   **Concurrent**: Parallel execution for broadcasting tasks.
*   **Group Chat**: Collaborative dialogue managed by a router.
*   **Handoff**: Dynamic routing to specialized agents.

Each pattern comes with real-world analogies, step-by-step breakdowns, and copy-pasteable Python implementation examples.

## How to Contribute

This project is built as a static web page, making it easy to extend and modify.

### Where is the data?
All the content—including pattern descriptions, analogies, examples, and code snippets—is stored in **`data.js`**. The data is structured in a JSON-like object called `patternData`.

### How to make changes?

1.  **Add or Edit Patterns**:
    *   Open `data.js`.
    *   Locate the `patternData` object.
    *   To edit an existing pattern, find its key (e.g., `sequential`, `concurrent`) and modify the `title`, `description`, `analogy`, or `examples`.
    *   To add a new pattern, add a new key to `patternData` following the existing structure.

2.  **Add or Edit Examples**:
    *   Inside a pattern object, look for the `examples` array.
    *   Each example object contains:
        *   `title`: The name of the example.
        *   `intro`: A brief goal description.
        *   `steps`: An array of steps explaining the flow.
        *   `implementations`: An array containing code for different frameworks (e.g., Semantic Kernel, CrewAI).

3.  **Update Logic or Styles**:
    *   **`script.js`**: Contains the logic for tab switching, dynamic content rendering, and syntax highlighting. Modify this if you need to change how data is displayed or interactions work.
    *   **`styles.css`**: Contains all the styling. Modify this to change the look and feel of the application.
    *   **`index.html`**: The main entry point. Modify this to change the navigation menu or general layout structure.

## License

This project is open-source and available under the MIT License.



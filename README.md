# SYNAPSE

SYNAPSE is a lightweight, browser-based coding environment for experimenting with HTML, CSS, and JavaScript in one place. Write code in the split editor, run it instantly, and inspect the result in the built-in live preview.

> **Academic context:** SYNAPSE was developed as a first-year mini project.

## Features

- Dedicated HTML, CSS, and JavaScript editors
- Live preview rendered in an isolated iframe
- Auto-run with a short debounce to keep editing responsive
- Manual **Run** and **Clear** controls
- Session persistence with browser `localStorage`
- Tab-key indentation inside all editors
- Resizable editor and preview sections
- Mobile tabs for switching between editors on smaller screens
- Dark, responsive interface with no build step or external runtime dependency

## Getting Started

### Run locally

1. Clone or download the repository.
2. Open `index.html` in a modern browser.
3. Enter HTML, CSS, and JavaScript in the corresponding panels.
4. Use **Run** to compile the code, or leave **Auto-Run** enabled for automatic updates.

You can also serve the folder with any static file server if your browser restricts local iframe behavior. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Usage

| Control | Description |
| --- | --- |
| **Auto-Run** | Compiles the preview automatically after editing pauses briefly. |
| **Run** | Compiles the current editor contents immediately. |
| **Clear** | Removes the HTML, CSS, and JavaScript currently in the editors. |
| Resize handle | Drag the divider to change the space allocated to the editors and preview. |

Editor contents are saved to the browser under the `synapse_session` local storage key whenever the preview is compiled. Clearing the editors does not remove the saved session until another compilation stores the empty state.

## Project Structure

```text
.
├── index.html   # Application markup and editor layout
├── script.js    # Compilation, persistence, controls, and responsive interactions
├── style.css    # Application styling and responsive layout
└── README.md    # Project documentation
```

## How It Works

When the code is compiled, SYNAPSE builds a complete HTML document from the three editor values and assigns it to the preview iframe through `srcdoc`. CSS is placed in the document head, while JavaScript is executed after the HTML body has been created. JavaScript errors are caught and written to the preview frame's console.

## Security Note

The preview executes the JavaScript entered by the user. Only run code you trust, especially when using a shared or unfamiliar browser profile. Session data is stored locally in the browser and is not sent to a server by this project.

## Browser Support

Use a current version of Chrome, Edge, Firefox, or Safari for the best experience. JavaScript must be enabled for the editor, live preview, and local persistence to work.

## License

No license has been specified for this repository yet. Add a license file before distributing or reusing the project publicly.
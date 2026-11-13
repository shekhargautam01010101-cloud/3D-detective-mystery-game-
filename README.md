# Blackwood Mystery 3D

A complete, browser-based low-poly detective game made with plain HTML, CSS, JavaScript and Three.js **r160** from a pinned CDN URL. There is no build step or package installation.

## Run with VS Code Live Server

1. Download or clone this repository and open its folder in VS Code.
2. Install/enable the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server** (or click **Go Live**).
4. The game loads Three.js from jsDelivr, so an internet connection is required. No local server-side code is used.

## How to play

Start the case briefing with **Enter the mansion**, then click Inspector Rao’s response to begin. Explore the connected rooms, look for glowing evidence, and speak with each suspect. Collecting evidence updates the Evidence Board. You need at least four clues to open an accusation; select the suspect and exactly two clues to present.

### Controls

- **W / A / S / D** — walk
- **Shift** — run
- **Mouse or touchpad drag** — rotate the third-person camera
- **Arrow keys** — rotate and tilt the camera
- **E** — collect nearby evidence or speak to a nearby suspect
- **Tab** — open/close the Evidence Board
- **Esc** — close the open panel

The canvas disables browser touch scrolling so pointer dragging also works on touchscreen laptops. Movement is blocked by mansion walls. On a laptop with integrated graphics, the game uses low-poly models, simple lighting, no real-time shadows, and a maximum pixel ratio of 1.5.

Inspector Rao supplies a hint after two minutes without an action. Wrong accusations consume one of three attempts; a correct accusation needs Karan and at least two of clues 2, 3 and 4. A successful case displays elapsed time, clues found and a rank.

## Rooms

Main Hall, Study, Library, Garden, Kitchen, Guest Room and Security Room are arranged as connected walkable spaces with door openings. The HUD displays the room you are currently in.

## Spoiler — solution

> **Karan, Arjun’s nephew, is the murderer.** Arjun’s new will removed Karan from the inheritance (clue 2), muddy prints show the murderer came from the garden (clue 3), and a cufflink marked **K** was found under the study desk (clue 4). Any two of these three are valid proof for the final accusation. The security log clears Rahul; the household and phone records clear Aman and Priya.

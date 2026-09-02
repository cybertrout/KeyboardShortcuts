const shortcutBank = {
  1: [
    {
      action: "Copy the selected text.",
      windows: { keys: ["control", "c"], label: "Ctrl + C" },
      mac: { keys: ["meta", "c"], label: "⌘˜ + C" }
    },
    {
      action: "Paste what you copied.",
      windows: { keys: ["control", "v"], label: "Ctrl + V" },
      mac: { keys: ["meta", "v"], label: "⌘˜ + V" }
    },
    {
      action: "Cut the selected text.",
      windows: { keys: ["control", "x"], label: "Ctrl + X" },
      mac: { keys: ["meta", "x"], label: "⌘˜ + X" }
    },
    {
      action: "Undo your last action.",
      windows: { keys: ["control", "z"], label: "Ctrl + Z" },
      mac: { keys: ["meta", "z"], label: "⌘˜ + Z" }
    },
    {
      action: "Select everything on the page or in the document.",
      windows: { keys: ["control", "a"], label: "Ctrl + A" },
      mac: { keys: ["meta", "a"], label: "⌘˜ + A" }
    }
  ],
  2: [
    {
      action: "Find a word on this page.",
      windows: { keys: ["control", "f"], label: "Ctrl + F" },
      mac: { keys: ["meta", "f"], label: "⌘˜ + F" }
    },
    {
      action: "Save your current document.",
      windows: { keys: ["control", "s"], label: "Ctrl + S" },
      mac: { keys: ["meta", "s"], label: "⌘˜ + S" }
    },
    {
      action: "Open a new browser tab.",
      windows: { keys: ["control", "t"], label: "Ctrl + T" },
      mac: { keys: ["meta", "t"], label: "⌘˜ + T" },
      mode: "builder"
    },
    {
      action: "Close the current browser tab.",
      windows: { keys: ["control", "w"], label: "Ctrl + W" },
      mac: { keys: ["meta", "w"], label: "⌘˜ + W" },
      mode: "builder"
    },
    {
      action: "Refresh the current page.",
      windows: { keys: ["control", "r"], label: "Ctrl + R" },
      mac: { keys: ["meta", "r"], label: "⌘˜ + R" },
      mode: "builder"
    }
  ],
  3: [
    {
      action: "Open Task Manager directly.",
      windows: { keys: ["control", "shift", "escape"], label: "Ctrl + Shift + Esc" },
      mac: { keys: ["meta", "option", "escape"], label: "⌘˜ + Option + Esc" },
      mode: "builder"
    },
    {
      action: "Open the Run dialog.",
      windows: { keys: ["meta", "r"], label: "Windows + R" },
      mac: { keys: ["meta", "space"], label: "⌘˜ + Space" },
      mode: "builder"
    },
    {
      action: "Open File Explorer.",
      windows: { keys: ["meta", "e"], label: "Windows + E" },
      mac: { keys: ["meta", "option", "space"], label: "⌘˜ + Option + Space" },
      mode: "builder"
    },
    {
      action: "Lock your computer.",
      windows: { keys: ["meta", "l"], label: "Windows + L" },
      mac: { keys: ["control", "meta", "q"], label: "Control + ⌘˜ + Q" },
      mode: "builder"
    },
    {
      action: "Switch to another open application.",
      windows: { keys: ["alt", "tab"], label: "Alt + Tab" },
      mac: { keys: ["meta", "tab"], label: "⌘˜ + Tab" },
      mode: "builder"
    }
  ],
  4: [
    {
      action: "A program has frozen. Open the tool that lets you inspect and end running processes.",
      windows: { keys: ["control", "shift", "escape"], label: "Ctrl + Shift + Esc" },
      mac: { keys: ["meta", "option", "escape"], label: "âŒ˜ + Option + Esc" },
      mode: "builder"
    },
    {
      action: "You need to quickly search a long incident-response page for the word â€œmalware.â€",
      windows: { keys: ["control", "f"], label: "Ctrl + F" },
      mac: { keys: ["meta", "f"], label: "⌘˜ + F" },
      mode: "builder"
    },
    {
      action: "You are stepping away from a workstation containing sensitive information. Secure it immediately.",
      windows: { keys: ["meta", "l"], label: "Windows + L" },
      mac: { keys: ["control", "meta", "q"], label: "Control + ⌘˜ + Q" },
      mode: "builder"
    },
    {
      action: "You are editing a configuration file and accidentally deleted an important line. Reverse your last action.",
      windows: { keys: ["control", "z"], label: "Ctrl + Z" },
      mac: { keys: ["meta", "z"], label: "⌘˜ + Z" },
      mode: "builder"
    },
    {
      action: "You need to launch a Windows command by opening the Run dialog.",
      windows: { keys: ["meta", "r"], label: "Windows + R" },
      mac: { keys: ["meta", "space"], label: "⌘˜ + Space" },
      mode: "builder"
    }
  ]
};

let currentLevel = 1;
let platform = "windows";
let currentMission = null;
let missionNumber = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let correct = 0;
let attempts = 0;
let timeLeft = 90;
let timer = null;
let acceptingInput = false;

const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  results: document.getElementById("results-screen")
};

const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const timeEl = document.getElementById("time");
const levelLabel = document.getElementById("level-label");
const progressLabel = document.getElementById("progress-label");
const missionText = document.getElementById("mission-text");
const shortcutDisplay = document.getElementById("shortcut-display");
const feedback = document.getElementById("feedback");
const hintBtn = document.getElementById("hint-btn");
const skipBtn = document.getElementById("skip-btn");
const quitBtn = document.getElementById("quit-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const menuBtn = document.getElementById("menu-btn");
const builder = document.getElementById("builder");
const builderKeys = document.getElementById("builder-keys");
const submitBuilder = document.getElementById("submit-builder");
let builderSelection = new Set();

document.querySelectorAll(".level-card").forEach(button => {
  button.addEventListener("click", () => {
    currentLevel = Number(button.dataset.level);
    startGame();
  });
});

hintBtn.addEventListener("click", showHint);
skipBtn.addEventListener("click", () => nextMission());
quitBtn.addEventListener("click", endGame);
playAgainBtn.addEventListener("click", startGame);
menuBtn.addEventListener("click", () => showScreen("start"));
submitBuilder.addEventListener("click", gradeBuilder);

window.addEventListener("keydown", handleShortcut, true);

function startGame() {
  platform = document.getElementById("platform").value;
  timeLeft = Number(document.getElementById("round-length").value);
  score = 0;
  streak = 0;
  bestStreak = 0;
  correct = 0;
  attempts = 0;
  missionNumber = 0;
  updateStats();
  showScreen("game");
  nextMission();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function nextMission() {
  acceptingInput = false;
  feedback.textContent = "";
  feedback.className = "feedback";
  shortcutDisplay.textContent = "PRESS THE SHORTCUT";
  shortcutDisplay.className = "shortcut-display";

  const bank = shortcutBank[currentLevel];
  let next = bank[Math.floor(Math.random() * bank.length)];

  if (bank.length > 1 && currentMission) {
    while (next === currentMission) {
      next = bank[Math.floor(Math.random() * bank.length)];
    }
  }

  currentMission = next;
  missionNumber++;
  levelLabel.textContent = `LEVEL ${currentLevel}`;
  progressLabel.textContent = `MISSION ${missionNumber}`;
  missionText.textContent = currentMission.action;

  if (currentMission.mode === "builder") {
    acceptingInput = false;
    shortcutDisplay.textContent = "BUILD THE SHORTCUT";
    setupBuilder();
  } else {
    builder.classList.add("hidden");
    setTimeout(() => {
      acceptingInput = true;
    }, 250);
  }
}


function setupBuilder() {
  builderSelection = new Set();
  builder.classList.remove("hidden");
  builderKeys.innerHTML = "";

  const expected = currentMission[platform].keys;
  const pool = new Set(expected);

  ["control", "shift", "alt", "meta", "tab", "escape", "space", "e", "l", "r", "t", "w", "f", "z"].forEach(k => pool.add(k));

  [...pool].forEach(key => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key-choice";
    button.dataset.key = key;
    button.textContent = displayKeyName(key);
    button.addEventListener("click", () => {
      if (builderSelection.has(key)) {
        builderSelection.delete(key);
        button.classList.remove("selected");
      } else {
        builderSelection.add(key);
        button.classList.add("selected");
      }
    });
    builderKeys.appendChild(button);
  });
}

function displayKeyName(key) {
  const names = {
    control: "Ctrl",
    shift: "Shift",
    alt: "Alt / Option",
    meta: platform === "mac" ? "⌘˜ Cmd" : "Windows",
    tab: "Tab",
    escape: "Esc",
    space: "Space"
  };
  return names[key] || key.toUpperCase();
}

function gradeBuilder() {
  if (!currentMission || currentMission.mode !== "builder") return;

  attempts++;
  const expected = currentMission[platform].keys;

  if (sameKeys([...builderSelection], expected)) {
    correct++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
    const streakBonus = Math.min(streak * 10, 100);
    const points = 100 + streakBonus;
    score += points;
    feedback.textContent = `ACCESS GRANTED  +${points}`;
    feedback.className = "feedback correct";
    shortcutDisplay.textContent = currentMission[platform].label;
    shortcutDisplay.className = "shortcut-display hint";
    updateStats();
    setTimeout(nextMission, 850);
  } else {
    streak = 0;
    score = Math.max(0, score - 15);
    feedback.textContent = "INCORRECT” ADJUST YOUR KEYS";
    feedback.className = "feedback incorrect";
    updateStats();
  }
}

function handleShortcut(event) {
  if (!screens.game.classList.contains("active") || !acceptingInput) return;

  const expected = currentMission[platform].keys;
  const pressed = normalizeEvent(event);

  if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
    return;
  }

  event.preventDefault();

  attempts++;

  if (sameKeys(pressed, expected)) {
    acceptingInput = false;
    correct++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);

    const streakBonus = Math.min(streak * 10, 100);
    const points = 100 + streakBonus;
    score += points;

    feedback.textContent = `ACCESS GRANTED  +${points}`;
    feedback.className = "feedback correct";
    shortcutDisplay.textContent = currentMission[platform].label;
    shortcutDisplay.className = "shortcut-display hint";
    updateStats();

    setTimeout(nextMission, 800);
  } else {
    streak = 0;
    score = Math.max(0, score - 15);
    feedback.textContent = "INCORRECT” TRY AGAIN";
    feedback.className = "feedback incorrect";
    updateStats();
  }
}

function normalizeEvent(event) {
  const keys = [];

  if (event.ctrlKey) keys.push("control");
  if (event.metaKey) keys.push("meta");
  if (event.altKey) keys.push("alt");
  if (event.shiftKey) keys.push("shift");

  let key = event.key.toLowerCase();
  if (key === "esc") key = "escape";
  if (!["control", "meta", "alt", "shift"].includes(key)) {
    keys.push(key);
  }

  return keys.sort();
}

function sameKeys(a, b) {
  const aa = [...a].sort();
  const bb = [...b].sort();
  return aa.length === bb.length && aa.every((value, index) => value === bb[index]);
}

function showHint() {
  if (!currentMission) return;
  score = Math.max(0, score - 25);
  shortcutDisplay.textContent = currentMission[platform].label;
  shortcutDisplay.className = "shortcut-display hint";
  feedback.textContent = "HINT USED  -25";
  feedback.className = "feedback incorrect";
  updateStats();
}

function updateStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  timeEl.textContent = timeLeft;
}

function endGame() {
  clearInterval(timer);
  acceptingInput = false;

  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  document.getElementById("final-score").textContent = score;
  document.getElementById("correct-count").textContent = correct;
  document.getElementById("best-streak").textContent = bestStreak;
  document.getElementById("accuracy").textContent = `${accuracy}%`;

  let message = "Keep building those keyboard reflexes.";
  if (accuracy >= 90 && correct >= 8) message = "Elite shortcut reflexes. Nice work.";
  else if (accuracy >= 75) message = "Strong round. You are getting fast.";
  else if (accuracy >= 50) message = "Good progress. Run the level again and beat your score.";

  document.getElementById("results-message").textContent = message;
  showScreen("results");
}

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

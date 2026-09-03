function handleShortcut(event) {
  if (!screens.game.classList.contains("active") || !acceptingInput) return;

  // Ignore modifier keys by themselves.
  const modifierKeys = ["Control", "Shift", "Alt", "Meta"];

  if (modifierKeys.includes(event.key)) {
    return;
  }

  const expected = currentMission[platform].keys;
  const pressed = normalizeEvent(event);

  // If no modifier key is being held, ignore the key press.
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

    feedback.textContent = `ACCESS GRANTED +${points}`;
    feedback.className = "feedback correct";

    shortcutDisplay.textContent = currentMission[platform].label;
    shortcutDisplay.className = "shortcut-display hint";

    updateStats();

    setTimeout(nextMission, 800);

  } else {
    streak = 0;
    score = Math.max(0, score - 15);

    feedback.textContent = "INCORRECT — TRY AGAIN";
    feedback.className = "feedback incorrect";

    updateStats();
  }
}

const habits = [
  {
    name: "Read for 10 minutes",
    category: "Learning",
    description: "Read a book, article, scripture passage, or class material for 10 focused minutes."
  },
  {
    name: "Take a short walk",
    category: "Health",
    description: "Walk outside or around your home for a few minutes to reset your mind and body."
  },
  {
    name: "Clean one small area",
    category: "Home",
    description: "Choose one desk, drawer, shelf, or counter and make it cleaner than it was before."
  },
  {
    name: "Write three sentences",
    category: "Reflection",
    description: "Write three honest sentences about your day, your goal, or what you learned."
  },
  {
    name: "Plan tomorrow",
    category: "Focus",
    description: "Write one task you want to complete tomorrow and place it somewhere visible."
  },
  {
    name: "Practice a skill",
    category: "Growth",
    description: "Spend 10 minutes practicing a skill like cooking, designing, language, or drawing."
  }
];

const prompts = [
  "What small action helped you move forward today?",
  "What made today easier than expected?",
  "What was difficult, and how did you respond?",
  "What small win can you recognize today?",
  "What will you repeat tomorrow?"
];

function cleanText(text) {
  return text
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#039;`);
}

function getSavedReflections() {
  const savedReflections = localStorage.getItem(`smallStepsReflections`);
  return savedReflections ? JSON.parse(savedReflections) : [];
}

function saveReflections(reflections) {
  localStorage.setItem(`smallStepsReflections`, JSON.stringify(reflections));
}

function getSelectedHabit() {
  return localStorage.getItem(`smallStepsSelectedHabit`) || habits[0].name;
}

function saveSelectedHabit(habitName) {
  localStorage.setItem(`smallStepsSelectedHabit`, habitName);
}

function getMilestoneText(dayCount) {
  if (dayCount >= 100) {
    return `You completed the 100-day challenge!`;
  }

  if (dayCount >= 50) {
    return `Reach Day 100 to complete the full challenge!`;
  }

  if (dayCount >= 10) {
    return `Reach Day 50 to complete your halfway milestone!`;
  }

  return `Reach Day 10 to complete your first milestone!`;
}

function updateProgressDisplay() {
  const reflections = getSavedReflections();
  const dayCount = reflections.length;
  const percentComplete = Math.min(dayCount, 100);
  const dayCountElement = document.querySelector(`#dayCount`);
  const progressFillElement = document.querySelector(`#progressFill`);
  const streakCountElement = document.querySelector(`#streakCount`);
  const completedCountElement = document.querySelector(`#completedCount`);
  const milestoneTextElement = document.querySelector(`#milestoneText`);

  if (dayCountElement) {
    dayCountElement.textContent = `Day ${dayCount} of 100`;
  }

  if (progressFillElement) {
    progressFillElement.style.width = `${percentComplete}%`;
  }

  if (streakCountElement) {
    streakCountElement.textContent = `Current streak: ${dayCount} days`;
  }

  if (completedCountElement) {
    completedCountElement.textContent = `Total habits completed: ${dayCount}`;
  }

  if (milestoneTextElement) {
    milestoneTextElement.textContent = getMilestoneText(dayCount);
  }
}

function updateHomeHabit() {
  const todayHabitElement = document.querySelector(`#todayHabit`);
  const reflectionPromptElement = document.querySelector(`#reflectionPrompt`);

  if (todayHabitElement) {
    todayHabitElement.textContent = getSelectedHabit();
  }

  if (reflectionPromptElement) {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    reflectionPromptElement.textContent = randomPrompt;
  }
}

function renderHabitCards() {
  const habitListElement = document.querySelector(`#habitList`);

  if (!habitListElement) {
    return;
  }

  const habitCards = habits.map((habit) => `
    <article class="card dashed-card habit-card">
      <div>
        <h3>${habit.name}</h3>
        <p><strong>Category:</strong> ${habit.category}</p>
        <p>${habit.description}</p>
      </div>
      <button class="choose-habit" type="button" data-habit="${habit.name}">Use This Habit</button>
    </article>
  `);

  habitListElement.innerHTML = habitCards.join(``);

  document.querySelectorAll(`.choose-habit`).forEach((button) => {
    button.addEventListener(`click`, () => {
      saveSelectedHabit(button.dataset.habit);

      document.querySelectorAll(`.choose-habit`).forEach((habitButton) => {
        habitButton.textContent = `Use This Habit`;
      });

      button.textContent = `Selected`;
    });
  });
}

function renderReflections() {
  const reflectionListElement = document.querySelector(`#reflectionList`);

  if (!reflectionListElement) {
    return;
  }

  const reflections = getSavedReflections();

  if (reflections.length === 0) {
    reflectionListElement.innerHTML = `<p>No reflections saved yet. Save your first reflection on the Home page.</p>`;
    return;
  }

  const recentReflections = reflections.slice(-5).reverse();
  const reflectionCards = recentReflections.map((reflection) => `
    <article class="reflection-item">
      <h3>${cleanText(reflection.date)}</h3>
      <p><strong>Habit:</strong> ${cleanText(reflection.habit)}</p>
      <p><strong>Mood:</strong> ${cleanText(reflection.mood)}</p>
      <p>${cleanText(reflection.text)}</p>
    </article>
  `);

  reflectionListElement.innerHTML = reflectionCards.join(``);
}

function setupReflectionForm() {
  const reflectionForm = document.querySelector(`#reflectionForm`);
  const formMessageElement = document.querySelector(`#formMessage`);

  if (!reflectionForm) {
    return;
  }

  reflectionForm.addEventListener(`submit`, (event) => {
    event.preventDefault();

    const reflectionText = document.querySelector(`#reflection`).value.trim();
    const mood = document.querySelector(`#mood`).value;

    if (reflectionText.length < 3) {
      formMessageElement.textContent = `Please write a little more before saving.`;
      return;
    }

    const reflections = getSavedReflections();
    const newReflection = {
      date: new Date().toLocaleDateString(),
      habit: getSelectedHabit(),
      mood: mood,
      text: reflectionText
    };

    reflections.push(newReflection);
    saveReflections(reflections);
    reflectionForm.reset();
    formMessageElement.textContent = `Reflection saved. Your progress has been updated.`;
    updateProgressDisplay();
  });
}

function setupNewHabitButton() {
  const newHabitButton = document.querySelector(`#newHabitButton`);
  const todayHabitElement = document.querySelector(`#todayHabit`);

  if (!newHabitButton || !todayHabitElement) {
    return;
  }

  newHabitButton.addEventListener(`click`, () => {
    const currentHabit = getSelectedHabit();
    const otherHabits = habits.filter((habit) => habit.name !== currentHabit);
    const randomHabit = otherHabits[Math.floor(Math.random() * otherHabits.length)];

    saveSelectedHabit(randomHabit.name);
    todayHabitElement.textContent = randomHabit.name;
  });
}

function setupClearProgressButton() {
  const clearProgressButton = document.querySelector(`#clearProgressButton`);
  const clearMessageElement = document.querySelector(`#clearMessage`);

  if (!clearProgressButton) {
    return;
  }

  clearProgressButton.addEventListener(`click`, () => {
    const reflections = getSavedReflections();

    if (reflections.length === 0) {
      clearMessageElement.textContent = `There is no saved progress to clear.`;
      return;
    }

    localStorage.removeItem(`smallStepsReflections`);
    clearMessageElement.textContent = `Progress cleared.`;
    updateProgressDisplay();
    renderReflections();
  });
}

function setCurrentYear() {
  document.querySelectorAll(`.current-year`).forEach((element) => {
    element.textContent = `${new Date().getFullYear()}`;
  });
}

setCurrentYear();
updateHomeHabit();
updateProgressDisplay();
renderHabitCards();
renderReflections();
setupReflectionForm();
setupNewHabitButton();
setupClearProgressButton();

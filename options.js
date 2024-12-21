document.addEventListener('DOMContentLoaded', () => {
  const rulesContainer = document.getElementById('rules');
  let currentRules = [];

  chrome.storage.sync.get(['rules'], (result) => {
    currentRules = result.rules || [];
    renderRules();
  });

  function createRuleElement() {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <input type="text" class="website" placeholder="Website (e.g., youtube.com)" />
      <input type="text" class="reminder" placeholder="Reminder text" />
      <input type="text" class="links" placeholder="Links (comma-separated)" />
      <button class="delete-btn">Delete</button>
    `;
    return div;
  }

  function renderRules() {
    rulesContainer.innerHTML = '';
    currentRules.forEach((rule, index) => {
      const element = createRuleElement();
      element.querySelector('.website').value = rule.website;
      element.querySelector('.reminder').value = rule.reminder;
      element.querySelector('.links').value = rule.links.join(', ');
      element.querySelector('.delete-btn').onclick = () => {
        currentRules.splice(index, 1);
        renderRules();
      };
      rulesContainer.appendChild(element);
    });
  }

  document.getElementById('addRule').addEventListener('click', () => {
    rulesContainer.appendChild(createRuleElement());
  });

  document.getElementById('save').addEventListener('click', () => {
    const rules = Array.from(rulesContainer.getElementsByClassName('rule')).map(rule => ({
      website: rule.querySelector('.website').value,
      reminder: rule.querySelector('.reminder').value,
      links: rule.querySelector('.links').value.split(',').map(link => link.trim())
    }));

    chrome.storage.sync.set({ rules }, () => {
      alert('Settings saved!');
    });
  });
});

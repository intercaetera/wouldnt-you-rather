chrome.storage.sync.get(['rules', 'dismissedUntil'], (result) => {
  const rules = result.rules || [];
  const dismissedUntil = result.dismissedUntil || {};
  const currentUrl = window.location.hostname;
  
  const matchingRule = rules.find(rule => 
    currentUrl.includes(rule.website)
  );

  if (matchingRule) {
    const currentTime = new Date().getTime();
    const dismissedTime = dismissedUntil[currentUrl] || 0;
    
    if (currentTime < dismissedTime) {
      return;
    }

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 500px;
      font-size: 16px;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginRight = '8px';
    closeButton.onclick = () => notification.remove();

    const dismissButton = document.createElement('button');
    dismissButton.textContent = 'Dismiss for 3 hours';
    dismissButton.onclick = () => {
      const threeHours = 3 * 60 * 60 * 1000;
      const dismissUntil = currentTime + threeHours;

      chrome.storage.sync.get(['dismissedUntil'], (result) => {
        const dismissedUntil = result.dismissedUntil || {};
        dismissedUntil[currentUrl] = dismissUntil;
        chrome.storage.sync.set({ dismissedUntil });
      });

      notification.remove();
    };

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.appendChild(closeButton);
    buttonContainer.appendChild(dismissButton);
    
    notification.innerHTML = `
      <h1>Wouldn&apos;t you rather...</h1>
      <p>${matchingRule.reminder}</p>
      <div style="margin-top: 10px;">
        ${matchingRule.links.map(link => `
          <a href="${link}" target="_blank" style="display: block; margin: 5px 0;">${link}</a>
        `).join('')}
      </div>
    `;

    notification.appendChild(buttonContainer);
    
    document.body.appendChild(notification);
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'pomo.html' });
});

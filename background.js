chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'PICKED') chrome.storage.local.set({ pendingPick: { selector: msg.selector, preview: msg.preview, tabId: sender.tab?.id } });
});

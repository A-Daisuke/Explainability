export const startRecording = async () => {
  chrome.storage.local.set({
    recordingStartTime: Date.now(),
    restarting: false,
    recording: true,
  });

  // Check if customRegion is set
  const { customRegion } = await chrome.storage.local.get(["customRegion"]);

  const { recordingType } = await chrome.storage.local.get(["recordingType"]);

  if (recordingType === "region") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        try {
          const url = new URL(tab.url);
          let hostname = url.hostname;

          if (hostname.startsWith("www.")) {
            hostname = hostname.slice(4);
          }

          chrome.storage.local.set({ recordedTabDomain: hostname });
        } catch (e) {
          console.warn("Could not parse tab URL for domain:", e);
        }
      }
    });
  }

  if (customRegion) {
    sendMessageRecord({ type: "start-recording-tab", region: true });
  } else {
    sendMessageRecord({ type: "start-recording-tab" });
  }
  chrome.action.setIcon({ path: "assets/recording-logo.png" });
  // Set up alarm if set in storage
  const { alarm } = await chrome.storage.local.get(["alarm"]);
  const { alarmTime } = await chrome.storage.local.get(["alarmTime"]);
  if (alarm) {
    const seconds = parseFloat(alarmTime);
    chrome.alarms.create("recording-alarm", { delayInMinutes: seconds / 60 });
  }
};

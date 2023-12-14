document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_EXTRACT_URL = "https://bikroy.com/en/ad";

  document.getElementById("copyBtn").addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    if (
      activeTab.status === "complete" &&
      activeTab.url.includes(PRODUCT_EXTRACT_URL)
    ) {
      chrome.tabs
        .sendMessage(activeTab.id, { type: "copyProduct" })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});

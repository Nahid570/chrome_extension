document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_EXTRACT_URL = "https://bikroy.com/en/ad";

  const createPostButton = document.getElementById("create_post");

  createPostButton.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://bikroy.com/en/post-ad" });
  });

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
          const copyBtn = document.getElementById("copyBtn");
          if (response.success) {
            copyBtn.innerText = "Copied";
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});

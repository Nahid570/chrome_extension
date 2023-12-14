console.log("Is content script running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === "copyProduct") {
    ExtractProductDetails();
    sendResponse({ success: true });
  }

  if (message.type === "getProduct") {
    console.log("Getting products!...");
    getProductDetails();
    sendResponse({ success: true });
  }

  if (message.type === "pageRefreshed") {
    getProductDetails();
    sendResponse({ success: true });
  }
});

// Extract Product Information from Product Details page and Save to Chrome Sync Storage
function ExtractProductDetails() {
  const title = document.querySelector(".title--3s1R8").innerHTML;
  const price = document
    .querySelector(".amount--3NTpl")
    .innerHTML.split(" ")[1];
  const description = document.querySelector(
    ".expandable-container--1kbq7 .description--1nRbz"
  ).innerHTML;
  const productinfo = document.querySelectorAll(
    ".ad-meta--17Bqm .full-width--XovDn"
  );

  const formattedDescription = description
    .replace(/<\/p><p>/g, "\n")
    .replace(/<p>|<\/p>/g, "");

  // Extracted Product Information
  let extractedProductInfo = {};
  productinfo.forEach((info) => {
    const labelElement = info.querySelector(".word-break--2nyVq.label--3oVZK");
    const valueElement = info.querySelector(".word-break--2nyVq.value--1lKHt");
    if (labelElement && valueElement) {
      const label = labelElement.textContent.trim().replace(":", "");
      const value = valueElement.textContent.trim();

      // Store the information in the object
      extractedProductInfo[label] = value;
    }
  });

  // Set all the product information into the Chrome Storage
  chrome.storage.sync.set({
    title,
    price,
    productinfo: extractedProductInfo,
    description: formattedDescription,
  });
}

function getProductDetails() {
  const title_input = document.getElementById("input_title");
  const description_input = document.querySelector(
    ".textarea-container--1Yuq5 .textarea--a2X6r"
  );
  const price_input = document.getElementById("input_price");

  chrome.storage.sync.get(
    ["title", "price", "productinfo", "description"],
    (data) => {
      let newPrice = "";
      for (let i = 0; i < data.price.length; i++) {
        if (data.price[i] !== ",") {
          newPrice += data.price[i];
        }
      }
      if (title_input) {
        // title_input.value = data.title ?? "";
      }
      if (description_input) {
        description_input.value = "Hello World";
      }
      // price_input.value = newPrice ?? "";
    }
  );
}

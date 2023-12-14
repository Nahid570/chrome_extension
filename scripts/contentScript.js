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

  const conditionRadio = document.querySelectorAll(
    ".custom-radio--1pHhU .sr-only--4m2kh"
  );
  const brand_input = document.getElementById("input_Brand");
  const model_input = document.getElementById("input_5");

  chrome.storage.sync.get(
    ["title", "price", "productinfo", "description"],
    (data) => {
      console.log(data);
      let newPrice = "";
      for (let i = 0; i < data.price.length; i++) {
        if (data.price[i] !== ",") {
          newPrice += data.price[i];
        }
      }
      setTimeout(() => {
        title_input.value = data.title ?? "";
        title_input.dispatchEvent(new Event("input", { bubbles: true }));
      }, 0);

      // Price input
      setTimeout(() => {
        price_input.value = newPrice ?? "";
        price_input.dispatchEvent(new Event("input", { bubbles: true }));
      }, 50); // A slight delay to ensure events do not interfere

      // Description input
      setTimeout(() => {
        description_input.value = data.description ?? "";
        description_input.dispatchEvent(new Event("input", { bubbles: true }));
      }, 100);

      if (data.productinfo.Condition) {
        setTimeout(() => {
          conditionRadio.forEach((radioBtn) => {
            if (radioBtn.value === data.productinfo.Condition.toLowerCase()) {
              radioBtn.checked = true;
              radioBtn.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });
        }, 110);
      }

      if (data.productinfo.Brand) {
        console.log("Is brand executing ?");
        setTimeout(() => {
          const brand_dropdown = document.querySelector("form");
          console.log(brand_dropdown);
          // selectOptionFromDropdown(brand_dropdown, data.productinfo.Brand);
        }, 120);

        // if (data.productinfo.Model) {
        //   setTimeout(() => {
        //     model_input.value = data.productinfo.Model;
        //     model_input.dispatchEvent(new Event("input", { bubbles: true }));
        //   }, 130);
        // }
      }
    }
  );
}

function selectOptionFromDropdown(dropdownElement, value) {
  const options = dropdownElement.querySelectorAll("li[role='option");
  console.log(options);
  // console.log(options);
}

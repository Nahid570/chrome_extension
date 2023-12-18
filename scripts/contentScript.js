console.log("Is content script running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === "copyProduct") {
    ExtractProductDetails();
    sendResponse({ success: true });
  }

  if (message.type === "getProduct") {
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
  const allSelectFields = document.querySelectorAll(
    ".config-fields-wrapper--3rndl .form-field-wrapper--SzdnY"
  );

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
      if (title_input) {
        setTimeout(() => {
          title_input.value = data.title ?? "";
          title_input.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }

      // Price input
      if (price_input) {
        setTimeout(() => {
          price_input.value = newPrice ?? "";
          price_input.dispatchEvent(new Event("input", { bubbles: true }));
        }, 50); // A slight delay to ensure events do not interfere
      }

      // Description input
      if (description_input) {
        setTimeout(() => {
          description_input.value = data.description ?? "";
          description_input.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }, 100);
      }

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
        // const getBtns = allSelectFields[1].querySelectorAll(
        //   ".dropdown-wrapper--HTHHu .dd-button-wrapper--28F_E"
        // );
        // console.log(getBtns);
        selectDesireDropdown(allSelectFields[1]);
        const options = allSelectFields[1].querySelector(".menu--1PZC_");
        setTimeout(() => {
          const allOptions = options.querySelectorAll(".item--184dY");
          selectedoption(allOptions, data.productinfo.Brand);

          const modelDropdownBtns = allSelectFields[1].querySelectorAll(
            ".dropdown-wrapper--HTHHu .dd-button-wrapper--28F_E"
          );
          const modelResetBtns = allSelectFields[1].querySelectorAll(
            ".dropdown-wrapper--HTHHu .reset-button--16akp"
          );
          // console.log(modelDropdownBtns);

          setTimeout(() => {
            // getBtns[1].click();
            if (modelResetBtns[1]) {
              modelResetBtns[1].click();
            }
            modelDropdownBtns[1].click();
            let modelOptions =
              allSelectFields[1].querySelectorAll(".menu--1PZC_");

            setTimeout(() => {
              const allModelOptions =
                modelOptions[1].querySelectorAll(".item--184dY");
              selectedoption(allModelOptions, data.productinfo.Model);
            }, 0);
          }, 1000);
        }, 0);
      }

      // RAM
      if (data.productinfo.RAM) {
        selectDesireDropdown(allSelectFields[2]);
        setTimeout(() => {
          const options = allSelectFields[2].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          selectedoption(allOptions, data.productinfo.RAM);
        }, 20);
      } else {
        selectDesireDropdown(allSelectFields[2]);
        setTimeout(() => {
          const options = allSelectFields[2].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          allOptions[0].click();
        }, 20);
      }

      // Processor
      if (data.productinfo.Processor) {
        selectDesireDropdown(allSelectFields[3]);
        setTimeout(() => {
          const options = allSelectFields[3].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          selectedoption(allOptions, data.productinfo.Processor);
        }, 40);
      } else {
        selectDesireDropdown(allSelectFields[3]);
        setTimeout(() => {
          const options = allSelectFields[3].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          allOptions[0].click();
        }, 40);
      }

      // HDD
      if (data.productinfo.HDD) {
        selectDesireDropdown(allSelectFields[4]);
        setTimeout(() => {
          const options = allSelectFields[4].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          selectedoption(allOptions, data.productinfo.HDD);
        }, 50);
      } else {
        selectDesireDropdown(allSelectFields[4]);
        setTimeout(() => {
          const options = allSelectFields[4].querySelector(".menu--1PZC_");
          const allOptions = options.querySelectorAll(".item--184dY");
          allOptions[0].click();
        }, 50);
      }
      //
      //
    }
  );
}

function selectedoption(allOptions, value) {
  allOptions.forEach((option) => {
    if (option.innerText.toLowerCase() === value.toLowerCase()) {
      option.click();
    }
  });
}

function selectDesireDropdown(selectNumber) {
  const brandOpenDropdownBtn = selectNumber.querySelector(
    ".dd-button-wrapper--28F_E"
  );
  const clearSelect = selectNumber.querySelector(".reset-button--16akp");
  if (clearSelect) {
    clearSelect.click();
  }
  brandOpenDropdownBtn.click();
}

var phoneNumbers = []; // Array to store added phone numbers

function submitForm() {
  var countryCodeSelect = document.getElementById('country-code');
  var selectedCountrySelect = document.getElementById('country-flag');
  var countryCode = countryCodeSelect.options[countryCodeSelect.selectedIndex].value;
  var selectedCountry = selectedCountrySelect.options[selectedCountrySelect.selectedIndex].value;
  var phoneNumber = document.getElementById('phoneNumber').value;
  console.log(phoneNumber);
  
  // Input validation: Check if the phone number is empty
  if (phoneNumber.trim() === '') {
    displayPopUp("Error", "Please enter your phone number.");
    return; // Exit the function if validation fails
  }
 
  // Input validation: Check if the phone number is in the correct format
  if (!/^(\d{7,18})$/.test(phoneNumber)) {
    displayPopUp("Error", "Invalid phone number format. Please enter a number between 8 and 18 digits.");
    return; // Exit the function if validation fails
  }
  
  // Combine the country code and phone number
  var fullPhoneNumber = countryCode + phoneNumber;

  // Check if the full phone number has already been added
  if (phoneNumbers.includes(fullPhoneNumber)) {
    displayPopUp("Error", "Phone number already added.");
    return; // Exit the function if the number is already added
  }
 
  console.log(selectedCountry);

  // Prepare data JSON string with dynamic values
  var dataObj = {
    "@apiBaseUrl": "null",
    "@Campid": "1765452120516300",
    "@communicationIdentifier": fullPhoneNumber,
    "@sender": "SRBT",
    "@language": "en",
    "@title": "hello",
    "@message": "test"
  };

  var requestBody = {
    "journeyId": "1761565383615",  // keep static or make dynamic as needed
    "identifier": fullPhoneNumber,
    "data": JSON.stringify(dataObj),
    "generatedDate": getDateAndTime(),
    "delay": "0",
    "source": "3"
  };
  
  fetch('https://aida.aienterprise.ai/assistant/addAndWakeUpAssistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // add token header here if required
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    if (data.code === 26002) {
      displayPopUp("Error", "Phone number already added.");
    } else {
      displayPopUp("Success", "Phone number submitted successfully!");
      phoneNumbers.push(fullPhoneNumber); 
    }
  })
  .catch(error => {
    console.error(error);  
    displayPopUp("Error", "An error occurred while submitting the phone number.");
  });

  console.log('https://aida.aienterprise.ai/assistant/addScheduled?identifier=' + fullPhoneNumber + '&date=&journeyId=1761565383615&journeyName=AIPARK_INTRO&data={\"@COUNTRYCODE\":\"' + selectedCountry + '\",\"@MARSHAL\":\"' + fullPhoneNumber + '\"}');
}

function getDateAndTime() {
  var now = new Date();
  now.setDate(now.getDate() - 1); // Subtract 1 from the day
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  var hour = String(now.getHours()).padStart(2, '0');
  var minute = String(now.getMinutes()).padStart(2, '0');
  var second = String(now.getSeconds()).padStart(2, '0');
  
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function displayPopUp(title, message) {
  var popup = document.createElement("div");
  popup.className = "popup";
  var popupContent = document.createElement("div");
  popupContent.className = "popup-content";
  var popupTitle = document.createElement("h2");
  popupTitle.textContent = title;
  var popupMessage = document.createElement("p");
  popupMessage.textContent = message;
  var closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", function() {
    popup.remove();
  });

  popupContent.appendChild(popupTitle);
  popupContent.appendChild(popupMessage);
  popupContent.appendChild(closeBtn);
  popup.appendChild(popupContent);

  document.body.appendChild(popup);
}


 
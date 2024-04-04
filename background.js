//chrome.storage.local has a 5MB limit per extension so we may have to watch out for this


// Function to save cookie information
function saveCookieInfo(cookieInfo) {
    //chrome.storage.local API stores the cookie information
    chrome.storage.local.set({cookieData: cookieInfo}, function() {
      console.log("Cookie information saved.");
    });
  }
  
  // Listen for any changes to the cookies
  chrome.cookies.onChanged.addListener(function(changeInfo) {
    console.log('Cookie changed:', changeInfo);
    //saveCookieInfo to stores the changed cookie information
    //info is isolated to the extension and cannot be accessed by web pages or other extensions (secure i think?)
    saveCookieInfo(changeInfo);
  });
  

  // Function to retrieve cookie information
function getStoredCookieInfo() {
    chrome.storage.local.get(['cookieData'], function(result) {
      console.log("Retrieved cookie information:", result.cookieData);
    });
  }


// Function to check and log cookies without httpOnly or secure flags
function checkCookieFlags() {
    chrome.cookies.getAll({}, function(cookies) {
      const cookiesWithoutHttpOnly = cookies.filter(cookie => !cookie.httpOnly);
      const cookiesWithoutSecure = cookies.filter(cookie => !cookie.secure);

      // 4 patrick --> domain check
  
      // Log the cookies that don't have httpOnly set
      console.log("Cookies without httpOnly set:", cookiesWithoutHttpOnly);
  
      // Log the cookies that don't have secure set
      console.log("Cookies without secure set:", cookiesWithoutSecure);
  
      // Optionally, you can store these in chrome.storage as well
      chrome.storage.local.set({cookiesWithoutHttpOnly: cookiesWithoutHttpOnly, cookiesWithoutSecure: cookiesWithoutSecure}, function() {
        console.log("Cookies without httpOnly and secure flags are stored.");
      });
    });
  }
  
  checkCookieFlags();
  
  

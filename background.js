import checkSD from './checkSD.js';
const checker = new checkSD();


function simulateTestCookie() {
    const testCookie = {
        domain: "smetrics.statnews.com", //can use any domain we expect to be on the block list
        httpOnly: false,
        secure: false //both set intationally to false to trigger the alert
    };

    //check if the domain is on the block lsit and lacks proper flags
    if (!testCookie.httpOnly || !testCookie.secure) {
        const domain = testCookie.domain.replace(/^\./, '').replace(/^www\./, ''); //normalize domain name by removing '.' or 'www.'

        if (checker.check(domain)) {
            const message = `Test case: A cookie from ${domain}, which is on the block list, was set without proper security settings.`;
            alertUser(message);
        }
    }
}

//listener for browser action (extension icon click)
chrome.action.onClicked.addListener((tab) => {
    simulateTestCookie(); // trigger test simulation when icon is clicked
});

//const checkSD = require('./checkSD'); // Import the checkSD class

//chrome.storage.local has a 5MB limit per extension so we may have to watch out for this

/*
// Function to save cookie information
function saveCookieInfo(cookieInfo) {
    //chrome.storage.local API stores the cookie information
    chrome.storage.local.set({cookieData: cookieInfo}, function() {
      console.log("Cookie information saved.");
    });
  }
*/
//Function to save cookie information only if it is new 
function saveCookieInfo(cookieInfo) {
    //only save if the cookie does not have httpOnly or secure flags
    if (!cookieInfo.cookie.httpOnly || !cookieInfo.cookie.secure) {
        chrome.storage.local.set({ cookieData: cookieInfo }, function() {
            //console.log("New cookie information saved.");
        });
    }
}

//listen for changes to the cookies and process only new cookies
chrome.cookies.onChanged.addListener(function(changeInfo) {
    //check if the change is adding a new cookie or changing an existing one
    if (changeInfo.cause === 'explicit') { //'explicit' can be changed. This indicates that the change was made directly as a result of an action taken bu a webpage or user
        //console.log('New or updated cookie:', changeInfo);
        saveCookieInfo(changeInfo);
        processCookie(changeInfo.cookie);
    }
});

/*
// Listen for any changes to the cookies
chrome.cookies.onChanged.addListener(function(changeInfo) {
//  console.log('Cookie changed:', changeInfo);
  //saveCookieInfo to stores the changed cookie information
  //info is isolated to the extension and cannot be accessed by web pages or other extensions (secure i think?)
  if(!changeInfo.cookie.httpOnly || !changeInfo.cookie.secure){
    
    saveCookieInfo(changeInfo);
  }
});*/


// Function to retrieve cookie information
function getStoredCookieInfo() {
    chrome.storage.local.get(['cookieData'], function(result) {
        console.log("Retrieved cookie information:", result.cookieData);
    });
}

//function to alert user with a message (popup potential)
function alertUser(message) {
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Cookie Alert',
        message: message,
        priority: 2
    }, function(notificationId) {
        if (chrome.runtime.lastError) {
            console.error('Notification failed: ', chrome.runtime.lastError);
        } else {
            console.log('Notification succeeded with ID: ', notificationId);
        }
    });
}

// func to save malicious cname cloaking domains
function addMaliciousDomain(domain) {
    chrome.storage.local.get("malicious_domain", function(result) {
        let currDomains = [];

        if (result.malicious_domain && Array.isArray(result.malicious_domain)) {
            currDomains = result.malicious_domain;
        }

        if (!currDomains.includes(domain)) {
            currDomains.push(domain);
            chrome.storage.local.set({ malicious_domain: currDomains });
        }
    });
}

//function to process a single cookie
function processCookie(cookie) {
    if (!cookie.httpOnly || !cookie.secure) {
        const domain = cookie.domain.replace(/^\./, '').replace(/^www\./, ''); //normalize domain name by removing '.' or 'www.'
        console.log(`checking ${domain}`)
        if (checker.check(domain)) {
            const message = `A cookie from ${domain}, which is on the block list, was set without proper security settings.`;
            console.log(message);
            alertUser(message);

            if(checker.checkSessionIDLeak(cookie)) {
                const message = `A session cookie from ${domain} has leaked session ID`;
                console.log(message);
                alertUser(message);
            }

            // for textarea loading
            addMaliciousDomain((domain + ":" + checker.site_list[domain]));
        }
    }
}


// Function to check and log cookies without httpOnly or secure flags
function checkCookieFlags() {
    chrome.cookies.getAll({}, function(cookies) {

        const cookiesToCheck = new Set();
        const uniqueCookies = {};

        //collect all cookies without httpOnly or secure set
        cookies.forEach(cookie => {
            if (!cookie.httpOnly || !cookie.secure) {
                const uniqueId = `${cookie.name}@${cookie.domain}`; //unique identifier for each cookie
                if (!uniqueCookies[uniqueId]) {
                    uniqueCookies[uniqueId] = cookie;
                    cookiesToCheck.add(cookie);
                }
            }
        });

        //const cookiesWithoutHttpOnly = cookies.filter(cookie => !cookie.httpOnly);
        //const cookiesWithoutSecure = cookies.filter(cookie => !cookie.secure);

        // 4 patrick --> domain check
        //var checkObj = new checkSD();
        //console.log(checkObj.check("sadobeanalytics.geico.com")); // replace w/ proper sd
        cookiesToCheck.forEach(cookie => {
            const domain = cookie.domain.replace(/^\./, '').replace(/^www\./, ''); //normalize domain name by removing '.' or 'www.'
            console.log(`checking ${domain}`)
            if (checker.check(domain)) {
                const message = `A cookie from ${domain}, which is on the block list, was set without proper security settings.`;
                console.log(message);
                alertUser(message);
            }
        });

        //log cookies
        console.log("Unique cookies without proper flags:", Array.from(cookiesToCheck));

        //optional store in chrome.storage as well
        chrome.storage.local.set({ cookiesWithoutProperFlags: Array.from(cookiesToCheck) }, function() {
            console.log("Cookies without proper flags are stored.");
        });


        // Log the cookies that don't have httpOnly set
        //console.log("Cookies without httpOnly set:", cookiesWithoutHttpOnly);

        // Log the cookies that don't have secure set
        //console.log("Cookies without secure set:", cookiesWithoutSecure);
        /*
        chrome.storage.local.set({
          cookiesWithoutHttpOnly: cookiesWithoutHttpOnly, 
          cookiesWithoutSecure: cookiesWithoutSecure
        }, function() {
          console.log("Cookies without httpOnly and secure flags are stored.");
        });
        */
    });
}
//initial check on load
//checkCookieFlags();
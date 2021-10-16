const engines = [
  {
    name: "Google",
    url: "https://google.com/",
    search: "https://google.com/search?q=",
    icon: "../assets/img/googleLogo.png",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/",
    search: "https://duckduckgo.com/?q=",
    icon: "../assets/img/ddgLogo.png",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/",
    search: "https://youtube.com/results?search_query=",
    icon: "../assets/img/ytLogo.png",
  },
];

// Set search engine
function updateSearch() {
  var currentEngine = engines.find((element) => element.name == engine);
  document.getElementById(
    "searchBox"
  ).style.backgroundImage = `url("${currentEngine.icon}")`;
  document.getElementById("searchBox").textContent =
    "Search " + currentEngine.name;
  document.getElementById("searchButton").textContent =
    currentEngine.name + " Search";
  document.getElementById("openSearch").textContent =
    "Open " + currentEngine.name;
}

var engine;
if (typeof browser === "undefined") {
  // we're running on chrome
  chrome.storage.local.get("searchEngine", function (res) {
    engine = res.searchEngine || "Google"; // google is the default
    updateSearch();
  });
} else {
  // we're running on firefox
  browser.storage.local.get("searchEngine").then((res) => {
    engine = res.searchEngine || "Google"; // google is the default
    updateSearch();
  });
}

document.getElementById("settings_changesearch").onclick = function () {
  if (!engine) return;

  var newEngine = engines.findIndex((element) => element.name == engine) + 1;
  if (newEngine > engines.length - 1) newEngine = 0; // wrap around to the first engine
  engine = engines[newEngine].name;

  if (typeof browser === "undefined") {
    // we're running on chrome
    chrome.storage.local.set({ searchEngine: engine }, function () {
      updateSearch();
    });
  } else {
    // we're running on firefox
    browser.storage.local.set({ searchEngine: engine }).then(updateSearch());
  }
};

// Initial function call to show date and time
showGreeting();

// Function to get the date and time
function getDateTime() {
  let today = new Date();
  let dayNum = today.getUTCDay();
  let date = today.getDate();
  let day;
  let monthNum = today.getMonth() + 1;
  let month;

  function getTime() {
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let postTime;
    let time;

    // Get time in 12hrs
    if (hours >= 12) {
      hours -= 12;
      postTime = "pm";
    } else {
      postTime = "am";
    }

    // This is to fix a bug because 12pm shows 0
    if (hours == "0") {
      hours = "12";
    }

    // Get minutes in double digits at all times
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    // Set the time to how it should be displayed in html
    time =
      hours +
      ":" +
      "</div>" +
      '<div id="dateTime">' +
      minutes +
      " " +
      postTime +
      "</div>";

    return time;
  }

  // Get the time (to be displayed) and store it in a variable called time
  // Initial getTime function call
  time = getTime();

  // Assign day names to dayMap
  let dayMap = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };

  day = dayMap[dayNum];

  // Assign month names to monthNum
  let monthMap = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  month = monthMap[monthNum];

  // It's 7:38 on Thr, 31 Dec
  let greeting =
    "It's " +
    '<div id="dateTime">' +
    time +
    " on " +
    '<div id="dateTime">' +
    day +
    ", " +
    date +
    " " +
    month +
    "</div>";
  return greeting;
}

// Function to display them on screen (recursively)
function showGreeting() {
  // Set the greeting to the greeting div
  document.getElementById("greeting").innerHTML = getDateTime();

  // Recursion to get current date without refreshing the page (Gets the time every two seconds)
  setTimeout(showGreeting, 2000);
}

// For search operation
let searchButton = document.getElementById("searchButton");
let searchBox = document.getElementById("searchBox");

// When search button is clicked
searchButton.addEventListener("click", function (event) {
  // Don't reload the page
  // Without this, window.location.replace is not working
  event.preventDefault();

  // Search
  var currentEngine = engines.find((element) => element.name == engine);

  window.location.replace(currentEngine.search + searchBox.value);
});

// To open search engine
let openSearchButton = document.getElementById("openSearch");
openSearchButton.addEventListener("click", function (event) {
  // Don't reload the page
  // Without this, window.location.replace is not working
  event.preventDefault();

  var currentEngine = engines.find((element) => element.name == engine);
  window.location.replace(currentEngine.url);
});

// closing modal on esc button
document.addEventListener("keydown", function (event) {
  if (
    event.keyCode === 27 &&
    document.querySelector("#modal").classList.contains("modalShown")
  ) {
    document.querySelector("#modal").classList.toggle("modalShown");
  }
});

// For weather info
// First get user IP
window.onload = function () {
  // Get Location from IP
  fetch("http://ip-api.com/json/")
    .then(function (response) {
      // console.log(response.json)
      return response.json();
    })
    .then(function (data) {
      let status = data.status;
      let country = data.country;
      let city = data.city;
      let ip = data.query;

      // If the ip, location etc is returned:
      if (status === "success") {
        // Fetch the weather api
        fetch(
          "http://api.weatherapi.com/v1/current.json?key=" +
            weatherAPI_KEY +
            "&q=" +
            city +
            "&aqi=no"
        )
          .then(function (weatherResponse) {
            return weatherResponse.json();
          })
          .then(function (weatherData) {
            let state = weatherData.location.region;
            let lastUpdated = weatherData.current.last_updated;
            // List of all states that use fahrenheit.
            let countriesThatUseF = [
              "United States",
              "Bahamas",
              "Cayman Islands",
              "Liberia",
              "Palau",
              "Micronesia",
              "Marshall Islands",
            ];
            // console.log(state, lastUpdated, tempC, tempF)
            let tempLetter = "C";
            let temp = weatherData.current.temp_c;
            // Checks to see if the country is in the list of countries that uses fahrenheit
            if (countriesThatUseF.includes(country)) {
              tempLetter = "F";
              temp = weatherData.current.temp_f;
            }

            document.getElementById("weatherInfo").innerHTML = `
                        <button id="temp">
                            ${temp} °${tempLetter}
                        </button>
                        
                    `;
          });
      }
    });
};

// select the open-btn button
let openBtn = document.getElementById("open-btn");
// select the modal-background
let modalBackground = document.getElementById("modal-background");
// select the close-btn
let closeBtn = document.getElementById("close-btn");

// shows the modal when the user clicks open-btn
openBtn.addEventListener("click", function () {
  modalBackground.style.display = "block";
});

// hides the modal when the user clicks close-btn
closeBtn.addEventListener("click", function () {
  modalBackground.style.display = "none";
});

// hides the modal when the user clicks outside the modal
window.addEventListener("click", function (event) {
  // check if the event happened on the modal-background
  if (event.target === modalBackground) {
    // hides the modal
    modalBackground.style.display = "none";
  }
});

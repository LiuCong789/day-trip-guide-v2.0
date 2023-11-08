const itineraryEl = document.querySelector(".itinerary");
const placeInputEl = document.querySelector(".place-input");
const submitBtn = document.querySelector(".submit-btn");
const loadingIndicator = document.querySelector(".loading-indicator");
const countdownElement = document.getElementById("countdown");
const temperatureEl = document.querySelector(".temperature");

async function handleUserInput() {
  submitBtn.disabled = true;

  // Add loading effect
  let countdown = 30;
  const updateCountdown = () => {
    countdownElement.textContent = countdown + "s";
  };

  const countdownInterval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.display = "none";
    } else {
      updateCountdown();
      countdown--;
    }
  }, 1000);

  // Show loading indicator
  loadingIndicator.style.display = "block";

  // Remove the previous content in temperatureElement
  temperatureEl.innerHTML = "";

  // Remove the previous content in itineraryElement
  itineraryEl.innerHTML = "";

  // Fetch day trip data
  const res = await fetch("find-trip", {
    method: "POST",
    body: JSON.stringify({
      trip: placeInputEl.value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const jsonRes = await res.json();

  // console.log(jsonRes.choices[0].message.content);

  const content = jsonRes.choices[0].message.content;

  // Split content into paragraphs based on a character limit (e.g., 200 characters per paragraph)
  const paragraphs = content.match(/.{1,300}(\s|$)/g);

  if (paragraphs) {
    paragraphs.forEach((paragraphText) => {
      const feedParagraph = document.createElement("p");
      feedParagraph.textContent = paragraphText;
      itineraryEl.appendChild(feedParagraph);
    });
  }

  // Fetch weather data
  async function getWeather(s) {
    const WEATHER_API_KEY = "cce55cb1bffbc2fd1c278e01e637d29d";

    const getWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${placeInputEl.value}&appid=${WEATHER_API_KEY}`
    );

    const weatherData = await getWeather.json();

    // console.log(weatherData);

    const cityEl = document.createElement("span");
    cityEl.textContent = weatherData.name;

    const tempEl = document.createElement("span");
    const temperatureInCelsius = (weatherData.main.temp - 273.15).toFixed(1);
    tempEl.innerHTML = `${temperatureInCelsius}&deg;C`;

    temperatureEl.appendChild(cityEl);
    temperatureEl.appendChild(tempEl);

    // Display the weather icon or image
    const weatherIcon = document.createElement("img");
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    temperatureEl.appendChild(weatherIcon);
  }

  getWeather();

  // Hide loading indicator after the request is completed
  loadingIndicator.style.display = "none";

  updateCountdown();

  placeInputEl.value = "";
  submitBtn.disabled = false;
  document.querySelector(".app-wrapper").style.height = "auto";

  clearInterval(countdownInterval);

  // Fetch exchange rate data
}

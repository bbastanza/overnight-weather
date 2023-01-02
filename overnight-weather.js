require('dotenv').config()
const axios = require('axios')

const owKey = process.env.OPENWEATHER_API_KEY
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const twilioToken = process.env.TWILIO_AUTH_TOKEN

function main() {

}

main()

// CHARLOTTE NC
const location = {
  lat: "35.227085",
  long: "-80.843124"
}

async function getWeather() {
  const weather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${location.lat}&lon=${location.long}&appid=${owKey}`);

  console.log(weather.data)
  // return

  const list = weather.data.list;

  for (let i = 0; i < list.length; i++) {
    const listItem = list[i]

    console.log(listItem.dt_txt)

    console.log(listItem.main.temp)

    console.log("")

  }
}


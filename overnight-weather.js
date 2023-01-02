require('dotenv').config()
const axios = require('axios')

const openWeatherApiKey = process.env.OPENWEATHER_API_KEY
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const twilioToken = process.env.TWILIO_AUTH_TOKEN
const weatherBotSid = process.env.WEATHER_BOT_SID
const client = require('twilio')(twilioSid, twilioToken);

const ALERT_TEMP_MIN = 32

// CHARLOTTE NC
const location = {
  lat: "35.227085",
  long: "-80.843124"
}

async function getWeather() {
  const weather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${location.lat}&lon=${location.long}&appid=${openWeatherApiKey}`);

  const list = weather.data.list;

  return findColdestTemp(list)
}

function findColdestTemp(list) {
  let lowestTemp = null
  let timestamp = null

  for (let i = 0; i < list.length; i++) {
    const listItem = list[i]

    if (!lowestTemp) {
      lowestTemp = listItem.main.temp
      timestamp = listItem.dt_txt
      continue
    }

    if (listItem.main.temp < lowestTemp) {
      lowestTemp = listItem.main.temp
      timestamp = listItem.dt_txt
      continue
    }
  }

  return {
    temp: lowestTemp,
    timestamp
  }

}

async function sendMessage(body) {
  const message = await client.messages
    .create({
      body,
      messagingServiceSid: weatherBotSid,
      to: '+15304487215'
    })

  return message
}

async function main() {
  const result = await getWeather()

  // alert if our temp is lower than our alert and exit from script
  if (result.temp < ALERT_TEMP_MIN) {
    const message = await sendMessage(`It will be a low of ${result.temp} at ${result.timestamp}. Have a great evening!`)
    console.log("message sent at " + result.timestamp)
    console.log(message)
    return
  }

  console.log("Temp did not hit minimum. Lowest temp is " + result.temp)
}

main()

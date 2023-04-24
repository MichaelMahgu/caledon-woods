const fs = require('fs').promises;
const path = require('path')
;
const currentDate = new Date()
const year = currentDate.getFullYear()
const month = String(currentDate.getMonth() + 1).padStart(2, '0')
const day = String(currentDate.getDate()).padStart(2, '0')
const hour = String(currentDate.getHours()).padStart(2, '0')
const formattedDate = `${year}-${month}-${day}`
const log = true
;
module.exports = {
  mode:{
    hourly:'hourly',
    daily:'daily',
  },
  url:'https://api.open-meteo.com/v1/gem',
  cource:'Caledon Woods',
  config: {
    latitude: 43.9135,
    longitude: -79.805,
    timezone: "America%2FNew_York",
    timeformat: 'unixtime',
    mode:'hourly',
    past_days:0,
    current_weather: true,
  },
  timestamp:{
    the_date:formattedDate,
    the_year:year,
    the_month:month,
    the_day:day,
    the_hour:hour,
  },
  hourly_captures:[
    "temperature_2m",
    "relativehumidity_2m",
    "apparent_temperature",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "weathercode",
    "surface_pressure",
    "et0_fao_evapotranspiration",
    "windspeed_10m",
    "winddirection_10m",
    "windgusts_10m",
    "soil_temperature_0_to_10cm",
    "soil_moisture_0_to_10cm",
    "direct_radiation",
    "diffuse_radiation",
  ],
  daily_captures:[
    "weathercode",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "sunrise",
    "sunset",
    "precipitation_sum",
    "rain_sum",
    "showers_sum",
    "snowfall_sum",
    "precipitation_hours",
    "windspeed_10m_max",
    "windgusts_10m_max",
    "winddirection_10m_dominant",
    "shortwave_radiation_sum",
    "et0_fao_evapotranspiration",
  ],
  args: process.argv.slice(2),
  ok: false,
  text: null,
  final_url: null,
  final_name: null,
}

const ParseCommandLine = () => {
  // Setup mode from first argument
  module.exports.config.mode = module.exports.args.length != 0
    ? module.exports.args[0]
    : module.exports.mode.hourly

  // Make sure mode is valid
  if (!module.exports.mode[module.exports.config.mode]) {
    module.exports.config.mode = module.exports.mode.hourly
  }
}

const BuildApiUrl = () => {
  let url = module.exports.url
  let params = Object.keys(module.exports.config).filter((item) => item !== 'mode' && item !== 'current_weather')
  let key = module.exports.config.mode + '_captures'
  const tmparr = []
  for(const param of params) {
    tmparr.push(param + '=' + module.exports.config[param])
  }
  url += '?' + tmparr.join('&')
  url += '&' + module.exports.config.mode + '=' + module.exports[key].join(',')
  if (module.exports.config.current_weather) {
    url += '&current_weather=true'
  }
  module.exports.final_url = url
}

const BuildFilename = () => {
  module.exports.final_name = `cache/${module.exports.timestamp.the_hour}-${module.exports.config.mode}.json`
}

module.exports.prepare = async () => {
  ParseCommandLine()
  BuildApiUrl()
  BuildFilename()
}

module.exports.fetch = async () =>{
  if (!module.exports.final_url) return
  // Fetch data
  const res = await fetch(module.exports.final_url)
  if (res.ok) {
    module.exports.text = await res.text()
  }
  module.exports.ok = res.ok
  return res.ok
}

const CreateFilePath = async () => {
  const directory = path.dirname(module.exports.final_name)
  try {
    const stats = await fs.stat(directory);
    if (!stats.isDirectory()) {
      await fs.mkdir(directory, {recursive:true})
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports.store = async () => {
  if (!module.exports.ok) return
  if (!module.exports.final_name) return
  const directory = path.dirname(module.exports.final_name)
  try {
    try {
      const stats = await fs.stat(directory);
    } catch {
      await fs.mkdir(directory, {recursive:true})
    }
    await fs.writeFile(module.exports.final_name, module.exports.text, {flag:'w'})
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

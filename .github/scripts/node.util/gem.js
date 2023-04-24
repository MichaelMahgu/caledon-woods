const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const hour = String(currentDate.getHours()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
module.exports = {
  mode:{
    hourly:'hourly',
    daily:'daily',
  },
  url:'https://api.open-meteo.com/v1/gem',
  config: {
    course:'Caledon Woods',
    latitude: 43.92,
    longitude: 79.80,
    timezone: "America%2FNew_York",
    timeformat: 'unixtime',
    mode:'hourly',
    past_days:0,
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
}

module.exports.prepare = () => {
  // Setup mode from first argument
  module.exports.config.mode = module.exports.args.length != 0
    ? module.exports.args[0]
    : module.exports.mode.hourly

  // Make sure mode is valid
  if (!module.exports.mode[module.exports.config.mode]) {
    module.exports.config.mode = module.exports.mode.hourly
  }
}

module.exports.fetch = () => {
}

module.exports.store = () => {
}

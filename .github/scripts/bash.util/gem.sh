#!/usr/bin/env bash

# These might be the api reference coords
# 43.9135,-79.805

# Basic settings
latitude=43.92
longitude=-79.80
timezone=America%2FNew_York
timeformat=unixtime
mode=hourly
past_days=0

# Setup Environment
the_date=$(date +"%Y-%m-%d")
the_year=$(date +"%Y")
the_month=$(date +"%m")
the_day=$(date +"%d")
the_hour=$(date +"%H")

# Define settings
api_url="https://api.open-meteo.com/v1/gem"
settings=(
  "latitude"
  "longitude"
  "timezone"
  "timeformat"
  "past_days"
)

# Define hourly captures
hourly_captures=(
  "temperature_2m"
  "relativehumidity_2m"
  "apparent_temperature"
  "precipitation"
  "rain"
  "showers"
  "snowfall"
  "weathercode"
  "surface_pressure"
  "et0_fao_evapotranspiration"
  "windspeed_10m"
  "winddirection_10m"
  "windgusts_10m"
  "soil_temperature_0_to_10cm"
  "soil_moisture_0_to_10cm"
  "direct_radiation"
  "diffuse_radiation"
)

# Define daily captures
daily_captures=(
  "weathercode"
  "temperature_2m_max"
  "temperature_2m_min"
  "apparent_temperature_max"
  "apparent_temperature_min"
  "sunrise"
  "sunset"
  "precipitation_sum"
  "rain_sum"
  "showers_sum"
  "snowfall_sum"
  "precipitation_hours"
  "precipitation_probability_max"
  "windspeed_10m_max"
  "windgusts_10m_max"
  "winddirection_10m_dominant"
  "shortwave_radiation_sum"
  "et0_fao_evapotranspiration"
)

#!/usr/bin/env bash

# Basic settings
latitude=43.92
longitude=-79.80
timezone=America%2FNew_York
timeformat=unixtime
models=auto
mode=daily
current_weather=true

# Setup Environment
the_date=$(date +"%Y-%m-%d")
the_year=$(date +"%Y")
the_month=$(date +"%m")
the_day=$(date +"%d")
the_hour=$(date +"%H")

# Define settings
api_url="https://api.open-meteo.com/v1/forecast"
settings=(
  "latitude"
  "longitude"
  "timezone"
  "timeformat"
)

# Define hourly captures
hourly_captures=(
  "temperature_2m"
  "temperature_80m"
  "relativehumidity_2m"
  "apparent_temperature"
  "precipitation_probability"
  "precipitation"
  "rain"
  "showers"
  "snowfall"
  "weathercode"
  "windspeed_10m"
  "windspeed_80m"
  "soil_temperature_0cm"
  "soil_temperature_6cm"
  "winddirection_10m"
  "winddirection_80m"
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
  "winddirection_10m_dominant"
)

# Define models
models=(
  "icon_seamless"
  "gem_seamless"
  "jma_seamless"
  "gfs_seamless"
  "meteofrance_seamless"
)

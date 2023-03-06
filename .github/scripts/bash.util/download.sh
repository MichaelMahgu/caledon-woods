#!/usr/bin/env bash

# Build the hourly capture string
captures_str="$(IFS=','; echo "${!${mode}_captures[*]}")"

# Build final API url
final_url="${api_url}?current_weather=true&latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&timeformat=${timeformat}&models=${models}&${mode}=${captures_str}"

# Make sure our directories exist
if [[ ! -e ./cache ]]; then
  mkdir -p ./cache
fi

# Download latest
curl --silent --output ./cache/${the_hour}-${mode}.json ${final_url}

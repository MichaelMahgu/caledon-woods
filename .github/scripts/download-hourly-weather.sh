#!/usr/bin/env bash

# Include common
source ./.github/scripts/bash.util/common.sh

# Setup mode
mode=hourly

# Build the hourly capture string
hourly_captures_str="$(IFS=','; echo "${hourly_captures[*]}")"

# Build final API url
final_url="${api_url}?current_weather=${current_weather}&latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&timeformat=${timeformat}&models=${models}&${mode}=${hourly_captures_str}"

# Make sure our directories exist
if [[ ! -e ./cache ]]; then
  mkdir -p ./cache
fi

# Download latest
curl --silent --output ./cache/${the_hour}-${mode}.json ${final_url}

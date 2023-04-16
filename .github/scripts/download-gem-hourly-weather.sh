#!/usr/bin/env bash

# Include common
source ./.github/scripts/bash.util/gem.sh

# Setup mode
mode=hourly

# Build the hourly capture string
hourly_captures_str="$(IFS=','; echo "${hourly_captures[*]}")"

# Build final API url
final_url="${api_url}?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&timeformat=${timeformat}&past_days=${past_days}&${mode}=${hourly_captures_str}"

# Make sure our directories exist
if [[ ! -e ./cache ]]; then
  mkdir -p ./cache
fi

# Download latest
curl --silent --output ./cache/${the_hour}-${mode}-gem.json ${final_url}
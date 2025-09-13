source "https://rubygems.org"

gem "jekyll", "~> 4.4.1"
gem "minima", "~> 2.5" # The default Jekyll theme
gem "logger" # To suppress the Ruby 3.5.0 logger warning

group :jekyll_plugins do
  # Add any additional Jekyll plugins here, e.g.:
  # gem "jekyll-feed", "~> 0.12"
end

# Update platform specification to address deprecation warning
platforms :windows do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data"
end
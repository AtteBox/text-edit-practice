# Updates the app's favicon based on the icon.png file
# - Requires ImageMagick to be installed
convert -background transparent "icon.png" -define icon:auto-resize=16,24,32,48,64,72,96,128,256 "./src/app/favicon.ico"
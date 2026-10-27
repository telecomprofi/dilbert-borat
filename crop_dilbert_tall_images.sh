#!/bin/bash

# This script finds JPG and GIF images taller than 300px in the specified directory
# and crops the top 1/3, preserving the bottom 2/3.

# Directory containing the compressed Dilbert images
IMAGE_DIR="/Users/work/njsapp/nextjs-docker/Dilbert_compressed"

# Get the absolute path of the script's directory
SCRIPT_DIR=$(cd -- "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Construct the absolute path for the image directory
ABS_IMAGE_DIR="$IMAGE_DIR"

# Minimum height for cropping
MIN_HEIGHT=299

# Debug: Print the command we're about to run
echo "Processing images in: $ABS_IMAGE_DIR"

# Run find to create the file list, handling spaces and special characters
find "$ABS_IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.gif" \) -print0 | while IFS= read -r -d '' file; do
    # Debug: Print the current file being processed
    echo "Processing file: $file"

    # Skip if not a file or doesn't exist
    if [[ ! -f "$file" ]]; then
        echo "Skipping non-file or non-existent entry: $file"
        continue
    fi

    # Use 'file' command to get image dimensions
    img_info=$(file "$file")
    # echo "File info: $img_info" # Comment out to reduce output
    img_height=$(file "$file" | grep -oE '[[:digit:]]+ x [[:digit:]]+' | awk '{print $3}')
    echo "Extracted height: $img_height"

    # Check if height is greater than or equal to minimum height
    if [ "$img_height" -ge "$MIN_HEIGHT" ]; then
        # Calculate new height (bottom 2/3)
        new_height=$(echo "$img_height * 2 / 3" | bc)
        # Calculate offset from the top (top 1/3)
        offset_y=$(echo "$img_height / 3" | bc)

        echo "Cropping file: $file (original height: $img_height, new height: $new_height, offset: $offset_y)"

        # echo "Height before convert:" # Comment out to reduce output
        # file "$file" | grep -oE '[[:digit:]]+ x [[:digit:]]+' | awk '{print $3}' # Comment out to reduce output

        # Create a temporary file for the cropped image
        # set -x # Enable debugging before mktemp # Comment out debug
        CROPPED_FILE=$(mktemp)
        # echo "Temporary cropped file path: $CROPPED_FILE" # Comment out debug print
        # echo "Saving cropped image to temporary file: $CROPPED_FILE" # Comment out to reduce output

        # Use ImageMagick magick to crop the image and save to temporary file
        magick "$file" -crop x"${new_height}+0+${offset_y}" +repage "$CROPPED_FILE.gif"
        # set +x # Disable debugging # Comment out debug

        # echo "magick convert exit status: $?" # Comment out to reduce output

        # Check if magick convert was successful
        if [ $? -eq 0 ]; then
            # echo "Magick convert successful. Replacing original file." # Comment out to reduce output
            # Replace the original file with the cropped file
            # set -x # Enable debugging # Comment out debug
            mv "$CROPPED_FILE.gif" "$file"
            # set +x # Disable debugging # Comment out debug
            # echo "mv exit status: $?" # Comment out to reduce output
            # Add a small delay before checking height again # Removed unnecessary delay
            # sleep 1 # Removed unnecessary delay
            echo "Successfully cropped $file (original height: $img_height, new height: $new_height)"
            #  echo "Height after convert and move:" # Comment out to reduce output
            # file "$file" | grep -oE '[[:digit:]]+ x [[:digit:]]+' | awk '{print $3}' # Comment out to reduce output
        else
            echo "Error: ImageMagick magick failed for file: $file"
            # Clean up temporary file if convert failed
            rm -f "$CROPPED_FILE.gif" # Use -f to avoid error if file doesn't exist
        fi
        # Clean up the temporary file after processing each image, regardless of cropping
        rm -f "$CROPPED_FILE"
    else
        echo "File $file does not meet minimum height criteria ($MIN_HEIGHT). Height: $img_height. Skipping cropping."
    fi
done

echo "Image cropping script finished." 
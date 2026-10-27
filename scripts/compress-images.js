const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DILBERT_BASE_PATH = path.join(process.cwd(), 'Dilbert_1989-2023_complete');
const COMPRESSED_PATH = path.join(process.cwd(), 'Dilbert_compressed');

// Create compressed directory if it doesn't exist
if (!fs.existsSync(COMPRESSED_PATH)) {
    fs.mkdirSync(COMPRESSED_PATH, { recursive: true });
}

async function compressImages() {
    try {
        // Process each year directory
        for (let year = 1989; year <= 2023; year++) {
            const yearPath = path.join(DILBERT_BASE_PATH, year.toString());
            const compressedYearPath = path.join(COMPRESSED_PATH, year.toString());

            if (!fs.existsSync(yearPath)) continue;

            // Create year directory in compressed folder
            if (!fs.existsSync(compressedYearPath)) {
                fs.mkdirSync(compressedYearPath, { recursive: true });
            }

            const files = fs.readdirSync(yearPath);

            for (const file of files) {
                if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

                const inputPath = path.join(yearPath, file);
                const outputPath = path.join(compressedYearPath, file);

                // Skip if already compressed
                if (fs.existsSync(outputPath)) continue;

                console.log(`Compressing ${inputPath}...`);

                try {
                    await sharp(inputPath)
                        .resize(800, null, { // Resize to max width of 800px, maintain aspect ratio
                            withoutEnlargement: true,
                            fit: 'inside'
                        })
                        .jpeg({ // Convert to JPEG with quality 80
                            quality: 80,
                            progressive: true
                        })
                        .toFile(outputPath);
                } catch (error) {
                    console.error(`Error compressing ${inputPath}:`, error);
                }
            }
        }
        console.log('Compression complete!');
    } catch (error) {
        console.error('Error during compression:', error);
    }
}

compressImages(); 
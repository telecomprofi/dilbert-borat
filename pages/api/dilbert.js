import fs from 'fs';
import path from 'path';

// Use the compressed images path
const DILBERT_BASE_PATH = path.join(__dirname, '..', '..', '..', '..', 'Dilbert_compressed');

// Cache for available images
let imageCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getAvailableImages = () => {
    const now = Date.now();
    if (imageCache && (now - lastCacheUpdate) < CACHE_DURATION) {
        return imageCache;
    }

    const images = [];
    try {
        // Check if the base directory exists
        if (!fs.existsSync(DILBERT_BASE_PATH)) {
            console.error('Dilbert base directory not found:', DILBERT_BASE_PATH);
            return [];
        }

        for (let year = 1989; year <= 2023; year++) {
            const yearPath = path.join(DILBERT_BASE_PATH, year.toString());
            try {
                if (fs.existsSync(yearPath)) {
                    const files = fs.readdirSync(yearPath);
                    const yearImages = files
                        .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
                        .map(file => ({
                            year,
                            filename: file,
                            path: path.join(yearPath, file)
                        }));
                    images.push(...yearImages);
                }
            } catch (error) {
                console.error(`Error reading directory for year ${year}:`, error);
            }
        }

        imageCache = images;
        lastCacheUpdate = now;
        return images;
    } catch (error) {
        console.error('Error getting available images:', error);
        return [];
    }
};

// Add function to sanitize filename for headers
const sanitizeHeaderValue = (value) => {
    // Remove any characters that are not allowed in HTTP headers
    return value.replace(/[^\x20-\x7E]/g, '');
};

export default async function handler(req, res) {
    try {
        const images = getAvailableImages();

        if (images.length === 0) {
            res.status(404).json({ error: 'No local images found' });
            return;
        }

        // Select a random image
        const randomImage = images[Math.floor(Math.random() * images.length)];

        // Read the image file
        const imageBuffer = fs.readFileSync(randomImage.path);

        // Set appropriate content type based on file extension
        const ext = path.extname(randomImage.filename).toLowerCase();
        const contentType = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        }[ext] || 'image/jpeg';

        // Send the image
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Image-Year', randomImage.year);
        res.setHeader('X-Image-Filename', sanitizeHeaderValue(randomImage.filename));
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error serving Dilbert strip:', error);
        res.status(500).json({ error: 'Failed to serve image' });
    }
} 
const fs = require('fs').promises; // For Node.js file operations

const thisYear = new Date().getFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);

function generateProgressBar() {
    const progressBarCapacity = 30;
    const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity);
    const progressBar =
        '█'.repeat(passedProgressBarIndex) +
        '▁'.repeat(progressBarCapacity - passedProgressBarIndex);
    return `{ ${progressBar} }`;
}

async function updateReadme() {
    try {
        // Read the existing README.md file
        let readmeContent = await fs.readFile('README.md', 'utf8');
        
        // Prepare the progress section
        const progressSection = `\
⏳ Year progress ${generateProgressBar()} ${(progressOfThisYear * 100).toFixed(2)} %

⏰ Updated on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', dateStyle: 'full', timeStyle: 'long' })}`;

        // Find the markers and replace content between them
        const startMarker = '<!-- year progress start -->';
        const endMarker = '<!-- year progress end -->';
        const startIndex = readmeContent.indexOf(startMarker) + startMarker.length;
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('Could not find year progress markers in README.md');
        }

        // Construct new content
        const newReadme = 
            readmeContent.substring(0, startIndex) +
            '\n' + progressSection + '\n' +
            readmeContent.substring(endIndex);

        // Write the updated content back to README.md
        await fs.writeFile('README.md', newReadme, 'utf8');
        console.log('README.md has been updated successfully');
        console.log(newReadme);

    } catch (error) {
        console.error('Error updating readme:', error);
    }
}

// Execute the update
updateReadme();
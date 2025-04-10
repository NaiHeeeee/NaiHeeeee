const fs = require('fs').promises;

const thisYear = new Date().getFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);

function generateProgressBar() {
    const progressBarCapacity = 30;
    const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity);
    const progressBar =
        '█'.repeat(passedProgressBarIndex) +
        ' '.repeat(progressBarCapacity - passedProgressBarIndex);
    return `{ ${progressBar} }`;
}

async function updateReadme() {
    try {
        // 读取现有的 README.md 文件
        let readmeContent = await fs.readFile('README.md', 'utf8');
        
        // 准备进度部分
        const progressSection = `\
⏳ Year progress ${generateProgressBar()} ${(progressOfThisYear * 100).toFixed(2)} %

⏰ Updated on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', dateStyle: 'full', timeStyle: 'long' })}`;

        // 查找标记并替换它们之间的内容
        const startMarker = '<!-- year progress start -->';
        const endMarker = '<!-- year progress end -->';
        const startIndex = readmeContent.indexOf(startMarker) + startMarker.length;
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('无法在 README.md 中找到 year progress 标记');
        }

        // 构造新的内容
        const newReadme = 
            readmeContent.substring(0, startIndex) +
            '\n' + progressSection + '\n' +
            readmeContent.substring(endIndex);

        // 将更新后的内容写回 README.md
        await fs.writeFile('README.md', newReadme, 'utf8');
        console.log('README.md 已成功更新');
        console.log(newReadme);

    } catch (error) {
        console.error('更新 README 时出错:', error);
    }
}

// 执行更新
updateReadme();
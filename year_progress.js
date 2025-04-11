const fs = require(`fs`).promises;

const thisYear = new Date().getFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);

function generateProgressBar() {
    const progressBarCapacity = 30;
    const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity);
    const progressBar =
        `█`.repeat(passedProgressBarIndex) +
        `▁`.repeat(progressBarCapacity - passedProgressBarIndex);
    return `{ ${progressBar} }`;
}

async function updateReadme(filename) {
    try {
        // 读取现有的 README 文件
        let readmeContent = await fs.readFile(filename, `utf8`);
        
        // 准备进度部分
        const progressSection = `\
⏳ Year progress ${generateProgressBar()} ${(progressOfThisYear * 100).toFixed(2)} %

⏰ Updated on ${new Date().toLocaleString(`en-US`, { timeZone: `Asia/Shanghai`, dateStyle: `full`, timeStyle: `long`, hour12: false })}`;

        // 更新文件内容
        const startMarker = `<!-- year progress start -->`;
        const endMarker = `<!-- year progress end -->`;
        const startIndex = readmeContent.indexOf(startMarker) + startMarker.length;
        const endIndex = readmeContent.indexOf(endMarker);
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error(`无法在 ${filename} 中找到 year progress 标记`);
        }

        // 构造新的内容
        const newReadme = 
            readmeContent.substring(0, startIndex) +
            `\n` + progressSection + `\n` +
            readmeContent.substring(endIndex);

        // 将更新后的内容写回文件
        await fs.writeFile(filename, newReadme, `utf8`);
        
        console.log(`\
${filename} 已成功更新
更新内容：
------------------------------------------------------------
${progressSection}
------------------------------------------------------------\
        `);
    } catch (error) {
        console.error(`更新 ${filename} 时出错:`, error);
    }
}

// 执行更新
async function updateAllReadme() {
    await updateReadme(`README.md`);
    await updateReadme(`template/README-eta.md`);
}

updateAllReadme();
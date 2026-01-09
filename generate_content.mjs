
import fs from 'fs';
import path from 'path';

const worklogDir = 'content/worklog';
const workshopDir = 'content/workshop';

// Ensure directories exist
if (!fs.existsSync(worklogDir)) fs.mkdirSync(worklogDir, { recursive: true });
if (!fs.existsSync(workshopDir)) fs.mkdirSync(workshopDir, { recursive: true });

// 1. Generate Worklogs for Week 2-12
for (let i = 2; i <= 12; i++) {
    const enContent = `# Week ${i} Worklog\n\n**Focus:** [Topic for Week ${i}]\n\n## 📅 Weekly Goals\n- [ ] Goal 1\n- [ ] Goal 2\n\n## 🚀 Key Achievements\n- Achievement 1\n- Achievement 2\n\n## 📝 Daily Log\n\n### Monday\n- Task A\n\n### Tuesday\n- Task B\n\n## 🧠 Challenges & Solutions\n- **Challenge:** Description.\n- **Solution:** How you solved it.\n`;

    const viContent = `# Nhật Ký Tuần ${i}\n\n**Trọng tâm:** [Chủ đề Tuần ${i}]\n\n## 📅 Mục Tiêu Tuần\n- [ ] Mục tiêu 1\n- [ ] Mục tiêu 2\n\n## 🚀 Thành Tựu Chính\n- Thành tựu 1\n- Thành tựu 2\n\n## 📝 Nhật Ký Hàng Ngày\n\n### Thứ Hai\n- Công việc A\n\n### Thứ Ba\n- Công việc B\n\n## 🧠 Thách Thức & Giải Pháp\n- **Thách thức:** Mô tả.\n- **Giải pháp:** Cách giải quyết.\n`;

    fs.writeFileSync(path.join(worklogDir, `week-${i}.en.md`), enContent);
    fs.writeFileSync(path.join(worklogDir, `week-${i}.vi.md`), viContent);
    console.log(`Created Week ${i} logs.`);
}

// 2. Generate Workshop Sections
const workshopSections = ['overview', 'setup', 'implementation', 'cleanup'];
const workshopTitles = {
    overview: { en: 'Workshop Overview', vi: 'Tổng Quan Workshop' },
    setup: { en: 'Environment Setup', vi: 'Cài Đặt Môi Trường' },
    implementation: { en: 'Implementation Steps', vi: 'Các Bước Triển Khai' },
    cleanup: { en: 'Resource Cleanup', vi: 'Dọn Dẹp Tài Nguyên' }
};

workshopSections.forEach(section => {
    const enContent = `# ${workshopTitles[section].en}\n\nContent for ${section} goes here...\n`;
    const viContent = `# ${workshopTitles[section].vi}\n\nNội dung cho phần ${section} viết ở đây...\n`;

    fs.writeFileSync(path.join(workshopDir, `${section}.en.md`), enContent);
    fs.writeFileSync(path.join(workshopDir, `${section}.vi.md`), viContent);
    console.log(`Created Workshop section: ${section}`);
});

const { execSync } = require('child_process');
const fs = require('fs');
const dir = 'C:\\Users\\rabot\\OneDrive\\Desktop\\Яндекс Волга';

try {
  execSync('git init', { cwd: dir });
  try { execSync('git remote remove origin', { cwd: dir }); } catch(e) {}
  execSync('git remote add origin https://github.com/tymursoseliia/yandexVoha.git', { cwd: dir });
  execSync('git add .', { cwd: dir });
  try { execSync('git commit -m "Automotive rebranding complete"', { cwd: dir }); } catch(e) {}
  execSync('git branch -M main', { cwd: dir });
  execSync('git push -u origin main --force', { cwd: dir });
  console.log('Successfully pushed Yandex Volga');
} catch (e) {
  console.error('Error:', e.message);
}

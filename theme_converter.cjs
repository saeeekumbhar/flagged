const fs = require('fs');
const path = require('path');

const targetDirs = [
  'd:/AI studio/flagged/src/components/tabs'
];

const replaceMap = {
  // Backgrounds & Borders
  'bg-white/60 backdrop-blur-xl border border-[#CFBB99] rounded-[16px]': 'premium-glass rounded-[24px]',
  'bg-white/60 backdrop-blur-xl rounded-[16px] p-4 shadow-sm border border-[#CFBB99]': 'premium-glass rounded-[24px] p-4',
  'bg-[#E5D7C4]/80 border border-[#CFBB99]': 'premium-glass',
  'bg-white/40 backdrop-blur-md border border-[#CFBB99]': 'premium-pill border-white/60',
  'bg-white/80 rounded-[20px] rounded-tl-sm': 'premium-glass rounded-[24px] rounded-tl-sm',
  
  // Specific JourneyTab Day Bubbles (keep them soft but cleaner)
  'bg-[#E5D7C4]/60': 'bg-white/50'
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // processDirectory(fullPath); // skip recursive for now
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('HomeTab.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [key, value] of Object.entries(replaceMap)) {
        // Global replace
        content = content.split(key).join(value);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${file}`);
      }
    }
  }
}

targetDirs.forEach(dir => processDirectory(dir));
console.log('Premium theme conversion script completed.');

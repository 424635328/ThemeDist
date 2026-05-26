const fs = require('fs');
let c = fs.readFileSync('E:/GitHub/themeDist/src/api/index_config.js', 'utf8');

// 1. Script tags
const scripts = (c.match(/<script[\s>]/g) || []).length;
const closes = (c.match(/<\/script>/g) || []).length;
console.log('<script> tags:', scripts, '(expect 1)');
console.log('</script> tags:', closes, '(expect 1)');

// 2. Theme count
const themeStarts = (c.match(/id: '/g) || []).length;
console.log('Theme count (id: patterns):', themeStarts);

// 3. Check for specific broken patterns
const issues = [
  'onload=',
  'onerror=',
  'getContext(',
  'requestAnimationFrame(',
  'addEventListener(',
  'document.createElement',
  'window._omni',
  'window._hs',
  'innerHTML',
  'setTimeout(',
  'setInterval(',
  'MutationObserver',
];
console.log('');
let found = 0;
issues.forEach(p => {
  try {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'gi');
    const count = (c.match(re) || []).length;
    if (count > 0) {
      console.log('  Found', p, ':', count, 'occurrences');
      found += count;
    }
  } catch(e) { console.log('  Error with', p, ':', e.message); }
});

// These are OK in the OmniBoxV2 section (trusted built-in feature)
console.log('');
if (found > 0) {
  console.log('Note: Some matches may be in OmniBoxV2 (trusted built-in feature at end of file)');
  // Find OmniBoxV2 boundaries
  const omniStart = c.indexOf('<script>');
  const omniEnd = c.indexOf('</script>');
  console.log('OmniBoxV2 script span: chars', omniStart, 'to', omniEnd);
  console.log('Verify: grep for these patterns in the OmniBoxV2 section only');
}

// 4. Check line count
console.log('');
console.log('Total lines:', c.split('\n').length, '(was 6509)');

// 5. Check each theme boundary for missing braces
const dailyPoolStart = c.indexOf('dailyPool:[');
console.log('dailyPool starts at char:', dailyPoolStart);

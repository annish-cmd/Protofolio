const fs = require('fs');

// Patch index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<!-- Custom Cursor -->[\s\S]*?<div class="cursor-follower"><\/div>/, '');
fs.writeFileSync('index.html', html);
console.log('Fixed index.html');

// Patch script.js
let js = fs.readFileSync('script.js', 'utf8');
js = js.replace(/\s*initCursor\(\);/, '');

// Find initCursor definition and remove it (lines 152-189 approx)
js = js.replace(/function initCursor\(\) {[\s\S]*?}\n\n/m, '');

// Fix scroll handler performance
js = js.replace(
  /window.addEventListener\('scroll', \(\) => {[\s\S]*?}\);/,
  `// Optimized parallax scroll
  const orbs = document.querySelectorAll('.orb');
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = 0.05 + i * 0.03;
          orb.style.transform = \`translateY(\${scrollY * speed}px)\`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });`
);
fs.writeFileSync('script.js', js);
console.log('Fixed script.js');

// Patch style.css
let css = fs.readFileSync('style.css', 'utf8');

// The regex relies on precise matching. I will just do a global replace for cursor: none and cursor css classes
css = css.replace(/cursor:\s*none\s*;/g, 'cursor: auto;');
css = css.replace(/\.cursor\s*{[\s\S]*?}/, '');
css = css.replace(/\.cursor-follower\s*{[\s\S]*?}/, '');

fs.writeFileSync('style.css', css);
console.log('Fixed style.css');

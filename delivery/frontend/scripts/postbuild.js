import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Path to the built index.html file
const indexPath = join(process.cwd(), 'dist/index.html');

// Read the built index.html file
let indexContent = readFileSync(indexPath, 'utf-8');

// Script to add for GitHub Pages redirect
const redirectScript = `
<script type="text/javascript">
  // Redirect script for GitHub Pages
  // If there's a redirect path in the query string, replace the history entry
  (function() {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>`;

// Insert the redirect script just before the closing </head> tag
indexContent = indexContent.replace('</head>', `${redirectScript}\n  </head>`);

// Write the modified content back to the file
writeFileSync(indexPath, indexContent);

console.log('Post-build script completed: Added redirect script to index.html');
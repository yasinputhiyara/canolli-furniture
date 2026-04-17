const fs = require('fs');
let content = fs.readFileSync('frontend/src/routes/AppRoutes.jsx', 'utf8');
const searchString = '{/* Shop Route */}';
const targetIndex = content.indexOf(searchString);

if (targetIndex !== -1) {
    const route = `
        {/* About Route */}
        <Route
          path="/about"
          element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          }
        />

        `;
    content = content.slice(0, targetIndex) + route + content.slice(targetIndex);
    fs.writeFileSync('frontend/src/routes/AppRoutes.jsx', content);
    console.log('Successfully injected About Route');
} else {
    console.log('Search string not found');
}

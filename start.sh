# Build all stuffs
echo "Build Cummare Server and its components..."
npm run build


# Runn all stuffs
echo "Run Cummare Server and its components..."

# 1) server
node dist/app.js ../Configurations/CummareConfig.json server &

# 2) Updater
node dist/app.js ../Configurations/CummareConfig.json refresher &

# 3) Viewer
node dist/app.js ../Configurations/CummareConfig.json viewer
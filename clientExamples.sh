# Send a simple transaction
npm run build && node dist/publish.js 127.0.0.1:50052 transaction "{\"from\":\"alice2\",\"to\":\"bob\",\"amount\":454434543}" &&

# Fetch form transactions
node dist/subscribe.js 127.0.0.1:50052 transaction
const mongoose = require('mongoose');

function connectToDb() {
    const uri = process.env.DB_CONNECT;

    if (!uri) {
        console.error('Error: DB_CONNECT environment variable is not set.');
        console.error('Please create a .env file in the Backend folder with: DB_CONNECT=your_connection_string');
        process.exit(1);
    }

    // Remove quotes if present
    const connectionString = uri.trim().replace(/^["']|["']$/g, '');

    mongoose
        .connect(connectionString, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        })
        .then(() => {
            console.log('✓ Connected to MongoDB');
            console.log(`  Database: ${mongoose.connection.db.databaseName}`);
        })
        .catch((err) => {
            console.error('✗ Failed to connect to MongoDB');
            
            if (err.code === 8000 || err.message.includes('authentication failed')) {
                console.error('  Authentication failed. Please check:');
                console.error('  1. Username and password in connection string');
                console.error('  2. IP address is whitelisted in MongoDB Atlas (Network Access)');
                console.error('  3. User has proper database permissions');
                console.error('  4. Password special characters are URL-encoded (if any)');
            } else if (err.message.includes('ENOTFOUND')) {
                console.error('  DNS resolution failed. Check your cluster hostname.');
            } else if (err.message.includes('timeout')) {
                console.error('  Connection timeout. Check network access and firewall settings.');
            } else {
                console.error(`  Error: ${err.message}`);
            }
            
            process.exit(1);
        });
}

module.exports = connectToDb;
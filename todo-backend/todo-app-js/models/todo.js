const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Define the ToDo model
const ToDo = sequelize.define('ToDo', {
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'todos'
});

// Function to clear all todos
async function clearDatabase() {
    try {
        await ToDo.destroy({
            where: {},
            truncate: true
        });
        console.log('Database cleared successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
        throw error;
    }
}

// Setup cleanup handlers
async function cleanup() {
    console.log('Cleaning up before exit...');
    try {
        await clearDatabase();
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

// Handle different termination signals
process.on('SIGINT', cleanup);  // Handles Ctrl+C
process.on('SIGTERM', cleanup); // Handles system termination signal
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    cleanup();
});

// Sync the model with the database
sequelize.sync();

module.exports = ToDo;
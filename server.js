import app from './app.js';
import db from './models/index.js'; // renamed for clarity

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(' Database connection established');

    await db.sequelize.sync({ alter: true });
    console.log(' All models synced');

    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1); // Exit the process if database connection fails
  }
};

startServer();

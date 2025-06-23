import { Sequelize } from 'sequelize';
import app from './app.js';
import sequelize from './config/database.js';

const PORT = process.env.PORT || 5000;



sequelize.sync({alter: true}).then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () =>
        console.log(`Server is running on port ${PORT}`));
});
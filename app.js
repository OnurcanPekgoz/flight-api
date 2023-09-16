import express from 'express';
import * as db from './databasepg.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Flight API Documentation',
            version: '1.0.0',
            description: 'Simple API Documentation ',
        },
    },
    apis: ['./routes.js'],
};

const specs = swaggerJSDoc(options);
import routes from './routes.js';
const app = express();

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs))
db.setupDb()
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
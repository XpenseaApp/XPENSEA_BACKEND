const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { PORT, API_VERSION } = process.env;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Xpensea API Documentation",
    version: "1.0.0",
    description: "API documentation for Xpensea application",
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api/${API_VERSION}`,
      url: `https://dev-api.xpensea.com:3040/api/v1`,
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/swagger/paths/*.js"],
};

const swaggerOptions = {
  swaggerOptions: {
    docExpansion: "none", 
    filter: true, 
    tagsSorter: "alpha", 
    operationsSorter: "alpha" 
  }
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec, swaggerOptions };

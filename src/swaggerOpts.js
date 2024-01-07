/**
 * @type {import("@fastify/swagger").FastifySwaggerOptions}
 */
export const swaggerOptions = {
  swagger: {
    info: {
      title: "Energy price API",
      description:
        "API for fetching current energy price data for any provider in Slovenia",
      version: "1.0.0",
    },
    host: "energy-price-api.eu",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  // Used to automatically generate the link to the cloud run backend on each path
  transform: ({ schema, url }) => {
    return {
      schema: {
        ...schema,
        operationId: url,
        "x-google-backend": {
          address: `https://energy-price-api.eu${url}`,
        },
      },
      url,
    };
  },
  refResolver: {
    buildLocalReference: (json, _baseUri, _fragment, i) =>
      json["$id"] || `def-${i}`,
  },
};

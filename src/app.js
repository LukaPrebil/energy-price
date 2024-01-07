import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { requestExecutionContext } from "./executionContext.js";
import { swaggerOptions } from "./swaggerOpts.js";

export const fastify = Fastify({
  logger: {
    level: "debug",
    mixin: () => ({
      requestId: requestExecutionContext.getStore()?.get("requestId"),
    }),
  },
});

await fastify.register(swagger, swaggerOptions);
await fastify.register(swaggerUI);

export const log = fastify.log;

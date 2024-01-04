import Fastify from "fastify";
import { requestExecutionContext } from "./executionContext.js";

export const fastify = Fastify({
  logger: {
    level: "debug",
    mixin: () => ({
      requestId: requestExecutionContext.getStore()?.get("requestId"),
    }),
  },
});

export const log = fastify.log;

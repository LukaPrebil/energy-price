import { performance } from "node:perf_hooks";
import { getPrice } from "./getPrice.js";
import { fastify, log } from "./app.js";


fastify.get("/:provider", async (request) => {

fastify.get("/:provider", async (request, reply) => {
  const { provider } = request.params;
  return await getPrice(provider);
});

const start = async () => {
  try {
      await fastify.listen({ port: 3000 })
  } catch (err) {
    log.error(err);
      process.exit(1)
  }
};

start();

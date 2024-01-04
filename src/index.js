import { performance } from "node:perf_hooks";
import { getPrice } from "./getPrice.js";
import { fastify, log } from "./app.js";


fastify.get("/:provider", async (request) => {
  performance.mark(`start-/${request.params.provider}`);

  const { provider } = request.params;
  const result = await getPrice(provider);

  performance.mark(`end-/${request.params.provider}`);
  performance.measure(`/${request.params.provider}`, `start-/${request.params.provider}`, `end-/${request.params.provider}`);
  log.debug(`/${request.params.provider} measure: ${performance.getEntriesByName(`/${request.params.provider}`)[0].duration}`);
  return result;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};

start();

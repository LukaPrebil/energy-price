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
  // You must listen on the port Cloud Run provides
  const port = parseInt(process.env["PORT"] ?? "") || 8080;
  // You must listen on all IPV4 addresses in Cloud Run
  const host = "0.0.0.0";

  try {
    await fastify.listen({ port, host });
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};

start();

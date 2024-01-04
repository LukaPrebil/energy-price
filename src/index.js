import Fastify from "fastify";
import { getPrice } from "./getPrice.js";

const fastify = Fastify({
  logger: true,
});

fastify.get("/:provider", async (request, reply) => {
  const { provider } = request.params;
  return await getPrice(provider);
});

const start = async () => {
  try {
      await fastify.listen({ port: 3000 })
  } catch (err) {
      fastify.log.error(err)
      process.exit(1)
  }
};

start();

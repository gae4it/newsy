import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const variantRouter = createTRPCRouter({
  getByIds: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(({ ctx, input }) => {
      return ctx.db.variant.findMany({
        where: { id: { in: input.ids } },
        include: { product: true },
      });
    }),
});

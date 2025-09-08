import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { categoryId: input.categoryId },
        include: { variants: true },
      });
    }),
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.query,
                mode: "insensitive",
              },
            },
            {
              variants: {
                some: {
                  name: {
                    contains: input.query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: { variants: true },
      });
    }),
});

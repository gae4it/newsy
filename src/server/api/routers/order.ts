import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        items: z.array(
          z.object({
            variantId: z.number(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.create({
        data: {
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          items: {
            create: input.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          },
        },
      });
    }),
});

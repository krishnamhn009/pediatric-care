import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0 text-[11px] font-medium tracking-wide whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-white text-black border-white shadow-sm hover:bg-white/90",
        secondary:
          "bg-white/[0.06] text-foreground border-white/10 backdrop-blur hover:bg-white/[0.10] hover:border-white/15",
        destructive: "bg-white text-black border-white hover:bg-white/90",
        outline:
          "bg-transparent text-muted-foreground border-white/10 hover:bg-white/[0.04] hover:text-foreground hover:border-white/15",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
        subtle:
          "bg-white/[0.08] text-foreground border-white/[0.06] hover:bg-white/[0.12]",
      },
      size: {
        default: "h-5 px-2.5 text-[11px]",
        sm: "h-6 px-2 text-[11px]",
        lg: "h-7 px-3 text-xs",
        dot: "h-6 pl-1 pr-2.5 gap-1.5",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant = "secondary",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };

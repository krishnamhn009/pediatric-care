import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  date,
  setDate,
  className,
}: {
  date?: Date;
  setDate?: (date?: Date) => void;
  className?: string;
}) {
  const [internalDate, setInternalDate] = React.useState<Date>();

  const current = date !== undefined ? date : internalDate;
  const setCurrent = setDate || setInternalDate;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-[280px] justify-start text-left font-normal",
          !current && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {current ? format(current, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={current} onSelect={setCurrent} />
      </PopoverContent>
    </Popover>
  );
}

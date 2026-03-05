import React from "react";
import {
  AccordionContent,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const SidebarAccordionItem = ({
  title,
  children,
  value,
}: {
  title: string;
  children: React.ReactNode;
  value?: string;
}) => {
  const itemValue = value || title.toLowerCase().replace(/\s+/g, "-");
  return (
    <ShadcnAccordionItem
      value={itemValue}
      className="border-b border-black/10 dark:border-white/10 last:border-0"
    >
      <AccordionTrigger className="w-full flex justify-between items-center py-4 px-6 bg-white dark:bg-card hover:bg-accent dark:hover:bg-accent hover:text-black transition-colors text-left font-bold uppercase tracking-tight text-black dark:text-white hover:no-underline data-[state=open]:bg-accent data-[state=open]:text-black">
        {title}
      </AccordionTrigger>
      <AccordionContent className="p-6 bg-white dark:bg-[#111111] px-6 border-t-2 border-black/5 dark:border-white/5">
        {children}
      </AccordionContent>
    </ShadcnAccordionItem>
  );
};

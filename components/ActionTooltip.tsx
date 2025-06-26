"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import { ReactNode } from "react";

interface IProps{
    label:string;
    children:ReactNode;
    side?:"top" | "right" | "bottom" | "left";
    align?:"start" | "end" | "center";
}

const ActionTooltip = ({label,children,side,align}:IProps) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p className="font-semibold text-sm capitalize">
                    {label?.toLowerCase()}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip
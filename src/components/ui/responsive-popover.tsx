import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerTrigger, DrawerContent } from "./drawer";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

const ResponsivePopoverContext = React.createContext({ isDrawer: false });

interface ResponsivePopoverRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
// Root component - decides between Popover and Drawer
function ResponsivePopoverRoot({
  children,
  open,
  onOpenChange,
  ...props
}: ResponsivePopoverRootProps) {
  const isMobile = useIsMobile();

  const Wrapper = isMobile ? Drawer : Popover;

  return (
    <ResponsivePopoverContext.Provider value={{ isDrawer: isMobile }}>
      <Wrapper open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </Wrapper>
    </ResponsivePopoverContext.Provider>
  );
}

interface ResponsivePopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

// Trigger component - renders appropriate trigger based on context
function ResponsivePopoverTrigger({
  children,
  asChild,
  ...props
}: ResponsivePopoverTriggerProps) {
  const { isDrawer } = React.useContext(ResponsivePopoverContext);
  const Component = isDrawer ? DrawerTrigger : PopoverTrigger;

  return (
    <Component asChild={asChild} {...props}>
      {children}
    </Component>
  );
}

// Content component

interface ResponsivePopoverContentProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}

function ResponsivePopoverContent({
  children,
  side,
  align,
  ...props
}: ResponsivePopoverContentProps) {
  const { isDrawer } = React.useContext(ResponsivePopoverContext);

  if (isDrawer) {
    return <DrawerContent {...props}>{children}</DrawerContent>;
  }

  return (
    <PopoverContent side={side} align={align} {...props}>
      {children}
    </PopoverContent>
  );
}

export {
  ResponsivePopoverRoot as ResponsivePopover,
  ResponsivePopoverTrigger,
  ResponsivePopoverContent,
};

"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SIDEBAR_COLLAPSIBLE_VALUES, SIDEBAR_VARIANT_VALUES } from "@/lib/preferences/layout";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/app/(main)/dashboard/_components/AuthModal";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [variant, setVariant] = useState<typeof SIDEBAR_VARIANT_VALUES[number]>("inset");
  const [collapsible, setCollapsible] = useState<typeof SIDEBAR_COLLAPSIBLE_VALUES[number]>("icon");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Read preferences from cookies on client side
    const sidebarState = getCookie("sidebar_state");
    setDefaultOpen(sidebarState !== "false");

    const variantCookie = getCookie("sidebar_variant");
    if (variantCookie && SIDEBAR_VARIANT_VALUES.includes(variantCookie as any)) {
      setVariant(variantCookie as typeof SIDEBAR_VARIANT_VALUES[number]);
    }

    const collapsibleCookie = getCookie("sidebar_collapsible");
    if (collapsibleCookie && SIDEBAR_COLLAPSIBLE_VALUES.includes(collapsibleCookie as any)) {
      setCollapsible(collapsibleCookie as typeof SIDEBAR_COLLAPSIBLE_VALUES[number]);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Timeout after 2 seconds
      const timeoutId = setTimeout(() => {
        console.warn('[Auth] Check timeout, showing auth modal');
        setIsAuthenticated(false);
      }, 2000);

      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage && chrome?.runtime) {
          // @ts-ignore - Chrome extension API
          const result = await chrome.storage.local.get(['accessToken', 'userData']);

          if (result.accessToken) {
            // Token exists, verify it with API
            // @ts-ignore - Chrome extension API
            const verifyResult: any = await new Promise((resolve) => {
              // @ts-ignore - Chrome extension API
              chrome.runtime.sendMessage({
                action: 'isLoggedIn'
              }, (response: any) => {
                resolve(response);
              });
            });

            clearTimeout(timeoutId);
            setIsAuthenticated(verifyResult?.isLoggedIn === true);
          } else {
            // No token found
            clearTimeout(timeoutId);
            setIsAuthenticated(false);
          }
        } else {
          // Not in extension context, skip auth
          clearTimeout(timeoutId);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearTimeout(timeoutId);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return <AuthModal onAuthenticated={handleAuthenticated} />;
  }

  // Show dashboard if authenticated
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&]:mx-auto! [html[data-content-layout=centered]_&]:max-w-screen-2xl!",
          // Adds right margin for inset sidebar in centered layout up to 113rem.
          // On wider screens with collapsed sidebar, removes margin and sets margin auto for alignment.
          "max-[113rem]:peer-data-[variant=inset]:mr-2! min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:mr-auto!",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

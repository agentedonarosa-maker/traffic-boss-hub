import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsPopover } from "./NotificationsPopover";
import { useState } from "react";

export function AppLayout() {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    // No need to reset loading state as user will be redirected
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-12 sm:h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-full">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
                
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar clientes, campanhas..."
                    className="w-64 xl:w-80 pl-10 bg-background/50 h-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <NotificationsPopover />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent/10 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
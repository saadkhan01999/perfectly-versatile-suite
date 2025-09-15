import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Students } from "@/components/Students";
import { Courses } from "@/components/Courses";
import { Fees } from "@/components/Fees";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <Students />;
      case "courses":
        return <Courses />;
      case "fees":
        return <Fees />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-elegant bg-clip-text text-transparent tracking-tight truncate">
                Academy Management Software
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
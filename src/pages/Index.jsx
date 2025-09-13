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
    <SidebarProvider collapsedWidth={56}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-elegant bg-clip-text text-transparent tracking-tight">
                Academy Management Software
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
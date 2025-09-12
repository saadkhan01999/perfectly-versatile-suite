import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
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
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--chart-2)))] bg-clip-text text-transparent tracking-tight lg:hidden">
              Academy Management Software
            </h1>
            <div className="hidden lg:block">
              <h1 className="text-3xl font-extrabold bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--chart-2)))] bg-clip-text text-transparent tracking-tight">
                Academy Management Software
              </h1>
            </div>
            
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
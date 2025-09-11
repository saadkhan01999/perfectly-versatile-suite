import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Students } from "@/components/Students";
import { Courses } from "@/components/Courses";
import { Fees } from "@/components/Fees";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

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
      case "expenses":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Expenses module coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Reports module coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Settings module coming soon...</p>
          </div>
        );
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
            <h1 className="text-2xl font-bold text-foreground lg:hidden">
              Academy Management Software
            </h1>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground">
                Academy Management Software
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></div>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
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
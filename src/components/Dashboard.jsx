import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Users, DollarSign, Clock, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jan", profit: 2500 },
  { month: "Feb", profit: 1900 },
  { month: "Mar", profit: 1400 },
  { month: "Apr", profit: 3500 },
  { month: "May", profit: 2600 },
  { month: "Jun", profit: 2700 },
  { month: "Jul", profit: 4500 },
  { month: "Aug", profit: 2300 },
  { month: "Sep", profit: 1300 },
  { month: "Oct", profit: 600 },
  { month: "Nov", profit: 0 },
];

const expenseData = [
  { name: "Rent", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Salaries", value: 40, color: "hsl(var(--chart-2))" },
  { name: "Internet", value: 8, color: "hsl(var(--chart-3))" },
  { name: "Marketing", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Misc", value: 5, color: "hsl(var(--chart-5))" },
];

export function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    feesCollected: 0,
    pendingFees: 0,
    monthlyProfit: 0
  });
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');
      
      if (studentsError) throw studentsError;

      const { data: fees, error: feesError } = await supabase
        .from('fees')
        .select('*');
      
      if (feesError) throw feesError;

      const totalFees = fees?.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0) || 0;
      const pendingFees = fees?.reduce((sum, fee) => sum + (fee.pending_amount || 0), 0) || 0;

      setStats({
        totalStudents: students?.length || 0,
        feesCollected: totalFees,
        pendingFees: pendingFees,
        monthlyProfit: totalFees * 0.3
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statsCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Fees Collected",
      value: `PKR ${stats.feesCollected.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Pending Fees",
      value: `PKR ${stats.pendingFees.toLocaleString()}`,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Profit this Month",
      value: `+PKR ${Math.round(stats.monthlyProfit).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Academy overview and key metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchDashboardStats}>
            <Calendar className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="shadow-sm border-0 bg-card hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={cn("h-5 w-5", card.color)} />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", card.color)}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Profit/Loss Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `PKR ${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`PKR ${value}`, "Profit"]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="hsl(var(--chart-1))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Users, DollarSign, Clock, TrendingUp } from "lucide-react";

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

const statsCards = [
  {
    title: "Total Students",
    value: "56",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Fees Collected",
    value: "$3,200",
    icon: DollarSign,
    color: "text-primary",
  },
  {
    title: "Pending Fees",
    value: "$1,100",
    icon: Clock,
    color: "text-warning",
  },
  {
    title: "Profit this Month",
    value: "+$850",
    icon: TrendingUp,
    color: "text-success",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="shadow-sm border-0 bg-card">
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
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "Profit"]}
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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
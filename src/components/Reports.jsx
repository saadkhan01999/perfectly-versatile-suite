import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Users, BookOpen, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Currency formatter (PKR)
const formatPKR = (value) => {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `PKR ${Math.round(n).toLocaleString()}`;
  }
};

export function Reports() {
  const [reportType, setReportType] = useState("financial");
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateReport();
  }, [reportType, timeRange, selectedYear]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await fetchReportData();
      setReportData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    // Fetch students data
    const { data: students } = await supabase
      .from('students')
      .select('*, courses(*)');

    // Fetch fees data
    const { data: fees } = await supabase
      .from('fees')
      .select('*');

    // Fetch expenses data
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*');

    // Fetch courses data
    const { data: courses } = await supabase
      .from('courses')
      .select('*');

    // Process data based on report type
    if (reportType === "financial") {
      return generateFinancialReport(fees, expenses);
    } else if (reportType === "student") {
      return generateStudentReport(students, courses);
    } else if (reportType === "course") {
      return generateCourseReport(courses, students);
    }
  };

  const generateFinancialReport = (fees, expenses) => {
    const monthlyRevenue = Array.from({length: 12}, (_, i) => {
      const month = new Date(2024, i).toLocaleDateString('en', { month: 'short' });
      const revenue = fees?.filter(fee => {
        const feeDate = new Date(fee.created_at);
        return feeDate.getMonth() === i;
      }).reduce((sum, fee) => sum + (fee.paid_amount || 0), 0) || 0;

      const expense = expenses?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === i;
      }).reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;

      return { 
        month, 
        revenue, 
        expense,
        profit: revenue - expense 
      };
    });

    const totalRevenue = fees?.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
    const totalProfit = totalRevenue - totalExpenses;

    const expenseCategories = expenses?.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {}) || {};

    const expensePieData = Object.entries(expenseCategories).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    return {
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0
      },
      monthlyData: monthlyRevenue,
      expenseBreakdown: expensePieData
    };
  };

  const generateStudentReport = (students, courses) => {
    const statusDistribution = students?.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const courseEnrollments = courses?.map(course => ({
      name: course.title,
      enrollments: students?.filter(s => s.course_id === course.id).length || 0,
      capacity: course.max_students,
      utilization: ((students?.filter(s => s.course_id === course.id).length || 0) / course.max_students * 100).toFixed(1)
    })) || [];

    const monthlyEnrollments = Array.from({length: 12}, (_, i) => {
      const month = new Date(2024, i).toLocaleDateString('en', { month: 'short' });
      const enrollments = students?.filter(student => {
        const joinDate = new Date(student.join_date);
        return joinDate.getMonth() === i;
      }).length || 0;
      
      return { month, enrollments };
    });

    return {
      summary: {
        totalStudents: students?.length || 0,
        activeStudents: students?.filter(s => s.status === 'Active').length || 0,
        pendingStudents: students?.filter(s => s.status === 'Pending').length || 0,
        averageEnrollmentRate: courseEnrollments.reduce((sum, course) => sum + parseFloat(course.utilization), 0) / courseEnrollments.length || 0
      },
      statusData: Object.entries(statusDistribution).map(([status, count]) => ({
        name: status,
        value: count,
        color: status === 'Active' ? 'hsl(var(--success))' : status === 'Pending' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'
      })),
      courseEnrollments,
      monthlyEnrollments
    };
  };

  const generateCourseReport = (courses, students) => {
    const courseStats = courses?.map(course => {
      const enrolled = students?.filter(s => s.course_id === course.id).length || 0;
      const revenue = enrolled * (course.price || 0);
      
      return {
        title: course.title,
        enrolled,
        capacity: course.max_students,
        revenue,
        status: course.status,
        progress: course.progress || 0,
        utilization: ((enrolled / course.max_students) * 100).toFixed(1)
      };
    }) || [];

    const statusDistribution = courses?.reduce((acc, course) => {
      acc[course.status] = (acc[course.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const categoryDistribution = courses?.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      summary: {
        totalCourses: courses?.length || 0,
        activeCourses: courses?.filter(c => c.status === 'Active').length || 0,
        totalEnrollments: students?.length || 0,
        avgUtilization: courseStats.reduce((sum, course) => sum + parseFloat(course.utilization), 0) / courseStats.length || 0
      },
      courseStats,
      statusData: Object.entries(statusDistribution).map(([status, count]) => ({
        name: status,
        value: count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      })),
      categoryData: Object.entries(categoryDistribution).map(([category, count]) => ({
        name: category,
        value: count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      }))
    };
  };

  const toCSV = (rows) => {
    if (!rows || rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const escape = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const lines = [headers.join(',')];
    for (const row of rows) {
      lines.push(headers.map((h) => escape(row[h])).join(','));
    }
    return lines.join('\n');
  };

  const downloadCSV = (rows, name) => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportReport = async () => {
    try {
      if (reportType === 'financial') {
        const rows = (reportData?.monthlyData || []).map((d) => ({ month: d.month, revenue: d.revenue, expense: d.expense, profit: d.profit }));
        downloadCSV(rows, 'financial-report');
      } else if (reportType === 'student') {
        const { data: students } = await supabase.from('students').select('id,name,email,phone,fees,status,join_date, courses(title)');
        const rows = (students || []).map((s) => ({ id: s.id, name: s.name, email: s.email, phone: s.phone, course: s.courses?.title || '', status: s.status, fees: s.fees, join_date: s.join_date }));
        downloadCSV(rows, 'students-report');
      } else if (reportType === 'course') {
        const rows = (reportData?.courseStats || []).map((c) => ({ title: c.title, enrolled: c.enrolled, capacity: c.capacity, revenue: c.revenue, status: c.status, progress: c.progress, utilization: c.utilization }));
        downloadCSV(rows, 'courses-report');
      }
      toast({ title: 'Success', description: 'Report exported as CSV' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to export report', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Generating report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive academy performance reports</p>
        </div>
        <Button onClick={exportReport} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Controls */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial Report</SelectItem>
                <SelectItem value="student">Student Report</SelectItem>
                <SelectItem value="course">Course Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={generateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportData?.summary && (
        <div className="grid gap-4 md:grid-cols-4">
          {reportType === "financial" && (
            <>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-success">{formatPKR(reportData.summary.totalRevenue)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Expenses</p>
                      <p className="text-2xl font-bold text-destructive">{formatPKR(reportData.summary.totalExpenses)}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit</p>
                      <p className="text-2xl font-bold text-primary">{formatPKR(reportData.summary.totalProfit)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Profit Margin</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.profitMargin}%</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "student" && (
            <>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Students</p>
                      <p className="text-2xl font-bold text-success">{reportData.summary.activeStudents}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-warning">{reportData.summary.pendingStudents}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Enrollment</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.averageEnrollmentRate.toFixed(1)}%</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "course" && (
            <>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.totalCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                      <p className="text-2xl font-bold text-success">{reportData.summary.activeCourses}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Enrollments</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.totalEnrollments}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Utilization</p>
                      <p className="text-2xl font-bold text-primary">{reportData.summary.avgUtilization.toFixed(1)}%</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Charts */}
      {reportData && (
        <div className="grid gap-6 lg:grid-cols-2">
          {reportType === "financial" && (
            <>
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                        <Legend />
                        <Bar dataKey="revenue" fill="hsl(var(--success))" name="Revenue" />
                        <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {reportData.expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "student" && (
            <>
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Monthly Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.monthlyEnrollments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Student Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {reportData.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "course" && reportData.courseStats && (
            <>
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Course Enrollment vs Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.courseStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="enrolled" fill="hsl(var(--primary))" name="Enrolled" />
                        <Bar dataKey="capacity" fill="hsl(var(--muted))" name="Capacity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle>Course Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {reportData.categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
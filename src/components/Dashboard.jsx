import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Eye,
  UserPlus,
  GraduationCap,
  CreditCard,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Currency formatter (PKR)
const formatPKR = (value) => {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `PKR ${Math.round(n).toLocaleString()}`;
  }
};

export function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalRevenue: 0,
    pendingFees: 0,
    recentEnrollments: 0,
    completionRate: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [studentsRes, coursesRes, feesRes] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('fees').select('*')
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (feesRes.error) throw feesRes.error;

      const students = studentsRes.data || [];
      const courses = coursesRes.data || [];
      const fees = feesRes.data || [];

      // Calculate stats
      const totalRevenue = fees.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0);
      const pendingFees = fees.reduce((sum, fee) => sum + (fee.pending_amount || 0), 0);
      const activeStudents = students.filter(s => s.status === "Active").length;
      const activeCourses = courses.filter(c => c.status === "Active").length;

      // Recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEnrollments = students.filter(s => 
        new Date(s.join_date) > thirtyDaysAgo
      ).length;

      setStats({
        totalStudents: students.length,
        activeStudents,
        totalCourses: courses.length,
        activeCourses,
        totalRevenue,
        pendingFees,
        recentEnrollments,
        completionRate: students.length > 0 ? Math.round((activeStudents / students.length) * 100) : 0
      });

      // Generate recent activities
      const activities = [
        ...(students.slice(-3).map(student => ({
          id: `student-${student.id}`,
          type: "enrollment",
          message: `${student.name} enrolled in academy`,
          timestamp: new Date(student.join_date),
          icon: UserPlus,
          color: "text-success"
        }))),
        ...(fees.filter(fee => fee.status === "Paid").slice(-2).map(fee => {
          const student = students.find(s => s.id === fee.student_id);
          return {
            id: `payment-${fee.id}`,
            type: "payment",
            message: `${student?.name || 'Student'} paid ${formatPKR(fee.paid_amount)}`,
            timestamp: new Date(fee.created_at),
            icon: CreditCard,
            color: "text-primary"
          };
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

      setRecentActivities(activities);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} active`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: `+${stats.recentEnrollments} this month`
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      subtitle: `${stats.activeCourses} active`,
      icon: BookOpen,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      trend: "Course catalog"
    },
    {
      title: "Revenue Collected",
      value: formatPKR(stats.totalRevenue),
      subtitle: "Total earnings",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "Monthly income"
    },
    {
      title: "Pending Fees",
      value: formatPKR(stats.pendingFees),
      subtitle: "Outstanding amount",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "Follow up required"
    }
  ];

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Welcome to your academy management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="responsive-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-elegant group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={cn("rounded-full p-3 group-hover:scale-110 smooth-transition", stat.bgColor)}>
                    <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", stat.color)} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="responsive-grid-2 gap-6">
        {/* Recent Activity */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 smooth-transition hover:bg-muted/50">
                    <div className={cn("rounded-full p-2 bg-background", activity.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-3 h-12 smooth-transition hover:scale-[1.02]" 
              variant="outline"
            >
              <UserPlus className="h-4 w-4" />
              Add New Student
            </Button>
            <Button 
              className="w-full justify-start gap-3 h-12 smooth-transition hover:scale-[1.02]" 
              variant="outline"
            >
              <GraduationCap className="h-4 w-4" />
              Create Course
            </Button>
            <Button 
              className="w-full justify-start gap-3 h-12 smooth-transition hover:scale-[1.02]" 
              variant="outline"
            >
              <CreditCard className="h-4 w-4" />
              Record Payment
            </Button>
            <Button 
              className="w-full justify-start gap-3 h-12 smooth-transition hover:scale-[1.02]" 
              variant="outline"
            >
              <Eye className="h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="responsive-grid-3">
        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Student Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.activeStudents} of {stats.totalStudents} students active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Courses</span>
                <span className="font-medium">{Math.round((stats.activeCourses / Math.max(stats.totalCourses, 1)) * 100)}%</span>
              </div>
              <Progress value={(stats.activeCourses / Math.max(stats.totalCourses, 1)) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.activeCourses} of {stats.totalCourses} courses running
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Fee Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-medium">
                  {stats.totalRevenue + stats.pendingFees > 0 
                    ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalRevenue + stats.pendingFees > 0 
                  ? (stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100
                  : 0} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                {formatPKR(stats.totalRevenue)} collected of {formatPKR(stats.totalRevenue + stats.pendingFees)} total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
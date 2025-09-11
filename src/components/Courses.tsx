import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, Clock, BookOpen, Edit, Trash2 } from "lucide-react";

const coursesData = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    description: "Complete full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js",
    instructor: "John Smith",
    duration: "12 weeks",
    students: 18,
    maxStudents: 25,
    price: "$1,200",
    status: "Active",
    progress: 72,
    startDate: "2024-01-15",
    category: "Programming"
  },
  {
    id: 2,
    title: "Data Science & Analytics",
    description: "Learn Python, machine learning, data visualization, and statistical analysis",
    instructor: "Sarah Johnson",
    duration: "16 weeks",
    students: 14,
    maxStudents: 20,
    price: "$1,500",
    status: "Active",
    progress: 45,
    startDate: "2024-02-20",
    category: "Data Science"
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build iOS and Android apps using React Native and Flutter",
    instructor: "Mike Davis",
    duration: "10 weeks",
    students: 12,
    maxStudents: 20,
    price: "$1,300",
    status: "Active",
    progress: 30,
    startDate: "2024-03-10",
    category: "Mobile"
  },
  {
    id: 4,
    title: "UI/UX Design Masterclass",
    description: "Learn design principles, wireframing, prototyping, and user research",
    instructor: "Emily Wilson",
    duration: "8 weeks",
    students: 8,
    maxStudents: 15,
    price: "$1,100",
    status: "Active",
    progress: 60,
    startDate: "2024-01-30",
    category: "Design"
  },
  {
    id: 5,
    title: "Cybersecurity Fundamentals",
    description: "Network security, ethical hacking, and cybersecurity best practices",
    instructor: "Robert Brown",
    duration: "14 weeks",
    students: 6,
    maxStudents: 15,
    price: "$1,400",
    status: "Upcoming",
    progress: 0,
    startDate: "2024-04-15",
    category: "Security"
  }
];

export function Courses() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Upcoming":
        return "bg-warning text-warning-foreground";
      case "Completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Programming":
        return "bg-chart-1 text-white";
      case "Data Science":
        return "bg-chart-2 text-white";
      case "Mobile":
        return "bg-chart-3 text-white";
      case "Design":
        return "bg-chart-4 text-white";
      case "Security":
        return "bg-chart-5 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Courses</h2>
          <p className="text-muted-foreground">Manage course curriculum and enrollment</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {coursesData.map((course) => (
          <Card key={course.id} className="shadow-sm border-0 h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-2">
                <Badge className={getCategoryColor(course.category)} variant="secondary">
                  {course.category}
                </Badge>
                <Badge className={getStatusColor(course.status)} variant="secondary">
                  {course.status}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium text-foreground">{course.instructor}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Students:</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.students}/{course.maxStudents}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-primary text-base">{course.price}</span>
                </div>
              </div>

              {course.status === "Active" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
              
              <div className="mt-auto pt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{coursesData.length}</p>
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {coursesData.filter(c => c.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Courses</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {coursesData.reduce((total, course) => total + course.students, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              ${coursesData.reduce((total, course) => {
                const price = parseInt(course.price.replace('$', '').replace(',', ''));
                return total + (price * course.students);
              }, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
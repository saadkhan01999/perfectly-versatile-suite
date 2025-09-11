import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";

const studentsData = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 234 567 8901",
    course: "Web Development",
    status: "Active",
    fees: "$1,200",
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+1 234 567 8902",
    course: "Data Science",
    status: "Active",
    fees: "$1,500",
    joinDate: "2024-02-20"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 234 567 8903",
    course: "Mobile Development",
    status: "Pending",
    fees: "$1,300",
    joinDate: "2024-03-10"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 234 567 8904",
    course: "UI/UX Design",
    status: "Active",
    fees: "$1,100",
    joinDate: "2024-01-30"
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 234 567 8905",
    course: "Cybersecurity",
    status: "Inactive",
    fees: "$1,400",
    joinDate: "2023-12-05"
  }
];

export function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStudents = studentsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      case "Inactive":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground">Manage student information and enrollment</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {student.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Course</p>
                      <p className="font-medium text-foreground">{student.course}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(student.status)} variant="secondary">
                        {student.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fees</p>
                      <p className="font-medium text-foreground">{student.fees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Join Date</p>
                      <p className="font-medium text-foreground">{student.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{filteredStudents.length}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {filteredStudents.filter(s => s.status === "Active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">
              {filteredStudents.filter(s => s.status === "Pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Pending Enrollment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
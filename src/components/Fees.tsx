import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Eye, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";

const feesData = [
  {
    id: 1,
    studentName: "Alex Johnson",
    course: "Web Development",
    totalFees: 1200,
    paidAmount: 1200,
    pendingAmount: 0,
    dueDate: "2024-01-15",
    status: "Paid",
    paymentDate: "2024-01-10",
    installments: [
      { amount: 600, date: "2024-01-10", status: "Paid" },
      { amount: 600, date: "2024-01-10", status: "Paid" }
    ]
  },
  {
    id: 2,
    studentName: "Sarah Williams",
    course: "Data Science",
    totalFees: 1500,
    paidAmount: 750,
    pendingAmount: 750,
    dueDate: "2024-03-20",
    status: "Partial",
    paymentDate: "2024-02-20",
    installments: [
      { amount: 750, date: "2024-02-20", status: "Paid" },
      { amount: 750, date: "2024-03-20", status: "Pending" }
    ]
  },
  {
    id: 3,
    studentName: "Michael Brown",
    course: "Mobile Development",
    totalFees: 1300,
    paidAmount: 0,
    pendingAmount: 1300,
    dueDate: "2024-03-15",
    status: "Overdue",
    paymentDate: null,
    installments: [
      { amount: 650, date: "2024-03-15", status: "Overdue" },
      { amount: 650, date: "2024-04-15", status: "Pending" }
    ]
  },
  {
    id: 4,
    studentName: "Emily Davis",
    course: "UI/UX Design",
    totalFees: 1100,
    paidAmount: 1100,
    pendingAmount: 0,
    dueDate: "2024-02-15",
    status: "Paid",
    paymentDate: "2024-02-10",
    installments: [
      { amount: 1100, date: "2024-02-10", status: "Paid" }
    ]
  },
  {
    id: 5,
    studentName: "James Wilson",
    course: "Cybersecurity",
    totalFees: 1400,
    paidAmount: 700,
    pendingAmount: 700,
    dueDate: "2024-04-01",
    status: "Partial",
    paymentDate: "2024-01-15",
    installments: [
      { amount: 700, date: "2024-01-15", status: "Paid" },
      { amount: 700, date: "2024-04-01", status: "Pending" }
    ]
  }
];

export function Fees() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFees = feesData.filter(fee =>
    fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success text-success-foreground";
      case "Partial":
        return "bg-warning text-warning-foreground";
      case "Pending":
        return "bg-muted text-muted-foreground";
      case "Overdue":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalCollected = feesData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalPending = feesData.reduce((sum, fee) => sum + fee.pendingAmount, 0);
  const overdueAmount = feesData
    .filter(fee => fee.status === "Overdue")
    .reduce((sum, fee) => sum + fee.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fee Management</h2>
          <p className="text-muted-foreground">Track student payments and outstanding fees</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-success">${totalCollected.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-warning">${totalPending.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">${overdueAmount.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round((totalCollected / (totalCollected + totalPending)) * 100)}%
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by student name or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fees List */}
      <div className="grid gap-4">
        {filteredFees.map((fee) => (
          <Card key={fee.id} className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {fee.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">{fee.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{fee.course}</p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Fees</p>
                      <p className="font-bold text-foreground">${fee.totalFees.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paid</p>
                      <p className="font-bold text-success">${fee.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-bold text-warning">${fee.pendingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium text-foreground">{fee.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(fee.status)} variant="secondary">
                        {fee.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    {fee.status !== "Paid" && (
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Installments */}
              {fee.installments.length > 1 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Payment Schedule:</p>
                  <div className="grid gap-2">
                    {fee.installments.map((installment, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Installment {index + 1} - {installment.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${installment.amount.toLocaleString()}</span>
                          <Badge 
                            className={getStatusColor(installment.status)} 
                            variant="secondary"
                          >
                            {installment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
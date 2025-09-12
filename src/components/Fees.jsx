import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Eye, DollarSign, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Fees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    student_id: "",
    course_id: "",
    total_amount: "",
    paid_amount: "0",
    due_date: "",
    status: "Pending"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes, coursesRes, installmentsRes] = await Promise.all([
        supabase.from('fees').select('*'),
        supabase.from('students').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('installments').select('*')
      ]);

      if (feesRes.error) throw feesRes.error;
      if (studentsRes.error) throw studentsRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (installmentsRes.error) throw installmentsRes.error;

      setFees(feesRes.data || []);
      setStudents(studentsRes.data || []);
      setCourses(coursesRes.data || []);
      setInstallments(installmentsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  const getFeeInstallments = (feeId) => {
    return installments.filter(i => i.fee_id === feeId);
  };

  const filteredFees = fees.filter(fee => {
    const studentName = getStudentName(fee.student_id);
    const courseName = getCourseName(fee.course_id);
    return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           courseName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
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

  const handleAddFee = async (e) => {
    e.preventDefault();
    try {
      const pendingAmount = parseFloat(newFee.total_amount) - parseFloat(newFee.paid_amount);
      
      const { data, error } = await supabase
        .from('fees')
        .insert([{
          ...newFee,
          total_amount: parseFloat(newFee.total_amount),
          paid_amount: parseFloat(newFee.paid_amount),
          pending_amount: pendingAmount
        }])
        .select();

      if (error) throw error;

      setFees([...fees, data[0]]);
      setNewFee({
        student_id: "",
        course_id: "",
        total_amount: "",
        paid_amount: "0",
        due_date: "",
        status: "Pending"
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Fee record added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fee record",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', feeId);

      if (error) throw error;

      setFees(fees.filter(fee => fee.id !== feeId));
      toast({
        title: "Success",
        description: "Fee record deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fee record",
        variant: "destructive",
      });
    }
  };

  const totalCollected = fees.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0);
  const totalPending = fees.reduce((sum, fee) => sum + (fee.pending_amount || 0), 0);
  const overdueAmount = fees
    .filter(fee => fee.status === "Overdue")
    .reduce((sum, fee) => sum + (fee.pending_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading fees data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fee Management</h2>
          <p className="text-muted-foreground">Track student payments and outstanding fees</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Fee Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={newFee.student_id} onValueChange={(value) => setNewFee({...newFee, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={newFee.course_id} onValueChange={(value) => setNewFee({...newFee, course_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="0.00"
                    value={newFee.total_amount}
                    onChange={(e) => setNewFee({...newFee, total_amount: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Paid Amount</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder="0.00"
                    value={newFee.paid_amount}
                    onChange={(e) => setNewFee({...newFee, paid_amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newFee.due_date}
                  onChange={(e) => setNewFee({...newFee, due_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newFee.status} onValueChange={(value) => setNewFee({...newFee, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Add Fee Record
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                  {totalCollected + totalPending > 0 ? Math.round((totalCollected / (totalCollected + totalPending)) * 100) : 0}%
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
        {filteredFees.map((fee) => {
          const studentName = getStudentName(fee.student_id);
          const courseName = getCourseName(fee.course_id);
          const feeInstallments = getFeeInstallments(fee.id);
          
          return (
            <Card key={fee.id} className="shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{studentName}</h3>
                      <p className="text-sm text-muted-foreground">{courseName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Fees</p>
                        <p className="font-bold text-foreground">${fee.total_amount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Paid</p>
                        <p className="font-bold text-success">${fee.paid_amount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="font-bold text-warning">${fee.pending_amount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium text-foreground">{fee.due_date || "Not set"}</p>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFee(fee.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Installments */}
                {feeInstallments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Payment Schedule:</p>
                    <div className="grid gap-2">
                      {feeInstallments.map((installment, index) => (
                        <div key={installment.id} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Installment {index + 1} - {installment.due_date}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${installment.amount?.toLocaleString() || 0}</span>
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
          );
        })}
      </div>

      {filteredFees.length === 0 && (
        <Card className="shadow-sm border-0">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No fee records found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
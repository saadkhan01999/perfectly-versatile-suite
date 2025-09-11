-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    course_id UUID,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Inactive')),
    fees DECIMAL(10,2),
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT NOT NULL,
    duration TEXT,
    max_students INTEGER DEFAULT 25,
    price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Upcoming', 'Completed')),
    start_date DATE,
    category TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fees table
CREATE TABLE public.fees (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    pending_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Partial', 'Pending', 'Overdue')),
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create installments table
CREATE TABLE public.installments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    fee_id UUID REFERENCES public.fees(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    academy_name TEXT DEFAULT 'Academy Management Software',
    address TEXT,
    phone TEXT,
    email TEXT,
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since this is academy management software)
-- Students policies
CREATE POLICY "Allow public access to students" ON public.students FOR ALL USING (true);

-- Courses policies
CREATE POLICY "Allow public access to courses" ON public.courses FOR ALL USING (true);

-- Fees policies
CREATE POLICY "Allow public access to fees" ON public.fees FOR ALL USING (true);

-- Installments policies
CREATE POLICY "Allow public access to installments" ON public.installments FOR ALL USING (true);

-- Expenses policies
CREATE POLICY "Allow public access to expenses" ON public.expenses FOR ALL USING (true);

-- Settings policies
CREATE POLICY "Allow public access to settings" ON public.settings FOR ALL USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON public.fees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_installments_updated_at BEFORE UPDATE ON public.installments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint for students course_id
ALTER TABLE public.students ADD CONSTRAINT fk_students_course FOREIGN KEY (course_id) REFERENCES public.courses(id);

-- Insert sample data
INSERT INTO public.courses (title, description, instructor, duration, max_students, price, status, start_date, category, progress) VALUES
('Web Development Bootcamp', 'Complete full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js', 'John Smith', '12 weeks', 25, 1200.00, 'Active', '2024-01-15', 'Programming', 72),
('Data Science & Analytics', 'Learn Python, machine learning, data visualization, and statistical analysis', 'Sarah Johnson', '16 weeks', 20, 1500.00, 'Active', '2024-02-20', 'Data Science', 45),
('Mobile App Development', 'Build iOS and Android apps using React Native and Flutter', 'Mike Davis', '10 weeks', 20, 1300.00, 'Active', '2024-03-10', 'Mobile', 30),
('UI/UX Design Masterclass', 'Learn design principles, wireframing, prototyping, and user research', 'Emily Wilson', '8 weeks', 15, 1100.00, 'Active', '2024-01-30', 'Design', 60),
('Cybersecurity Fundamentals', 'Network security, ethical hacking, and cybersecurity best practices', 'Robert Brown', '14 weeks', 15, 1400.00, 'Upcoming', '2024-04-15', 'Security', 0);

INSERT INTO public.expenses (title, category, amount, description, date) VALUES
('Office Rent', 'Rent', 2500.00, 'Monthly office space rental', '2024-01-01'),
('Instructor Salaries', 'Salaries', 8000.00, 'Monthly salaries for all instructors', '2024-01-01'),
('Internet & Utilities', 'Internet', 350.00, 'Monthly internet and utility bills', '2024-01-01'),
('Marketing Campaign', 'Marketing', 1200.00, 'Social media and online advertising', '2024-01-01'),
('Office Supplies', 'Misc', 150.00, 'Stationery and office equipment', '2024-01-01');
using EF_CodeFirst.Infra;
using EF_CodeFirst.Model;
using System;
using System.Linq;

namespace EF_CodeFirst
{
    class Program
    {
        static void Main(string[] args)
        {
            // Initializing the database and populating seed data using DropCreateDatabaseIfModelChanges initializer
            (new DropCreateDBOnModelChanged()).InitializeDatabase(new SchoolContext());

            SchoolContext schoolContext = new SchoolContext();

            Course course = schoolContext.Courses.FirstOrDefault(l => l.Name == "WCF");

            course.Students.Add(new Student() { Grade = 10, Name = "Jorge" });
            course.Students.Add(new Student() { Grade = 9, Name = "Juan" });

            course.CourseTeacher.Salary += 1000;

            course.Students.RemoveAll(student => student.Name == "Student_1");

            schoolContext.SaveChanges();

            Console.WriteLine(course.ToString());
        }
    }
}
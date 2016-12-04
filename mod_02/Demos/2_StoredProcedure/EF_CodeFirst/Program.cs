using System;
using System.Data.Entity;
using System.Linq;
using EF_CodeFirst.Infra;
using System.Data.SqlClient;
using EF_CodeFirst.Model;

namespace EF_CodeFirst
{
    class Program
    {
        static void Main(string[] args)
        {
            // Initializing the database and populating seed data using DropCreateDatabaseIfModelChanges initializer
            (new DropCreateDBOnModelChanged()).InitializeDatabase(new SchoolContext());

            // Creating a SchoolContext to be used to access data
            using (var context = new SchoolContext())
            {

                // Calculating the average grade for the course
                var averageGradeInCourse = (from c in context.Courses
                                            where c.Name == "WCF"
                                            select c.Students.Average(s => s.Grade)).Single();

                Console.WriteLine("Average grade for the course is {0}", averageGradeInCourse);

                // Adding 10 points to all the students in this course using Stored Procedure called spUpdateGrades, passing the course name and the grade change
                context.Database.ExecuteSqlCommand("spUpdateGrades @CourseName, @GradeChange",
                                                            new SqlParameter("@CourseName", "WCF"),
                                                            new SqlParameter("@GradeChange", 10));

                // Calculating the average grade for the course after the grades update
                var averageGradeInCourseAfterGradesUpdate = (from c in context.Courses
                                                             where c.Name == "WCF"
                                                             select c.Students.Average(s => s.Grade)).Single();

                Console.WriteLine("Average grade for the course after 10 points upgrade is {0}", averageGradeInCourseAfterGradesUpdate);

                Console.WriteLine("Press any key to exit...");
                Console.ReadLine();
            }
        }
    }
}

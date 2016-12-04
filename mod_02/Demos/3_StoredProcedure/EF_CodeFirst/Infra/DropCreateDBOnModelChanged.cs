using System;
using System.Data.Entity;
using System.Linq;
using System.Collections.Generic;
using EF_CodeFirst.Model;

namespace EF_CodeFirst.Infra
{
    internal class DropCreateDBOnModelChanged : DropCreateDatabaseAlways<SchoolContext>
    {
        // After the database been droped and recreated, Seed method is being called for creating initial data
        protected override void Seed(SchoolContext context)
        {
            // Creating a fictitious teacher names
            List<string> TeacherNames = new List<string>() { "Kari Hensien", "Terry Adams", "Dan Park", "Peter Houston", "Lukas Keller", "Mathew Charles", "John Smith", "Andrew Davis", "Frank Miller", "Patrick Hines" };

            List<string> CourseNames = new List<string>() { "WCF", "WFP", "ASP.NET", "Advanced .Net", ".Net Performance", "LINQ", "Entity Frameword", "Windows Azure", "Windows Phone 8", "Production Debugging" };

            // Generating ten courses
            for (int i = 0; i < 10; i++)
            {
                var teacher = new Teacher() { Name = TeacherNames[i], Salary = 100000 };
                var course = new Course { Name = CourseNames[i], CourseTeacher = teacher, Students = new List<Student>() };

                Random rand = new Random(i);

                // For each course, generating ten students and assigning them to the current course
                for (int j = 0; j < 10; j++)
                {
                    var student = new Student {  Name = "Student_" + j, Grade = rand.Next(40,80)};
                    course.Students.Add(student);
                }
                context.Courses.Add(course);
                context.Teachers.Add(teacher);
            }

            // Defining stored procedure that accepts CourceName and GradeChange as parameters and updates the grade to all the students in the course
            string cmdCreateProcedure = @"CREATE PROCEDURE spUpdateGrades @CourseName nvarchar(30), @GradeChange int
                                        AS
                                        BEGIN
	                                        DECLARE @CourseId int

	                                        SELECT @CourseId = Id FROM Courses where Name = @CourseName;

	                                        UPDATE Students SET Grade = 
								                                        (Case 
									                                        When (Grade + @GradeChange) <= 100 Then (Grade + @GradeChange) 
									                                        Else 100 
								                                        End) 
			                                        where Id In(SELECT Student_Id from CourseStudents where Course_Id = @CourseId) ;
                                        END";

            // Creating the stored procedure in database
            context.Database.ExecuteSqlCommand(cmdCreateProcedure);

            // Saving the changes to the database
            context.SaveChanges();
        }
    }
}



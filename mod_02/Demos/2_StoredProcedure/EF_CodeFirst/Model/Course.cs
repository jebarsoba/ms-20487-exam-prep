using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EF_CodeFirst.Model
{
    public class Course
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual Teacher CourseTeacher { get; set; }
        public virtual List<Student> Students { get; set; }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(string.Format("Course Id: {0}, Name: {1}", Id, Name));
            sb.AppendLine(string.Format("Teacher name: {0}, Salary: {1}", CourseTeacher.Name, CourseTeacher.Salary));
            sb.AppendLine("Students:");

            foreach (var item in Students)
            {
                sb.AppendLine(string.Format("\tStudent name: {0}", item.Name));
            }

            return sb.ToString();
        }
    }
}

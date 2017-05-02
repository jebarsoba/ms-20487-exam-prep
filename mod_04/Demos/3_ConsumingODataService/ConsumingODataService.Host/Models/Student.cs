using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConsumingODataService.Host.Model
{
    [Table("Students")]
    public class Student : Person
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
        public virtual int Grade { get; set; }
        public virtual List<Course> Courses { get; set; }
    }
}

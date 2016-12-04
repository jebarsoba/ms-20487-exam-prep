using System.Data.Entity;

namespace MyFirstEF
{
    class Program
    {
        static void Main(string[] args)
        {
            CreateDatabaseIfNotExists<MyDbContext> myDbContext = new CreateDatabaseIfNotExists<MyDbContext>();
            myDbContext.InitializeDatabase(new MyDbContext());
        }
    }
}
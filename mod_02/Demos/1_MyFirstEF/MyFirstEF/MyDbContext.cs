using System.Data.Entity;

namespace MyFirstEF
{
    public class MyDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Store> Stores { get; set; }
    }
}
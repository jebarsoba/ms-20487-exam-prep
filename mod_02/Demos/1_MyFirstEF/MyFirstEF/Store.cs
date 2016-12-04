using System.Collections.Generic;

namespace MyFirstEF
{
    public class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Product> Products { get; set; }
    }
}
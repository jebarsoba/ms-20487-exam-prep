using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace ImagesWithMediaTypeFormatter.Host.Controllers
{
    public class ValuesController : ApiController
    {
        private Value[] VALUES = new Value[] { 
            new Value{Id =0, Name = "Zero", Thumbnail=@"Images\orderedlist0.png"},
            new Value{Id =1, Name = "One", Thumbnail=@"Images\orderedlist1.png"},
            new Value{Id =2, Name = "Two", Thumbnail=@"Images\orderedlist2.png"},
            new Value{Id =3, Name = "Three", Thumbnail=@"Images\orderedlist3.png"},
            new Value{Id =4, Name = "Four", Thumbnail=@"Images\orderedlist4.png"},
            new Value{Id =5, Name = "Five", Thumbnail=@"Images\orderedlist5.png"},
            new Value{Id =6, Name = "Six", Thumbnail=@"Images\orderedlist6.png"},
            new Value{Id =7, Name = "Seven", Thumbnail=@"Images\orderedlist7.png"},
            new Value{Id =8, Name = "Eight", Thumbnail=@"Images\orderedlist8.png"},
            new Value{Id =9, Name = "Nine", Thumbnail=@"Images\orderedlist9.png"}};            

        // GET api/values/5
        public Value Get(int id)
        {
            return VALUES[id];
        }    
    }

    public class Value
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [IgnoreDataMember]
        public string Thumbnail { get; set; }
    }
}
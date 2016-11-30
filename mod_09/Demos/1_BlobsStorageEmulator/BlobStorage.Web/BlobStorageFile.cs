using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlobStorage.Web
{
	public class BlobStorageFile
	{
		public string Name { get; set; }
		public Uri Uri { get; set; }
		public long Size { get; set; }
	}
}
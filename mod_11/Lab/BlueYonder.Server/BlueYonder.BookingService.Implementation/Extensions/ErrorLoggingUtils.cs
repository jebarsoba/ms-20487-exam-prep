using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace BlueYonder.BookingService.Implementation.Extensions
{
    internal static class ErrorLoggingUtils
    {
        public static string GetObjectAsXml(object obj)
        {
            if (obj == null)
            {
                return "null";
            }
            try
            {
                DataContractSerializer dcs = new DataContractSerializer(obj.GetType());

                MemoryStream ms = new MemoryStream();

                using (XmlDictionaryWriter writer = XmlDictionaryWriter.CreateTextWriter(ms))
                {
                    dcs.WriteObject(writer, obj);
                }

                return Encoding.Default.GetString(ms.GetBuffer());
            }
            catch (Exception ex)
            {
                return "Error serializing parameter: " + ex.ToString();
            }
        }
    }
}

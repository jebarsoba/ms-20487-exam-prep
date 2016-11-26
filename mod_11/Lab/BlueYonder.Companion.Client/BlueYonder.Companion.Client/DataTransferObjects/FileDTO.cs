using System;

namespace BlueYonder.Companion.Client.DataTransferObjects
{
    public class FileDTO
    {
        public string FileName { get; set; }

        public Uri Uri { get; set; }

        public int TripId { get; set; }

        public int LocationId { get; set; }

        public string Description { get; set; }

        public bool IsPrivate { get; set; }

        public string Type { get; set; }

        public string UserId { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace BlobStorage.Web
{
    public static class ContainerHelper
    {
        public static CloudBlobContainer GetContainer()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
            //The following line from the original demo didn't work, had to change it...
            //CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("PhotosStorage"));

            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            CloudBlobContainer container = blobClient.GetContainerReference("files");

            container.CreateIfNotExists();

            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

            return container;
        }
    }
}
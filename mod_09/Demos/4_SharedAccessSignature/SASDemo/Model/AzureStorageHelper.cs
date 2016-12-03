using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SASDemo.Model
{
    public class AzureStorageHelper
    {
        private const string PolicyName = "restrictedAccess";

        public static void UploadPicture(Stream pictureStream, string pictureName)
        {
            BlobContainerPermissions containerPermissions;
            CloudBlobContainer container = GetBlobContainer(out containerPermissions);

            // Retrieve reference to a blob
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(pictureName.ToLower());

            // Create or overwrite the blob with contents from the stream given
            blockBlob.UploadFromStream(pictureStream);

            // Disable caching the blob in the browser, so we can easily test the expired policy
            blockBlob.Properties.CacheControl = "no-cache";
            blockBlob.SetProperties();
        }

        public static IEnumerable<SASPicture> GetPicturesRefrences()
        {
            BlobContainerPermissions containerPermissions;
            CloudBlobContainer container = GetBlobContainer(out containerPermissions);

            var list = new List<SASPicture>();
            // Get the shared access policy to show the URL's expiration date
            SharedAccessBlobPolicy sharedAccessPolicy = containerPermissions.SharedAccessPolicies[PolicyName];

            string sasToken = container.GetSharedAccessSignature(new SharedAccessBlobPolicy(), PolicyName);
            // Loop over items within the container and output the length and URI.
            foreach (IListBlobItem item in container.ListBlobs(null, true))
            {
                if (item.GetType() == typeof(CloudBlockBlob))
                {
                    CloudBlockBlob blockBlob = (CloudBlockBlob)item;

                    list.Add(new SASPicture
                    {
                        Name = blockBlob.Name,
                        SASLink = blockBlob.Uri.AbsoluteUri + sasToken,
                        SimpleLink = blockBlob.Uri.AbsoluteUri,
                        ValidTo = sharedAccessPolicy.SharedAccessExpiryTime.Value.LocalDateTime
                    });
                }
            }

            return list;
        }

        public static void ExtendPolicy()
        {
            BlobContainerPermissions containerPermissions;
            CloudBlobContainer container = GetBlobContainer(out containerPermissions);

            SharedAccessBlobPolicy sharedAccessPolicy = containerPermissions.SharedAccessPolicies[PolicyName];
            // Extend the expiration time by one minute.
            sharedAccessPolicy.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(1);
            container.SetPermissions(containerPermissions);
        }

        private static CloudBlobContainer GetBlobContainer(out BlobContainerPermissions containerPermissions)
        {
            // Retrieve storage account from connection string.
            CloudStorageAccount storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
            //The following line from the original demo didn't work, had to change it...
            //CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageAccount"));

            // Create the blob client. 
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve reference to a previously created container.
            CloudBlobContainer container = blobClient.GetContainerReference("photos");
            if (container.CreateIfNotExists())
            {
                // Container was just created. Next step is to set its permissions

                containerPermissions = new BlobContainerPermissions();
                // Set the shared access policy to one minute from now
                SharedAccessBlobPolicy sharedAccessPolicy = new SharedAccessBlobPolicy()
                {
                    SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(1),
                    Permissions = SharedAccessBlobPermissions.Read
                };

                containerPermissions.SharedAccessPolicies.Add(PolicyName, sharedAccessPolicy);
                containerPermissions.PublicAccess = BlobContainerPublicAccessType.Off;

                container.SetPermissions(containerPermissions);
            }
            else
            {
                containerPermissions = container.GetPermissions();
            }
            return container;
        }

    }
}
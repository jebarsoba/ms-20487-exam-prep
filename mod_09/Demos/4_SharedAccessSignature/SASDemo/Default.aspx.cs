using SASDemo.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SASDemo
{
	public partial class _Default : Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!IsPostBack)
			{
                rptPhotos.DataSource = AzureStorageHelper.GetPicturesRefrences();
				rptPhotos.DataBind();
			}
		}

		protected void btnUpload_Click(object sender, EventArgs e)
		{
			if (filePicture.HasFile && filePicture.PostedFile != null)
			{
                AzureStorageHelper.UploadPicture(filePicture.PostedFile.InputStream, filePicture.PostedFile.FileName);
			}
			Response.Redirect("/Default.aspx");
		}

        protected void btnExtendPolicy_Click(object sender, EventArgs e)
        {          
            AzureStorageHelper.ExtendPolicy();
            Response.Redirect("/Default.aspx");
        }
	}
}
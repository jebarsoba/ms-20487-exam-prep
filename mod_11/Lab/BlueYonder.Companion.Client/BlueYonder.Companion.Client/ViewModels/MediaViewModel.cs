using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;
using BlueYonder.Companion.Client.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Networking.BackgroundTransfer;
using Windows.Storage;
using Windows.UI.Xaml.Controls;

namespace BlueYonder.Companion.Client.ViewModels
{
    public class MediaViewModel : ViewModel
    {
        private readonly DataManager _data;

        public DelegateCommand CaptureVideoCommand { get; set; }
        public DelegateCommand CaptureImageCommand { get; set; }
        public DelegateCommand TakePictureCommand { get; set; }

        public DelegateCommand UploadCommand { get; set; }
        public DelegateCommand DownloadCommand { get; set; }
        public DelegateCommand CancelBackgroundProcessCommand { get; set; }

        private Reservation _reservation;
        public Reservation Reservation
        {
            get { return this._reservation; }
            set { this.SetProperty(ref this._reservation, value); }
        }

        private List<MediaItem> _mediaFiles;
        public List<MediaItem> MediaFiles
        {
            get { return this._mediaFiles; }
            set { this.SetProperty(ref this._mediaFiles, value); }
        }

        private MediaCapture _mediaCaptureManager;
        public MediaCapture MediaCaptureManager
        {
            get { return this._mediaCaptureManager; }
            set { this.SetProperty(ref this._mediaCaptureManager, value); }
        }

        #region Contrast

        private double _contrastValue = 50;
        public double ContrastValue
        {
            get { return this._contrastValue; }
            set
            {
                this.SetProperty(ref this._contrastValue, value);
                SetContrastValue();
            }
        }

        private double _contrastMinValue = 0;
        public double ContrastMinValue
        {
            get { return this._contrastMinValue; }
            set { this.SetProperty(ref this._contrastMinValue, value); }
        }

        private double _contrastStepFrequency = 5;
        public double ContrastStepFrequency
        {
            get { return this._contrastStepFrequency; }
            set { this.SetProperty(ref this._contrastStepFrequency, value); }
        }

        private double _contrastMaxValue = 100;
        public double ContrastMaxValue
        {
            get { return this._contrastMaxValue; }
            set { this.SetProperty(ref this._contrastMaxValue, value); }
        }

        #endregion

        #region Brightness

        private double _brightnessMinValue = 0;
        public double BrightnessMinValue
        {
            get { return this._brightnessMinValue; }
            set { this.SetProperty(ref this._brightnessMinValue, value); }
        }

        private double _brightnessStepFrequency = 5;
        public double BrightnessStepFrequency
        {
            get { return this._brightnessStepFrequency; }
            set { this.SetProperty(ref this._brightnessStepFrequency, value); }
        }

        private double _brightnessMaxValue = 100;
        public double BrightnessMaxValue
        {
            get { return this._brightnessMaxValue; }
            set { this.SetProperty(ref this._brightnessMaxValue, value); }
        }

        private double _brightnessValue = 50;
        public double BrightnessValue
        {
            get { return this._brightnessValue; }
            set
            {
                this.SetProperty(ref this._brightnessValue, value);
                SetBrightnessValue();
            }
        }

        #endregion

        private bool _previewEnabled;
        public bool PreviewEnabled
        {
            get { return this._previewEnabled; }
            set { this.SetProperty(ref this._previewEnabled, value); }
        }

        private CaptureElement _previewElement;
        public CaptureElement PreviewElement
        {
            get { return this._previewElement; }
            set { this.SetProperty(ref this._previewElement, value); }
        }

        private bool _idle;
        public bool Idle
        {
            get { return this._idle; }
            set { this.SetProperty(ref this._idle, value); }
        }

        private int _reservationId;
        public int ReservationId
        {
            get { return this._reservationId; }
            set { this.SetProperty(ref this._reservationId, value); }
        }

        private TravelerInfoViewModel _travelerInfo;
        public TravelerInfoViewModel TravelerInfo
        {
            get { return this._travelerInfo; }
            set { this.SetProperty(ref this._travelerInfo, value); }
        }

        private string _message;
        public string Message
        {
            get { return this._message; }
            set { this.SetProperty(ref this._message, value); }
        }

        private double _uploadPercent;
        public double UploadPercent
        {
            get { return this._uploadPercent; }
            set { this.SetProperty(ref this._uploadPercent, value); }
        }

        private StorageFolder _mediaFolder;
        private StorageFolder _mediaTempFolder;
        private CancellationTokenSource cts;

        private List<DownloadOperation> activeDownloads;

        private MediaItem _selectedMediaItem;
        public MediaItem SelectedMediaItem
        {
            get { return this._selectedMediaItem; }
            set { this.SetProperty(ref this._selectedMediaItem, value); }
        }

        private double _backgroundProcessPercent;
        public double BackgroundProcessPercent
        {
            get { return this._backgroundProcessPercent; }
            set { this.SetProperty(ref this._backgroundProcessPercent, value); }
        }

        public MediaViewModel()
        {
            this._data = new DataManager();

            this.TravelerInfo = new TravelerInfoViewModel();

            this.Idle = true;

            this.MediaFiles = new List<MediaItem>();

            CaptureVideoCommand = new DelegateCommand(CaptureVideo);
            CaptureImageCommand = new DelegateCommand(CaptureImage);
            TakePictureCommand = new DelegateCommand(TakePicture);

            UploadCommand = new DelegateCommand(UploadMedia);
            DownloadCommand = new DelegateCommand(DownloadMedia);
            CancelBackgroundProcessCommand = new DelegateCommand(CancelBackgroundProcess);
        }

        public override async void Initialize(Frame frame)
        {
            base.Initialize(frame);

            this.Reservation = await _data.GetReservationAsync(this.ReservationId);

            var rootMediaFolder = await Windows.Storage.ApplicationData.Current.TemporaryFolder.CreateFolderAsync("Media", CreationCollisionOption.OpenIfExists);
            _mediaFolder = await rootMediaFolder.CreateFolderAsync(ReservationId.ToString(), CreationCollisionOption.OpenIfExists);

            _mediaTempFolder = await Windows.Storage.ApplicationData.Current.TemporaryFolder.CreateFolderAsync("Media", CreationCollisionOption.OpenIfExists);
            _mediaFolder = await Windows.Storage.ApplicationData.Current.LocalFolder.CreateFolderAsync("Media", CreationCollisionOption.OpenIfExists);

            await LoadMediaFiles();

            await RecoverDownloads();
        }

        private void SetBrightnessValue()
        {
            try
            {
                var success = this.MediaCaptureManager.VideoDeviceController.Brightness.TrySetValue(this.BrightnessValue);
                Message = success ? string.Empty : "Unable to change the brightness";
            }
            catch (Exception exception)
            {
                ShowFatalErrorMessageDialog(exception.Message, string.Empty);
            }
        }

        private void SetContrastValue()
        {
            try
            {
                var success = this.MediaCaptureManager.VideoDeviceController.Contrast.TrySetValue(this.ContrastValue);
                Message = success ? string.Empty : "Unable to change the contrast";
            }
            catch (Exception exception)
            {
                ShowFatalErrorMessageDialog(exception.Message, string.Empty);
            }
        }

        private void SetupVideoPreviewSettings()
        {
            if (MediaCaptureManager.VideoDeviceController.Brightness != null && MediaCaptureManager.VideoDeviceController.Brightness.Capabilities.Supported)
            {
                var brightness = this.MediaCaptureManager.VideoDeviceController.Brightness;
                this.BrightnessMaxValue = brightness.Capabilities.Max;
                this.BrightnessMinValue = brightness.Capabilities.Min;
                this.BrightnessStepFrequency = brightness.Capabilities.Step;

                double controlValue = 0;
                if (brightness.TryGetValue(out controlValue))
                {
                    this.BrightnessValue = controlValue;
                }
            }

            if (MediaCaptureManager.VideoDeviceController.Contrast != null && MediaCaptureManager.VideoDeviceController.Contrast.Capabilities.Supported)
            {
                var contrast = this.MediaCaptureManager.VideoDeviceController.Contrast;
                this.ContrastMaxValue = contrast.Capabilities.Max;
                this.ContrastMinValue = contrast.Capabilities.Min;
                this.ContrastStepFrequency = contrast.Capabilities.Step;

                double controlValue = 0;
                if (contrast.TryGetValue(out controlValue))
                {
                    this.ContrastValue = controlValue;
                }
            }
        }

        private async void CaptureImage(object parameter)
        {
            try
            {
                MediaCaptureManager = new Windows.Media.Capture.MediaCapture();
                await MediaCaptureManager.InitializeAsync();
                MediaCaptureManager.Failed += MediaCaptureManager_Failed;
                this._previewElement.Source = MediaCaptureManager;

                await MediaCaptureManager.StartPreviewAsync();

                this.PreviewEnabled = true;
                this.Idle = true;
                SetupVideoPreviewSettings();
            }
            catch (Exception ex)
            {
                ShowFatalErrorMessageDialog(ex.Message, string.Empty);
            }
        }

        private async void TakePicture(object parameter)
        {
            this.Idle = false;
            var file = await _mediaTempFolder.CreateFileAsync("UserImage.jpg", Windows.Storage.CreationCollisionOption.GenerateUniqueName);
            ImageEncodingProperties imageProperties = ImageEncodingProperties.CreateJpeg();
            await MediaCaptureManager.CapturePhotoToStorageFileAsync(imageProperties, file);
            await MediaCaptureManager.StopPreviewAsync();
            await LoadMediaFiles();
            this.PreviewEnabled = false;
            this.Idle = true;
        }

        private void MediaCaptureManager_Failed(MediaCapture sender, MediaCaptureFailedEventArgs errorEventArgs)
        {
            ShowFatalErrorMessageDialog(errorEventArgs.Message, string.Empty);
        }

        private async void CaptureVideo(object parameter)
        {
            try
            {
                CameraCaptureUI dialog = new CameraCaptureUI();
                dialog.VideoSettings.Format = CameraCaptureUIVideoFormat.Mp4;
                StorageFile file = await dialog.CaptureFileAsync(CameraCaptureUIMode.Video);
                if (file != null)
                {
                    await file.MoveAsync(_mediaTempFolder, file.Name, NameCollisionOption.GenerateUniqueName);
                    await LoadMediaFiles();
                }
            }
            catch (Exception ex)
            {
                ShowFatalErrorMessageDialog(Accessories.resourceLoader.GetString("CaptureVideo"), Accessories.resourceLoader.GetString("CaptureVideoError"));
            }
        }

        private async Task LoadMediaFiles()
        {
            var tempFiles = await _mediaTempFolder.GetFilesAsync();
            var localFiles = await _mediaFolder.GetFilesAsync();

            var tempMedias = tempFiles.Select(file => new MediaItem(FolderType.Temp, ReservationId, file.Name)).ToList();
            var localMedias = localFiles.Select(file => new MediaItem(FolderType.Local, ReservationId, file.Name)).ToList();

            var totalFile = tempMedias.Concat(localMedias).ToList();

            MediaFiles.Clear();
            MediaFiles = totalFile;

            // old implementation?
            //MediaFiles = files.Select(file => string.Format("ms-appdata:///Temp/Media/{0}/{1}", ReservationId, file.Name)).ToList();
        }
  
        private static void ShowFatalErrorMessageDialog(string message, string title)
        {
            var msg = new Windows.UI.Popups.MessageDialog("Fatal Error: " + message, title);
            msg.ShowAsync();
        }

        private async void DownloadMedia(object parameter)
        {
            if (SelectedMediaItem == null)
            {
                var msg = new Windows.UI.Popups.MessageDialog(Accessories.resourceLoader.GetString("SelectMediaFileForUpload"));
                await msg.ShowAsync();
                return;
            }

            if (this.SelectedMediaItem.FolderType == FolderType.Local)
            {
                var msg = new Windows.UI.Popups.MessageDialog(Accessories.resourceLoader.GetString("MediaItemAlreadyOnLocalDrive"));
                await msg.ShowAsync();
                return;
            }

            var file = await _mediaTempFolder.GetFileAsync(this.SelectedMediaItem.Name);
            await file.CopyAsync(_mediaFolder, this.SelectedMediaItem.Name, NameCollisionOption.GenerateUniqueName);

            await LoadMediaFiles();
        }

        private async Task RecoverDownloads()
        {
            activeDownloads = new List<DownloadOperation>();
            try
            {
                IReadOnlyList<DownloadOperation> downloads = await BackgroundDownloader.GetCurrentDownloadsAsync();
                if (downloads.Count > 0)
                {
                    List<Task> tasks = new List<Task>();
                    foreach (DownloadOperation download in downloads)
                    {
                        tasks.Add(HandleDownloadAsync(download, false));
                    }
                    await Task.WhenAll(tasks);
                }
            }
            catch (Exception ex)
            {
            }
        }

        private async Task HandleDownloadAsync(DownloadOperation download, bool start)
        {
            try
            {
                activeDownloads.Add(download);
                Progress<DownloadOperation> progressCallback = new Progress<DownloadOperation>(DownloadProgress);
                if (start)
                {
                    // Start the download and attach a progress handler.
                    await download.StartAsync().AsTask(cts.Token, progressCallback);
                }
                else
                {
                    // The download was already running when the application started, re-attach the progress handler.
                    await download.AttachAsync().AsTask(cts.Token, progressCallback);
                }

                ResponseInformation response = download.GetResponseInformation();
            }
            catch (TaskCanceledException)
            {
            }
            catch (Exception ex)
            {
            }
            finally
            {
                activeDownloads.Remove(download);
            }
        }

        private async void UploadMedia(object parameter)
        {
            if (SelectedMediaItem == null)
            {
                var msg = new Windows.UI.Popups.MessageDialog(Accessories.resourceLoader.GetString("SelectMediaFileForUpload"));
                await msg.ShowAsync();
                return;
            }

            var file = await _mediaTempFolder.GetFileAsync(this.SelectedMediaItem.Name);

            this.Idle = false;
            BackgroundUploader uploader = new BackgroundUploader();
            UploadOperation upload = uploader.CreateUpload(new Uri("ServerUri"), file);

            Progress<UploadOperation> progressCallback = new Progress<UploadOperation>(UploadProgress);
            await upload.StartAsync().AsTask(cts.Token, progressCallback);
            ResponseInformation response = upload.GetResponseInformation();
            this.Idle = true;
        }

        private void CancelBackgroundProcess(object parameter)
        {
            cts.Cancel();
            cts.Dispose();
            cts = new CancellationTokenSource();
            this.Idle = true;
            this.BackgroundProcessPercent = 0;
        }

        private void UploadProgress(UploadOperation upload)
        {
            if (upload.Progress.TotalBytesToReceive > 0)
            {
                this.BackgroundProcessPercent = upload.Progress.BytesSent * 100 / upload.Progress.TotalBytesToSend;
                // this.UploadPercent = upload.Progress.BytesReceived * 100 / upload.Progress.TotalBytesToReceive;
            }
        }

        private void DownloadProgress(DownloadOperation download)
        {
            if (download.Progress.TotalBytesToReceive > 0)
            {
                this.BackgroundProcessPercent = download.Progress.BytesReceived * 100 / download.Progress.TotalBytesToReceive;
            }
        }
    }
}

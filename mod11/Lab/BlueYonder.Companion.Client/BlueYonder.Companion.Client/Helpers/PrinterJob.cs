using BlueYonder.Companion.Client.Common;
using BlueYonder.Companion.Client.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Windows.Graphics.Printing;
using Windows.Graphics.Printing.OptionDetails;
using Windows.UI;
using Windows.UI.Text;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Documents;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Printing;

namespace BlueYonder.Companion.Client.Helpers
{
    //Module 7 - Implementing Advanced Contract Scenarios
    //The student will be able to implement the Print and Settings contracts and the Play To API.

    internal enum DisplayContent : int
    {
        /// <summary>
        /// Show only text
        /// </summary>
        Text = 1,

        /// <summary>
        /// Show only images
        /// </summary>
        Images = 2,

        /// <summary>
        /// Show a combination of images and text
        /// </summary>
        TextAndImages = 3
    }

    /// <summary>
    /// Helpers class that tracks the loading state of a xaml element
    /// Elements which use async load patterns must enlist for observation
    /// </summary>
    public class PageLoadState
    {
        /// <summary>
        /// Event used to detect when all "loadable" elements are ready
        /// </summary>
        private CountdownEvent loadingElements;

        /// <summary>
        /// An action to execute when content is available (eg: SetPreview for the page)
        /// </summary>
        public Action<int, UIElement> ReadyAction { get; set; }

        /// <summary>
        /// Current page number in print/preview list
        /// </summary>
        private int pageNumber;

        /// <summary>
        /// XAML Page(element)
        /// </summary>
        private UIElement page;

        public UIElement Page
        {
            get { return page; }
        }

        public PageLoadState(UIElement page, int pageNumber)
        {
            this.page = page;
            this.pageNumber = pageNumber;
            loadingElements = new CountdownEvent(0);
        }

        /// <summary>
        /// Internal method that is called when an element has finished loading
        /// </summary>        
        private void SetElementComplete()
        {
            loadingElements.Signal();
        }

        /// <summary>
        /// Adds an element in the observation list
        /// </summary>
        /// <param name="bitmap">The bitmap on which to listen for ImageOpened event</param>
        public void ListenForCompletion(BitmapImage bitmap)
        {
            if (loadingElements.CurrentCount == 0)
            {
                // Event is already signaled. Manually set the count to 1 and "arm" the event.
                loadingElements.Reset(1);
            }
            else
            {
                // AddCount will throw if event is already in signaled state.
                loadingElements.AddCount();
            }
            bitmap.ImageOpened += (s, e) => SetElementComplete();
        }

        /// <summary>
        /// Property used to determine if the content is ready
        /// If content is not ready a background task will serve the content once it's ready
        /// </summary>
        public bool Ready
        {
            get
            {
                var ready = loadingElements.CurrentCount == 0;
                if (!ready)
                {
                    // A request was made and the content is not ready, serve it once it's complete
                    Task.Run(async () =>
                    {
                        await IsReadyAsync();
                        ReadyAction(pageNumber, page);
                    });
                }

                return ready;
            }
        }

        /// <summary>
        /// Async method that enables listening for the completion event in a background thread
        /// </summary>
        public async Task IsReadyAsync()
        {
            await Task.Run(() => { loadingElements.Wait(); });
        }
    }

    public enum PrintJobType
    {
        SinglePage,
        MultiPage
    }

    public class PrinterJob : IDisposable
    {
        private const double ApplicationContentMarginLeft = 0.075;
        private const double ApplicationContentMarginTop = 0.03;

        private readonly LayoutAwarePage _rootPage;
        private PrintDocument _printDocument;
        private readonly IPrintDocumentSource _printDocumentSource;
        private readonly List<UIElement> _printPreviewPages;
        private readonly Reservation _reservationForPrinting;
        private readonly PrintJobType _type;

        public PrinterJob(LayoutAwarePage rootPage, PrintJobType type, Reservation reservation)
        {
            _reservationForPrinting = reservation;
            _type = type;

            _rootPage = rootPage;
            _printDocument = new PrintDocument();
            _printDocumentSource = _printDocument.DocumentSource;
            _printDocument.Paginate += CreatePrintPreviewPages;
            _printDocument.GetPreviewPage += GetPrintPreviewPage;
            _printDocument.AddPages += AddPrintPages;

            _printPreviewPages = new List<UIElement>();

            PrintManager printMan = PrintManager.GetForCurrentView();
            printMan.PrintTaskRequested += PrintTaskRequested;
        }

        public void UnregisterForPrinting()
        {
            _printDocument = null;
            PrintManager printMan = PrintManager.GetForCurrentView();
            printMan.PrintTaskRequested -= PrintTaskRequested;
        }

        protected event EventHandler pagesCreated;

        protected virtual void PrintTaskRequested(PrintManager sender, PrintTaskRequestedEventArgs e)
        {
            PrintTask printTask = e.Request.CreatePrintTask("BlueYonder", sourceRequested => sourceRequested.SetSource(_printDocumentSource));
            PrintTaskOptionDetails printDetailedOptions = PrintTaskOptionDetails.GetFromPrintTaskOptions(printTask.Options);

            printDetailedOptions.DisplayedOptions.Clear();
            printDetailedOptions.DisplayedOptions.Add(Windows.Graphics.Printing.StandardPrintTaskOptions.Copies);
            printDetailedOptions.DisplayedOptions.Add(Windows.Graphics.Printing.StandardPrintTaskOptions.Orientation);
            printDetailedOptions.DisplayedOptions.Add(Windows.Graphics.Printing.StandardPrintTaskOptions.ColorMode);

            printDetailedOptions.OptionChanged += printDetailedOptions_OptionChanged;
        }

        async void printDetailedOptions_OptionChanged(PrintTaskOptionDetails sender, PrintTaskOptionChangedEventArgs args)
        {
            // Listen for PageContent changes
            string optionId = args.OptionId as string;
            if (string.IsNullOrEmpty(optionId))
                return;

            await _rootPage.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, _printDocument.InvalidatePreview);
        }

        private Canvas _printingRoot = null;
        public Canvas PrintingRoot
        {
            get
            {
                if (_printingRoot == null)
                    _printingRoot = new Canvas();

                return _printingRoot;
            }
        }

        /// <summary>
        /// This is the event handler for PrintDocument.Paginate. It creates print preview pages for the app.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected virtual void CreatePrintPreviewPages(object sender, PaginateEventArgs e)
        {
            // Clear the cache of preview pages 
            _printPreviewPages.Clear();

            // Clear the printing root of preview pages
            PrintingRoot.Children.Clear();

            // Get the PrintTaskOptions
            PrintTaskOptions printingOptions = ((PrintTaskOptions)e.PrintTaskOptions);

            // Get the page description to deterimine how big the page is
            PrintPageDescription pageDescription = printingOptions.GetPageDescription(0);

            AddPrintPreviewPages(pageDescription);

            if (pagesCreated != null)
                pagesCreated.Invoke(_printPreviewPages, null);

            // Report the number of preview pages created
            _printDocument.SetPreviewPageCount(_printPreviewPages.Count, PreviewPageCountType.Intermediate);
        }

        protected virtual void GetPrintPreviewPage(object sender, GetPreviewPageEventArgs e)
        {
            // give the PrintDocument the requested preview page
            _printDocument.SetPreviewPage(e.PageNumber, _printPreviewPages[e.PageNumber - 1]);
        }

        protected virtual void AddPrintPages(object sender, AddPagesEventArgs e)
        {
            // Loop over all of the preview pages and add each one to  add each page to be printied
            for (int i = 0; i < _printPreviewPages.Count; i++)
            {
                _printDocument.AddPage(_printPreviewPages[i]);
            }

            // Indicate that all of the print pages have been provided
            _printDocument.AddPagesComplete();
        }

        internal int currentPreviewPage;

        private void BuildBasicLayout(PrintPageDescription printPageDescription, out Canvas pageContainer, out Grid contentContainer)
        {
            Canvas page = new Canvas();
            page.Width = printPageDescription.PageSize.Width;
            page.Height = printPageDescription.PageSize.Height;

            PageLoadState pageState = new PageLoadState(page, _printPreviewPages.Count);
            pageState.ReadyAction = async (pageNumber, currentPage) =>
            {
                // Ignore if this is not the current page
                if (Interlocked.CompareExchange(ref currentPreviewPage, currentPreviewPage, pageNumber) == pageNumber)
                {
                    await this._rootPage.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
                    {
                        _printDocument.SetPreviewPage(pageNumber + 1, currentPage);
                    });
                }
            };

            // Create a grid which contains the actual content to be printed
            Grid content = new Grid();

            // Get the margins size
            // If the ImageableRect is smaller than the app provided margins use the ImageableRect
            double marginWidth = Math.Max(printPageDescription.PageSize.Width - printPageDescription.ImageableRect.Width,
                                        printPageDescription.PageSize.Width * ApplicationContentMarginLeft * 2);

            double marginHeight = Math.Max(printPageDescription.PageSize.Height - printPageDescription.ImageableRect.Height,
                                         printPageDescription.PageSize.Height * ApplicationContentMarginTop * 2);

            // Set content size based on the given margins
            content.Width = printPageDescription.PageSize.Width - marginWidth;
            content.Height = printPageDescription.PageSize.Height - marginHeight;

            // Set content margins
            content.SetValue(Canvas.LeftProperty, marginWidth / 2);
            content.SetValue(Canvas.TopProperty, marginHeight / 2);

            // Add the RowDefinitions to the Grid which is a content to be printed
            RowDefinition rowDef = new RowDefinition();
            rowDef.Height = new GridLength(0.7, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(0.8, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(2.5, GridUnitType.Auto);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(3.5, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(1.5, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(0.5, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(0.5, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);
            rowDef = new RowDefinition();
            rowDef.Height = new GridLength(0.5, GridUnitType.Star);
            content.RowDefinitions.Add(rowDef);

            // Add the ColumnDefinitions to the Grid which is a content to be printed
            ColumnDefinition colDef = new ColumnDefinition();
            colDef.Width = new GridLength(100, GridUnitType.Star);
            content.ColumnDefinitions.Add(colDef);


            // Create the "Windows 8 SDK Sample" header which consists of an image and text in a stack panel
            // and add it to the content grid
            Image BlueYonderLogo = new Image();
            BlueYonderLogo.Source = new BitmapImage(new Uri("ms-appx:///Assets/BlueYonderGraphics/BlueYonderNotificationsLogo.png"));

            TextBlock headerText = new TextBlock();
            headerText.TextWrapping = TextWrapping.Wrap;
            headerText.Text = Accessories.resourceLoader.GetString("Blue Yonder Companion");
            headerText.FontSize = 20;
            headerText.Foreground = new SolidColorBrush(Colors.Black);

            StackPanel sp = new StackPanel();
            sp.Orientation = Orientation.Horizontal;
            sp.Children.Add(BlueYonderLogo);
            sp.Children.Add(headerText);


            StackPanel outerPanel = new StackPanel();
            outerPanel.Orientation = Orientation.Vertical;
            outerPanel.VerticalAlignment = Windows.UI.Xaml.VerticalAlignment.Top;
            outerPanel.Children.Add(sp);
            outerPanel.SetValue(Grid.RowProperty, 1);

            TextBlock ReservationTitle = new TextBlock();
            ReservationTitle.TextWrapping = TextWrapping.Wrap;
            ReservationTitle.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintReservationTitle"), _reservationForPrinting.ReservationId);
            ReservationTitle.FontSize = 22;
            ReservationTitle.FontWeight = FontWeights.Bold;
            ReservationTitle.Foreground = new SolidColorBrush(Colors.Black);
            outerPanel.Children.Add(ReservationTitle);

            content.Children.Add(outerPanel);

            // Create BlueYonder image used to end each page and add it to the content grid
            Image blueYonderLogo = new Image();
            blueYonderLogo.Source = new BitmapImage(new Uri("ms-appx:///Assets/BlueYonderGraphics/BlueYonderSmallLogo30X30.png"));
            blueYonderLogo.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            blueYonderLogo.SetValue(Grid.RowProperty, 6);
            content.Children.Add(blueYonderLogo);


            // Add the copywrite notice and add it to the content grid
            TextBlock copyrightNotice = new TextBlock();
            copyrightNotice.Text = Accessories.resourceLoader.GetString("PrintCopyrightNotice");
            copyrightNotice.FontSize = 16;
            copyrightNotice.TextWrapping = TextWrapping.Wrap;
            copyrightNotice.Foreground = new SolidColorBrush(Colors.Black);
            copyrightNotice.SetValue(Grid.RowProperty, 7);
            copyrightNotice.SetValue(Grid.ColumnSpanProperty, 2);
            content.Children.Add(copyrightNotice);

            pageContainer = page;
            contentContainer = content;
        }

        protected virtual void AddPrintPreviewPages(PrintPageDescription printPageDescription)
        {
            Canvas page;
            Grid content;
            BuildBasicLayout(printPageDescription, out page, out content);

            RichTextBlockOverflow rtbo = new RichTextBlockOverflow();

            RichTextBlock rtbl = new RichTextBlock();
            rtbl.SetValue(Grid.RowProperty, 2);
            rtbl = CreateReservationBoardingPass(rtbl);
            int a = rtbl.Blocks.Count();
            rtbl.Foreground = new SolidColorBrush(Colors.Black);
            content.Children.Add(rtbl);

            page.Children.Add(content);
            _printPreviewPages.Add(page);

            if (this._type == PrintJobType.MultiPage)
            {
                BuildBasicLayout(printPageDescription, out page, out content);

                rtbl = new RichTextBlock();
                rtbl.SetValue(Grid.RowProperty, 2);
                rtbl = CreateReservationInvoice(rtbl);
                rtbl.Foreground = new SolidColorBrush(Colors.Black);
                content.Children.Add(rtbl);

                page.Children.Add(content);
                _printPreviewPages.Add(page);
            }

            // Add the newley created page to the printing root which is part of the visual tree and force it to go
            // through layout so that the linked containers correctly distribute the content inside them.
            PrintingRoot.InvalidateMeasure();
            PrintingRoot.UpdateLayout();
        }

        /// <summary>
        /// This function adds content to the blocks collection of the RichTextBlock passed into the function.      
        /// </summary>
        /// <param name="rtbl">last rich text block</param>
        protected virtual RichTextBlock CreateReservationBoardingPass(RichTextBlock rtbl)
        {
            // Create a Run and give it content
            Run run = new Run();
            run.Text = string.Format("{0} {1} {2}", this._reservationForPrinting.DepartureFlight.FlightInfo.Flight.Source.Country, 
                Accessories.resourceLoader.GetString("To"),
                this._reservationForPrinting.DepartureFlight.FlightInfo.Flight.Destination.Country);

            // Create a paragraph, set it's font size, add the run to the paragraph's inline collection
            Paragraph para = new Paragraph();
            para.FontSize = 32;
            para.Inlines.Add(run);
            // Add the paragraph to the blocks collection of the RichTextBlock
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1} {2}", this._reservationForPrinting.DepartureFlight.FlightInfo.Flight.Source.City, 
                Accessories.resourceLoader.GetString("To"),
                this._reservationForPrinting.DepartureFlight.FlightInfo.Flight.Destination.City);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}", Accessories.resourceLoader.GetString("PrintFlightId"), this._reservationForPrinting.DepartureFlight.FlightInfo.Flight.FlightId);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintConfirmationNumber"), this._reservationForPrinting.ConfirmationCode);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintClass"), this._reservationForPrinting.DepartureFlight.Class);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintReservationDate"), this._reservationForPrinting.ReservationDate);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintReservationId"), this._reservationForPrinting.ReservationId);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            run = new Run();
            run.Text = string.Format("{0} {1}",Accessories.resourceLoader.GetString("PrintStatus"), this._reservationForPrinting.DepartureFlight.Status);
            para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);

            if (this._reservationForPrinting.ReturnFlight != null)
            {
                run = new Run();
                run.Text = Accessories.resourceLoader.GetString("PrintReturnFlight");
                para = new Paragraph();
                para.FontSize = 32;
                para.Inlines.Add(run);
                rtbl.Blocks.Add(para);

                run = new Run();
                run.Text = string.Format("{0} {1} {2}",
                    this._reservationForPrinting.ReturnFlight.FlightInfo.Flight.Source.City,
                    Accessories.resourceLoader.GetString("To"),
                    this._reservationForPrinting.ReturnFlight.FlightInfo.Flight.Destination.City);

                para = new Paragraph();
                para.FontSize = 16;
                para.Inlines.Add(run);
                rtbl.Blocks.Add(para);

                run = new Run();
                run.Text = string.Format("{0} {1}", Accessories.resourceLoader.GetString("Departure"), this._reservationForPrinting.ReturnFlight.FlightInfo.Departure);
                para = new Paragraph();
                para.FontSize = 16;
                para.Inlines.Add(run);
                rtbl.Blocks.Add(para);

                run = new Run();
                run.Text = string.Format("{1} {0}", Accessories.resourceLoader.GetString("PrintFlightId"), this._reservationForPrinting.ReturnFlight.FlightInfo.Flight.FlightId);
                para = new Paragraph();
                para.FontSize = 16;
                para.Inlines.Add(run);
                rtbl.Blocks.Add(para);
            }

            return rtbl;
        }

        protected virtual RichTextBlock CreateReservationInvoice(RichTextBlock rtbl)
        {
            Run run = new Run();
            run.Text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat mollis urna non egestas. Vivamus sollicitudin lorem in odio egestas eget rhoncus mauris blandit. Duis eget nibh vel odio bibendum malesuada. Mauris non quam ipsum, et hendrerit massa. In eget nisi et lorem dapibus dapibus. Etiam mollis mauris sed est pellentesque ornare. Vestibulum quis varius mauris. Aenean lorem nunc, rhoncus at commodo eget, egestas nec lorem. Morbi eu venenatis mi. Curabitur dapibus rhoncus risus, sit amet volutpat risus luctus eu. In eu turpis justo, sed pulvinar neque. Donec dapibus leo ut neque eleifend vitae condimentum arcu vulputate. Suspendisse non tellus enim. Pellentesque id urna eros. Praesent fringilla iaculis dolor dapibus vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi sollicitudin viverra tortor, eget dictum sapien tempus vel. Vestibulum sagittis quam id magna auctor egestas. Integer sed massa nibh, id dictum risus. Nullam sed congue turpis. In aliquet iaculis ipsum, sed pulvinar massa euismod sit amet. Etiam ullamcorper, elit a pharetra placerat, odio magna suscipit nulla, vel facilisis massa massa ac turpis. Curabitur tincidunt magna at enim volutpat tempus. Phasellus nisl enim, commodo eu consequat eget, tempus vitae dui. Cras semper pharetra turpis, non placerat neque vulputate sed. Vivamus molestie sem tellus, eu vulputate ipsum. Morbi sit amet libero ut ante blandit euismod vel non est. Duis interdum erat non nibh ornare commodo luctus tortor ultricies. Phasellus adipiscing diam sit amet lacus sagittis porttitor. Duis ultrices erat vitae erat porta porta.";
            Paragraph para = new Paragraph();
            para.FontSize = 16;
            para.Inlines.Add(run);
            rtbl.Blocks.Add(para);
            return rtbl;
        }

        public void Dispose()
        {
            PrintManager printMan = PrintManager.GetForCurrentView();
            printMan.PrintTaskRequested -= PrintTaskRequested;
        }
    }
}

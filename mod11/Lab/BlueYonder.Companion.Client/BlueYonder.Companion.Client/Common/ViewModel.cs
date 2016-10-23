using Windows.UI.Xaml.Controls;

namespace BlueYonder.Companion.Client.Common
{
    public class ViewModel : BindableBase
    {
        protected Frame Frame { get; private set; }

        public virtual void Initialize(Frame frame)
        {
            this.Frame = frame;
        }

        public virtual void Uninitialize()
        {
        }
    }
}
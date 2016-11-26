Notes:
-Demo uses ACS for SB, but MS replaced ACS with SAS by default: https://blogs.msdn.microsoft.com/cie/2014/08/29/service-bus-namespace-creation-on-portal-no-longer-has-acs-connection-string/
-Creating an SB namespace with ACS using Azure PowerShell:
Add-AzureAccount
Select-AzureSubscription "Evaluación gratuita"
New-AzureSBNamespace -Name ServiceBusDemo07JEB -Location "Central US" -CreateACSNamespace $true -NamespaceType Messaging

Output:
Name                  : ServiceBusDemo07JEB
Region                : Central US
DefaultKey            : NY+cdKW0sc0OpI7A3Ny1A66oodPUmqRQH3r69pRzT/I=
Status                : Active
CreatedAt             : 26/11/2016 03:14:54 p.m.
AcsManagementEndpoint : https://servicebusdemo07jeb-sb.accesscontrol.windows.net/
ServiceBusEndpoint    : https://servicebusdemo07jeb.servicebus.windows.net/
ConnectionString      : Endpoint=sb://servicebusdemo07jeb.servicebus.windows.net/;SharedSecretIssuer=owner;SharedSecretValue=NY+cdKW0sc0OpI7A3Ny1A66oodPUmqRQH3r69pRzT/I=
NamespaceType         : Messaging

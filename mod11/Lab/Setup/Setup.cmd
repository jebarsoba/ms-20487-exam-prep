@Echo off

cls

REM %~d0
REM cd %~dp0

powershell -NonInteractive -Command "Set-ExecutionPolicy unrestricted"

@Echo Configuring machine's certificates
"..\..\..\tools\certmgr.exe" -del -c -n "Client" -s -r LocalMachine My > NUL
"..\..\..\tools\certmgr.exe" -del -c -n "Server" -s -r LocalMachine My > NUL
"..\..\..\tools\certmgr.exe" -del -c -n "Server" -s -r LocalMachine TrustedPeople > NUL
"..\..\..\tools\certmgr.exe" -del -c -n "Blue Yonder Airlines Root CA" -s -r LocalMachine My > NUL
"..\..\..\tools\certmgr.exe" -del -c -n "Blue Yonder Airlines Root CA" -s -r LocalMachine Root > NUL

certutil -f -p 1 -importpfx ..\..\..\certs\BlueYonderAirlinesRootCA.pfx > NUL
certutil -f -p 1 -importpfx ..\..\..\certs\client.pfx > NUL
certutil -f -p 1 -importpfx ..\..\..\certs\server.pfx > NUL
certutil -f -p 1 -importpfx ..\..\..\certs\cloudapp.pfx > NUL
certutil -f -p 1 -importpfx ..\..\..\certs\emulator.pfx > NUL
certutil -f -addstore trustedPeople ..\..\..\certs\server.cer > NUL

Powershell ..\..\..\tools\scripts\GrantCertsPermissions.ps1
Powershell ..\..\..\tools\scripts\VerifyIIS_SSL.ps1

@Echo Checking for missing Windows Azure components
Powershell .\BuildWindowsAzureComponents.ps1

Rem Configuring IIS
Call ..\..\..\tools\scripts\SetupIIS.cmd Mod11 > NUL
Call ..\..\..\tools\scripts\SetupIISForSB.cmd Mod11 > NUL

pause
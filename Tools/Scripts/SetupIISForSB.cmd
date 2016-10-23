@Echo off

"%systemroot%\system32\inetsrv\appcmd.exe" set apppool DefaultAppPool /startMode:AlwaysRunning
"%systemroot%\system32\inetsrv\appcmd.exe" set app "Default Web Site/BlueYonder.Server.Booking.WebHost" /preloadEnabled:true
"%systemroot%\system32\inetsrv\AppCmd.exe" recycle apppool DefaultAppPool
//CdnPath=http://ajax.aspnetcdn.com/ajax/4.5/6/SmartNav.js
var snSrc;
if ((typeof(window.__smartNav) == "undefined") || (window.__smartNav == null))
{
    window.__smartNav = new Object();
    window.__smartNav.update = function()
    {
        var sn = window.__smartNav;
        var fd;
        document.detachEvent("onstop", sn.stopHif);
        sn.inPost = false;
        try { fd = frames["__hifSmartNav"].document; } catch (e) {return;}
        var fdr = fd.getElementsByTagName("asp_smartnav_rdir");
        if (fdr.length > 0)
        {
            if ((typeof(sn.sHif) == "undefined") || (sn.sHif == null))
            {
                sn.sHif = document.createElement("IFRAME");
                sn.sHif.name = "__hifSmartNav";
                sn.sHif.style.display = "none";
                sn.sHif.src = snSrc;
            }
            try {window.location = fdr[0].url;} catch (e) {};
            return;
        }
        var fdurl = fd.location.href;
        var index = fdurl.indexOf(snSrc);
        if ((index != -1 && index == fdurl.length-snSrc.length)
            || fdurl == "about:blank")
            return;
		var fdurlb = fdurl.split("?")[0];
		if (document.location.href.indexOf(fdurlb) < 0)
		{
            document.location.href=fdurl;
		    return;
		}
		sn._savedOnLoad = window.onload;
		window.onload = null;
		window.__smartNav.updateHelper();
	}
	window.__smartNav.updateHelper = function()
	{
		if (document.readyState != "complete")
		{
		    window.setTimeout(window.__smartNav.updateHelper, 25);
		    return;
		}
		window.__smartNav.loadNewContent();
	}
	window.__smartNav.loadNewContent = function()
	{
		var sn = window.__smartNav;
		var fd;
		try { fd = frames["__hifSmartNav"].document; } catch (e) {return;}
        if ((typeof(sn.sHif) != "undefined") && (sn.sHif != null))
        {
            sn.sHif.removeNode(true);
            sn.sHif = null;
        }
        var hdm = document.getElementsByTagName("head")[0];
        var hk = hdm.childNodes;
        var tt = null;
        var i;
        for (i = hk.length - 1; i>= 0; i--)
        {
            if (hk[i].tagName == "TITLE")
            {
                tt = hk[i].outerHTML;
                continue;
            }
            if (hk[i].tagName != "BASEFONT" || hk[i].innerHTML.length == 0)
                hdm.removeChild(hdm.childNodes[i]);
        }
        var kids = fd.getElementsByTagName("head")[0].childNodes;
        for (i = 0; i < kids.length; i++)
        {
            var tn = kids[i].tagName;
            var k = document.createElement(tn);
            k.id = kids[i].id;
            k.mergeAttributes(kids[i]);
            switch(tn)
            {
            case "TITLE":
                if (tt == kids[i].outerHTML)
                    continue;
                k.innerText = kids[i].text;
                hdm.insertAdjacentElement("afterbegin", k);
                continue;
            case "BASEFONT" :
                if (kids[i].innerHTML.length > 0)
                    continue;
                break;
            default:
                var o = document.createElement("BODY");
                o.innerHTML = "<BODY>" + kids[i].outerHTML + "</BODY>";
                k = o.firstChild;
                break;
            }
            if((typeof(k) != "undefined") && (k != null))
                hdm.appendChild(k);
        }
        document.body.clearAttributes();
        document.body.id = fd.body.id;
        document.body.mergeAttributes(fd.body);
        var newBodyLoad = fd.body.onload;
        if ((typeof(newBodyLoad) != "undefined") && (newBodyLoad != null))
            document.body.onload = newBodyLoad;
        else
            document.body.onload = sn._savedOnLoad;
        var s = "<BODY>" + fd.body.innerHTML + "</BODY>";
        if ((typeof(sn.hif) != "undefined") && (sn.hif != null))
        {
            var hifP = sn.hif.parentElement;
            if ((typeof(hifP) != "undefined") && (hifP != null))
                sn.sHif=hifP.removeChild(sn.hif);
        }
        document.body.innerHTML = s;
        var sc = document.scripts;
        for (i = 0; i < sc.length; i++)
        {
            sc[i].text = sc[i].text;
        }
        sn.hif = document.all("__hifSmartNav");
        if ((typeof(sn.hif) != "undefined") && (sn.hif != null))
        {
            var hif = sn.hif;
            sn.hifName = "__hifSmartNav" + (new Date()).getTime();
            frames["__hifSmartNav"].name = sn.hifName;
            sn.hifDoc = hif.contentWindow.document;
            if (sn.ie5)
                hif.parentElement.removeChild(hif);
            window.setTimeout(sn.restoreFocus,0);
        }
        if (typeof(window.onload) == "string")
        {
            try { eval(window.onload) } catch (e) {};
        }
        else if ((typeof(window.onload) != "undefined") && (window.onload != null))
        {
            try { window.onload() } catch (e) {};
        }
        sn._savedOnLoad = null;
        sn.attachForm();
    };
    window.__smartNav.restoreFocus = function()
    {
        if (window.__smartNav.inPost == true) return;
        var curAe = document.activeElement;
        var sAeId = window.__smartNav.ae;
        if (((typeof(sAeId) == "undefined") || (sAeId == null)) ||
            (typeof(curAe) != "undefined") && (curAe != null) && (curAe.id == sAeId || curAe.name == sAeId))
            return;
        var ae = document.all(sAeId);
        if ((typeof(ae) == "undefined") || (ae == null)) return;
        try { ae.focus(); } catch(e){};
    }
    window.__smartNav.saveHistory = function()
    {
        if ((typeof(window.__smartNav.hif) != "undefined") && (window.__smartNav.hif != null))
            window.__smartNav.hif.removeNode();
        if ((typeof(window.__smartNav.sHif) != "undefined") && (window.__smartNav.sHif != null)
            && (typeof(document.all[window.__smartNav.siHif]) != "undefined")
            && (document.all[window.__smartNav.siHif] != null)) {
            document.all[window.__smartNav.siHif].insertAdjacentElement(
                        "BeforeBegin", window.__smartNav.sHif);
        }
    }
    window.__smartNav.stopHif = function()
    {
        document.detachEvent("onstop", window.__smartNav.stopHif);
        var sn = window.__smartNav;
        if (((typeof(sn.hifDoc) == "undefined") || (sn.hifDoc == null)) &&
            (typeof(sn.hif) != "undefined") && (sn.hif != null))
        {
            try {sn.hifDoc = sn.hif.contentWindow.document;}
            catch(e){sn.hifDoc=null}
        }
        if (sn.hifDoc != null)
        {
            try {sn.hifDoc.execCommand("stop");} catch (e){}
        }
    }
    window.__smartNav.init =  function()
    {
        var sn = window.__smartNav;
        window.__smartNav.form.__smartNavPostBack.value = 'true';
        document.detachEvent("onstop", sn.stopHif);
        document.attachEvent("onstop", sn.stopHif);
        try { if (window.event.returnValue == false) return; } catch(e) {}
        sn.inPost = true;
        if ((typeof(document.activeElement) != "undefined") && (document.activeElement != null))
        {
            var ae = document.activeElement.id;
            if (ae.length == 0)
                ae = document.activeElement.name;
            sn.ae = ae;
        }
        else
            sn.ae = null;
        try {document.selection.empty();} catch (e) {}
        if ((typeof(sn.hif) == "undefined") || (sn.hif == null))
        {
            sn.hif = document.all("__hifSmartNav");
            sn.hifDoc = sn.hif.contentWindow.document;
        }
        if ((typeof(sn.hifDoc) != "undefined") && (sn.hifDoc != null))
            try {sn.hifDoc.designMode = "On";} catch(e){};
        if ((typeof(sn.hif.parentElement) == "undefined") || (sn.hif.parentElement == null))
            document.body.appendChild(sn.hif);
        var hif = sn.hif;
        hif.detachEvent("onload", sn.update);
        hif.attachEvent("onload", sn.update);
        window.__smartNav.fInit = true;
    };
    window.__smartNav.submit = function()
    {
        window.__smartNav.fInit = false;
        try { window.__smartNav.init(); } catch(e) {}
        if (window.__smartNav.fInit) {
            window.__smartNav.form._submit();
        }
    };
    window.__smartNav.attachForm = function()
    {
        var cf = document.forms;
        for (var i=0; i<cf.length; i++)
        {
            if ((typeof(cf[i].__smartNavEnabled) != "undefined") && (cf[i].__smartNavEnabled != null))
            {
                window.__smartNav.form = cf[i];
                window.__smartNav.form.insertAdjacentHTML("beforeEnd", "<input type='hidden' name='__smartNavPostBack' value='false' />");
                break;
            }
        }
        var snfm = window.__smartNav.form;
        if ((typeof(snfm) == "undefined") || (snfm == null)) return false;
        var sft = snfm.target;
        if (sft.length != 0 && sft.indexOf("__hifSmartNav") != 0) return false;
        var sfc = snfm.action.split("?")[0];
        var url = window.location.href.split("?")[0];
        if (url.charAt(url.length-1) != '/' && url.lastIndexOf(sfc) + sfc.length != url.length) return false;
        if (snfm.__formAttached == true) return true;
        snfm.__formAttached = true;
        snfm.attachEvent("onsubmit", window.__smartNav.init);
        snfm._submit = snfm.submit;
        snfm.submit = window.__smartNav.submit;
        snfm.target = window.__smartNav.hifName;
        return true;
    };
    window.__smartNav.hifName = "__hifSmartNav" + (new Date()).getTime();
    window.__smartNav.ie5 = navigator.appVersion.indexOf("MSIE 5") > 0;
    var rc = window.__smartNav.attachForm();
    var hif = document.all("__hifSmartNav");
    if ((typeof(snSrc) == "undefined") || (snSrc == null)) {
	    if (typeof(window.dialogHeight) != "undefined") {
	            snSrc = "IEsmartnav1";
		    hif.src = snSrc;
	    } else {
		    snSrc = hif.src;
	    }
    }
    if (rc)
    {
        var fsn = frames["__hifSmartNav"];
        fsn.name = window.__smartNav.hifName;
        window.__smartNav.siHif = hif.sourceIndex;
        try {
            if (fsn.document.location != snSrc)
            {
                fsn.document.designMode = "On";
                hif.attachEvent("onload",window.__smartNav.update);
                window.__smartNav.hif = hif;
            }
        }
        catch (e) { window.__smartNav.hif = hif; }
        window.attachEvent("onbeforeunload", window.__smartNav.saveHistory);
    }
    else
        window.__smartNav = null;
}

// SIG // Begin signature block
// SIG // MIIaVgYJKoZIhvcNAQcCoIIaRzCCGkMCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFIH7YgU3B1bV
// SIG // nC80acvmoys+BEEroIIVJjCCBJkwggOBoAMCAQICEzMA
// SIG // AACdHo0nrrjz2DgAAQAAAJ0wDQYJKoZIhvcNAQEFBQAw
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwHhcNMTIwOTA0
// SIG // MjE0MjA5WhcNMTMwMzA0MjE0MjA5WjCBgzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjENMAsGA1UECxMETU9QUjEeMBwGA1UE
// SIG // AxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqRJbBD7Ipxl
// SIG // ohaYO8thYvp0Ka2NBhnScVgZil5XDWlibjagTv0ieeAd
// SIG // xxphjvr8oxElFsjAWCwxioiuMh6I238+dFf3haQ2U8pB
// SIG // 72m4aZ5tVutu5LImTXPRZHG0H9ZhhIgAIe9oWINbSY+0
// SIG // 39M11svZMJ9T/HprmoQrtyFndNT2eLZhh5iUfCrPZ+kZ
// SIG // vtm6Y+08Tj59Auvzf6/PD7eBfvT76PeRSLuPPYzIB5Mc
// SIG // 87115PxjICmfOfNBVDgeVGRAtISqN67zAIziDfqhsg8i
// SIG // taeprtYXuTDwAiMgEPprWQ/grZ+eYIGTA0wNm2IZs7uW
// SIG // vJFapniGdptszUzsErU4RwIDAQABo4IBDTCCAQkwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwMwHQYDVR0OBBYEFN5R3Bvy
// SIG // HkoFPxIcwbzDs2UskQWYMB8GA1UdIwQYMBaAFMsR6MrS
// SIG // tBZYAck3LjMWFrlMmgofMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljQ29kU2lnUENBXzA4LTMxLTIwMTAuY3J0MA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQAqpPfuwMMmeoNiGnicW8X9
// SIG // 7BXEp3gT0RdTKAsMAEI/OA+J3GQZhDV/SLnP63qJoc1P
// SIG // qeC77UcQ/hfah4kQ0UwVoPAR/9qWz2TPgf0zp8N4k+R8
// SIG // 1W2HcdYcYeLMTmS3cz/5eyc09lI/R0PADoFwU8GWAaJL
// SIG // u78qA3d7bvvQRooXKDGlBeMWirjxSmkVXTP533+UPEdF
// SIG // Ha7Ki8f3iB7q/pEMn08HCe0mkm6zlBkB+F+B567aiY9/
// SIG // Wl6EX7W+fEblR6/+WCuRf4fcRh9RlczDYqG1x1/ryWlc
// SIG // cZGpjVYgLDpOk/2bBo+tivhofju6eUKTOUn10F7scI1C
// SIG // dcWCVZAbtVVhMIIEujCCA6KgAwIBAgIKYQKOQgAAAAAA
// SIG // HzANBgkqhkiG9w0BAQUFADB3MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EwHhcNMTIwMTA5MjIyNTU4WhcNMTMwNDA5MjIy
// SIG // NTU4WjCBszELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjENMAsGA1UE
// SIG // CxMETU9QUjEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNO
// SIG // OkY1MjgtMzc3Ny04QTc2MSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluyOR01UwlyVgNdO
// SIG // Cz2/l0PDS+NgZxEvAU0M2NFGLxBA3gukUFISiAtDei0/
// SIG // 7khuZseR5gPKbux5qWojm81ins1qpD/no0P/YkehtLpE
// SIG // +t9AwYVUfuigpyxDI5tSHzI19P6aVp+NY3d7MJ4KM4Vy
// SIG // G8pKyMwlzdtdES7HsIzxj0NIRwW1eiAL5fPvwbr0s9jN
// SIG // OI/7Iao9Cm2FF9DK54YDwDODtSXEzFqcxMPaYiVNUyUU
// SIG // YY/7G+Ds90fGgEXmNVMjNnfKsN2YKznAdTUP3YFMIT12
// SIG // MMWysGVzKUgn2MLSsIRHu3i61XQD3tdLGfdT3njahvdh
// SIG // iCYztEfGoFSIFSssdQIDAQABo4IBCTCCAQUwHQYDVR0O
// SIG // BBYEFC/oRsho025PsiDQ3olO8UfuSMHyMB8GA1UdIwQY
// SIG // MBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMPMFQGA1UdHwRN
// SIG // MEswSaBHoEWGQ2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL01pY3Jvc29mdFRpbWVT
// SIG // dGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEETDBKMEgGCCsG
// SIG // AQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY3Jvc29mdFRpbWVTdGFtcFBDQS5j
// SIG // cnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcN
// SIG // AQEFBQADggEBAHP/fS6dzY2IK3x9414VceloYvAItkNW
// SIG // xFxKLWjY+UgRkfMRnIXsEtRUoHWpOKFZf3XuxvU02FSk
// SIG // 4tDMfJerk3UwlwcdBFMsNn9/8UAeDJuA4hIKIDoxwAd1
// SIG // Z+D6NJzsiPtXHOVYYiCQRS9dRanIjrN8cm0QJ8VL2G+i
// SIG // qBKzbTUjZ/os2yUtuV2xHgXnQyg+nAV2d/El3gVHGW3e
// SIG // SYWh2kpLCEYhNah1Nky3swiq37cr2b4qav3fNRfMPwzH
// SIG // 3QbPTpQkYyALLiSuX0NEEnpc3TfbpEWzkToSV33jR8Zm
// SIG // 08+cRlb0TAex4Ayq1fbVPKLgtdT4HH4EVRBrGPSRzVGn
// SIG // lWUwggW8MIIDpKADAgECAgphMyYaAAAAAAAxMA0GCSqG
// SIG // SIb3DQEBBQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20x
// SIG // GTAXBgoJkiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNV
// SIG // BAMTJE1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1
// SIG // dGhvcml0eTAeFw0xMDA4MzEyMjE5MzJaFw0yMDA4MzEy
// SIG // MjI5MzJaMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnJZ
// SIG // XBkwZL8dmmAgIEKZdlNsPhvWb8zL8epr/pcWEODfOnSD
// SIG // GrcvoDLs/97CQk4j1XIA2zVXConKriBJ9PBorE1LjaW9
// SIG // eUtxm0cH2v0l3511iM+qc0R/14Hb873yNqTJXEXcr609
// SIG // 4CholxqnpXJzVvEXlOT9NZRyoNZ2Xx53RYOFOBbQc1sF
// SIG // umdSjaWyaS/aGQv+knQp4nYvVN0UMFn40o1i/cvJX0Yx
// SIG // ULknE+RAMM9yKRAoIsc3Tj2gMj2QzaE4BoVcTlaCKCoF
// SIG // MrdL109j59ItYvFFPeesCAD2RqGe0VuMJlPoeqpK8kbP
// SIG // Nzw4nrR3XKUXno3LEY9WPMGsCV8D0wIDAQABo4IBXjCC
// SIG // AVowDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUyxHo
// SIG // ytK0FlgByTcuMxYWuUyaCh8wCwYDVR0PBAQDAgGGMBIG
// SIG // CSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYE
// SIG // FP3RMU7TJoqV4ZhgO6gxb6Y8vNgtMBkGCSsGAQQBgjcU
// SIG // AgQMHgoAUwB1AGIAQwBBMB8GA1UdIwQYMBaAFA6sgmBA
// SIG // VieX5SUT/CrhClOVWeSkMFAGA1UdHwRJMEcwRaBDoEGG
// SIG // P2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBU
// SIG // BggrBgEFBQcBAQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWlj
// SIG // cm9zb2Z0Um9vdENlcnQuY3J0MA0GCSqGSIb3DQEBBQUA
// SIG // A4ICAQBZOT5/Jkav629AsTK1ausOL26oSffrX3XtTDst
// SIG // 10OtC/7L6S0xoyPMfFCYgCFdrD0vTLqiqFac43C7uLT4
// SIG // ebVJcvc+6kF/yuEMF2nLpZwgLfoLUMRWzS3jStK8cOeo
// SIG // DaIDpVbguIpLV/KVQpzx8+/u44YfNDy4VprwUyOFKqSC
// SIG // HJPilAcd8uJO+IyhyugTpZFOyBvSj3KVKnFtmxr4HPBT
// SIG // 1mfMIv9cHc2ijL0nsnljVkSiUc356aNYVt2bAkVEL1/0
// SIG // 2q7UgjJu/KSVE+Traeepoiy+yCsQDmWOmdv1ovoSJgll
// SIG // OJTxeh9Ku9HhVujQeJYYXMk1Fl/dkx1Jji2+rTREHO4Q
// SIG // FRoAXd01WyHOmMcJ7oUOjE9tDhNOPXwpSJxy0fNsysHs
// SIG // cKNXkld9lI2gG0gDWvfPo2cKdKU27S0vF8jmcjcS9G+x
// SIG // PGeC+VKyjTMWZR4Oit0Q3mT0b85G1NMX6XnEBLTT+yzf
// SIG // H4qerAr7EydAreT54al/RrsHYEdlYEBOsELsTu2zdnnY
// SIG // CjQJbRyAMR/iDlTd5aH75UcQrWSY/1AWLny/BSF64pVB
// SIG // J2nDk4+VyY3YmyGuDVyc8KKuhmiDDGotu3ZrAB2WrfIW
// SIG // e/YWgyS5iM9qqEcxL5rc43E91wB+YkfRzojJuBj6DnKN
// SIG // waM9rwJAav9pm5biEKgQtDdQCNbDPTCCBgcwggPvoAMC
// SIG // AQICCmEWaDQAAAAAABwwDQYJKoZIhvcNAQEFBQAwXzET
// SIG // MBEGCgmSJomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixk
// SIG // ARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0
// SIG // IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTA3
// SIG // MDQwMzEyNTMwOVoXDTIxMDQwMzEzMDMwOVowdzELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEAn6Fssd/bSJIqfGsuGeG94uPF
// SIG // mVEjUK3O3RhOJA/u0afRTK10MCAR6wfVVJUVSZQbQpKu
// SIG // mFwwJtoAa+h7veyJBw/3DgSY8InMH8szJIed8vRnHCz8
// SIG // e+eIHernTqOhwSNTyo36Rc8J0F6v0LBCBKL5pmyTZ9co
// SIG // 3EZTsIbQ5ShGLieshk9VUgzkAyz7apCQMG6H81kwnfp+
// SIG // 1pez6CGXfvjSE/MIt1NtUrRFkJ9IAEpHZhEnKWaol+TT
// SIG // BoFKovmEpxFHFAmCn4TtVXj+AZodUAiFABAwRu233iNG
// SIG // u8QtVJ+vHnhBMXfMm987g5OhYQK1HQ2x/PebsgHOIktU
// SIG // //kFw8IgCwIDAQABo4IBqzCCAacwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAdBgNVHQ4EFgQUIzT42VJGcArtQPt2+7MrsMM1
// SIG // sw8wCwYDVR0PBAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEA
// SIG // MIGYBgNVHSMEgZAwgY2AFA6sgmBAVieX5SUT/CrhClOV
// SIG // WeSkoWOkYTBfMRMwEQYKCZImiZPyLGQBGRYDY29tMRkw
// SIG // FwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0wKwYDVQQD
// SIG // EyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
// SIG // b3JpdHmCEHmtFqFKoKWtTHNY9AcTLmUwUAYDVR0fBEkw
// SIG // RzBFoEOgQYY/aHR0cDovL2NybC5taWNyb3NvZnQuY29t
// SIG // L3BraS9jcmwvcHJvZHVjdHMvbWljcm9zb2Z0cm9vdGNl
// SIG // cnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBEBggrBgEFBQcw
// SIG // AoY4aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
// SIG // ZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5jcnQwEwYDVR0l
// SIG // BAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEFBQADggIB
// SIG // ABCXisNcA0Q23em0rXfbznlRTQGxLnRxW20ME6vOvnuP
// SIG // uC7UEqKMbWK4VwLLTiATUJndekDiV7uvWJoc4R0Bhqy7
// SIG // ePKL0Ow7Ae7ivo8KBciNSOLwUxXdT6uS5OeNatWAweaU
// SIG // 8gYvhQPpkSokInD79vzkeJkuDfcH4nC8GE6djmsKcpW4
// SIG // oTmcZy3FUQ7qYlw/FpiLID/iBxoy+cwxSnYxPStyC8jq
// SIG // cD3/hQoT38IKYY7w17gX606Lf8U1K16jv+u8fQtCe9RT
// SIG // ciHuMMq7eGVcWwEXChQO0toUmPU8uWZYsy0v5/mFhsxR
// SIG // VuidcJRsrDlM1PZ5v6oYemIp76KbKTQGdxpiyT0ebR+C
// SIG // 8AvHLLvPQ7Pl+ex9teOkqHQ1uE7FcSMSJnYLPFKMcVpG
// SIG // QxS8s7OwTWfIn0L/gHkhgJ4VMGboQhJeGsieIiHQQ+kr
// SIG // 6bv0SMws1NgygEwmKkgkX1rqVu+m3pmdyjpvvYEndAYR
// SIG // 7nYhv5uCwSdUtrFqPYmhdmG0bqETpr+qR/ASb/2KMmyy
// SIG // /t9RyIwjyWa9nR2HEmQCPS2vWY+45CHltbDKY7R4VAXU
// SIG // QS5QrJSwpXirs6CWdRrZkocTdSIvMqgIbqBbjCW/oO+E
// SIG // yiHW6x5PyZruSeD3AWVviQt9yGnI5m7qp5fOMSn/DsVb
// SIG // XNhNG6HY+i+ePy5VFmvJE6P9MYIEnDCCBJgCAQEwgZAw
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0ECEzMAAACdHo0n
// SIG // rrjz2DgAAQAAAJ0wCQYFKw4DAhoFAKCBvjAZBgkqhkiG
// SIG // 9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgEL
// SIG // MQ4wDAYKKwYBBAGCNwIBFTAjBgkqhkiG9w0BCQQxFgQU
// SIG // 5b5q28JkixNXjz+aNC9H7IgAkEIwXgYKKwYBBAGCNwIB
// SIG // DDFQME6gJoAkAE0AaQBjAHIAbwBzAG8AZgB0ACAATABl
// SIG // AGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9sZWFybmluZyAwDQYJKoZIhvcNAQEBBQAE
// SIG // ggEAPhGh6QQBwOuj6V7USpvF2AvLPTyVsvZw8x+4Sr71
// SIG // wEiZOiyVJPmMuph+DAZDvItvtprjfdp8hIwzBWW84pjP
// SIG // 4MjUiNY2WraaVVOtjvrrQR8pahVMeTQ+0HjVoOJxjZf0
// SIG // q7CCkNPXXEZNDbfQQWqdTuvDbgb80w8Qr5Jdzya6f6/I
// SIG // cg3GbOXTfuwz/GRcvBS8+kK1AxDP+Nghpz1Y9M2BoUTR
// SIG // eSgGUqjObtirDfaviGfoqARHPfEEPJ/xar7RHHZr8agb
// SIG // l70NBXCdjPe192+1UAJRhdVv1Bd9zgcHo33K5Hx6JxYD
// SIG // As8hUAHLNHTGO77n19DyEJI9rci3c/OsxyV1zqGCAh8w
// SIG // ggIbBgkqhkiG9w0BCQYxggIMMIICCAIBATCBhTB3MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0ECCmECjkIAAAAAAB8wCQYF
// SIG // Kw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0B
// SIG // BwEwHAYJKoZIhvcNAQkFMQ8XDTEzMDEyMTIyMDQ1OVow
// SIG // IwYJKoZIhvcNAQkEMRYEFIXFpx1Q7+gfOOkaX6vECk1V
// SIG // f2MyMA0GCSqGSIb3DQEBBQUABIIBAIwK8FJgW7UxLnC+
// SIG // OXNAh7+k8pyy1/T22Hda7XFEZ+N6zVygQm+nW7SUD0R/
// SIG // e06n7mqYPcPwF6SdK3CeHr0Sx57Dugj5Bg2bGWSo8gNW
// SIG // PjAHrmb6u4NPfe3RqyhxmwxFmQ+no4Q1KY5iokdQlPNd
// SIG // qwSmAfqP6yoF0gj3dBAZPeClCMK3fP6bX2Ri5NXyzlvq
// SIG // BtnvAAYfz69Y2D4eekCjpQ4L1UdD0P6TSKYYlv5kiOL6
// SIG // cFv3J1U3Gyf27Me3ye7dJNGMupInAT2vyl34kbBAKh49
// SIG // xys8TGCtt7hh0iit/5Tcqzcy0zRV5TVArfb4B4Vh/L5k
// SIG // B3opq7gxQy+pIopWpnc=
// SIG // End signature block

//!----------------------------------------------------------
//! Copyright (C) Microsoft Corporation. All rights reserved.
//!----------------------------------------------------------
//! MicrosoftMvcAjax.js

Type.registerNamespace('Sys.Mvc');

////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.AjaxOptions

Sys.Mvc.$create_AjaxOptions = function Sys_Mvc_AjaxOptions() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.InsertionMode

Sys.Mvc.InsertionMode = function() { 
    /// <field name="replace" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="insertBefore" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="insertAfter" type="Number" integer="true" static="true">
    /// </field>
};
Sys.Mvc.InsertionMode.prototype = {
    replace: 0, 
    insertBefore: 1, 
    insertAfter: 2
}
Sys.Mvc.InsertionMode.registerEnum('Sys.Mvc.InsertionMode', false);


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.AjaxContext

Sys.Mvc.AjaxContext = function Sys_Mvc_AjaxContext(request, updateTarget, loadingElement, insertionMode) {
    /// <param name="request" type="Sys.Net.WebRequest">
    /// </param>
    /// <param name="updateTarget" type="Object" domElement="true">
    /// </param>
    /// <param name="loadingElement" type="Object" domElement="true">
    /// </param>
    /// <param name="insertionMode" type="Sys.Mvc.InsertionMode">
    /// </param>
    /// <field name="_insertionMode" type="Sys.Mvc.InsertionMode">
    /// </field>
    /// <field name="_loadingElement" type="Object" domElement="true">
    /// </field>
    /// <field name="_response" type="Sys.Net.WebRequestExecutor">
    /// </field>
    /// <field name="_request" type="Sys.Net.WebRequest">
    /// </field>
    /// <field name="_updateTarget" type="Object" domElement="true">
    /// </field>
    this._request = request;
    this._updateTarget = updateTarget;
    this._loadingElement = loadingElement;
    this._insertionMode = insertionMode;
}
Sys.Mvc.AjaxContext.prototype = {
    _insertionMode: 0,
    _loadingElement: null,
    _response: null,
    _request: null,
    _updateTarget: null,
    
    get_data: function Sys_Mvc_AjaxContext$get_data() {
        /// <value type="String"></value>
        if (this._response) {
            return this._response.get_responseData();
        }
        else {
            return null;
        }
    },
    
    get_insertionMode: function Sys_Mvc_AjaxContext$get_insertionMode() {
        /// <value type="Sys.Mvc.InsertionMode"></value>
        return this._insertionMode;
    },
    
    get_loadingElement: function Sys_Mvc_AjaxContext$get_loadingElement() {
        /// <value type="Object" domElement="true"></value>
        return this._loadingElement;
    },
    
    get_object: function Sys_Mvc_AjaxContext$get_object() {
        /// <value type="Object"></value>
        var executor = this.get_response();
        return (executor) ? executor.get_object() : null;
    },
    
    get_response: function Sys_Mvc_AjaxContext$get_response() {
        /// <value type="Sys.Net.WebRequestExecutor"></value>
        return this._response;
    },
    set_response: function Sys_Mvc_AjaxContext$set_response(value) {
        /// <value type="Sys.Net.WebRequestExecutor"></value>
        this._response = value;
        return value;
    },
    
    get_request: function Sys_Mvc_AjaxContext$get_request() {
        /// <value type="Sys.Net.WebRequest"></value>
        return this._request;
    },
    
    get_updateTarget: function Sys_Mvc_AjaxContext$get_updateTarget() {
        /// <value type="Object" domElement="true"></value>
        return this._updateTarget;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.AsyncHyperlink

Sys.Mvc.AsyncHyperlink = function Sys_Mvc_AsyncHyperlink() {
}
Sys.Mvc.AsyncHyperlink.handleClick = function Sys_Mvc_AsyncHyperlink$handleClick(anchor, evt, ajaxOptions) {
    /// <param name="anchor" type="Object" domElement="true">
    /// </param>
    /// <param name="evt" type="Sys.UI.DomEvent">
    /// </param>
    /// <param name="ajaxOptions" type="Sys.Mvc.AjaxOptions">
    /// </param>
    evt.preventDefault();
    Sys.Mvc.MvcHelpers._asyncRequest(anchor.href, 'post', '', anchor, ajaxOptions);
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.MvcHelpers

Sys.Mvc.MvcHelpers = function Sys_Mvc_MvcHelpers() {
}
Sys.Mvc.MvcHelpers._serializeSubmitButton = function Sys_Mvc_MvcHelpers$_serializeSubmitButton(element, offsetX, offsetY) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <param name="offsetX" type="Number" integer="true">
    /// </param>
    /// <param name="offsetY" type="Number" integer="true">
    /// </param>
    /// <returns type="String"></returns>
    if (element.disabled) {
        return null;
    }
    var name = element.name;
    if (name) {
        var tagName = element.tagName.toUpperCase();
        var encodedName = encodeURIComponent(name);
        var inputElement = element;
        if (tagName === 'INPUT') {
            var type = inputElement.type;
            if (type === 'submit') {
                return encodedName + '=' + encodeURIComponent(inputElement.value);
            }
            else if (type === 'image') {
                return encodedName + '.x=' + offsetX + '&' + encodedName + '.y=' + offsetY;
            }
        }
        else if ((tagName === 'BUTTON') && (name.length) && (inputElement.type === 'submit')) {
            return encodedName + '=' + encodeURIComponent(inputElement.value);
        }
    }
    return null;
}
Sys.Mvc.MvcHelpers._serializeForm = function Sys_Mvc_MvcHelpers$_serializeForm(form) {
    /// <param name="form" type="Object" domElement="true">
    /// </param>
    /// <returns type="String"></returns>
    var formElements = form.elements;
    var formBody = new Sys.StringBuilder();
    var count = formElements.length;
    for (var i = 0; i < count; i++) {
        var element = formElements[i];
        var name = element.name;
        if (!name || !name.length) {
            continue;
        }
        var tagName = element.tagName.toUpperCase();
        if (tagName === 'INPUT') {
            var inputElement = element;
            var type = inputElement.type;
            if ((type === 'text') || (type === 'password') || (type === 'hidden') || (((type === 'checkbox') || (type === 'radio')) && element.checked)) {
                formBody.append(encodeURIComponent(name));
                formBody.append('=');
                formBody.append(encodeURIComponent(inputElement.value));
                formBody.append('&');
            }
        }
        else if (tagName === 'SELECT') {
            var selectElement = element;
            var optionCount = selectElement.options.length;
            for (var j = 0; j < optionCount; j++) {
                var optionElement = selectElement.options[j];
                if (optionElement.selected) {
                    formBody.append(encodeURIComponent(name));
                    formBody.append('=');
                    formBody.append(encodeURIComponent(optionElement.value));
                    formBody.append('&');
                }
            }
        }
        else if (tagName === 'TEXTAREA') {
            formBody.append(encodeURIComponent(name));
            formBody.append('=');
            formBody.append(encodeURIComponent((element.value)));
            formBody.append('&');
        }
    }
    var additionalInput = form._additionalInput;
    if (additionalInput) {
        formBody.append(additionalInput);
        formBody.append('&');
    }
    return formBody.toString();
}
Sys.Mvc.MvcHelpers._asyncRequest = function Sys_Mvc_MvcHelpers$_asyncRequest(url, verb, body, triggerElement, ajaxOptions) {
    /// <param name="url" type="String">
    /// </param>
    /// <param name="verb" type="String">
    /// </param>
    /// <param name="body" type="String">
    /// </param>
    /// <param name="triggerElement" type="Object" domElement="true">
    /// </param>
    /// <param name="ajaxOptions" type="Sys.Mvc.AjaxOptions">
    /// </param>
    if (ajaxOptions.confirm) {
        if (!confirm(ajaxOptions.confirm)) {
            return;
        }
    }
    if (ajaxOptions.url) {
        url = ajaxOptions.url;
    }
    if (ajaxOptions.httpMethod) {
        verb = ajaxOptions.httpMethod;
    }
    if (body.length > 0 && !body.endsWith('&')) {
        body += '&';
    }
    body += 'X-Requested-With=XMLHttpRequest';
    var upperCaseVerb = verb.toUpperCase();
    var isGetOrPost = (upperCaseVerb === 'GET' || upperCaseVerb === 'POST');
    if (!isGetOrPost) {
        body += '&';
        body += 'X-HTTP-Method-Override=' + upperCaseVerb;
    }
    var requestBody = '';
    if (upperCaseVerb === 'GET' || upperCaseVerb === 'DELETE') {
        if (url.indexOf('?') > -1) {
            if (!url.endsWith('&')) {
                url += '&';
            }
            url += body;
        }
        else {
            url += '?';
            url += body;
        }
    }
    else {
        requestBody = body;
    }
    var request = new Sys.Net.WebRequest();
    request.set_url(url);
    if (isGetOrPost) {
        request.set_httpVerb(verb);
    }
    else {
        request.set_httpVerb('POST');
        request.get_headers()['X-HTTP-Method-Override'] = upperCaseVerb;
    }
    request.set_body(requestBody);
    if (verb.toUpperCase() === 'PUT') {
        request.get_headers()['Content-Type'] = 'application/x-www-form-urlencoded;';
    }
    request.get_headers()['X-Requested-With'] = 'XMLHttpRequest';
    var updateElement = null;
    if (ajaxOptions.updateTargetId) {
        updateElement = $get(ajaxOptions.updateTargetId);
    }
    var loadingElement = null;
    if (ajaxOptions.loadingElementId) {
        loadingElement = $get(ajaxOptions.loadingElementId);
    }
    var ajaxContext = new Sys.Mvc.AjaxContext(request, updateElement, loadingElement, ajaxOptions.insertionMode);
    var continueRequest = true;
    if (ajaxOptions.onBegin) {
        continueRequest = ajaxOptions.onBegin(ajaxContext) !== false;
    }
    if (loadingElement) {
        Sys.UI.DomElement.setVisible(ajaxContext.get_loadingElement(), true);
    }
    if (continueRequest) {
        request.add_completed(Function.createDelegate(null, function(executor) {
            Sys.Mvc.MvcHelpers._onComplete(request, ajaxOptions, ajaxContext);
        }));
        request.invoke();
    }
}
Sys.Mvc.MvcHelpers._onComplete = function Sys_Mvc_MvcHelpers$_onComplete(request, ajaxOptions, ajaxContext) {
    /// <param name="request" type="Sys.Net.WebRequest">
    /// </param>
    /// <param name="ajaxOptions" type="Sys.Mvc.AjaxOptions">
    /// </param>
    /// <param name="ajaxContext" type="Sys.Mvc.AjaxContext">
    /// </param>
    ajaxContext.set_response(request.get_executor());
    if (ajaxOptions.onComplete && ajaxOptions.onComplete(ajaxContext) === false) {
        return;
    }
    var statusCode = ajaxContext.get_response().get_statusCode();
    if ((statusCode >= 200 && statusCode < 300) || statusCode === 304 || statusCode === 1223) {
        if (statusCode !== 204 && statusCode !== 304 && statusCode !== 1223) {
            var contentType = ajaxContext.get_response().getResponseHeader('Content-Type');
            if ((contentType) && (contentType.indexOf('application/x-javascript') !== -1)) {
                eval(ajaxContext.get_data());
            }
            else {
                Sys.Mvc.MvcHelpers.updateDomElement(ajaxContext.get_updateTarget(), ajaxContext.get_insertionMode(), ajaxContext.get_data());
            }
        }
        if (ajaxOptions.onSuccess) {
            ajaxOptions.onSuccess(ajaxContext);
        }
    }
    else {
        if (ajaxOptions.onFailure) {
            ajaxOptions.onFailure(ajaxContext);
        }
    }
    if (ajaxContext.get_loadingElement()) {
        Sys.UI.DomElement.setVisible(ajaxContext.get_loadingElement(), false);
    }
}
Sys.Mvc.MvcHelpers.updateDomElement = function Sys_Mvc_MvcHelpers$updateDomElement(target, insertionMode, content) {
    /// <param name="target" type="Object" domElement="true">
    /// </param>
    /// <param name="insertionMode" type="Sys.Mvc.InsertionMode">
    /// </param>
    /// <param name="content" type="String">
    /// </param>
    if (target) {
        switch (insertionMode) {
            case Sys.Mvc.InsertionMode.replace:
                target.innerHTML = content;
                break;
            case Sys.Mvc.InsertionMode.insertBefore:
                if (content && content.length > 0) {
                    target.innerHTML = content + target.innerHTML.trimStart();
                }
                break;
            case Sys.Mvc.InsertionMode.insertAfter:
                if (content && content.length > 0) {
                    target.innerHTML = target.innerHTML.trimEnd() + content;
                }
                break;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.AsyncForm

Sys.Mvc.AsyncForm = function Sys_Mvc_AsyncForm() {
}
Sys.Mvc.AsyncForm.handleClick = function Sys_Mvc_AsyncForm$handleClick(form, evt) {
    /// <param name="form" type="Object" domElement="true">
    /// </param>
    /// <param name="evt" type="Sys.UI.DomEvent">
    /// </param>
    var additionalInput = Sys.Mvc.MvcHelpers._serializeSubmitButton(evt.target, evt.offsetX, evt.offsetY);
    form._additionalInput = additionalInput;
}
Sys.Mvc.AsyncForm.handleSubmit = function Sys_Mvc_AsyncForm$handleSubmit(form, evt, ajaxOptions) {
    /// <param name="form" type="Object" domElement="true">
    /// </param>
    /// <param name="evt" type="Sys.UI.DomEvent">
    /// </param>
    /// <param name="ajaxOptions" type="Sys.Mvc.AjaxOptions">
    /// </param>
    evt.preventDefault();
    var validationCallbacks = form.validationCallbacks;
    if (validationCallbacks) {
        for (var i = 0; i < validationCallbacks.length; i++) {
            var callback = validationCallbacks[i];
            if (!callback()) {
                return;
            }
        }
    }
    var body = Sys.Mvc.MvcHelpers._serializeForm(form);
    Sys.Mvc.MvcHelpers._asyncRequest(form.action, form.method || 'post', body, form, ajaxOptions);
}


Sys.Mvc.AjaxContext.registerClass('Sys.Mvc.AjaxContext');
Sys.Mvc.AsyncHyperlink.registerClass('Sys.Mvc.AsyncHyperlink');
Sys.Mvc.MvcHelpers.registerClass('Sys.Mvc.MvcHelpers');
Sys.Mvc.AsyncForm.registerClass('Sys.Mvc.AsyncForm');

// ---- Do not remove this footer ----
// Generated using Script# v0.5.0.0 (http://projects.nikhilk.net)
// -----------------------------------

// SIG // Begin signature block
// SIG // MIIaaAYJKoZIhvcNAQcCoIIaWTCCGlUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFIMZdbb0tQdE
// SIG // x0//TitxFcBa+JC0oIIVLzCCBJkwggOBoAMCAQICEzMA
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
// SIG // dcWCVZAbtVVhMIIEwzCCA6ugAwIBAgITMwAAACs5MkjB
// SIG // sslI8wAAAAAAKzANBgkqhkiG9w0BAQUFADB3MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBQQ0EwHhcNMTIwOTA0MjExMjM0WhcN
// SIG // MTMxMjA0MjExMjM0WjCBszELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjENMAsGA1UECxMETU9QUjEnMCUGA1UECxMebkNpcGhl
// SIG // ciBEU0UgRVNOOkMwRjQtMzA4Ni1ERUY4MSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAprYw
// SIG // DgNlrlBahmuFn0ihHsnA7l5JB4XgcJZ8vrlfYl8GJtOL
// SIG // ObsYIqUukq3YS4g6Gq+bg67IXjmMwjJ7FnjtNzg68WL7
// SIG // aIICaOzru0CKsf6hLDZiYHA5YGIO+8YYOG+wktZADYCm
// SIG // DXiLNmuGiiYXGP+w6026uykT5lxIjnBGNib+NDWrNOH3
// SIG // 2thc6pl9MbdNH1frfNaVDWYMHg4yFz4s1YChzuv3mJEC
// SIG // 3MFf/TiA+Dl/XWTKN1w7UVtdhV/OHhz7NL5f5ShVcFSc
// SIG // uOx8AFVGWyiYKFZM4fG6CRmWgUgqMMj3MyBs52nDs9TD
// SIG // Ts8wHjfUmFLUqSNFsq5cQUlPtGJokwIDAQABo4IBCTCC
// SIG // AQUwHQYDVR0OBBYEFKUYM1M/lWChQxbvjsav0iu6nljQ
// SIG // MB8GA1UdIwQYMBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMP
// SIG // MFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY3Jv
// SIG // c29mdFRpbWVTdGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEE
// SIG // TDBKMEgGCCsGAQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFRpbWVT
// SIG // dGFtcFBDQS5jcnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
// SIG // DQYJKoZIhvcNAQEFBQADggEBAH7MsHvlL77nVrXPc9uq
// SIG // UtEWOca0zfrX/h5ltedI85tGiAVmaiaGXv6HWNzGY444
// SIG // gPQIRnwrc7EOv0Gqy8eqlKQ38GQ54cXV+c4HzqvkJfBp
// SIG // rtRG4v5mMjzXl8UyIfruGiWgXgxCLBEzOoKD/e0ds77O
// SIG // kaSRJXG5q3Kwnq/kzwBiiXCpuEpQjO4vImSlqOZNa5Us
// SIG // HHnsp6Mx2pBgkKRu/pMCDT8sJA3GaiaBUYNKELt1Y0Sq
// SIG // aQjGA+vizwvtVjrs73KnCgz0ANMiuK8icrPnxJwLKKCA
// SIG // yuPh1zlmMOdGFxjn+oL6WQt6vKgN/hz/A4tjsk0SAiNP
// SIG // LbOFhDvioUfozxUwggW8MIIDpKADAgECAgphMyYaAAAA
// SIG // AAAxMA0GCSqGSIb3DQEBBQUAMF8xEzARBgoJkiaJk/Is
// SIG // ZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFgltaWNyb3Nv
// SIG // ZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290IENlcnRp
// SIG // ZmljYXRlIEF1dGhvcml0eTAeFw0xMDA4MzEyMjE5MzJa
// SIG // Fw0yMDA4MzEyMjI5MzJaMHkxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xIzAhBgNVBAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25p
// SIG // bmcgUENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
// SIG // CgKCAQEAsnJZXBkwZL8dmmAgIEKZdlNsPhvWb8zL8epr
// SIG // /pcWEODfOnSDGrcvoDLs/97CQk4j1XIA2zVXConKriBJ
// SIG // 9PBorE1LjaW9eUtxm0cH2v0l3511iM+qc0R/14Hb873y
// SIG // NqTJXEXcr6094CholxqnpXJzVvEXlOT9NZRyoNZ2Xx53
// SIG // RYOFOBbQc1sFumdSjaWyaS/aGQv+knQp4nYvVN0UMFn4
// SIG // 0o1i/cvJX0YxULknE+RAMM9yKRAoIsc3Tj2gMj2QzaE4
// SIG // BoVcTlaCKCoFMrdL109j59ItYvFFPeesCAD2RqGe0VuM
// SIG // JlPoeqpK8kbPNzw4nrR3XKUXno3LEY9WPMGsCV8D0wID
// SIG // AQABo4IBXjCCAVowDwYDVR0TAQH/BAUwAwEB/zAdBgNV
// SIG // HQ4EFgQUyxHoytK0FlgByTcuMxYWuUyaCh8wCwYDVR0P
// SIG // BAQDAgGGMBIGCSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYB
// SIG // BAGCNxUCBBYEFP3RMU7TJoqV4ZhgO6gxb6Y8vNgtMBkG
// SIG // CSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMB8GA1UdIwQY
// SIG // MBaAFA6sgmBAVieX5SUT/CrhClOVWeSkMFAGA1UdHwRJ
// SIG // MEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29mdHJvb3Rj
// SIG // ZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYIKwYBBQUH
// SIG // MAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0MA0GCSqG
// SIG // SIb3DQEBBQUAA4ICAQBZOT5/Jkav629AsTK1ausOL26o
// SIG // SffrX3XtTDst10OtC/7L6S0xoyPMfFCYgCFdrD0vTLqi
// SIG // qFac43C7uLT4ebVJcvc+6kF/yuEMF2nLpZwgLfoLUMRW
// SIG // zS3jStK8cOeoDaIDpVbguIpLV/KVQpzx8+/u44YfNDy4
// SIG // VprwUyOFKqSCHJPilAcd8uJO+IyhyugTpZFOyBvSj3KV
// SIG // KnFtmxr4HPBT1mfMIv9cHc2ijL0nsnljVkSiUc356aNY
// SIG // Vt2bAkVEL1/02q7UgjJu/KSVE+Traeepoiy+yCsQDmWO
// SIG // mdv1ovoSJgllOJTxeh9Ku9HhVujQeJYYXMk1Fl/dkx1J
// SIG // ji2+rTREHO4QFRoAXd01WyHOmMcJ7oUOjE9tDhNOPXwp
// SIG // SJxy0fNsysHscKNXkld9lI2gG0gDWvfPo2cKdKU27S0v
// SIG // F8jmcjcS9G+xPGeC+VKyjTMWZR4Oit0Q3mT0b85G1NMX
// SIG // 6XnEBLTT+yzfH4qerAr7EydAreT54al/RrsHYEdlYEBO
// SIG // sELsTu2zdnnYCjQJbRyAMR/iDlTd5aH75UcQrWSY/1AW
// SIG // Lny/BSF64pVBJ2nDk4+VyY3YmyGuDVyc8KKuhmiDDGot
// SIG // u3ZrAB2WrfIWe/YWgyS5iM9qqEcxL5rc43E91wB+YkfR
// SIG // zojJuBj6DnKNwaM9rwJAav9pm5biEKgQtDdQCNbDPTCC
// SIG // BgcwggPvoAMCAQICCmEWaDQAAAAAABwwDQYJKoZIhvcN
// SIG // AQEFBQAwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcG
// SIG // CgmSJomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMk
// SIG // TWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
// SIG // aXR5MB4XDTA3MDQwMzEyNTMwOVoXDTIxMDQwMzEzMDMw
// SIG // OVowdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMY
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBMIIBIjANBgkq
// SIG // hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn6Fssd/bSJIq
// SIG // fGsuGeG94uPFmVEjUK3O3RhOJA/u0afRTK10MCAR6wfV
// SIG // VJUVSZQbQpKumFwwJtoAa+h7veyJBw/3DgSY8InMH8sz
// SIG // JIed8vRnHCz8e+eIHernTqOhwSNTyo36Rc8J0F6v0LBC
// SIG // BKL5pmyTZ9co3EZTsIbQ5ShGLieshk9VUgzkAyz7apCQ
// SIG // MG6H81kwnfp+1pez6CGXfvjSE/MIt1NtUrRFkJ9IAEpH
// SIG // ZhEnKWaol+TTBoFKovmEpxFHFAmCn4TtVXj+AZodUAiF
// SIG // ABAwRu233iNGu8QtVJ+vHnhBMXfMm987g5OhYQK1HQ2x
// SIG // /PebsgHOIktU//kFw8IgCwIDAQABo4IBqzCCAacwDwYD
// SIG // VR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUIzT42VJGcArt
// SIG // QPt2+7MrsMM1sw8wCwYDVR0PBAQDAgGGMBAGCSsGAQQB
// SIG // gjcVAQQDAgEAMIGYBgNVHSMEgZAwgY2AFA6sgmBAVieX
// SIG // 5SUT/CrhClOVWeSkoWOkYTBfMRMwEQYKCZImiZPyLGQB
// SIG // GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0
// SIG // MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHmCEHmtFqFKoKWtTHNY9AcTLmUw
// SIG // UAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvbWljcm9z
// SIG // b2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBE
// SIG // BggrBgEFBQcwAoY4aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5j
// SIG // cnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcN
// SIG // AQEFBQADggIBABCXisNcA0Q23em0rXfbznlRTQGxLnRx
// SIG // W20ME6vOvnuPuC7UEqKMbWK4VwLLTiATUJndekDiV7uv
// SIG // WJoc4R0Bhqy7ePKL0Ow7Ae7ivo8KBciNSOLwUxXdT6uS
// SIG // 5OeNatWAweaU8gYvhQPpkSokInD79vzkeJkuDfcH4nC8
// SIG // GE6djmsKcpW4oTmcZy3FUQ7qYlw/FpiLID/iBxoy+cwx
// SIG // SnYxPStyC8jqcD3/hQoT38IKYY7w17gX606Lf8U1K16j
// SIG // v+u8fQtCe9RTciHuMMq7eGVcWwEXChQO0toUmPU8uWZY
// SIG // sy0v5/mFhsxRVuidcJRsrDlM1PZ5v6oYemIp76KbKTQG
// SIG // dxpiyT0ebR+C8AvHLLvPQ7Pl+ex9teOkqHQ1uE7FcSMS
// SIG // JnYLPFKMcVpGQxS8s7OwTWfIn0L/gHkhgJ4VMGboQhJe
// SIG // GsieIiHQQ+kr6bv0SMws1NgygEwmKkgkX1rqVu+m3pmd
// SIG // yjpvvYEndAYR7nYhv5uCwSdUtrFqPYmhdmG0bqETpr+q
// SIG // R/ASb/2KMmyy/t9RyIwjyWa9nR2HEmQCPS2vWY+45CHl
// SIG // tbDKY7R4VAXUQS5QrJSwpXirs6CWdRrZkocTdSIvMqgI
// SIG // bqBbjCW/oO+EyiHW6x5PyZruSeD3AWVviQt9yGnI5m7q
// SIG // p5fOMSn/DsVbXNhNG6HY+i+ePy5VFmvJE6P9MYIEpTCC
// SIG // BKECAQEwgZAweTELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEG
// SIG // A1UEAxMaTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EC
// SIG // EzMAAACdHo0nrrjz2DgAAQAAAJ0wCQYFKw4DAhoFAKCB
// SIG // vjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgor
// SIG // BgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAjBgkqhkiG
// SIG // 9w0BCQQxFgQUpS/1KP6Y1vFrIGS00O7Xt6QpFYkwXgYK
// SIG // KwYBBAGCNwIBDDFQME6gJoAkAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0ACAATABlAGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9sZWFybmluZyAwDQYJKoZI
// SIG // hvcNAQEBBQAEggEAt3cWz/79gSI9exqOdJn3FzpMyPTy
// SIG // RgVo6h/YkBdRQL9PEo+BD20z/DFLFY/Y/gbNbDxF5js5
// SIG // F5VPMp6eT/MlV+QZrS9+nf3DkSc+slNAxnuKYBFiRdHg
// SIG // M711XXGGjO8d4tzq3C7onYVw1ulAu2DOufZaTB0HX+d6
// SIG // z2Ylm2pdes/Cac3SH9s19OLr62dGuwQjURzCVx/QQDq0
// SIG // CI2bwxrdbfFJ2B1rBs7UW9i5F+9V6nyZ0NDdmkKsi5Ul
// SIG // xD2EhoFoGPKIRBrixWLOnXKShIWY2NzxPyjP/wRR3Nls
// SIG // KQL0oz1iCJInv3jYbof9G3y7ZeI2I2b+40/9+Vl5WKu5
// SIG // lhOAW6GCAigwggIkBgkqhkiG9w0BCQYxggIVMIICEQIB
// SIG // ATCBjjB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECEzMAAAAr
// SIG // OTJIwbLJSPMAAAAAACswCQYFKw4DAhoFAKBdMBgGCSqG
// SIG // SIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkF
// SIG // MQ8XDTEzMDEyMTIyMTYzMFowIwYJKoZIhvcNAQkEMRYE
// SIG // FK6imY+RiBhmHc2DLukuo1j9133eMA0GCSqGSIb3DQEB
// SIG // BQUABIIBABlwi9lGV4oS39XEd1QiAHwFIrou6vBtQDQz
// SIG // HbRk6vXmrOoU88BIQmHwZ7LYw5hYUV+PWhnpHsZ44r7+
// SIG // iWY4EQBDjBdIzillGIHqcfkD6EjU+mBVr3M2y5+1xGeT
// SIG // /HWOBaSjfAtR6nxIHKm7oMVGlZKQNUiLaJJJFSY34NVX
// SIG // 8h5Fvt8Dne9RLuDllpcxyyvRdil6mHFoALmY8Ho5ABiA
// SIG // J409CHQos+QWj+STEGmn2+CdY/1duK/inLnoUL+prHTU
// SIG // Z8uzuoMJ1lbsGrt0F0puRdHO6YM0vPWJBqW67Nwfaxvu
// SIG // UHakMVzb5fia0I8SYFI7vxks0XPVe3VB1WPuCEPjknU=
// SIG // End signature block

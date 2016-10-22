//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//----------------------------------------------------------
// MicrosoftMvcValidation.js

Type.registerNamespace('Sys.Mvc');Sys.Mvc.$create_Validation=function(){return {};}
Sys.Mvc.$create_JsonValidationField=function(){return {};}
Sys.Mvc.$create_JsonValidationOptions=function(){return {};}
Sys.Mvc.$create_JsonValidationRule=function(){return {};}
Sys.Mvc.$create_ValidationContext=function(){return {};}
Sys.Mvc.NumberValidator=function(){}
Sys.Mvc.NumberValidator.create=function(rule){return Function.createDelegate(new Sys.Mvc.NumberValidator(),new Sys.Mvc.NumberValidator().validate);}
Sys.Mvc.NumberValidator.prototype={validate:function(value,context){if(Sys.Mvc._ValidationUtil.$1(value)){return true;}var $0=Number.parseLocale(value);return (!isNaN($0));}}
Sys.Mvc.FormContext=function(formElement,validationSummaryElement){this.$5=[];this.fields=new Array(0);this.$9=formElement;this.$7=validationSummaryElement;formElement['__MVC_FormValidation'] = this;if(validationSummaryElement){var $0=validationSummaryElement.getElementsByTagName('ul');if($0.length>0){this.$8=$0[0];}}this.$3=Function.createDelegate(this,this.$D);this.$4=Function.createDelegate(this,this.$E);}
Sys.Mvc.FormContext._Application_Load=function(){var $0=window.mvcClientValidationMetadata;if($0){while($0.length>0){var $1=$0.pop();Sys.Mvc.FormContext.$12($1);}}}
Sys.Mvc.FormContext.$F=function($p0,$p1){var $0=[];var $1=document.getElementsByName($p1);for(var $2=0;$2<$1.length;$2++){var $3=$1[$2];if(Sys.Mvc.FormContext.$10($p0,$3)){Array.add($0,$3);}}return $0;}
Sys.Mvc.FormContext.getValidationForForm=function(formElement){return formElement['__MVC_FormValidation'];}
Sys.Mvc.FormContext.$10=function($p0,$p1){while($p1){if($p0===$p1){return true;}$p1=$p1.parentNode;}return false;}
Sys.Mvc.FormContext.$12=function($p0){var $0=$get($p0.FormId);var $1=(!Sys.Mvc._ValidationUtil.$1($p0.ValidationSummaryId))?$get($p0.ValidationSummaryId):null;var $2=new Sys.Mvc.FormContext($0,$1);$2.enableDynamicValidation();$2.replaceValidationSummary=$p0.ReplaceValidationSummary;for(var $4=0;$4<$p0.Fields.length;$4++){var $5=$p0.Fields[$4];var $6=Sys.Mvc.FormContext.$F($0,$5.FieldName);var $7=(!Sys.Mvc._ValidationUtil.$1($5.ValidationMessageId))?$get($5.ValidationMessageId):null;var $8=new Sys.Mvc.FieldContext($2);Array.addRange($8.elements,$6);$8.validationMessageElement=$7;$8.replaceValidationMessageContents=$5.ReplaceValidationMessageContents;for(var $9=0;$9<$5.ValidationRules.length;$9++){var $A=$5.ValidationRules[$9];var $B=Sys.Mvc.ValidatorRegistry.getValidator($A);if($B){var $C=Sys.Mvc.$create_Validation();$C.fieldErrorMessage=$A.ErrorMessage;$C.validator=$B;Array.add($8.validations,$C);}}$8.enableDynamicValidation();Array.add($2.fields,$8);}var $3=$0.validationCallbacks;if(!$3){$3=[];$0.validationCallbacks = $3;}$3.push(Function.createDelegate(null,function(){
return Sys.Mvc._ValidationUtil.$0($2.validate('submit'));}));return $2;}
Sys.Mvc.FormContext.prototype={$3:null,$4:null,$6:null,$7:null,$8:null,$9:null,replaceValidationSummary:false,addError:function(message){this.addErrors([message]);},addErrors:function(messages){if(!Sys.Mvc._ValidationUtil.$0(messages)){Array.addRange(this.$5,messages);this.$11();}},clearErrors:function(){Array.clear(this.$5);this.$11();},$A:function(){if(this.$7){if(this.$8){Sys.Mvc._ValidationUtil.$3(this.$8);for(var $0=0;$0<this.$5.length;$0++){var $1=document.createElement('li');Sys.Mvc._ValidationUtil.$4($1,this.$5[$0]);this.$8.appendChild($1);}}Sys.UI.DomElement.removeCssClass(this.$7,'validation-summary-valid');Sys.UI.DomElement.addCssClass(this.$7,'validation-summary-errors');}},$B:function(){var $0=this.$7;if($0){var $1=this.$8;if($1){$1.innerHTML='';}Sys.UI.DomElement.removeCssClass($0,'validation-summary-errors');Sys.UI.DomElement.addCssClass($0,'validation-summary-valid');}},enableDynamicValidation:function(){Sys.UI.DomEvent.addHandler(this.$9,'click',this.$3);Sys.UI.DomEvent.addHandler(this.$9,'submit',this.$4);},$C:function($p0){if($p0.disabled){return null;}var $0=$p0.tagName.toUpperCase();var $1=$p0;if($0==='INPUT'){var $2=$1.type;if($2==='submit'||$2==='image'){return $1;}}else if(($0==='BUTTON')&&($1.type==='submit')){return $1;}return null;},$D:function($p0){this.$6=this.$C($p0.target);},$E:function($p0){var $0=$p0.target;var $1=this.$6;if($1&&$1.disableValidation){return;}var $2=this.validate('submit');if(!Sys.Mvc._ValidationUtil.$0($2)){$p0.preventDefault();}},$11:function(){if(!this.$5.length){this.$B();}else{this.$A();}},validate:function(eventName){var $0=this.fields;var $1=[];for(var $2=0;$2<$0.length;$2++){var $3=$0[$2];if(!$3.elements[0].disabled){var $4=$3.validate(eventName);if($4){Array.addRange($1,$4);}}}if(this.replaceValidationSummary){this.clearErrors();this.addErrors($1);}return $1;}}
Sys.Mvc.FieldContext=function(formContext){this.$A=[];this.elements=new Array(0);this.validations=new Array(0);this.formContext=formContext;this.$6=Function.createDelegate(this,this.$D);this.$7=Function.createDelegate(this,this.$E);this.$8=Function.createDelegate(this,this.$F);this.$9=Function.createDelegate(this,this.$10);}
Sys.Mvc.FieldContext.prototype={$6:null,$7:null,$8:null,$9:null,defaultErrorMessage:null,formContext:null,replaceValidationMessageContents:false,validationMessageElement:null,addError:function(message){this.addErrors([message]);},addErrors:function(messages){if(!Sys.Mvc._ValidationUtil.$0(messages)){Array.addRange(this.$A,messages);this.$14();}},clearErrors:function(){Array.clear(this.$A);this.$14();},$B:function(){var $0=this.validationMessageElement;if($0){if(this.replaceValidationMessageContents){Sys.Mvc._ValidationUtil.$4($0,this.$A[0]);}Sys.UI.DomElement.removeCssClass($0,'field-validation-valid');Sys.UI.DomElement.addCssClass($0,'field-validation-error');}var $1=this.elements;for(var $2=0;$2<$1.length;$2++){var $3=$1[$2];Sys.UI.DomElement.removeCssClass($3,'input-validation-valid');Sys.UI.DomElement.addCssClass($3,'input-validation-error');}},$C:function(){var $0=this.validationMessageElement;if($0){if(this.replaceValidationMessageContents){Sys.Mvc._ValidationUtil.$4($0,'');}Sys.UI.DomElement.removeCssClass($0,'field-validation-error');Sys.UI.DomElement.addCssClass($0,'field-validation-valid');}var $1=this.elements;for(var $2=0;$2<$1.length;$2++){var $3=$1[$2];Sys.UI.DomElement.removeCssClass($3,'input-validation-error');Sys.UI.DomElement.addCssClass($3,'input-validation-valid');}},$D:function($p0){if($p0.target['__MVC_HasTextChanged']||$p0.target['__MVC_HasValidationFired']){this.validate('blur');}},$E:function($p0){$p0.target['__MVC_HasTextChanged'] = true;},$F:function($p0){$p0.target['__MVC_HasTextChanged'] = true;if($p0.target['__MVC_HasValidationFired']){this.validate('input');}},$10:function($p0){if($p0.rawEvent.propertyName==='value'){$p0.target['__MVC_HasTextChanged'] = true;if($p0.target['__MVC_HasValidationFired']){this.validate('input');}}},enableDynamicValidation:function(){var $0=this.elements;for(var $1=0;$1<$0.length;$1++){var $2=$0[$1];if(Sys.Mvc._ValidationUtil.$2($2,'onpropertychange')){var $3=document.documentMode;if($3&&$3>=8){Sys.UI.DomEvent.addHandler($2,'propertychange',this.$9);}}else{Sys.UI.DomEvent.addHandler($2,'input',this.$8);}Sys.UI.DomEvent.addHandler($2,'change',this.$7);Sys.UI.DomEvent.addHandler($2,'blur',this.$6);}},$11:function($p0,$p1){var $0=$p1||this.defaultErrorMessage;if(Boolean.isInstanceOfType($p0)){return ($p0)?null:$0;}if(String.isInstanceOfType($p0)){return (($p0).length)?$p0:$0;}return null;},$12:function(){var $0=this.elements;return ($0.length>0)?$0[0].value:null;},$13:function(){var $0=this.elements;for(var $1=0;$1<$0.length;$1++){var $2=$0[$1];$2['__MVC_HasValidationFired'] = true;}},$14:function(){if(!this.$A.length){this.$C();}else{this.$B();}},validate:function(eventName){var $0=this.validations;var $1=[];var $2=this.$12();for(var $3=0;$3<$0.length;$3++){var $4=$0[$3];var $5=Sys.Mvc.$create_ValidationContext();$5.eventName=eventName;$5.fieldContext=this;$5.validation=$4;var $6=$4.validator($2,$5);var $7=this.$11($6,$4.fieldErrorMessage);if(!Sys.Mvc._ValidationUtil.$1($7)){Array.add($1,$7);}}this.$13();this.clearErrors();this.addErrors($1);return $1;}}
Sys.Mvc.RangeValidator=function(minimum,maximum){this.$0=minimum;this.$1=maximum;}
Sys.Mvc.RangeValidator.create=function(rule){var $0=rule.ValidationParameters['min'];var $1=rule.ValidationParameters['max'];return Function.createDelegate(new Sys.Mvc.RangeValidator($0,$1),new Sys.Mvc.RangeValidator($0,$1).validate);}
Sys.Mvc.RangeValidator.prototype={$0:null,$1:null,validate:function(value,context){if(Sys.Mvc._ValidationUtil.$1(value)){return true;}var $0=Number.parseLocale(value);return (!isNaN($0)&&this.$0<=$0&&$0<=this.$1);}}
Sys.Mvc.RegularExpressionValidator=function(pattern){this.$0=pattern;}
Sys.Mvc.RegularExpressionValidator.create=function(rule){var $0=rule.ValidationParameters['pattern'];return Function.createDelegate(new Sys.Mvc.RegularExpressionValidator($0),new Sys.Mvc.RegularExpressionValidator($0).validate);}
Sys.Mvc.RegularExpressionValidator.prototype={$0:null,validate:function(value,context){if(Sys.Mvc._ValidationUtil.$1(value)){return true;}var $0=new RegExp(this.$0);var $1=$0.exec(value);return (!Sys.Mvc._ValidationUtil.$0($1)&&$1[0].length===value.length);}}
Sys.Mvc.RequiredValidator=function(){}
Sys.Mvc.RequiredValidator.create=function(rule){return Function.createDelegate(new Sys.Mvc.RequiredValidator(),new Sys.Mvc.RequiredValidator().validate);}
Sys.Mvc.RequiredValidator.$0=function($p0){if($p0.tagName.toUpperCase()==='INPUT'){var $0=($p0.type).toUpperCase();if($0==='RADIO'){return true;}}return false;}
Sys.Mvc.RequiredValidator.$1=function($p0){if($p0.tagName.toUpperCase()==='SELECT'){return true;}return false;}
Sys.Mvc.RequiredValidator.$2=function($p0){if($p0.tagName.toUpperCase()==='INPUT'){var $0=($p0.type).toUpperCase();switch($0){case 'TEXT':case 'PASSWORD':case 'FILE':return true;}}if($p0.tagName.toUpperCase()==='TEXTAREA'){return true;}return false;}
Sys.Mvc.RequiredValidator.$3=function($p0){for(var $0=0;$0<$p0.length;$0++){var $1=$p0[$0];if($1.checked){return true;}}return false;}
Sys.Mvc.RequiredValidator.$4=function($p0){for(var $0=0;$0<$p0.length;$0++){var $1=$p0[$0];if($1.selected){if(!Sys.Mvc._ValidationUtil.$1($1.value)){return true;}}}return false;}
Sys.Mvc.RequiredValidator.$5=function($p0){return (!Sys.Mvc._ValidationUtil.$1($p0.value));}
Sys.Mvc.RequiredValidator.prototype={validate:function(value,context){var $0=context.fieldContext.elements;if(!$0.length){return true;}var $1=$0[0];if(Sys.Mvc.RequiredValidator.$2($1)){return Sys.Mvc.RequiredValidator.$5($1);}if(Sys.Mvc.RequiredValidator.$0($1)){return Sys.Mvc.RequiredValidator.$3($0);}if(Sys.Mvc.RequiredValidator.$1($1)){return Sys.Mvc.RequiredValidator.$4(($1).options);}return true;}}
Sys.Mvc.StringLengthValidator=function(minLength,maxLength){this.$1=minLength;this.$0=maxLength;}
Sys.Mvc.StringLengthValidator.create=function(rule){var $0=(rule.ValidationParameters['min']||0);var $1=(rule.ValidationParameters['max']||Number.MAX_VALUE);return Function.createDelegate(new Sys.Mvc.StringLengthValidator($0,$1),new Sys.Mvc.StringLengthValidator($0,$1).validate);}
Sys.Mvc.StringLengthValidator.prototype={$0:0,$1:0,validate:function(value,context){if(Sys.Mvc._ValidationUtil.$1(value)){return true;}return (this.$1<=value.length&&value.length<=this.$0);}}
Sys.Mvc._ValidationUtil=function(){}
Sys.Mvc._ValidationUtil.$0=function($p0){return (!$p0||!$p0.length);}
Sys.Mvc._ValidationUtil.$1=function($p0){return (!$p0||!$p0.length);}
Sys.Mvc._ValidationUtil.$2=function($p0,$p1){return ($p1 in $p0);}
Sys.Mvc._ValidationUtil.$3=function($p0){while($p0.firstChild){$p0.removeChild($p0.firstChild);}}
Sys.Mvc._ValidationUtil.$4=function($p0,$p1){var $0=document.createTextNode($p1);Sys.Mvc._ValidationUtil.$3($p0);$p0.appendChild($0);}
Sys.Mvc.ValidatorRegistry=function(){}
Sys.Mvc.ValidatorRegistry.getValidator=function(rule){var $0=Sys.Mvc.ValidatorRegistry.validators[rule.ValidationType];return ($0)?$0(rule):null;}
Sys.Mvc.ValidatorRegistry.$0=function(){return {required:Function.createDelegate(null,Sys.Mvc.RequiredValidator.create),length:Function.createDelegate(null,Sys.Mvc.StringLengthValidator.create),regex:Function.createDelegate(null,Sys.Mvc.RegularExpressionValidator.create),range:Function.createDelegate(null,Sys.Mvc.RangeValidator.create),number:Function.createDelegate(null,Sys.Mvc.NumberValidator.create)};}
Sys.Mvc.NumberValidator.registerClass('Sys.Mvc.NumberValidator');Sys.Mvc.FormContext.registerClass('Sys.Mvc.FormContext');Sys.Mvc.FieldContext.registerClass('Sys.Mvc.FieldContext');Sys.Mvc.RangeValidator.registerClass('Sys.Mvc.RangeValidator');Sys.Mvc.RegularExpressionValidator.registerClass('Sys.Mvc.RegularExpressionValidator');Sys.Mvc.RequiredValidator.registerClass('Sys.Mvc.RequiredValidator');Sys.Mvc.StringLengthValidator.registerClass('Sys.Mvc.StringLengthValidator');Sys.Mvc._ValidationUtil.registerClass('Sys.Mvc._ValidationUtil');Sys.Mvc.ValidatorRegistry.registerClass('Sys.Mvc.ValidatorRegistry');Sys.Mvc.ValidatorRegistry.validators=Sys.Mvc.ValidatorRegistry.$0();
// ---- Do not remove this footer ----
// Generated using Script# v0.5.0.0 (http://projects.nikhilk.net)
// -----------------------------------
Sys.Application.add_load(function(){Sys.Application.remove_load(arguments.callee);Sys.Mvc.FormContext._Application_Load();});
// SIG // Begin signature block
// SIG // MIIaaAYJKoZIhvcNAQcCoIIaWTCCGlUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFJadwOAID5vO
// SIG // VvHou3kkdgsQoOtRoIIVLzCCBJkwggOBoAMCAQICEzMA
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
// SIG // 9w0BCQQxFgQUXbdf+PEy3e8LoYnvaa4ItPgiWI0wXgYK
// SIG // KwYBBAGCNwIBDDFQME6gJoAkAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0ACAATABlAGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9sZWFybmluZyAwDQYJKoZI
// SIG // hvcNAQEBBQAEggEAej1ONTRTs+ilYI20dxaZ6U/Lks/D
// SIG // XBBY4GxralBko9jdiZQQ9+d6T7dba1c3L8q8+PYFyajP
// SIG // gDwtJT+LT129bONCeusUd4ls8rg27Fu93U+8OavI9h3Z
// SIG // gcd4q4/Z9h6NLe3IQiO8XAO2FVBre16dHny7MYB/ngbr
// SIG // owRcdvf3RpSCTr1suSQKA8Ls9LI+twPPTPeWpLC0Tj9a
// SIG // cplWSHORkXP83jFiHb9I1OwIEw8uh3SAGfe9uG99QxL/
// SIG // 8OUs3hjWGC87i6gCkZpDy2tPBet9HPod6CDDFdv7Gt3K
// SIG // IXDS89d9W0t9r96G5SM2IE8JwgbMLOBs89jP9yQYd/xW
// SIG // KnnXF6GCAigwggIkBgkqhkiG9w0BCQYxggIVMIICEQIB
// SIG // ATCBjjB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECEzMAAAAr
// SIG // OTJIwbLJSPMAAAAAACswCQYFKw4DAhoFAKBdMBgGCSqG
// SIG // SIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkF
// SIG // MQ8XDTEzMDEyMTIyMTYyOVowIwYJKoZIhvcNAQkEMRYE
// SIG // FHU5kQulzZsm7TvT+JsQzb59Jq+MMA0GCSqGSIb3DQEB
// SIG // BQUABIIBAFKWJKWr+YmALbLXsjM2u3Jq+2GHLcLXYTz4
// SIG // ZaURUM/wLFkEGf9pf/jf/ZIa0kHNEU2EtghDj7+KIzIh
// SIG // NePFIHlqvlwz75S2Z2Q853GNjqJpBcllOA9IPA3ULJR0
// SIG // JztMQTi5up6h9qLbtbBrcPhB5+Uy6DNwC8osoLg6xm97
// SIG // /xBPvG1Txmcag6wIw7zoR/wiy60+7LwNiqOvu7aoDVMo
// SIG // qKyJieX7zB9zovKVwJgmTyqJoNaMUeQaqNDS2VIq18pf
// SIG // LCx294ftr5wgppKflIenrcYw3kKTVMk60ra5hQrydZCt
// SIG // 9RLkYhtJobEYNxNXriAkGj7vMhTYKt9fFpuWYXaenxk=
// SIG // End signature block

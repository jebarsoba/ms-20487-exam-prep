//!----------------------------------------------------------
//! Copyright (C) Microsoft Corporation. All rights reserved.
//!----------------------------------------------------------
//! MicrosoftMvcValidation.js


Type.registerNamespace('Sys.Mvc');

////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.Validation

Sys.Mvc.$create_Validation = function Sys_Mvc_Validation() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.JsonValidationField

Sys.Mvc.$create_JsonValidationField = function Sys_Mvc_JsonValidationField() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.JsonValidationOptions

Sys.Mvc.$create_JsonValidationOptions = function Sys_Mvc_JsonValidationOptions() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.JsonValidationRule

Sys.Mvc.$create_JsonValidationRule = function Sys_Mvc_JsonValidationRule() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.ValidationContext

Sys.Mvc.$create_ValidationContext = function Sys_Mvc_ValidationContext() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.NumberValidator

Sys.Mvc.NumberValidator = function Sys_Mvc_NumberValidator() {
}
Sys.Mvc.NumberValidator.create = function Sys_Mvc_NumberValidator$create(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    return Function.createDelegate(new Sys.Mvc.NumberValidator(), new Sys.Mvc.NumberValidator().validate);
}
Sys.Mvc.NumberValidator.prototype = {
    
    validate: function Sys_Mvc_NumberValidator$validate(value, context) {
        /// <param name="value" type="String">
        /// </param>
        /// <param name="context" type="Sys.Mvc.ValidationContext">
        /// </param>
        /// <returns type="Object"></returns>
        if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(value)) {
            return true;
        }
        var n = Number.parseLocale(value);
        return (!isNaN(n));
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.FormContext

Sys.Mvc.FormContext = function Sys_Mvc_FormContext(formElement, validationSummaryElement) {
    /// <param name="formElement" type="Object" domElement="true">
    /// </param>
    /// <param name="validationSummaryElement" type="Object" domElement="true">
    /// </param>
    /// <field name="_validationSummaryErrorCss" type="String" static="true">
    /// </field>
    /// <field name="_validationSummaryValidCss" type="String" static="true">
    /// </field>
    /// <field name="_formValidationTag" type="String" static="true">
    /// </field>
    /// <field name="_onClickHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_onSubmitHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_errors" type="Array">
    /// </field>
    /// <field name="_submitButtonClicked" type="Object" domElement="true">
    /// </field>
    /// <field name="_validationSummaryElement" type="Object" domElement="true">
    /// </field>
    /// <field name="_validationSummaryULElement" type="Object" domElement="true">
    /// </field>
    /// <field name="fields" type="Array" elementType="FieldContext">
    /// </field>
    /// <field name="_formElement" type="Object" domElement="true">
    /// </field>
    /// <field name="replaceValidationSummary" type="Boolean">
    /// </field>
    this._errors = [];
    this.fields = new Array(0);
    this._formElement = formElement;
    this._validationSummaryElement = validationSummaryElement;
    formElement[Sys.Mvc.FormContext._formValidationTag] = this;
    if (validationSummaryElement) {
        var ulElements = validationSummaryElement.getElementsByTagName('ul');
        if (ulElements.length > 0) {
            this._validationSummaryULElement = ulElements[0];
        }
    }
    this._onClickHandler = Function.createDelegate(this, this._form_OnClick);
    this._onSubmitHandler = Function.createDelegate(this, this._form_OnSubmit);
}
Sys.Mvc.FormContext._Application_Load = function Sys_Mvc_FormContext$_Application_Load() {
    var allFormOptions = window.mvcClientValidationMetadata;
    if (allFormOptions) {
        while (allFormOptions.length > 0) {
            var thisFormOptions = allFormOptions.pop();
            Sys.Mvc.FormContext._parseJsonOptions(thisFormOptions);
        }
    }
}
Sys.Mvc.FormContext._getFormElementsWithName = function Sys_Mvc_FormContext$_getFormElementsWithName(formElement, name) {
    /// <param name="formElement" type="Object" domElement="true">
    /// </param>
    /// <param name="name" type="String">
    /// </param>
    /// <returns type="Array" elementType="Object" elementDomElement="true"></returns>
    var allElementsWithNameInForm = [];
    var allElementsWithName = document.getElementsByName(name);
    for (var i = 0; i < allElementsWithName.length; i++) {
        var thisElement = allElementsWithName[i];
        if (Sys.Mvc.FormContext._isElementInHierarchy(formElement, thisElement)) {
            Array.add(allElementsWithNameInForm, thisElement);
        }
    }
    return allElementsWithNameInForm;
}
Sys.Mvc.FormContext.getValidationForForm = function Sys_Mvc_FormContext$getValidationForForm(formElement) {
    /// <param name="formElement" type="Object" domElement="true">
    /// </param>
    /// <returns type="Sys.Mvc.FormContext"></returns>
    return formElement[Sys.Mvc.FormContext._formValidationTag];
}
Sys.Mvc.FormContext._isElementInHierarchy = function Sys_Mvc_FormContext$_isElementInHierarchy(parent, child) {
    /// <param name="parent" type="Object" domElement="true">
    /// </param>
    /// <param name="child" type="Object" domElement="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    while (child) {
        if (parent === child) {
            return true;
        }
        child = child.parentNode;
    }
    return false;
}
Sys.Mvc.FormContext._parseJsonOptions = function Sys_Mvc_FormContext$_parseJsonOptions(options) {
    /// <param name="options" type="Sys.Mvc.JsonValidationOptions">
    /// </param>
    /// <returns type="Sys.Mvc.FormContext"></returns>
    var formElement = $get(options.FormId);
    var validationSummaryElement = (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(options.ValidationSummaryId)) ? $get(options.ValidationSummaryId) : null;
    var formContext = new Sys.Mvc.FormContext(formElement, validationSummaryElement);
    formContext.enableDynamicValidation();
    formContext.replaceValidationSummary = options.ReplaceValidationSummary;
    for (var i = 0; i < options.Fields.length; i++) {
        var field = options.Fields[i];
        var fieldElements = Sys.Mvc.FormContext._getFormElementsWithName(formElement, field.FieldName);
        var validationMessageElement = (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(field.ValidationMessageId)) ? $get(field.ValidationMessageId) : null;
        var fieldContext = new Sys.Mvc.FieldContext(formContext);
        Array.addRange(fieldContext.elements, fieldElements);
        fieldContext.validationMessageElement = validationMessageElement;
        fieldContext.replaceValidationMessageContents = field.ReplaceValidationMessageContents;
        for (var j = 0; j < field.ValidationRules.length; j++) {
            var rule = field.ValidationRules[j];
            var validator = Sys.Mvc.ValidatorRegistry.getValidator(rule);
            if (validator) {
                var validation = Sys.Mvc.$create_Validation();
                validation.fieldErrorMessage = rule.ErrorMessage;
                validation.validator = validator;
                Array.add(fieldContext.validations, validation);
            }
        }
        fieldContext.enableDynamicValidation();
        Array.add(formContext.fields, fieldContext);
    }
    var registeredValidatorCallbacks = formElement.validationCallbacks;
    if (!registeredValidatorCallbacks) {
        registeredValidatorCallbacks = [];
        formElement.validationCallbacks = registeredValidatorCallbacks;
    }
    registeredValidatorCallbacks.push(Function.createDelegate(null, function() {
        return Sys.Mvc._validationUtil.arrayIsNullOrEmpty(formContext.validate('submit'));
    }));
    return formContext;
}
Sys.Mvc.FormContext.prototype = {
    _onClickHandler: null,
    _onSubmitHandler: null,
    _submitButtonClicked: null,
    _validationSummaryElement: null,
    _validationSummaryULElement: null,
    _formElement: null,
    replaceValidationSummary: false,
    
    addError: function Sys_Mvc_FormContext$addError(message) {
        /// <param name="message" type="String">
        /// </param>
        this.addErrors([ message ]);
    },
    
    addErrors: function Sys_Mvc_FormContext$addErrors(messages) {
        /// <param name="messages" type="Array" elementType="String">
        /// </param>
        if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(messages)) {
            Array.addRange(this._errors, messages);
            this._onErrorCountChanged();
        }
    },
    
    clearErrors: function Sys_Mvc_FormContext$clearErrors() {
        Array.clear(this._errors);
        this._onErrorCountChanged();
    },
    
    _displayError: function Sys_Mvc_FormContext$_displayError() {
        if (this._validationSummaryElement) {
            if (this._validationSummaryULElement) {
                Sys.Mvc._validationUtil.removeAllChildren(this._validationSummaryULElement);
                for (var i = 0; i < this._errors.length; i++) {
                    var liElement = document.createElement('li');
                    Sys.Mvc._validationUtil.setInnerText(liElement, this._errors[i]);
                    this._validationSummaryULElement.appendChild(liElement);
                }
            }
            Sys.UI.DomElement.removeCssClass(this._validationSummaryElement, Sys.Mvc.FormContext._validationSummaryValidCss);
            Sys.UI.DomElement.addCssClass(this._validationSummaryElement, Sys.Mvc.FormContext._validationSummaryErrorCss);
        }
    },
    
    _displaySuccess: function Sys_Mvc_FormContext$_displaySuccess() {
        var validationSummaryElement = this._validationSummaryElement;
        if (validationSummaryElement) {
            var validationSummaryULElement = this._validationSummaryULElement;
            if (validationSummaryULElement) {
                validationSummaryULElement.innerHTML = '';
            }
            Sys.UI.DomElement.removeCssClass(validationSummaryElement, Sys.Mvc.FormContext._validationSummaryErrorCss);
            Sys.UI.DomElement.addCssClass(validationSummaryElement, Sys.Mvc.FormContext._validationSummaryValidCss);
        }
    },
    
    enableDynamicValidation: function Sys_Mvc_FormContext$enableDynamicValidation() {
        Sys.UI.DomEvent.addHandler(this._formElement, 'click', this._onClickHandler);
        Sys.UI.DomEvent.addHandler(this._formElement, 'submit', this._onSubmitHandler);
    },
    
    _findSubmitButton: function Sys_Mvc_FormContext$_findSubmitButton(element) {
        /// <param name="element" type="Object" domElement="true">
        /// </param>
        /// <returns type="Object" domElement="true"></returns>
        if (element.disabled) {
            return null;
        }
        var tagName = element.tagName.toUpperCase();
        var inputElement = element;
        if (tagName === 'INPUT') {
            var type = inputElement.type;
            if (type === 'submit' || type === 'image') {
                return inputElement;
            }
        }
        else if ((tagName === 'BUTTON') && (inputElement.type === 'submit')) {
            return inputElement;
        }
        return null;
    },
    
    _form_OnClick: function Sys_Mvc_FormContext$_form_OnClick(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        this._submitButtonClicked = this._findSubmitButton(e.target);
    },
    
    _form_OnSubmit: function Sys_Mvc_FormContext$_form_OnSubmit(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        var form = e.target;
        var submitButton = this._submitButtonClicked;
        if (submitButton && submitButton.disableValidation) {
            return;
        }
        var errorMessages = this.validate('submit');
        if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(errorMessages)) {
            e.preventDefault();
        }
    },
    
    _onErrorCountChanged: function Sys_Mvc_FormContext$_onErrorCountChanged() {
        if (!this._errors.length) {
            this._displaySuccess();
        }
        else {
            this._displayError();
        }
    },
    
    validate: function Sys_Mvc_FormContext$validate(eventName) {
        /// <param name="eventName" type="String">
        /// </param>
        /// <returns type="Array" elementType="String"></returns>
        var fields = this.fields;
        var errors = [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!field.elements[0].disabled) {
                var thisErrors = field.validate(eventName);
                if (thisErrors) {
                    Array.addRange(errors, thisErrors);
                }
            }
        }
        if (this.replaceValidationSummary) {
            this.clearErrors();
            this.addErrors(errors);
        }
        return errors;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.FieldContext

Sys.Mvc.FieldContext = function Sys_Mvc_FieldContext(formContext) {
    /// <param name="formContext" type="Sys.Mvc.FormContext">
    /// </param>
    /// <field name="_hasTextChangedTag" type="String" static="true">
    /// </field>
    /// <field name="_hasValidationFiredTag" type="String" static="true">
    /// </field>
    /// <field name="_inputElementErrorCss" type="String" static="true">
    /// </field>
    /// <field name="_inputElementValidCss" type="String" static="true">
    /// </field>
    /// <field name="_validationMessageErrorCss" type="String" static="true">
    /// </field>
    /// <field name="_validationMessageValidCss" type="String" static="true">
    /// </field>
    /// <field name="_onBlurHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_onChangeHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_onInputHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_onPropertyChangeHandler" type="Sys.UI.DomEventHandler">
    /// </field>
    /// <field name="_errors" type="Array">
    /// </field>
    /// <field name="defaultErrorMessage" type="String">
    /// </field>
    /// <field name="elements" type="Array" elementType="Object" elementDomElement="true">
    /// </field>
    /// <field name="formContext" type="Sys.Mvc.FormContext">
    /// </field>
    /// <field name="replaceValidationMessageContents" type="Boolean">
    /// </field>
    /// <field name="validationMessageElement" type="Object" domElement="true">
    /// </field>
    /// <field name="validations" type="Array" elementType="Validation">
    /// </field>
    this._errors = [];
    this.elements = new Array(0);
    this.validations = new Array(0);
    this.formContext = formContext;
    this._onBlurHandler = Function.createDelegate(this, this._element_OnBlur);
    this._onChangeHandler = Function.createDelegate(this, this._element_OnChange);
    this._onInputHandler = Function.createDelegate(this, this._element_OnInput);
    this._onPropertyChangeHandler = Function.createDelegate(this, this._element_OnPropertyChange);
}
Sys.Mvc.FieldContext.prototype = {
    _onBlurHandler: null,
    _onChangeHandler: null,
    _onInputHandler: null,
    _onPropertyChangeHandler: null,
    defaultErrorMessage: null,
    formContext: null,
    replaceValidationMessageContents: false,
    validationMessageElement: null,
    
    addError: function Sys_Mvc_FieldContext$addError(message) {
        /// <param name="message" type="String">
        /// </param>
        this.addErrors([ message ]);
    },
    
    addErrors: function Sys_Mvc_FieldContext$addErrors(messages) {
        /// <param name="messages" type="Array" elementType="String">
        /// </param>
        if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(messages)) {
            Array.addRange(this._errors, messages);
            this._onErrorCountChanged();
        }
    },
    
    clearErrors: function Sys_Mvc_FieldContext$clearErrors() {
        Array.clear(this._errors);
        this._onErrorCountChanged();
    },
    
    _displayError: function Sys_Mvc_FieldContext$_displayError() {
        var validationMessageElement = this.validationMessageElement;
        if (validationMessageElement) {
            if (this.replaceValidationMessageContents) {
                Sys.Mvc._validationUtil.setInnerText(validationMessageElement, this._errors[0]);
            }
            Sys.UI.DomElement.removeCssClass(validationMessageElement, Sys.Mvc.FieldContext._validationMessageValidCss);
            Sys.UI.DomElement.addCssClass(validationMessageElement, Sys.Mvc.FieldContext._validationMessageErrorCss);
        }
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            Sys.UI.DomElement.removeCssClass(element, Sys.Mvc.FieldContext._inputElementValidCss);
            Sys.UI.DomElement.addCssClass(element, Sys.Mvc.FieldContext._inputElementErrorCss);
        }
    },
    
    _displaySuccess: function Sys_Mvc_FieldContext$_displaySuccess() {
        var validationMessageElement = this.validationMessageElement;
        if (validationMessageElement) {
            if (this.replaceValidationMessageContents) {
                Sys.Mvc._validationUtil.setInnerText(validationMessageElement, '');
            }
            Sys.UI.DomElement.removeCssClass(validationMessageElement, Sys.Mvc.FieldContext._validationMessageErrorCss);
            Sys.UI.DomElement.addCssClass(validationMessageElement, Sys.Mvc.FieldContext._validationMessageValidCss);
        }
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            Sys.UI.DomElement.removeCssClass(element, Sys.Mvc.FieldContext._inputElementErrorCss);
            Sys.UI.DomElement.addCssClass(element, Sys.Mvc.FieldContext._inputElementValidCss);
        }
    },
    
    _element_OnBlur: function Sys_Mvc_FieldContext$_element_OnBlur(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        if (e.target[Sys.Mvc.FieldContext._hasTextChangedTag] || e.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) {
            this.validate('blur');
        }
    },
    
    _element_OnChange: function Sys_Mvc_FieldContext$_element_OnChange(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        e.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true;
    },
    
    _element_OnInput: function Sys_Mvc_FieldContext$_element_OnInput(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        e.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true;
        if (e.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) {
            this.validate('input');
        }
    },
    
    _element_OnPropertyChange: function Sys_Mvc_FieldContext$_element_OnPropertyChange(e) {
        /// <param name="e" type="Sys.UI.DomEvent">
        /// </param>
        if (e.rawEvent.propertyName === 'value') {
            e.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true;
            if (e.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) {
                this.validate('input');
            }
        }
    },
    
    enableDynamicValidation: function Sys_Mvc_FieldContext$enableDynamicValidation() {
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (Sys.Mvc._validationUtil.elementSupportsEvent(element, 'onpropertychange')) {
                var compatMode = document.documentMode;
                if (compatMode && compatMode >= 8) {
                    Sys.UI.DomEvent.addHandler(element, 'propertychange', this._onPropertyChangeHandler);
                }
            }
            else {
                Sys.UI.DomEvent.addHandler(element, 'input', this._onInputHandler);
            }
            Sys.UI.DomEvent.addHandler(element, 'change', this._onChangeHandler);
            Sys.UI.DomEvent.addHandler(element, 'blur', this._onBlurHandler);
        }
    },
    
    _getErrorString: function Sys_Mvc_FieldContext$_getErrorString(validatorReturnValue, fieldErrorMessage) {
        /// <param name="validatorReturnValue" type="Object">
        /// </param>
        /// <param name="fieldErrorMessage" type="String">
        /// </param>
        /// <returns type="String"></returns>
        var fallbackErrorMessage = fieldErrorMessage || this.defaultErrorMessage;
        if (Boolean.isInstanceOfType(validatorReturnValue)) {
            return (validatorReturnValue) ? null : fallbackErrorMessage;
        }
        if (String.isInstanceOfType(validatorReturnValue)) {
            return ((validatorReturnValue).length) ? validatorReturnValue : fallbackErrorMessage;
        }
        return null;
    },
    
    _getStringValue: function Sys_Mvc_FieldContext$_getStringValue() {
        /// <returns type="String"></returns>
        var elements = this.elements;
        return (elements.length > 0) ? elements[0].value : null;
    },
    
    _markValidationFired: function Sys_Mvc_FieldContext$_markValidationFired() {
        var elements = this.elements;
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element[Sys.Mvc.FieldContext._hasValidationFiredTag] = true;
        }
    },
    
    _onErrorCountChanged: function Sys_Mvc_FieldContext$_onErrorCountChanged() {
        if (!this._errors.length) {
            this._displaySuccess();
        }
        else {
            this._displayError();
        }
    },
    
    validate: function Sys_Mvc_FieldContext$validate(eventName) {
        /// <param name="eventName" type="String">
        /// </param>
        /// <returns type="Array" elementType="String"></returns>
        var validations = this.validations;
        var errors = [];
        var value = this._getStringValue();
        for (var i = 0; i < validations.length; i++) {
            var validation = validations[i];
            var context = Sys.Mvc.$create_ValidationContext();
            context.eventName = eventName;
            context.fieldContext = this;
            context.validation = validation;
            var retVal = validation.validator(value, context);
            var errorMessage = this._getErrorString(retVal, validation.fieldErrorMessage);
            if (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(errorMessage)) {
                Array.add(errors, errorMessage);
            }
        }
        this._markValidationFired();
        this.clearErrors();
        this.addErrors(errors);
        return errors;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.RangeValidator

Sys.Mvc.RangeValidator = function Sys_Mvc_RangeValidator(minimum, maximum) {
    /// <param name="minimum" type="Number">
    /// </param>
    /// <param name="maximum" type="Number">
    /// </param>
    /// <field name="_minimum" type="Number">
    /// </field>
    /// <field name="_maximum" type="Number">
    /// </field>
    this._minimum = minimum;
    this._maximum = maximum;
}
Sys.Mvc.RangeValidator.create = function Sys_Mvc_RangeValidator$create(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    var min = rule.ValidationParameters['min'];
    var max = rule.ValidationParameters['max'];
    return Function.createDelegate(new Sys.Mvc.RangeValidator(min, max), new Sys.Mvc.RangeValidator(min, max).validate);
}
Sys.Mvc.RangeValidator.prototype = {
    _minimum: null,
    _maximum: null,
    
    validate: function Sys_Mvc_RangeValidator$validate(value, context) {
        /// <param name="value" type="String">
        /// </param>
        /// <param name="context" type="Sys.Mvc.ValidationContext">
        /// </param>
        /// <returns type="Object"></returns>
        if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(value)) {
            return true;
        }
        var n = Number.parseLocale(value);
        return (!isNaN(n) && this._minimum <= n && n <= this._maximum);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.RegularExpressionValidator

Sys.Mvc.RegularExpressionValidator = function Sys_Mvc_RegularExpressionValidator(pattern) {
    /// <param name="pattern" type="String">
    /// </param>
    /// <field name="_pattern" type="String">
    /// </field>
    this._pattern = pattern;
}
Sys.Mvc.RegularExpressionValidator.create = function Sys_Mvc_RegularExpressionValidator$create(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    var pattern = rule.ValidationParameters['pattern'];
    return Function.createDelegate(new Sys.Mvc.RegularExpressionValidator(pattern), new Sys.Mvc.RegularExpressionValidator(pattern).validate);
}
Sys.Mvc.RegularExpressionValidator.prototype = {
    _pattern: null,
    
    validate: function Sys_Mvc_RegularExpressionValidator$validate(value, context) {
        /// <param name="value" type="String">
        /// </param>
        /// <param name="context" type="Sys.Mvc.ValidationContext">
        /// </param>
        /// <returns type="Object"></returns>
        if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(value)) {
            return true;
        }
        var regExp = new RegExp(this._pattern);
        var matches = regExp.exec(value);
        return (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(matches) && matches[0].length === value.length);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.RequiredValidator

Sys.Mvc.RequiredValidator = function Sys_Mvc_RequiredValidator() {
}
Sys.Mvc.RequiredValidator.create = function Sys_Mvc_RequiredValidator$create(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    return Function.createDelegate(new Sys.Mvc.RequiredValidator(), new Sys.Mvc.RequiredValidator().validate);
}
Sys.Mvc.RequiredValidator._isRadioInputElement = function Sys_Mvc_RequiredValidator$_isRadioInputElement(element) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    if (element.tagName.toUpperCase() === 'INPUT') {
        var inputType = (element.type).toUpperCase();
        if (inputType === 'RADIO') {
            return true;
        }
    }
    return false;
}
Sys.Mvc.RequiredValidator._isSelectInputElement = function Sys_Mvc_RequiredValidator$_isSelectInputElement(element) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    if (element.tagName.toUpperCase() === 'SELECT') {
        return true;
    }
    return false;
}
Sys.Mvc.RequiredValidator._isTextualInputElement = function Sys_Mvc_RequiredValidator$_isTextualInputElement(element) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    if (element.tagName.toUpperCase() === 'INPUT') {
        var inputType = (element.type).toUpperCase();
        switch (inputType) {
            case 'TEXT':
            case 'PASSWORD':
            case 'FILE':
                return true;
        }
    }
    if (element.tagName.toUpperCase() === 'TEXTAREA') {
        return true;
    }
    return false;
}
Sys.Mvc.RequiredValidator._validateRadioInput = function Sys_Mvc_RequiredValidator$_validateRadioInput(elements) {
    /// <param name="elements" type="Array" elementType="Object" elementDomElement="true">
    /// </param>
    /// <returns type="Object"></returns>
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.checked) {
            return true;
        }
    }
    return false;
}
Sys.Mvc.RequiredValidator._validateSelectInput = function Sys_Mvc_RequiredValidator$_validateSelectInput(optionElements) {
    /// <param name="optionElements" type="DOMElementCollection">
    /// </param>
    /// <returns type="Object"></returns>
    for (var i = 0; i < optionElements.length; i++) {
        var element = optionElements[i];
        if (element.selected) {
            if (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(element.value)) {
                return true;
            }
        }
    }
    return false;
}
Sys.Mvc.RequiredValidator._validateTextualInput = function Sys_Mvc_RequiredValidator$_validateTextualInput(element) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <returns type="Object"></returns>
    return (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(element.value));
}
Sys.Mvc.RequiredValidator.prototype = {
    
    validate: function Sys_Mvc_RequiredValidator$validate(value, context) {
        /// <param name="value" type="String">
        /// </param>
        /// <param name="context" type="Sys.Mvc.ValidationContext">
        /// </param>
        /// <returns type="Object"></returns>
        var elements = context.fieldContext.elements;
        if (!elements.length) {
            return true;
        }
        var sampleElement = elements[0];
        if (Sys.Mvc.RequiredValidator._isTextualInputElement(sampleElement)) {
            return Sys.Mvc.RequiredValidator._validateTextualInput(sampleElement);
        }
        if (Sys.Mvc.RequiredValidator._isRadioInputElement(sampleElement)) {
            return Sys.Mvc.RequiredValidator._validateRadioInput(elements);
        }
        if (Sys.Mvc.RequiredValidator._isSelectInputElement(sampleElement)) {
            return Sys.Mvc.RequiredValidator._validateSelectInput((sampleElement).options);
        }
        return true;
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.StringLengthValidator

Sys.Mvc.StringLengthValidator = function Sys_Mvc_StringLengthValidator(minLength, maxLength) {
    /// <param name="minLength" type="Number" integer="true">
    /// </param>
    /// <param name="maxLength" type="Number" integer="true">
    /// </param>
    /// <field name="_maxLength" type="Number" integer="true">
    /// </field>
    /// <field name="_minLength" type="Number" integer="true">
    /// </field>
    this._minLength = minLength;
    this._maxLength = maxLength;
}
Sys.Mvc.StringLengthValidator.create = function Sys_Mvc_StringLengthValidator$create(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    var minLength = (rule.ValidationParameters['min'] || 0);
    var maxLength = (rule.ValidationParameters['max'] || Number.MAX_VALUE);
    return Function.createDelegate(new Sys.Mvc.StringLengthValidator(minLength, maxLength), new Sys.Mvc.StringLengthValidator(minLength, maxLength).validate);
}
Sys.Mvc.StringLengthValidator.prototype = {
    _maxLength: 0,
    _minLength: 0,
    
    validate: function Sys_Mvc_StringLengthValidator$validate(value, context) {
        /// <param name="value" type="String">
        /// </param>
        /// <param name="context" type="Sys.Mvc.ValidationContext">
        /// </param>
        /// <returns type="Object"></returns>
        if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(value)) {
            return true;
        }
        return (this._minLength <= value.length && value.length <= this._maxLength);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc._validationUtil

Sys.Mvc._validationUtil = function Sys_Mvc__validationUtil() {
}
Sys.Mvc._validationUtil.arrayIsNullOrEmpty = function Sys_Mvc__validationUtil$arrayIsNullOrEmpty(array) {
    /// <param name="array" type="Array" elementType="Object">
    /// </param>
    /// <returns type="Boolean"></returns>
    return (!array || !array.length);
}
Sys.Mvc._validationUtil.stringIsNullOrEmpty = function Sys_Mvc__validationUtil$stringIsNullOrEmpty(value) {
    /// <param name="value" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    return (!value || !value.length);
}
Sys.Mvc._validationUtil.elementSupportsEvent = function Sys_Mvc__validationUtil$elementSupportsEvent(element, eventAttributeName) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <param name="eventAttributeName" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    return (eventAttributeName in element);
}
Sys.Mvc._validationUtil.removeAllChildren = function Sys_Mvc__validationUtil$removeAllChildren(element) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
Sys.Mvc._validationUtil.setInnerText = function Sys_Mvc__validationUtil$setInnerText(element, innerText) {
    /// <param name="element" type="Object" domElement="true">
    /// </param>
    /// <param name="innerText" type="String">
    /// </param>
    var textNode = document.createTextNode(innerText);
    Sys.Mvc._validationUtil.removeAllChildren(element);
    element.appendChild(textNode);
}


////////////////////////////////////////////////////////////////////////////////
// Sys.Mvc.ValidatorRegistry

Sys.Mvc.ValidatorRegistry = function Sys_Mvc_ValidatorRegistry() {
    /// <field name="validators" type="Object" static="true">
    /// </field>
}
Sys.Mvc.ValidatorRegistry.getValidator = function Sys_Mvc_ValidatorRegistry$getValidator(rule) {
    /// <param name="rule" type="Sys.Mvc.JsonValidationRule">
    /// </param>
    /// <returns type="Sys.Mvc.Validator"></returns>
    var creator = Sys.Mvc.ValidatorRegistry.validators[rule.ValidationType];
    return (creator) ? creator(rule) : null;
}
Sys.Mvc.ValidatorRegistry._getDefaultValidators = function Sys_Mvc_ValidatorRegistry$_getDefaultValidators() {
    /// <returns type="Object"></returns>
    return { required: Function.createDelegate(null, Sys.Mvc.RequiredValidator.create), length: Function.createDelegate(null, Sys.Mvc.StringLengthValidator.create), regex: Function.createDelegate(null, Sys.Mvc.RegularExpressionValidator.create), range: Function.createDelegate(null, Sys.Mvc.RangeValidator.create), number: Function.createDelegate(null, Sys.Mvc.NumberValidator.create) };
}


Sys.Mvc.NumberValidator.registerClass('Sys.Mvc.NumberValidator');
Sys.Mvc.FormContext.registerClass('Sys.Mvc.FormContext');
Sys.Mvc.FieldContext.registerClass('Sys.Mvc.FieldContext');
Sys.Mvc.RangeValidator.registerClass('Sys.Mvc.RangeValidator');
Sys.Mvc.RegularExpressionValidator.registerClass('Sys.Mvc.RegularExpressionValidator');
Sys.Mvc.RequiredValidator.registerClass('Sys.Mvc.RequiredValidator');
Sys.Mvc.StringLengthValidator.registerClass('Sys.Mvc.StringLengthValidator');
Sys.Mvc._validationUtil.registerClass('Sys.Mvc._validationUtil');
Sys.Mvc.ValidatorRegistry.registerClass('Sys.Mvc.ValidatorRegistry');
Sys.Mvc.FormContext._validationSummaryErrorCss = 'validation-summary-errors';
Sys.Mvc.FormContext._validationSummaryValidCss = 'validation-summary-valid';
Sys.Mvc.FormContext._formValidationTag = '__MVC_FormValidation';
Sys.Mvc.FieldContext._hasTextChangedTag = '__MVC_HasTextChanged';
Sys.Mvc.FieldContext._hasValidationFiredTag = '__MVC_HasValidationFired';
Sys.Mvc.FieldContext._inputElementErrorCss = 'input-validation-error';
Sys.Mvc.FieldContext._inputElementValidCss = 'input-validation-valid';
Sys.Mvc.FieldContext._validationMessageErrorCss = 'field-validation-error';
Sys.Mvc.FieldContext._validationMessageValidCss = 'field-validation-valid';
Sys.Mvc.ValidatorRegistry.validators = Sys.Mvc.ValidatorRegistry._getDefaultValidators();

// ---- Do not remove this footer ----
// Generated using Script# v0.5.0.0 (http://projects.nikhilk.net)
// -----------------------------------

// register validation
Sys.Application.add_load(function() {
  Sys.Application.remove_load(arguments.callee);
  Sys.Mvc.FormContext._Application_Load();
});

// SIG // Begin signature block
// SIG // MIIaaAYJKoZIhvcNAQcCoIIaWTCCGlUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFLsEbSagjEKD
// SIG // CH6ZbOpJj2mF1dSooIIVLzCCBJkwggOBoAMCAQICEzMA
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
// SIG // 9w0BCQQxFgQUXukeLXBab8BObKjF9mv8Ck5Wr/gwXgYK
// SIG // KwYBBAGCNwIBDDFQME6gJoAkAE0AaQBjAHIAbwBzAG8A
// SIG // ZgB0ACAATABlAGEAcgBuAGkAbgBnoSSAImh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9sZWFybmluZyAwDQYJKoZI
// SIG // hvcNAQEBBQAEggEAQQSd1f2VQEOuOdBKLSenWq/fGpS5
// SIG // dnyqFttVLzUXovMjOCDAXPEk3a4ACEAEFdKX/KF+y7o/
// SIG // IH+R0WfxwcRq7t6iBzN+7TtLYS/Kjt8gPi3y2H0inVDr
// SIG // 05Mys+gUnIZmrURjTfBgQCcBcNI72g1zhxik9TLq5uXx
// SIG // qhwMBXnAjQ6oMZhziJDHE3bTpzPLBcqf0QcbP89a989A
// SIG // TxgDY2wnJW26wg5DAjEHYpEK2q3EMACyWgG7FJGAGACd
// SIG // KwQoPCxL2TncTEwydiMkotstkoOjrCJvrh7t6EmJEO/N
// SIG // G6QPZVnlZBeLTwkNUZ4DXaJ2i65es4KWBIvrz3BOcaWs
// SIG // 41IoIKGCAigwggIkBgkqhkiG9w0BCQYxggIVMIICEQIB
// SIG // ATCBjjB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQD
// SIG // ExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECEzMAAAAr
// SIG // OTJIwbLJSPMAAAAAACswCQYFKw4DAhoFAKBdMBgGCSqG
// SIG // SIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkF
// SIG // MQ8XDTEzMDEyMTIyMTYyOVowIwYJKoZIhvcNAQkEMRYE
// SIG // FG9ggnWpsqZWpa0pLrTZjMZYFWQpMA0GCSqGSIb3DQEB
// SIG // BQUABIIBAD5qaMTQ0G8iHlrAiU9DIJXr6w5qG8IxQb+o
// SIG // XNt5gA1+Be6CAPXkbGoNE1F0H+ioe9VMr6I70hbyELQ0
// SIG // 7aPVfyPbFzzMv3m42fIrylwDZ38W88PA95He0DKJ4JvI
// SIG // gEYQlX3KEC6wnYDMd/tRy3LWBBXn2OkVR77Ho/GUG/AE
// SIG // fanoqLVyRKk5NRSD55WyPhFIrjYGhBsu61z/HZ2Ejuwd
// SIG // 3I9tP360rIfQnLW+YvwS7QruhjNu3Di/Drz0NZHb+Zur
// SIG // uVevOIlDiRpJ6WHv20T3py+Su6ZIu42mRP0QOS412i7B
// SIG // 0YVfMhIVdj5o217CcdxWIpsg0Y8ISy3g4ZbtA3Y2fWg=
// SIG // End signature block

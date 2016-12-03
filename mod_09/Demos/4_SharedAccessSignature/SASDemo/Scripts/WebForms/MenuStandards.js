//CdnPath=http://ajax.aspnetcdn.com/ajax/4.5/6/MenuStandards.js
if (!window.Sys) { window.Sys = {}; }
if (!Sys.WebForms) { Sys.WebForms = {}; }
Sys.WebForms.Menu = function(options) {
    this.items = [];
    this.depth = options.depth || 1;
    this.parentMenuItem = options.parentMenuItem;
    this.element = Sys.WebForms.Menu._domHelper.getElement(options.element);
    if (this.element.tagName === 'DIV') {
        var containerElement = this.element;
        this.element = Sys.WebForms.Menu._domHelper.firstChild(containerElement);
        this.element.tabIndex = options.tabIndex || 0;
        options.element = containerElement;
        options.menu = this;
        this.container = new Sys.WebForms._MenuContainer(options);
        Sys.WebForms.Menu._domHelper.setFloat(this.element, this.container.rightToLeft ? "right" : "left");
    }
    else {
        this.container = options.container;
        this.keyMap = options.keyMap;
    }
    Sys.WebForms.Menu._elementObjectMapper.map(this.element, this);
    if (this.parentMenuItem && this.parentMenuItem.parentMenu) {
        this.parentMenu = this.parentMenuItem.parentMenu;
        this.rootMenu = this.parentMenu.rootMenu;
        if (!this.element.id) {
            this.element.id = (this.container.element.id || 'menu') + ':submenu:' + Sys.WebForms.Menu._elementObjectMapper._computedId;
        }
        if (this.depth > this.container.staticDisplayLevels) {
            this.displayMode = "dynamic";
            this.element.style.display = "none";
            this.element.style.position = "absolute";
            if (this.rootMenu && this.container.orientation === 'horizontal' && this.parentMenu.isStatic()) {
                this.element.style.top = "100%";
                if (this.container.rightToLeft) {
                    this.element.style.right = "0px";
                }
                else {
                    this.element.style.left = "0px";
                }
            }
            else {
                this.element.style.top = "0px";
                if (this.container.rightToLeft) {
                    this.element.style.right = "100%";
                }
                else {
                    this.element.style.left = "100%";
                }
            }
            if (this.container.rightToLeft) {
                this.keyMap = Sys.WebForms.Menu._keyboardMapping.verticalRtl;
            }
            else {
                this.keyMap = Sys.WebForms.Menu._keyboardMapping.vertical;
            }
        }
        else {
            this.displayMode = "static";
            this.element.style.display = "block";
            if (this.container.orientation === 'horizontal') {
                Sys.WebForms.Menu._domHelper.setFloat(this.element, this.container.rightToLeft ? "right" : "left");
            }
        }
    }
    Sys.WebForms.Menu._domHelper.appendCssClass(this.element, this.displayMode);
    var children = this.element.childNodes;
    var count = children.length;
    for (var i = 0; i < count; i++) {
        var node = children[i];
        if (node.nodeType !== 1) {   
            continue;
        }
        var topLevelMenuItem = null;
        if (this.parentMenuItem) {
            topLevelMenuItem = this.parentMenuItem.topLevelMenuItem;
        }
        var menuItem = new Sys.WebForms.MenuItem(this, node, topLevelMenuItem);
        var previousMenuItem = this.items[this.items.length - 1];
        if (previousMenuItem) {
            menuItem.previousSibling = previousMenuItem;
            previousMenuItem.nextSibling = menuItem;
        }
        this.items[this.items.length] = menuItem;
    }
};
Sys.WebForms.Menu.prototype = {
    blur: function() { if (this.container) this.container.blur(); },
    collapse: function() {
        this.each(function(menuItem) {
            menuItem.hover(false);
            menuItem.blur();
            var childMenu = menuItem.childMenu;
            if (childMenu) {
                childMenu.collapse();
            }
        });
        this.hide();
    },
    doDispose: function() { this.each(function(item) { item.doDispose(); }); },
    each: function(fn) {
        var count = this.items.length;
        for (var i = 0; i < count; i++) {
            fn(this.items[i]);
        }
    },
    firstChild: function() { return this.items[0]; },
    focus: function() { if (this.container) this.container.focus(); },
    get_displayed: function() { return this.element.style.display !== 'none'; },
    get_focused: function() {
        if (this.container) {
            return this.container.focused;
        }
        return false;
    },
    handleKeyPress: function(keyCode) {
        if (this.keyMap.contains(keyCode)) {
            if (this.container.focusedMenuItem) {
                this.container.focusedMenuItem.navigate(keyCode);
                return;
            }
            var firstChild = this.firstChild();
            if (firstChild) {
                this.container.navigateTo(firstChild);
            }
        }
    },
    hide: function() {
        if (!this.get_displayed()) {
            return;
        }
        this.each(function(item) {
            if (item.childMenu) {
                item.childMenu.hide();
            }
        });
        if (!this.isRoot()) {
            if (this.get_focused()) {
                this.container.navigateTo(this.parentMenuItem);
            }
            this.element.style.display = 'none';
        }
    },
    isRoot: function() { return this.rootMenu === this; },
    isStatic: function() { return this.displayMode === 'static'; },
    lastChild: function() { return this.items[this.items.length - 1]; },
    show: function() { this.element.style.display = 'block'; }
};
if (Sys.WebForms.Menu.registerClass) {
    Sys.WebForms.Menu.registerClass('Sys.WebForms.Menu');
}
Sys.WebForms.MenuItem = function(parentMenu, listElement, topLevelMenuItem) {
    this.keyMap = parentMenu.keyMap;
    this.parentMenu = parentMenu;
    this.container = parentMenu.container;
    this.element = listElement;
    this.topLevelMenuItem = topLevelMenuItem || this;
    this._anchor = Sys.WebForms.Menu._domHelper.firstChild(listElement);
    while (this._anchor && this._anchor.tagName !== 'A') {
        this._anchor = Sys.WebForms.Menu._domHelper.nextSibling(this._anchor);
    }
    if (this._anchor) {
        this._anchor.tabIndex = -1;
        var subMenu = this._anchor;
        while (subMenu && subMenu.tagName !== 'UL') {
            subMenu = Sys.WebForms.Menu._domHelper.nextSibling(subMenu);
        }
        if (subMenu) {
            this.childMenu = new Sys.WebForms.Menu({ element: subMenu, parentMenuItem: this, depth: parentMenu.depth + 1, container: this.container, keyMap: this.keyMap });
            if (!this.childMenu.isStatic()) {
                Sys.WebForms.Menu._domHelper.appendCssClass(this.element, 'has-popup');
                Sys.WebForms.Menu._domHelper.appendAttributeValue(this.element, 'aria-haspopup', this.childMenu.element.id);
            }
        }
    }
    Sys.WebForms.Menu._elementObjectMapper.map(listElement, this);
    Sys.WebForms.Menu._domHelper.appendAttributeValue(listElement, 'role', 'menuitem');
    Sys.WebForms.Menu._domHelper.appendCssClass(listElement, parentMenu.displayMode);
    if (this._anchor) {
        Sys.WebForms.Menu._domHelper.appendCssClass(this._anchor, parentMenu.displayMode);
    }
    this.element.style.position = "relative";
    if (this.parentMenu.depth == 1 && this.container.orientation == 'horizontal') {
        Sys.WebForms.Menu._domHelper.setFloat(this.element, this.container.rightToLeft ? "right" : "left");
    }
    if (!this.container.disabled) {
        Sys.WebForms.Menu._domHelper.addEvent(this.element, 'mouseover', Sys.WebForms.MenuItem._onmouseover);
        Sys.WebForms.Menu._domHelper.addEvent(this.element, 'mouseout', Sys.WebForms.MenuItem._onmouseout);
    }
};
Sys.WebForms.MenuItem.prototype = {
    applyUp: function(fn, condition) {
        condition = condition || function(menuItem) { return menuItem; };
        var menuItem = this;
        var lastMenuItem = null;
        while (condition(menuItem)) {
            fn(menuItem);
            lastMenuItem = menuItem;
            menuItem = menuItem.parentMenu.parentMenuItem;
        }
        return lastMenuItem;
    },
    blur: function() { this.setTabIndex(-1); },
    doDispose: function() {
        Sys.WebForms.Menu._domHelper.removeEvent(this.element, 'mouseover', Sys.WebForms.MenuItem._onmouseover);
        Sys.WebForms.Menu._domHelper.removeEvent(this.element, 'mouseout', Sys.WebForms.MenuItem._onmouseout);
        if (this.childMenu) {
            this.childMenu.doDispose();
        }
    },
    focus: function() {
        if (!this.parentMenu.get_displayed()) {
            this.parentMenu.show();
        }
        this.setTabIndex(0);
        this.container.focused = true;
        this._anchor.focus();
    },
    get_highlighted: function() { return /(^|\s)highlighted(\s|$)/.test(this._anchor.className); },
    getTabIndex: function() { return this._anchor.tabIndex; },
    highlight: function(highlighting) {
        if (highlighting) {
            this.applyUp(function(menuItem) {
                menuItem.parentMenu.parentMenuItem.highlight(true);
            },
            function(menuItem) {
                return !menuItem.parentMenu.isStatic() && menuItem.parentMenu.parentMenuItem;
            }
        );
            Sys.WebForms.Menu._domHelper.appendCssClass(this._anchor, 'highlighted');
        }
        else {
            Sys.WebForms.Menu._domHelper.removeCssClass(this._anchor, 'highlighted');
            this.setTabIndex(-1);
        }
    },
    hover: function(hovering) {
        if (hovering) {
            var currentHoveredItem = this.container.hoveredMenuItem;
            if (currentHoveredItem) {
                currentHoveredItem.hover(false);
            }
            var currentFocusedItem = this.container.focusedMenuItem;
            if (currentFocusedItem && currentFocusedItem !== this) {
                currentFocusedItem.hover(false);
            }
            this.applyUp(function(menuItem) {
                if (menuItem.childMenu && !menuItem.childMenu.get_displayed()) {
                    menuItem.childMenu.show();
                }
            });
            this.container.hoveredMenuItem = this;
            this.highlight(true);
        }
        else {
            var menuItem = this;
            while (menuItem) {
                menuItem.highlight(false);
                if (menuItem.childMenu) {
                    if (!menuItem.childMenu.isStatic()) {
                        menuItem.childMenu.hide();
                    }
                }
                menuItem = menuItem.parentMenu.parentMenuItem;
            }
        }
    },
    isSiblingOf: function(menuItem) { return menuItem.parentMenu === this.parentMenu; },
    mouseout: function() {
        var menuItem = this,
            id = this.container.pendingMouseoutId,
            disappearAfter = this.container.disappearAfter;
        if (id) {
            window.clearTimeout(id);
        }
        if (disappearAfter > -1) {
            this.container.pendingMouseoutId =
                window.setTimeout(function() { menuItem.hover(false); }, disappearAfter);
        }
    },
    mouseover: function() {
        var id = this.container.pendingMouseoutId;
        if (id) {
            window.clearTimeout(id);
            this.container.pendingMouseoutId = null;
        }
        this.hover(true);
        if (this.container.menu.get_focused()) {
            this.container.navigateTo(this);
        }
    },
    navigate: function(keyCode) {
        switch (this.keyMap[keyCode]) {
            case this.keyMap.next:
                this.navigateNext();
                break;
            case this.keyMap.previous:
                this.navigatePrevious();
                break;
            case this.keyMap.child:
                this.navigateChild();
                break;
            case this.keyMap.parent:
                this.navigateParent();
                break;
            case this.keyMap.tab:
                this.navigateOut();
                break;
        }
    },
    navigateChild: function() {
        var subMenu = this.childMenu;
        if (subMenu) {
            var firstChild = subMenu.firstChild();
            if (firstChild) {
                this.container.navigateTo(firstChild);
            }
        }
        else {
            if (this.container.orientation === 'horizontal') {
                var nextItem = this.topLevelMenuItem.nextSibling || this.topLevelMenuItem.parentMenu.firstChild();
                if (nextItem == this.topLevelMenuItem) {
                    return;
                }
                this.topLevelMenuItem.childMenu.hide();
                this.container.navigateTo(nextItem);
                if (nextItem.childMenu) {
                    this.container.navigateTo(nextItem.childMenu.firstChild());
                }
            }
        }
    },
    navigateNext: function() {
        if (this.childMenu) {
            this.childMenu.hide();
        }
        var nextMenuItem = this.nextSibling;
        if (!nextMenuItem && this.parentMenu.isRoot()) {
            nextMenuItem = this.parentMenu.parentMenuItem;
            if (nextMenuItem) {
                nextMenuItem = nextMenuItem.nextSibling;
            }
        }
        if (!nextMenuItem) {
            nextMenuItem = this.parentMenu.firstChild();
        }
        if (nextMenuItem) {
            this.container.navigateTo(nextMenuItem);
        }
    },
    navigateOut: function() {
        this.parentMenu.blur();
    },
    navigateParent: function() {
        var parentMenu = this.parentMenu,
            horizontal = this.container.orientation === 'horizontal';
        if (!parentMenu) return;
        if (horizontal && this.childMenu && parentMenu.isRoot()) {
            this.navigateChild();
            return;
        }
        if (parentMenu.parentMenuItem && !parentMenu.isRoot()) {
            if (horizontal && this.parentMenu.depth === 2) {
                var previousItem = this.parentMenu.parentMenuItem.previousSibling;
                if (!previousItem) {
                    previousItem = this.parentMenu.rootMenu.lastChild();
                }
                this.topLevelMenuItem.childMenu.hide();
                this.container.navigateTo(previousItem);
                if (previousItem.childMenu) {
                    this.container.navigateTo(previousItem.childMenu.firstChild());
                }
            }
            else {
                this.parentMenu.hide();
            }
        }
    },
    navigatePrevious: function() {
        if (this.childMenu) {
            this.childMenu.hide();
        }
        var previousMenuItem = this.previousSibling;
        if (previousMenuItem) {
            var childMenu = previousMenuItem.childMenu;
            if (childMenu && childMenu.isRoot()) {
                previousMenuItem = childMenu.lastChild();
            }
        }
        if (!previousMenuItem && this.parentMenu.isRoot()) {
            previousMenuItem = this.parentMenu.parentMenuItem;
        }
        if (!previousMenuItem) {
            previousMenuItem = this.parentMenu.lastChild();
        }
        if (previousMenuItem) {
            this.container.navigateTo(previousMenuItem);
        }
    },
    setTabIndex: function(index) { if (this._anchor) this._anchor.tabIndex = index; }
};
Sys.WebForms.MenuItem._onmouseout = function(e) {
    var menuItem = Sys.WebForms.Menu._elementObjectMapper.getMappedObject(this);
    if (!menuItem) {
        return;
    }
    menuItem.mouseout();
    Sys.WebForms.Menu._domHelper.cancelEvent(e);
};
Sys.WebForms.MenuItem._onmouseover = function(e) {
    var menuItem = Sys.WebForms.Menu._elementObjectMapper.getMappedObject(this);
    if (!menuItem) {
        return;
    }
    menuItem.mouseover();
    Sys.WebForms.Menu._domHelper.cancelEvent(e);
};
Sys.WebForms.Menu._domHelper = {
    addEvent: function(element, eventName, fn, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(eventName, fn, !!useCapture);
        }
        else {
            element['on' + eventName] = fn;
        }
    },
    appendAttributeValue: function(element, name, value) {
        this.updateAttributeValue('append', element, name, value);
    },
    appendCssClass: function(element, value) {
        this.updateClassName('append', element, name, value);
    },
    appendString: function(getString, setString, value) {
        var currentValue = getString();
        if (!currentValue) {
            setString(value);
            return;
        }
        var regex = this._regexes.getRegex('(^| )' + value + '($| )');
        if (regex.test(currentValue)) {
            return;
        }
        setString(currentValue + ' ' + value);
    },
    cancelEvent: function(e) {
        var event = e || window.event;
        if (event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        }
    },
    contains: function(ancestor, descendant) {
        for (; descendant && (descendant !== ancestor); descendant = descendant.parentNode) { }
        return !!descendant;
    },
    firstChild: function(element) {
        var child = element.firstChild;
        if (child && child.nodeType !== 1) {   
            child = this.nextSibling(child);
        }
        return child;
    },
    getElement: function(elementOrId) { return typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId; },
    getElementDirection: function(element) {
        if (element) {
            if (element.dir) {
                return element.dir;
            }
            return this.getElementDirection(element.parentNode);
        }
        return "ltr";
    },
    getKeyCode: function(event) { return event.keyCode || event.charCode || 0; },
    insertAfter: function(element, elementToInsert) {
        var next = element.nextSibling;
        if (next) {
            element.parentNode.insertBefore(elementToInsert, next);
        }
        else if (element.parentNode) {
            element.parentNode.appendChild(elementToInsert);
        }
    },
    nextSibling: function(element) {
        var sibling = element.nextSibling;
        while (sibling) {
            if (sibling.nodeType === 1) {   
                return sibling;
            }
            sibling = sibling.nextSibling;
        }
    },
    removeAttributeValue: function(element, name, value) {
        this.updateAttributeValue('remove', element, name, value);
    },
    removeCssClass: function(element, value) {
        this.updateClassName('remove', element, name, value);
    },
    removeEvent: function(element, eventName, fn, useCapture) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, fn, !!useCapture);
        }
        else if (element.detachEvent) {
            element.detachEvent('on' + eventName, fn)
        }
        element['on' + eventName] = null;
    },
    removeString: function(getString, setString, valueToRemove) {
        var currentValue = getString();
        if (currentValue) {
            var regex = this._regexes.getRegex('(\\s|\\b)' + valueToRemove + '$|\\b' + valueToRemove + '\\s+');
            setString(currentValue.replace(regex, ''));
        }
    },
    setFloat: function(element, direction) {
        element.style.styleFloat = direction;
        element.style.cssFloat = direction;
    },
    updateAttributeValue: function(operation, element, name, value) {
        this[operation + 'String'](
                function() {
                    return element.getAttribute(name);
                },
                function(newValue) {
                    element.setAttribute(name, newValue);
                },
                value
            );
    },
    updateClassName: function(operation, element, name, value) {
        this[operation + 'String'](
                function() {
                    return element.className;
                },
                function(newValue) {
                    element.className = newValue;
                },
                value
            );
    },
    _regexes: {
        getRegex: function(pattern) {
            var regex = this[pattern];
            if (!regex) {
                this[pattern] = regex = new RegExp(pattern);
            }
            return regex;
        }
    }
};
Sys.WebForms.Menu._elementObjectMapper = {
    _computedId: 0,
    _mappings: {},
    _mappingIdName: 'Sys.WebForms.Menu.Mapping',
    getMappedObject: function(element) {
        var id = element[this._mappingIdName];
        if (id) {
            return this._mappings[this._mappingIdName + ':' + id];
        }
    },
    map: function(element, theObject) {
        var mappedObject = element[this._mappingIdName];
        if (mappedObject === theObject) {
            return;
        }
        var objectId = element[this._mappingIdName] || element.id || '%' + (++this._computedId); 
        element[this._mappingIdName] = objectId;
        this._mappings[this._mappingIdName + ':' + objectId] = theObject;
        theObject.mappingId = objectId;
    }
};
Sys.WebForms.Menu._keyboardMapping = new (function() {
    var LEFT_ARROW = 37;
    var UP_ARROW = 38;
    var RIGHT_ARROW = 39;
    var DOWN_ARROW = 40;
    var TAB = 9;
    var ESCAPE = 27;
    this.vertical = { next: 0, previous: 1, child: 2, parent: 3, tab: 4 };
    this.vertical[DOWN_ARROW] = this.vertical.next;
    this.vertical[UP_ARROW] = this.vertical.previous;
    this.vertical[RIGHT_ARROW] = this.vertical.child;
    this.vertical[LEFT_ARROW] = this.vertical.parent;
    this.vertical[TAB] = this.vertical[ESCAPE] = this.vertical.tab;
    this.verticalRtl = { next: 0, previous: 1, child: 2, parent: 3, tab: 4 };
    this.verticalRtl[DOWN_ARROW] = this.verticalRtl.next;
    this.verticalRtl[UP_ARROW] = this.verticalRtl.previous;
    this.verticalRtl[LEFT_ARROW] = this.verticalRtl.child;
    this.verticalRtl[RIGHT_ARROW] = this.verticalRtl.parent;
    this.verticalRtl[TAB] = this.verticalRtl[ESCAPE] = this.verticalRtl.tab;
    this.horizontal = { next: 0, previous: 1, child: 2, parent: 3, tab: 4 };
    this.horizontal[RIGHT_ARROW] = this.horizontal.next;
    this.horizontal[LEFT_ARROW] = this.horizontal.previous;
    this.horizontal[DOWN_ARROW] = this.horizontal.child;
    this.horizontal[UP_ARROW] = this.horizontal.parent;
    this.horizontal[TAB] = this.horizontal[ESCAPE] = this.horizontal.tab;
    this.horizontalRtl = { next: 0, previous: 1, child: 2, parent: 3, tab: 4 };
    this.horizontalRtl[RIGHT_ARROW] = this.horizontalRtl.previous;
    this.horizontalRtl[LEFT_ARROW] = this.horizontalRtl.next;
    this.horizontalRtl[DOWN_ARROW] = this.horizontalRtl.child;
    this.horizontalRtl[UP_ARROW] = this.horizontalRtl.parent;
    this.horizontalRtl[TAB] = this.horizontalRtl[ESCAPE] = this.horizontalRtl.tab;
    this.horizontal.contains = this.horizontalRtl.contains = this.vertical.contains = this.verticalRtl.contains = function(keycode) {
        return this[keycode] != null;
    };
})();
Sys.WebForms._MenuContainer = function(options) {
    this.focused = false;
    this.disabled = options.disabled;
    this.staticDisplayLevels = options.staticDisplayLevels || 1;
    this.element = options.element;
    this.orientation = options.orientation || 'vertical';
    this.disappearAfter = options.disappearAfter;
    this.rightToLeft = Sys.WebForms.Menu._domHelper.getElementDirection(this.element) === 'rtl';
    Sys.WebForms.Menu._elementObjectMapper.map(this.element, this);
    this.menu = options.menu;
    this.menu.rootMenu = this.menu;
    this.menu.displayMode = 'static';
    this.menu.element.style.position = 'relative';
    this.menu.element.style.width = 'auto';
    if (this.orientation === 'vertical') {
        Sys.WebForms.Menu._domHelper.appendAttributeValue(this.menu.element, 'role', 'menu');
        if (this.rightToLeft) {
            this.menu.keyMap = Sys.WebForms.Menu._keyboardMapping.verticalRtl;
        }
        else {
            this.menu.keyMap = Sys.WebForms.Menu._keyboardMapping.vertical;
        }
    }
    else {
        Sys.WebForms.Menu._domHelper.appendAttributeValue(this.menu.element, 'role', 'menubar');
        if (this.rightToLeft) {
            this.menu.keyMap = Sys.WebForms.Menu._keyboardMapping.horizontalRtl;
        }
        else {
            this.menu.keyMap = Sys.WebForms.Menu._keyboardMapping.horizontal;
        }
    }
    var floatBreak = document.createElement('div');
    floatBreak.style.clear = this.rightToLeft ? "right" : "left";
    this.element.appendChild(floatBreak);
    Sys.WebForms.Menu._domHelper.setFloat(this.element, this.rightToLeft ? "right" : "left");
    Sys.WebForms.Menu._domHelper.insertAfter(this.element, floatBreak);
    if (!this.disabled) {
        Sys.WebForms.Menu._domHelper.addEvent(this.menu.element, 'focus', this._onfocus, true);
        Sys.WebForms.Menu._domHelper.addEvent(this.menu.element, 'keydown', this._onkeydown);
        var menuContainer = this;
        this.element.dispose = function() {
            if (menuContainer.element.dispose) {
                menuContainer.element.dispose = null;
                Sys.WebForms.Menu._domHelper.removeEvent(menuContainer.menu.element, 'focus', menuContainer._onfocus, true);
                Sys.WebForms.Menu._domHelper.removeEvent(menuContainer.menu.element, 'keydown', menuContainer._onkeydown);
                menuContainer.menu.doDispose();
            }
        };
        Sys.WebForms.Menu._domHelper.addEvent(window, 'unload', function() {
            if (menuContainer.element.dispose) {
                menuContainer.element.dispose();
            }
        });
    }
};
Sys.WebForms._MenuContainer.prototype = {
    blur: function() {
        this.focused = false;
        this.isBlurring = false;
        this.menu.collapse();
        this.focusedMenuItem = null;
    },
    focus: function(e) { this.focused = true; },
    navigateTo: function(menuItem) {
        if (this.focusedMenuItem && this.focusedMenuItem !== this) {
            this.focusedMenuItem.highlight(false);
        }
        menuItem.highlight(true);
        menuItem.focus();
        this.focusedMenuItem = menuItem;
    },
    _onfocus: function(e) {
        var event = e || window.event;
        if (event.srcElement && this) {
            if (Sys.WebForms.Menu._domHelper.contains(this.element, event.srcElement)) {
                if (!this.focused) {
                    this.focus();
                }
            }
        }
    },
    _onkeydown: function(e) {
        var thisMenu = Sys.WebForms.Menu._elementObjectMapper.getMappedObject(this);
        var keyCode = Sys.WebForms.Menu._domHelper.getKeyCode(e || window.event);
        if (thisMenu) {
            thisMenu.handleKeyPress(keyCode);
        }
    }
};

// SIG // Begin signature block
// SIG // MIIauwYJKoZIhvcNAQcCoIIarDCCGqgCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFKdHskv3B75w
// SIG // cjkdrp9H179/xqghoIIVgjCCBMMwggOroAMCAQICEzMA
// SIG // AAAz5SeGow5KKoAAAAAAADMwDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTEzMDMyNzIw
// SIG // MDgyM1oXDTE0MDYyNzIwMDgyM1owgbMxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDTALBgNVBAsTBE1PUFIxJzAlBgNVBAsT
// SIG // Hm5DaXBoZXIgRFNFIEVTTjpGNTI4LTM3NzctOEE3NjEl
// SIG // MCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vy
// SIG // dmljZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBAMreyhkPH5ZWgl/YQjLUCG22ncDC7Xw4q1gzrWuB
// SIG // ULiIIQpdr5ctkFrHwy6yTNRjdFj938WJVNALzP2chBF5
// SIG // rKMhIm0z4K7eJUBFkk4NYwgrizfdTwdq3CrPEFqPV12d
// SIG // PfoXYwLGcD67Iu1bsfcyuuRxvHn/+MvpVz90e+byfXxX
// SIG // WC+s0g6o2YjZQB86IkHiCSYCoMzlJc6MZ4PfRviFTcPa
// SIG // Zh7Hc347tHYXpqWgoHRVqOVgGEFiOMdlRqsEFmZW6vmm
// SIG // y0LPXVRkL4H4zzgADxBr4YMujT5I7ElWSuyaafTLDxD7
// SIG // BzRKYmwBjW7HIITKXNFjmR6OXewPpRZIqmveIS8CAwEA
// SIG // AaOCAQkwggEFMB0GA1UdDgQWBBQAWBs+7cXxBpO+MT02
// SIG // tKwLXTLwgTAfBgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7
// SIG // syuwwzWzDzBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9NaWNyb3NvZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsG
// SIG // AQUFBwEBBEwwSjBIBggrBgEFBQcwAoY8aHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQAC/+OMA+rv
// SIG // fji5uXyfO1KDpPojONQDuGpZtergb4gD9G9RapU6dYXo
// SIG // HNwHxU6dG6jOJEcUJE81d7GcvCd7j11P/AaLl5f5KZv3
// SIG // QB1SgY52SAN+8psXt67ZWyKRYzsyXzX7xpE8zO8OmYA+
// SIG // BpE4E3oMTL4z27/trUHGfBskfBPcCvxLiiAFHQmJkTkH
// SIG // TiFO3mx8cLur8SCO+Jh4YNyLlM9lvpaQD6CchO1ctXxB
// SIG // oGEtvUNnZRoqgtSniln3MuOj58WNsiK7kijYsIxTj2hH
// SIG // R6HYAbDxYRXEF6Et4zpsT2+vPe7eKbBEy8OSZ7oAzg+O
// SIG // Ee/RAoIxSZSYnVFIeK0d1kC2MIIE7DCCA9SgAwIBAgIT
// SIG // MwAAALARrwqL0Duf3QABAAAAsDANBgkqhkiG9w0BAQUF
// SIG // ADB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSMwIQYDVQQDExpN
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQTAeFw0xMzAx
// SIG // MjQyMjMzMzlaFw0xNDA0MjQyMjMzMzlaMIGDMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMQ0wCwYDVQQLEwRNT1BSMR4wHAYD
// SIG // VQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24wggEiMA0G
// SIG // CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDor1yiIA34
// SIG // KHy8BXt/re7rdqwoUz8620B9s44z5lc/pVEVNFSlz7SL
// SIG // qT+oN+EtUO01Fk7vTXrbE3aIsCzwWVyp6+HXKXXkG4Un
// SIG // m/P4LZ5BNisLQPu+O7q5XHWTFlJLyjPFN7Dz636o9UEV
// SIG // XAhlHSE38Cy6IgsQsRCddyKFhHxPuRuQsPWj/ov0DJpO
// SIG // oPXJCiHiquMBNkf9L4JqgQP1qTXclFed+0vUDoLbOI8S
// SIG // /uPWenSIZOFixCUuKq6dGB8OHrbCryS0DlC83hyTXEmm
// SIG // ebW22875cHsoAYS4KinPv6kFBeHgD3FN/a1cI4Mp68fF
// SIG // SsjoJ4TTfsZDC5UABbFPZXHFAgMBAAGjggFgMIIBXDAT
// SIG // BgNVHSUEDDAKBggrBgEFBQcDAzAdBgNVHQ4EFgQUWXGm
// SIG // WjNN2pgHgP+EHr6H+XIyQfIwUQYDVR0RBEowSKRGMEQx
// SIG // DTALBgNVBAsTBE1PUFIxMzAxBgNVBAUTKjMxNTk1KzRm
// SIG // YWYwYjcxLWFkMzctNGFhMy1hNjcxLTc2YmMwNTIzNDRh
// SIG // ZDAfBgNVHSMEGDAWgBTLEejK0rQWWAHJNy4zFha5TJoK
// SIG // HzBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWND
// SIG // b2RTaWdQQ0FfMDgtMzEtMjAxMC5jcmwwWgYIKwYBBQUH
// SIG // AQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY0NvZFNpZ1BD
// SIG // QV8wOC0zMS0yMDEwLmNydDANBgkqhkiG9w0BAQUFAAOC
// SIG // AQEAMdduKhJXM4HVncbr+TrURE0Inu5e32pbt3nPApy8
// SIG // dmiekKGcC8N/oozxTbqVOfsN4OGb9F0kDxuNiBU6fNut
// SIG // zrPJbLo5LEV9JBFUJjANDf9H6gMH5eRmXSx7nR2pEPoc
// SIG // sHTyT2lrnqkkhNrtlqDfc6TvahqsS2Ke8XzAFH9IzU2y
// SIG // RPnwPJNtQtjofOYXoJtoaAko+QKX7xEDumdSrcHps3Om
// SIG // 0mPNSuI+5PNO/f+h4LsCEztdIN5VP6OukEAxOHUoXgSp
// SIG // Rm3m9Xp5QL0fzehF1a7iXT71dcfmZmNgzNWahIeNJDD3
// SIG // 7zTQYx2xQmdKDku/Og7vtpU6pzjkJZIIpohmgjCCBbww
// SIG // ggOkoAMCAQICCmEzJhoAAAAAADEwDQYJKoZIhvcNAQEF
// SIG // BQAwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcGCgmS
// SIG // JomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // MB4XDTEwMDgzMTIyMTkzMloXDTIwMDgzMTIyMjkzMlow
// SIG // eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EwggEiMA0GCSqG
// SIG // SIb3DQEBAQUAA4IBDwAwggEKAoIBAQCycllcGTBkvx2a
// SIG // YCAgQpl2U2w+G9ZvzMvx6mv+lxYQ4N86dIMaty+gMuz/
// SIG // 3sJCTiPVcgDbNVcKicquIEn08GisTUuNpb15S3GbRwfa
// SIG // /SXfnXWIz6pzRH/XgdvzvfI2pMlcRdyvrT3gKGiXGqel
// SIG // cnNW8ReU5P01lHKg1nZfHndFg4U4FtBzWwW6Z1KNpbJp
// SIG // L9oZC/6SdCnidi9U3RQwWfjSjWL9y8lfRjFQuScT5EAw
// SIG // z3IpECgixzdOPaAyPZDNoTgGhVxOVoIoKgUyt0vXT2Pn
// SIG // 0i1i8UU956wIAPZGoZ7RW4wmU+h6qkryRs83PDietHdc
// SIG // pReejcsRj1Y8wawJXwPTAgMBAAGjggFeMIIBWjAPBgNV
// SIG // HRMBAf8EBTADAQH/MB0GA1UdDgQWBBTLEejK0rQWWAHJ
// SIG // Ny4zFha5TJoKHzALBgNVHQ8EBAMCAYYwEgYJKwYBBAGC
// SIG // NxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQU/dExTtMm
// SIG // ipXhmGA7qDFvpjy82C0wGQYJKwYBBAGCNxQCBAweCgBT
// SIG // AHUAYgBDAEEwHwYDVR0jBBgwFoAUDqyCYEBWJ5flJRP8
// SIG // KuEKU5VZ5KQwUAYDVR0fBEkwRzBFoEOgQYY/aHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvbWljcm9zb2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUF
// SIG // BwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0cDovL3d3dy5t
// SIG // aWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRS
// SIG // b290Q2VydC5jcnQwDQYJKoZIhvcNAQEFBQADggIBAFk5
// SIG // Pn8mRq/rb0CxMrVq6w4vbqhJ9+tfde1MOy3XQ60L/svp
// SIG // LTGjI8x8UJiAIV2sPS9MuqKoVpzjcLu4tPh5tUly9z7q
// SIG // QX/K4QwXaculnCAt+gtQxFbNLeNK0rxw56gNogOlVuC4
// SIG // iktX8pVCnPHz7+7jhh80PLhWmvBTI4UqpIIck+KUBx3y
// SIG // 4k74jKHK6BOlkU7IG9KPcpUqcW2bGvgc8FPWZ8wi/1wd
// SIG // zaKMvSeyeWNWRKJRzfnpo1hW3ZsCRUQvX/TartSCMm78
// SIG // pJUT5Otp56miLL7IKxAOZY6Z2/Wi+hImCWU4lPF6H0q7
// SIG // 0eFW6NB4lhhcyTUWX92THUmOLb6tNEQc7hAVGgBd3TVb
// SIG // Ic6YxwnuhQ6MT20OE049fClInHLR82zKwexwo1eSV32U
// SIG // jaAbSANa98+jZwp0pTbtLS8XyOZyNxL0b7E8Z4L5UrKN
// SIG // MxZlHg6K3RDeZPRvzkbU0xfpecQEtNP7LN8fip6sCvsT
// SIG // J0Ct5PnhqX9GuwdgR2VgQE6wQuxO7bN2edgKNAltHIAx
// SIG // H+IOVN3lofvlRxCtZJj/UBYufL8FIXrilUEnacOTj5XJ
// SIG // jdibIa4NXJzwoq6GaIMMai27dmsAHZat8hZ79haDJLmI
// SIG // z2qoRzEvmtzjcT3XAH5iR9HOiMm4GPoOco3Boz2vAkBq
// SIG // /2mbluIQqBC0N1AI1sM9MIIGBzCCA++gAwIBAgIKYRZo
// SIG // NAAAAAAAHDANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZIm
// SIG // iZPyLGQBGRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWlj
// SIG // cm9zb2Z0MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBD
// SIG // ZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1
// SIG // MzA5WhcNMjEwNDAzMTMwMzA5WjB3MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
// SIG // ggEKAoIBAQCfoWyx39tIkip8ay4Z4b3i48WZUSNQrc7d
// SIG // GE4kD+7Rp9FMrXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr
// SIG // 6Hu97IkHD/cOBJjwicwfyzMkh53y9GccLPx754gd6udO
// SIG // o6HBI1PKjfpFzwnQXq/QsEIEovmmbJNn1yjcRlOwhtDl
// SIG // KEYuJ6yGT1VSDOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd+
// SIG // +NIT8wi3U21StEWQn0gASkdmEScpZqiX5NMGgUqi+YSn
// SIG // EUcUCYKfhO1VeP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68e
// SIG // eEExd8yb3zuDk6FhArUdDbH895uyAc4iS1T/+QXDwiAL
// SIG // AgMBAAGjggGrMIIBpzAPBgNVHRMBAf8EBTADAQH/MB0G
// SIG // A1UdDgQWBBQjNPjZUkZwCu1A+3b7syuwwzWzDzALBgNV
// SIG // HQ8EBAMCAYYwEAYJKwYBBAGCNxUBBAMCAQAwgZgGA1Ud
// SIG // IwSBkDCBjYAUDqyCYEBWJ5flJRP8KuEKU5VZ5KShY6Rh
// SIG // MF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJ
// SIG // k/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jv
// SIG // c29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0eYIQ
// SIG // ea0WoUqgpa1Mc1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BB
// SIG // hj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2Ny
// SIG // bC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2VydC5jcmww
// SIG // VAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAChjhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01p
// SIG // Y3Jvc29mdFJvb3RDZXJ0LmNydDATBgNVHSUEDDAKBggr
// SIG // BgEFBQcDCDANBgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wD
// SIG // RDbd6bStd9vOeVFNAbEudHFbbQwTq86+e4+4LtQSooxt
// SIG // YrhXAstOIBNQmd16QOJXu69YmhzhHQGGrLt48ovQ7DsB
// SIG // 7uK+jwoFyI1I4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mR
// SIG // KiQicPv2/OR4mS4N9wficLwYTp2OawpylbihOZxnLcVR
// SIG // DupiXD8WmIsgP+IHGjL5zDFKdjE9K3ILyOpwPf+FChPf
// SIG // wgphjvDXuBfrTot/xTUrXqO/67x9C0J71FNyIe4wyrt4
// SIG // ZVxbARcKFA7S2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGys
// SIG // OUzU9nm/qhh6YinvopspNAZ3GmLJPR5tH4LwC8csu89D
// SIG // s+X57H2146SodDW4TsVxIxImdgs8UoxxWkZDFLyzs7BN
// SIG // Z8ifQv+AeSGAnhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU
// SIG // 2DKATCYqSCRfWupW76bemZ3KOm+9gSd0BhHudiG/m4LB
// SIG // J1S2sWo9iaF2YbRuoROmv6pH8BJv/YoybLL+31HIjCPJ
// SIG // Zr2dHYcSZAI9La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCl
// SIG // eKuzoJZ1GtmShxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/J
// SIG // mu5J4PcBZW+JC33Iacjmbuqnl84xKf8OxVtc2E0bodj6
// SIG // L54/LlUWa8kTo/0xggSlMIIEoQIBATCBkDB5MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQg
// SIG // Q29kZSBTaWduaW5nIFBDQQITMwAAALARrwqL0Duf3QAB
// SIG // AAAAsDAJBgUrDgMCGgUAoIG+MBkGCSqGSIb3DQEJAzEM
// SIG // BgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgor
// SIG // BgEEAYI3AgEVMCMGCSqGSIb3DQEJBDEWBBRRojPd8Oqq
// SIG // V6ZrhYjYib3fDkZeZjBeBgorBgEEAYI3AgEMMVAwTqAm
// SIG // gCQATQBpAGMAcgBvAHMAbwBmAHQAIABMAGUAYQByAG4A
// SIG // aQBuAGehJIAiaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L2xlYXJuaW5nIDANBgkqhkiG9w0BAQEFAASCAQBhHQJu
// SIG // BzLBCu90IQ1VJ/FTm0ZKQ+aAo/gYknve1LpQF2L440H0
// SIG // Vi3TI1OwpUIel42L7ECltEmqqdGMQ76Blh8Tq2s26jm+
// SIG // +i0rcZg5jVf/ow1Acdx1e4+jgsoyKw8reJbozarHmHcK
// SIG // yQU9I7bEI+JYaOdA+PbNNHvl/F/ge06BcAApx5s8sIPF
// SIG // TGWsNj5HNrPuN1cmhFYNzcTMzC41lBdxNwUPUnh+7oX+
// SIG // o75w9YMtVc06T6Qy3Rxkp///aEPnd5EoTtdTgw6nzBgC
// SIG // raI6iwOvtG6sTtZhXDaOIE17dE3hjaM3dZayztqB/1GX
// SIG // H482p4nDZ1UzSHwjL6Xrir+bKlNDoYICKDCCAiQGCSqG
// SIG // SIb3DQEJBjGCAhUwggIRAgEBMIGOMHcxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFBDQQITMwAAADPlJ4ajDkoqgAAAAAAAMzAJ
// SIG // BgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3
// SIG // DQEHATAcBgkqhkiG9w0BCQUxDxcNMTMwNDIzMjAxOTA2
// SIG // WjAjBgkqhkiG9w0BCQQxFgQU67Dc7O/ZiEWw299NJ1ro
// SIG // vIk93IcwDQYJKoZIhvcNAQEFBQAEggEAW2rvm1lFIz5j
// SIG // xWHKpoAPRkHm+uoewj65TO4mEmsM0KHv/9oYzigYNdNK
// SIG // cTV7cmK8r4pn+KaRR+nrnaklxZkhGqf6xaJy4KS+oPJ4
// SIG // Frg9XkC+gMTwoncewW3NnCJfRApxAcQ6B5vUbfu05Z5+
// SIG // F0tmH94N5ihtytETUHBFz5FPlGzMEXne9XRa0JLNfLFV
// SIG // DUdBpwr0QU9X0ZyxnphbjrP/HqiI2Ip1cYQByGE2ICil
// SIG // YK8YM/fRO6CcWd043hQnQdbEyE5Ky+QrrKmr49gsSzpb
// SIG // 6S1ZVbm47n4fTsljlkoQAguy0SiZ3slOpu3UsijKCVLy
// SIG // yyRMO3YEoSMlUDlCyq0yVg==
// SIG // End signature block

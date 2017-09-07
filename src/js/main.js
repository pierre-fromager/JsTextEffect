var textEffect = function (options) {

    this.options = options;
    this.default_linefeed = "\n";
    this.default_selector = 'div.p';
    this.default_hspace = '&nbsp;';
    this.default_space = ' ';
    this.default_animInactivClass = 'te_inactiv';
    this.default_animActivClass = 'te_rotatey';
    this.default_animDoneClass = 'rd_done';
    this.default_wrapperTag = 'div';
    this.default_animTempo = 0;
    this.default_clearClass = 'clear';
    this.default_started = function(){ console.log(this.selector + ' started');};
    this.default_completed = function(){console.log(this.selector + 'completed');};

    this.init = function () {
        this.nodeList = [];
        this.nodeListIndex = 0;
        this.selector = (this.options.selector) 
            ? this.options.selector 
            : this.default_selector;
        this.animTempo =  (this.options.animTempo) 
            ? this.options.animTempo 
            : this.default_animTempo;
        this.animActivClass =  (this.options.animActivClass) 
            ? this.options.animActivClass 
            : this.default_animActivClass;
        this.animInactivClass =  (this.options.animInactivClass) 
            ? this.options.animInactivClass 
            : this.default_animInactivClass;
        this.clearClass =  (this.options.clearClass) 
            ? this.options.clearClass 
            : this.default_clearClass;
        this.cbStart =  (this.options.cbStart) 
            ? this.options.cbStart 
            : this.default_started;
        this.cbComplete =  (this.options.cbComplete) 
            ? this.options.cbComplete 
            : this.default_completed;
        this.setNodeList();
        return this;
    };

    this.setSelector = function (selector) {
        this.selector = selector;
        return this;
    };
    
    this.setTempo = function (tempo) {
        this.animTempo = tempo;
        return this;
    };
    
    this.getWrapper = function (tContent, ct) {
        var wrapper = document.createElement(this.default_wrapperTag);
        var lfClass = (tContent[ct] === this.default_linefeed) 
            ? this.clearClass 
            : '';
        wrapper.innerHTML = (tContent[ct] === this.default_space)
            ? this.default_hspace
            : tContent[ct];
        wrapper.className = this.animInactivClass + this.default_space + lfClass;
        return wrapper;
    };
    
    this.completed = function () {
        this.cbComplete();
    };
    
    this.started = function () {
        this.cbStart();
    };
    
    this.runTempo = function (childss, ct, classActiv) {
        setTimeout(
            function (x, that) {
                return function () {
                    childss[x].className = classActiv;
                    if (x === (childss.length - 1)) {that.completed();}
                };
            }(ct, this)
            , (1 + ct) * this.animTempo
        );
    };
    
    this.setNodeList = function(){
        this.nodeList = document.querySelectorAll(this.selector);
    };
    
    this.getCurrentNodeItem = function(){
        return this.nodeList[this.nodeListIndex];
    };
    
    this.getNodeListItem = function(){
        return this.getCurrentNodeItem().childNodes;
    };
    
    this.getNodeListItemContent = function(){
        return this.getCurrentNodeItem().innerHTML;
    };
    
    this.setNodeListItemContent = function(content){
        this.getCurrentNodeItem().innerHTML = content;
    };
    
    this.hasClass = function (el, className) {
        if (!el.className) {
            return false;
        } else {
            var newElementClass = ' ' + el.className + ' ';
            var newClassName = ' ' + className + ' ';
            var has = newElementClass.indexOf(newClassName) !== -1;
            return has;
        }
    };
    
    this.removeDuplicated = function(content,all){
        return (all) 
            ? content.replace(/\s\s+/g, ' ') 
            : content.replace(/  +/g, ' ');
    }
    
    this.run = function () {
        this.started();
        for (this.nodeListIndex = 0; this.nodeListIndex < this.nodeList.length; ++this.nodeListIndex) {
            var done = this.hasClass(this.getCurrentNodeItem(), this.default_animDoneClass);
            if (done === false) {
                var tContent = this.removeDuplicated(this.getNodeListItemContent());
                this.setNodeListItemContent('');
                for (var ct = 0; ct < tContent.length; ++ct) {
                    this.getCurrentNodeItem().appendChild(this.getWrapper(tContent, ct));
                }
                var childss = this.getNodeListItem();
                for (var ct = 0; ct < childss.length; ++ct) {
                    var clearClass = (this.hasClass(childss[ct], this.clearClass)) 
                        ? this.clearClass 
                        : '';
                    this.runTempo(childss, ct, this.animActivClass + ' ' + clearClass);
                }
                this.getCurrentNodeItem().className += ' ' + this.default_animDoneClass;
            }
        }
        return this;
    };
    
    this.reset = function () {
        for (this.nodeListIndex = 0; this.nodeListIndex < this.nodeList.length; ++this.nodeListIndex) {
            var childs = this.getNodeListItem();
            var tContent = '';
            for (var ct = 0; ct < childs.length; ++ct) {
                tContent += (childs[ct].innerHTML === this.default_hspace)
                    ? this.default_space
                    : childs[ct].innerHTML;
            }
            for (var ct = 0; ct < childs.length; ++ct) {
                this.getCurrentNodeItem().removeChild(childs[ct]);
            }
            this.setNodeListItemContent(tContent);
            var classContext = this.getCurrentNodeItem().className.split(' ');
            this.getCurrentNodeItem().className = classContext[0];
        }
        return this;
    };
    
    return this;
};
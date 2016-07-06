! function() {
    if (typeof jQuery === 'undefined') {
        return;
    }
    String.prototype.replaceAll = function(tagList,replacee) {
        var _this=this;
        for(var i=0;i<tagList.length;i++) {
            _this=_this.replace('<'+tagList[i]+'>',replacee);
            _this=_this.replace('</'+tagList[i]+'>',replacee);
        }
        return _this;
    };
    styleTags=['b','strong','i','em','del','ins','mark','small','sub','sup','u'];
    get = function(obj,attr) {
        obj=obj['self'];
        var returnValue;
        Object.keys(obj).forEach(function(key, index) {
            if(key==attr){
                returnValue=obj[key];
            }
        });
        return returnValue;
    };
    removeElems = function(jsonForm, selector, attrToQuery){
        if(attrToQuery==undefined)
        {
            var attrToQuery='';
            if(selector.indexOf('>')==-1){
                if(selector[0]=='#'){ attrToQuery='id'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='.'){ attrToQuery='class'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='['){ attrToQuery=selector.slice(1,selector.indexOf('=')); selector=selector.slice(selector.indexOf('=')+1,selector.length-1);}
                else {attrToQuery='tagName'}
            } else {
                //currently only for #id>elem(s)
                jsonForm=selectedArray(jsonForm,selector.slice(0,selector.indexOf('>')))[0];
                selector=selector.slice(selector.indexOf('>')+1,selector.length);
                console.log('made up jsonForm',jsonForm);
                if(selector[0]=='#'){ attrToQuery='id'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='.'){ attrToQuery='class'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='['){ attrToQuery=selector.slice(1,selector.indexOf('=')); selector=selector.slice(selector.indexOf('=')+1,selector.length-1);}
                else {attrToQuery='tagName'}
               // childLevel=1;
                // console.log(selectedArray(jsonForm,selector.slice(0,selector.indexOf('>'))));
                // return;
            }
        }
        if(jsonForm.self){
            Object.keys(jsonForm).forEach(function(key, index) {
                if(key=='self'){
                    if(attrToQuery!='class'){
                        if(jsonForm[key][attrToQuery]==selector) {
                            jsonForm.self={};
                            jsonForm.children={};
                        }
                    } else {
                        if(jsonForm[key][attrToQuery])
                        if(jsonForm[key][attrToQuery].indexOf(selector)>-1) {
                            jsonForm.self={};
                            jsonForm.children={};
                        }
                    }
                    
                } else {
                    if(jsonForm[key].length>=1)
                    {
                        for(var i=0;i<jsonForm[key].length;i++){
                            removeElems(jsonForm[key][i],selector,attrToQuery);
                        }
                    } else {
                        return delete_null_nodes(jsonForm);
                    }
                        
                }
             });
        return delete_null_nodes(jsonForm);
        }
    else
        return delete_null_nodes(jsonForm);
    };
    delete_null_nodes = function (jsonForm) {
        if($.isEmptyObject(jsonForm.self)&&$.isEmptyObject(jsonForm.children)) return null;
        else {
            var children=[];
            for(var i=0;i<jsonForm.children.length;i++) {
                var child=delete_null_nodes(jsonForm.children[i]);
                if(child) children.push(child);
            }
            if(children.length>0)
                jsonForm.children=children;
            else
                jsonForm.children='';
        }
        return jsonForm;
    }
    selectedArray = function(jsonForm, selector,attrToQuery,childLevel){
        if(childLevel===undefined) childLevel= Infinity;
        if(attrToQuery==undefined)
        {
            var attrToQuery='';
            if(selector.indexOf('>')==-1 && selector.indexOf(' ')==-1){
                if(selector[0]=='#'){ attrToQuery='id'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='.'){ attrToQuery='class'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='['){ attrToQuery=selector.slice(1,selector.indexOf('=')); selector=selector.slice(selector.indexOf('=')+1,selector.length-1);}
                else {attrToQuery='tagName'}
            } else {
                //currently only for #id>elem(s)
                if(selector.indexOf(' ')==-1) {
                    jsonForm=selectedArray(jsonForm,selector.slice(0,selector.indexOf('>')))[0];
                    selector=selector.slice(selector.indexOf('>')+1,selector.length);
                    childLevel=1;
                } else {
                    jsonForm=selectedArray(jsonForm,selector.split(' ')[0])[0];
                    ultimateGlobal=jsonForm;
                    selector=selector.split(' ')[1];
                    childLevel=Infinity;
                }
                if(selector[0]=='#'){ attrToQuery='id'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='.'){ attrToQuery='class'; selector=selector.slice(1,selector.length);}
                else if(selector[0]=='['){ attrToQuery=selector.slice(1,selector.indexOf('=')); selector=selector.slice(selector.indexOf('=')+1,selector.length-1);}
                else {attrToQuery='tagName'}
                // console.log(selectedArray(jsonForm,selector.slice(0,selector.indexOf('>'))));
                // return;
            }
        }
        var elems=[];
        if(jsonForm.self){
        Object.keys(jsonForm).forEach(function(key, index) {
            if(key=='self'){
                if(attrToQuery!='class'){
                    if(jsonForm[key][attrToQuery]==selector)
                    elems.push(jsonForm);
                } else {
                    if(jsonForm[key][attrToQuery])
                    if(jsonForm[key][attrToQuery].indexOf(selector)>-1)
                        elems.push(jsonForm);
                }
                
            } else {
                if(jsonForm[key].length>=1&&childLevel>0)
                {
                    
                    for(var i=0;i<jsonForm[key].length;i++){
                        var _elems=selectedArray(jsonForm[key][i],selector,attrToQuery,childLevel-1);
                        if(_elems)
                            for(var j=0;j<_elems.length;j++){
                                elems.push(_elems[j]);
                            }
                    }
                } else {
                    
                    return;
                }
                    
                }
            });
        return elems;
    }
    else
        return;
    };
    prettifyCode = function(jsonForm) {
        var prettyCode = '';
        prettyCode += '&lt;' + jsonForm.self.tagName + '&gt;' + prettifyChildren(jsonForm.children, 1) + '&#13;&lt;/' + jsonForm.self.tagName + '&gt;';
        return prettyCode;
    }
    prettifyChildren = function(children, tabLvl) {
        var singletonTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source'];
        var childrenCode = '';
        for (var i = 0; i < children.length; i++) {
            if (children[i].children) {
                var child = '&#13;';
                for (var j = 0; j < tabLvl; j++) {
                    child += '&#9;';
                }
                child += '&lt;' + children[i].self.tagName + printAttributes(children[i].self) + '&gt;' + prettifyChildren(children[i].children, tabLvl + 1);
                if (children[i].self.innerContent == '') {
                    for (var j = 0; j < tabLvl + 1; j++) {
                        child += '&#9;';
                    }
                    child += children[i].self.innerContent + '&#13;';
                } else {
                    child += '&#13;';
                }
                if (singletonTags.indexOf(children[i].self.tagName) == -1) {
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;/' + children[i].self.tagName + '&gt;';
                }
            } else {
                if (children[i].self.tagName !== 'TEXT_NODE' && children[i].self.tagName !== 'COMMENT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;' + children[i].self.tagName + printAttributes(children[i].self) + '&gt;';
                    if (children[i].self.innerContent) {
                        child += '&#13;';
                        for (var j = 0; j < tabLvl + 1; j++) {
                            child += '&#9;';
                        }
                        child += children[i].self.innerContent + '&#13;';
                        for (var j = 0; j < tabLvl; j++) {
                            child += '&#9;';
                        }
                    }
                    if (singletonTags.indexOf(children[i].self.tagName) == -1) {
                        for (var j = 0; j < tabLvl; j++) {
                            child += '&#9;';
                        }
                        child += '&lt;/' + children[i].self.tagName + '&gt;';
                    }
                } else if (children[i].self.tagName === 'COMMENT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;!--' + children[i].self.innerContent + '--&gt;';
                } else if (children[i].self.tagName === 'TEXT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += children[i].self.innerContent;
                }
            }

            childrenCode += child;
        }
        return childrenCode;
    }
    printAttributes = function(self) {
        var attributeString = '';
        Object.keys(self).forEach(function(key, index) {
            if (key != 'tagName' && key != 'children' && key != 'innerContent') {
                attributeString += ' ' + key + '="' + self[key] + '"';
            }

        });
        return attributeString;
    }
    constructJSONfromArray = function(HTMLarray) {
        
    }
    htmlToJSON = function(divId) {
        constructTagTree = function(tags) {
            if (tags.length != 1 || $(tags[0]).eq(0).contents().length != 0) {
                var newObj = {};

                $.each(tags, function() {
                    var childrenLength = $(this).eq(0).contents().length;
                    var newerObj = [];
                    var count = $(this).eq(0).contents().length;
                    $.each($(this).eq(0).contents(), function() {
                        var child = constructTagTree($(this).eq(0));
                        if (child&&child.self)
                            newerObj.push(child);
                    });
                    newObj['children'] = (newerObj);
                    newObj['self'] = (constructAttributeObject($(this).eq(0)));

                });
            } else {
                var newObj = {};
                $.each(tags, function() {
                    newObj['children']='';
                    newObj['self'] = (constructAttributeObject($(this).eq(0)));
                });
            }
            return newObj;
        };
        constructAttributeObject = function(element) {
            var attrObj = {};
            element = element[0];
            if ($(element).prop('tagName')){
                var tagName=($(element).prop('tagName')).toLowerCase();
                if(tagName=='hmmhtml') attrObj['tagName'] = 'html';
                else if(tagName=='hmmbody') attrObj['tagName'] = 'body';
                else if(tagName=='hmmhead') attrObj['tagName'] = 'head';
                else attrObj['tagName'] = tagName;
            } 
            else if (element.nodeType == 8) {
                attrObj['tagName'] = 'COMMENT_NODE';
                attrObj['innerContent'] = element.nodeValue;
            } else {
                attrObj['tagName'] = 'TEXT_NODE';
                var x = element.nodeValue;
                x = x.replace(/(\r\n|\n|\r)/gm, " ");
                if (/\S/.test(x)) {
                    attrObj['innerContent'] = x;
                } else {
                    return;
                }
            }
            if ($(element).prop('tagName'))
                $.each(element.attributes, function() {
                    attrObj[this.name] = this.value;
                });

            return attrObj;
        };
        // if(divId.indexOf('iframe')!=-1)
        //     obj = constructTagTree($(divId).contents().eq(0).children().eq(0));
        // else {
            obj = constructTagTree($(divId).children().eq(0));
        // }
        
        return obj;
    }
    beautifulSoup = function(url) {
        var _this = this;
        _this.url = url;
        _this.loaded = false;
        _this.content = '';
        _this.onReady = function(action, params) {
            if (_this.loaded == false) {
                _this.loaded=true;
                var promise=new Promise(function(resolve,reject){
                     $.get(_this.url, function(data,status,response) {  
                        if(action!='pre-process'){
                            _this.loaded = true;
                            _this.content = data;
                            data=data.replace(/<html[^>]*>/,"<hmmhtml>");
                            data=data.replace(/<head[^>]*>/,"<hmmhead>");
                            data=data.replace("</html>","</hmmhtml>");
                            data=data.replace(/<body[^>]*>/,"<hmmbody>");
                            data=data.replace("</head>","</hmmhead>");
                            data=data.replace("</body>","</hmmbody>");
                            $('#doc').remove();
                            var div = document.createElement('div');
                            div.id="doc";
                            div.style="display:none;"
                            var html = data;
                            document.body.appendChild(div);
                            div.innerHTML=(html);
                            _this.jsonForm = htmlToJSON('#doc');
                            resolve(execute(action,params));
                        } else {
                            _this.loaded = true;
                            _this.content = data;
                            data=params(data);
                            data=data.replace(/<html[^>]*>/,"<hmmhtml>");
                            data=data.replace(/<head[^>]*>/,"<hmmhead>");
                            data=data.replace("</html>","</hmmhtml>");
                            data=data.replace(/<body[^>]*>/,"<hmmbody>");
                            data=data.replace("</head>","</hmmhead>");
                            data=data.replace("</body>","</hmmbody>");
                            $('#doc').remove();
                            // console.log(data);
                            var div = document.createElement('div');
                            div.id="doc";
                            div.style="display:none;"
                            var html = data;
                            document.body.appendChild(div);
                            div.innerHTML=(html);
                            _this.jsonForm = htmlToJSON('#doc');
                            resolve(true);
                        }
                                
                            
                        //}
                    });
                });
                return promise;   
               // );
            } else {
                var promise2=new Promise(function(resolve,reject){
                    resolve(execute(action, params));
                });
                return promise2;
            }
        }
        _this.html2json = function(varToStoreJSON) {
            return _this.jsonForm;
        };
        _this.prettify = function(divToPopulate) {
            var pretty=prettifyCode(_this.jsonForm);
            $(divToPopulate).append($('<textarea />').html(pretty).css({width:'800px',height:'80vh'}));
            return pretty;
        };
        _this.findAll = function( tag ){
            if(Array.isArray(tag)){
                var results=[]
                for(var i=0;i<tag.length;i++){
                    results.push(selectedArray(_this.jsonForm,tag[i]));
                }
                return results;
            } else {
                return selectedArray(_this.jsonForm,tag);
            }
        };
        _this.getText = function( param ){
            var textObj=selectedArray(selectedArray(_this.jsonFormStripped,'body')[0],'TEXT_NODE');
            var textLines=[];
            for(var i=0;i<textObj.length;i++){
                textLines.push(textObj[i]['self']['innerContent']);
            }
            return textLines;
        };
        _this.remove = function( tag ){
            if(Array.isArray(tag)){
                for(var i=0;i<tag.length;i++){
                     _this.jsonForm=removeElems(_this.jsonForm,tag[i]);
                }
            } else {
                 _this.jsonForm=removeElems(_this.jsonForm,tag);
            }
        };
        execute = function(action, params) {
            if (action === 'html2json') {
                return _this.html2json(params);
            } else if (action === 'prettify') {
                return _this.prettify(params);
            } else if (action === 'findAll') {
                return _this.findAll(params);
            } else if (action === 'getText') {
                return _this.getText(params);
            } else if (action === 'remove') {
                return _this.remove(params);
            }
        };
    };

}();

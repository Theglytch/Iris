function Panel() {
    this.init = function() {
        $('body').append('\n<style id="iris-style"></style>\n');

        $('body').append('<iris id="iris">');
        $('#iris').append('<iris id="iris-menu">');
        $('#iris').append('<iris id="iris-content">');
        $('#iris-menu').append('<iris id="" class="iris-btn" title="Help"><i iris-ctrl="true" class="material-icons">help_outline</i></iris>');
        $('#iris-menu').append('<iris id="" class="iris-btn" title="View"><i iris-ctrl="true" class="material-icons">grid_off</i></iris>');
        $('#iris-menu').append('<iris id="" class="iris-btn" title="Lock"><i iris-ctrl="true" class="material-icons">lock_outline</i></iris>');
        $('#iris-content').append('<iris id="iris-head">');
        $('#iris-content').append('<form id="iris-form" iris-ctrl="true">');
        $('#iris-content').append('<iris id="iris-actions">');
        $('#iris-content').append('<iris id="iris-details">');
        $('#iris-content').append('<iris id="iris-content-close" title="Close the panel"><i iris-ctrl="true" class="material-icons">close</i></iris>');
        $('#iris-head').append('<iris class="iris-head">Click on something</iris>');
        $('#iris-form').append('<input iris-ctrl="true" id="iris-form-input" type="text" title="Enter your commande (ex: div id class)">');
        $('#iris-form').append('<iris id="iris-form-delete" title="Clear the input"><i iris-ctrl="true" class="material-icons">cancel</i></iris>');
        $('#iris-actions').append('<iris id="" class="iris-btn" title="Select before"><i iris-ctrl="true" class="material-icons">arrow_back</i></iris>');
        $('#iris-actions').append('<iris id="" class="iris-btn" title="Select next"><i iris-ctrl="true" class="material-icons">arrow_forward</i></iris>');
        $('#iris-actions').append('<iris id="" class="iris-btn" title="Move target"><i iris-ctrl="true" class="material-icons">shuffle</i></iris>');
        $('#iris-actions').append('<iris id="iris-delete-target" class="iris-btn" title="Delete target"><i iris-ctrl="true" class="material-icons">delete</i></iris>');
        $('#iris-details').append('<iris id="iris-details-head">');
        $('#iris-details').append('<iris id="iris-details-content">');
        $('#iris-details-head').append('<iris target="simple" class="tab">Simple</iris>');
        $('#iris-details-head').append('<iris target="css" class="tab">CSS</iris>');
        $('#iris-details-head').append('<iris target="html" class="tab">HTML</iris>');
        $('#iris-details-content').append('<iris panel="simple" class="panel">');
        $('#iris-details-content').append('<textarea panel="css" class="panel" iris-ctrl="true">');
        $('#iris-details-content').append('<textarea panel="html" class="panel" iris-ctrl="true">');

        this.set(false);
        this.set_details();
    }

    this.set = function(statut) {
        if (statut) {
            $('#iris').show();
            $('#iris-form-input').focus();
            PANEL.set_head();
            PANEL.set_css();
            PANEL.set_html();
        } else {
            $('#iris').hide();
            COMPLETE.set(false);
        }
    }

    this.set_head = function() {
        var i = 0, length = TARGET.attributes.length,
            head = '<iris class="iris-head tag">' + TARGET.localName + '</iris>';

        for (i; i < length; i++) {
            if      (TARGET.attributes[i].name == 'id') head += '<iris class="iris-head id">#' + TARGET.attributes[i].value + '</iris>';
            else if (TARGET.attributes[i].name == 'class') {
                var ii = 0, items = TARGET.attributes[i].value.split(' '), items_length = items.length;
                for (ii; ii < items_length; ii++){ head += '<iris class="iris-head class">.' + items[ii] + '</iris>'; }
            }
            if (TARGET.attributes[i].name != 'id' && TARGET.attributes[i].name != 'class') 
                head += '<iris class="iris-head attr">' + TARGET.attributes[i].name + '="' + TARGET.attributes[i].value + '"</iris>';
        }

        $('#iris-head').html('').append(head);
        $('#iris-head').addClass('update').animate({color: '#bc8080'}, 230, function(){
            $(this).removeClass('update');
        });
    }

    this.set_details = function(target='css') {
        $('#iris-details-head .tab').removeClass('active');
        $('#iris-details-head [target="' + target + '"]').addClass('active');
        $('#iris-details-content .panel').hide();
        $('#iris-details-content [panel="' + target + '"]').show();
    }

    this.set_css = function() {
        var i = 0, length = STYLE.length, start = false,
            ii = 0, attr_length = TARGET.attributes.length,
            id = 0, classes = 0, attrs = 0,
            target = TARGET.localName,
            reg_target,
            reg_end = new RegExp('} *$');

        $('#iris-details-content [panel="css"]').text('');

        if (attr_length > 0) {
            for (ii; ii < attr_length; ii++) {
                if      (TARGET.attributes[ii].name == 'id') target += '|#' + TARGET.id + ' ';
                else if (TARGET.attributes[ii].name == 'class') {
                    var iii = 0, items = TARGET.attributes[ii].value.split(' '), items_length = items.length;
                    for (iii; iii < items_length; iii++){ target += '|.' + items[iii] + ' '; }
                }
                if (TARGET.attributes[ii].name != 'id' && TARGET.attributes[ii].name != 'class') 
                    target += '|' + TARGET.attributes[ii].name + '="' + TARGET.attributes[ii].value + '"';
            }
        }

        reg_target = new RegExp(target + ' ', 'i');

        for (i; i < length; i++) {
            if (reg_target.test(STYLE[i])) start = true;
            if (start) {
                $('#iris-details-content [panel="css"]').append(STYLE[i] + '\r\n');
                if (reg_end.test(STYLE[i])) start = false;
            }
        }
    }

    this.set_html = function() {
        var result = '', reg_spaces = /^    /gm;

        if (TARGET.nodeName == 'BODY') {
            var array = [].slice.call(TARGET.childNodes), length = array.length, i = 0;
            for (i; i < array.length; i++) {
                if (array[i].nodeName != 'IRIS' && array[i].nodeName != 'SCRIPT' && array[i].nodeName != 'STYLE') {
                    if (array[i].nodeName == '#text') result += array[i].data;
                    else result += array[i].outerHTML;
                }
            }
        } else {
            result = TARGET.outerHTML;
        }

        //result = result.replace('\n    ', '\n');

        $('#iris-details-content [panel="html"]').text('').text(result);
    }

    this.normalize = function(input) {
        input = input.replace(/#/g, ' #'); // Add space before hash
        input = input.replace(/\./g, ' .'); // Add space before point
        input = input.replace(/ *: */, ' '); // Remove spaces around double point and add one before
        input = input.replace(/ *;/, ''); // Remove space before ;
        input = input.replace(/^ +| +$/g, ''); // Remove extremes spaces
        input = input.replace(/ +/g, ' '); // replace multi space by one
        input = input.replace(/ *, */g, ','); // Removes spaces before and after
        return input;
    }

    this.process_HTML = function(array) {
        var i = 1, length = array.length,
            id = -1, classes = [], attrs = [],
            line = '<' + array[0],
            end = '>%' + array[0] + '%</' + array[0] + '>';

        if (array.length == 1) line += end;
        else {
            for (i; i < length; i++) {
                // Find pos of each elems
                if      (/^#/.test(array[i])) id = i;
                else if (/^\./.test(array[i])) classes.push(i);
                else if (/^[a-z0-9-_]+(=")[a-z0-9-_]*"$/i.test(array[i])) attrs.push(i);
            }

            if (id > -1) line += ' id="'+array[id].substr(1)+'"';

            if (classes.length > 0) {
                var ii = 0;
                line += ' class="';
                for (ii; ii < classes.length; ii++) {
                    if (ii > 0) line += ' '; // Si on est plus loin que le premier index, on ajoute un espace avant
                    line += array[classes[ii]].substr(1);
                }
                line += '"';
            }

            if (attrs.length > 0) {
                var ii = 0;
                for (ii; ii < attrs.length; ii++) {
                    line += ' ' + array[attrs[ii]];
                }
            }

            line += end;
        }

        $(TARGET).append(line);
        TARGET = TARGET.children[TARGET.children.length - 1];
    }

    this.process_CSS = function(array) {
        var target, style, style_line, val, i = 0, ii = 0;
        var reg_target, reg_style, reg_end = / *} *$/;
        var target_key = -1, style_key = -1;

        if (CSS.indexOf(array[0]) == -1) {  // if first input is not in CSS
            target = array[0]; // first input is target
            array.shift(); // Remove first index of array
        } else if (CSS.indexOf(array[0]) > -1) { // if first input is in CSS, TARGET is the target
            if (TARGET.id != '') target = '#' + TARGET.id; // check if the TARGET has an id, if yes thats the target
            else target = TARGET.localName;
        }

        style = array[0];
        val = array[1];
        if (array.length > 2) {
            for (i; i < array.length; i++) {
                if (i >= 2) val += ' ' + array[i];
            }
        }
        style_line = '    ' + style + ': ' + val + ';';
        reg_target = new RegExp('^ *' + target, 'i');
        reg_style = new RegExp('^ *' + style, 'i');

        for (ii; ii < STYLE.length; ii++) {
            if (reg_target.test(STYLE[ii])) target_key = ii;
            if (target_key > -1) {
                if (reg_style.test(STYLE[ii])) style_key = ii;
                if (reg_end.test(STYLE[ii])) break;
            }
        }

        if (target_key > -1) {
            if (style_key > -1) STYLE[style_key] = style_line;
            else STYLE.splice(target_key + 1, 0, style_line);
        } else {
            STYLE.push(target + ' {');
            STYLE.push(style_line);
            STYLE.push('}');
        }

        console.log(TARGET);

        $('#iris-style').html( STYLE.join('\n') );
    }

    this.process_update = function(array) {
        var type, val, remove = false;

        if      (array[0].charAt(0) == '#') type = 'id';
        else if (array[0].charAt(0) == '.') type = 'class';
        else if (array[0].charAt(0) != '#' && array[0].charAt(0) != '.' && array[0].charAt(0) != '-' && /=/.test(array[0])) type = array[0].split('=')[0];
        else if (array[0].charAt(0) == '-') {
            if      (array[0].charAt(1) == '#') type = 'id';
            else if (array[0].charAt(1) == '.') type = 'class';
            else type = array[0].split('=')[0]; // '-attr'
            remove = true;
        }

        if (remove == false) {
            if (type != 'id' && type != 'class' && /=/.test(array[0])) {
                val = array[0].split('=');
                val = val[1].substr(1, val[1].length - 2);
            } else {
                val = array[0].substr(1);
            }
            $(TARGET).attr(type, val);
        } else {
            val = array[0].substr(2);
        }
    }

    this.process_input = function(input) {
        var array;
        input = this.normalize(input);
        array = input.split(' ');
        $('#iris-form-input').val('');

        if (compare_array(CSS, array)) this.process_CSS(array); // If not style, check tagname
        else if (HTML.indexOf(array[0]) > -1) this.process_HTML(array); // Check if an style is in array
        else this.process_update(array);

        this.set_head();
        this.set_css();
        TEXT.set(true);
    }
}

function Work_view() {
    this.attr = 'iris-work';
    this.statut = true;

    this.init = function() {
        $('html').attr(this.attr, true);
        this.set(true);
    }

    this.set = function(statut) {
        if (statut == 'toggle') this.statut = !this.statut;
        else this.statut = statut;
        $('html').attr(this.attr, this.statut);

        if(this.statut == true) {
            $('body').text(function(){
                if (this.clientHeight == 0) $(this).prepend('%body%');
            }).find('*').each(function(){
                if (this.tagName != 'IRIS' && $(this).attr('iris-ctrl') != 'true' && this.tagName != 'STYLE' && this.clientHeight == 0) {
                    $(this).prepend('%'+this.localName+'%');
                }
            });
        } else {
            var reg_tags = /%[a-z0-9]+%/gi;
            $('body')[0].firstChild.data = $('body')[0].firstChild.data.replace(reg_tags, '');
            $('body').find('*').each(function(){
                if (this.tagName != 'IRIS' && $(this).attr('iris-ctrl') != 'true') {
                    $(this).html( this.innerHTML.replace(reg_tags, '') );
                }
            });
        }
    }
}

function File_modal() {
    this.init = function() {
        $('body').append('<iris id="iris-file">');
        $('#iris-file').append('<iris id="iris-file-box">');
        $('#iris-file-box').append('<iris id="iris-title">');
        $('#iris-file-box').append('<iris id="iris-file-upload-container">');
        $('#iris-file-box').append('<iris id="iris-file-download-container">');
        $('#iris-file-box').append('<iris id="iris-file-skip">Start from zero</iris>');
        $('#iris-title').append('<img src="img/logo.png" iris-ctrl="true">');
        $('#iris-file-upload-container').append('<input id="iris-file-upload" iris-ctrl="true" type="file">');
        $('#iris-file-upload-container').append('<label for="iris-file-upload" iris-ctrl="true" class="iris-file-item">');
        $('[for="iris-file-upload"]').append('<i iris-ctrl="true" class="material-icons">file_upload</i>');
        $('[for="iris-file-upload"]').append('<iris>Upload your CSS file first</iris>');
        $('#iris-file-download-container').append('<a id="iris-file-download-html" class="iris-file-item" iris-ctrl="true">');
        $('#iris-file-download-container').append('<a id="iris-file-download-css" class="iris-file-item" iris-ctrl="true">');
        $('#iris-file-download-html').append('<i iris-ctrl="true" class="material-icons">file_download</i>');
        $('#iris-file-download-html').append('<iris>Download HTML file</iris>');
        $('#iris-file-download-css').append('<i iris-ctrl="true" class="material-icons">file_download</i>');
        $('#iris-file-download-css').append('<iris>Download CSS file</iris>');

        FILE.set(true);
    }

    this.set = function(statut) {
        if (statut == 'toggle') $('#iris-file').toggle();
        else statut ? $('#iris-file').show() : $('#iris-file').hide();
        if (CSSLOAD) {
            $('#iris-file-upload-container').hide();
            $('#iris-file-skip').hide();
            $('#iris-file-download-container').show();
        } else {
            $('#iris-file-upload-container').show();
            $('#iris-file-download-container').hide();
        }
    }

    this.process_upload = function(file, filename) {
        $('#iris-style').html(file);
        STYLE = $('#iris-style').html().split('\r\n');
        CSSLOAD = true;
        FILE.set(false);
        CSSNAME = filename;
    }

    this.upload = function(e) {
        var file = e.target.files[0];
        if (!file) return; 
        var reader = new FileReader();
        reader.onload = function(e) {
            FILE.process_upload(e.target.result, file.name);
        };
        reader.readAsText(file);
    }

    this.download_HTML = function(e) {
        var html = document.getElementsByTagName('html')[0],
            array = [].slice.call(html.childNodes),
            length = array.length, i = 0,
            result = '<html>', data;

        for (i; i < length; i++) {
            if (array[i].nodeName != 'IRIS' && array[i].nodeName != 'SCRIPT' && array[i].nodeName != 'STYLE') {
                if (array[i].nodeName == '#text') result += array[i].data;
                else result += array[i].outerHTML;
            }
        }

        result += '</html>';
        data = 'text/html;charset=utf-8,' + encodeURIComponent(result);
        e.setAttribute('href', 'data:'+data);
        e.setAttribute('download', 'index.html');

        /*
        var tosave = document.getElementsByTagName('html')[0].outerHTML;
        var data = 'text/html;charset=utf-8,' + encodeURIComponent(tosave);
        e.setAttribute('href', 'data:'+data);
        e.setAttribute('download', 'index.html'); 
        */
    }

    this.download_CSS = function(e) {
        var tosave = STYLE.join('\r\n');
        var data = 'text/json;charset=utf-8,' + encodeURIComponent(tosave);
        e.setAttribute('href', 'data:'+data);
        e.setAttribute('download', CSSNAME);   
    }
}

function Text() {
    this.init = function() {
        $('body').append('<input id="iris-text" iris-ctrl="true" type="text">');
        TEXT.set(false);
    }

    this.set = function(statut) {
        if (statut == 'toggle') $('#iris-text').toggle();
        else if (statut == false) $('#iris-text').hide();
        else {
            if (HTML_TEXT.indexOf(TARGET.localName) > -1) {
                $('#iris-text').show().focus().css({
                    left: TARGET.offsetLeft,
                    top: TARGET.offsetTop + TARGET.offsetHeight
                });
            } else {
                $('#iris-text').hide();
            }
        }
    }
}

function Complete() {
    this.init = function() {
        $('body').append('<iris id="iris-autocomplete">');
        COMPLETE.set(false);
    }

    this.set = function(statut) {
        if (statut) {
            var target = $('#iris-form'),
                height = target[0].offsetHeight,
                top = target[0].offsetTop,
                width = target[0].offsetWidth;

            $('#iris-autocomplete').css({
                right: 0,
                top: top + height,
                width: width
            }).addClass('active').show().children('.iris-autocomplete-item:first-of-type').addClass('focus');
        } else {
            $('#iris-autocomplete').removeClass('active').hide();
        }
    }

    this.nav = function(key) {
        var id = $('#iris-autocomplete .focus').attr('iris-id'),
            length = $('#iris-autocomplete .iris-autocomplete-item').length;

        $('#iris-autocomplete .focus').removeClass('focus');

        if (key == 'ArrowUp') id = parseInt(id) - 1;
        else if (key == 'ArrowDown') id = parseInt(id) + 1;

        if (id == -1) id = length - 1;
        else if (id == length) id = 0;
        if (id > -1 || id < length) $('[iris-id="'+ id +'"]').addClass('focus');
    }

    this.select = function() {
        var val = $('#iris-form-input').val(),
            newval = $('#iris-autocomplete .focus').text();
        val = val.split(' ');
        val.pop();
        val.push(newval + ' ');
        val = val.join(' ');
        $('#iris-form-input').val(val).focus();
        COMPLETE.set(false);
    }

    this.process = function(input) {
        var i = 0, length = jAUTOCOMPLETE.length, size = 0,
            terms = input.split(' '), last = terms.length - 1,
            ii = 0, last_length =  terms[last].length, char = '';

        $('#iris-autocomplete').html('');
        for (i; i < length; i++) {
            if (terms[last] == '') {
                COMPLETE.set(false);
                return;
            }
            for (ii; ii < last_length; ii++) char += terms[last][ii] + '.*';
            var reg = new RegExp('^' + char, 'gi');
            if (reg.test(jAUTOCOMPLETE[i])) {
                $('#iris-autocomplete').append('<iris iris-id="' + size + '" class="iris-autocomplete-item">' + jAUTOCOMPLETE[i] + '</iris>');
                size += 1;
            }
        }
        
        if (size > 0) COMPLETE.set(true);
        else COMPLETE.set(false);
    }
}

(function($) {
    $.fn.extend({
        filedrop: function(options) {
            var defaults = { callback: null }

            options = $.extend(defaults, options);
            return this.each(function() {
                var files = [],
                    $this = $(this);

                $this.bind('dragover', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    $this.addClass('dragover');
                });

                $this.bind('dragleave', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    $this.removeClass('dragover');
                });

                $this.bind('drop', function(event){ // Catch drop event
                    event.stopPropagation();
                    event.preventDefault();
                    files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files; // Get all files that are dropped

                    if(options.callback) { // Convert uploaded file to data URL and pass trought callback
                        var reader = new FileReader();
                        reader.onload = function(event){
                            options.callback(event.target.result, files[0]);
                        }
                        reader.readAsText(files[0]);
                    }
                    return false;
                });
            });
        }
    });
}(jQuery));

function compare_array(haystack, arr) {
    return arr.some(function(v) {
        return haystack.indexOf(v) >= 0;
    });
}

function events() {
    $('#iris-file').on('dragover', function(e){
        $(this).filedrop({
            callback: function(file, filedata) {
                FILE.process_upload(file, filedata.name);
                $('#iris-file').removeClass('dragover');
            }
        });
    });
    $('#iris-file-upload').change(function(e){ FILE.upload(e); });
    $('#iris-file-download-html').click(function(e){ FILE.download_HTML(this); });
    $('#iris-file-download-css').click(function(e){ FILE.download_CSS(this); });
    $('#iris-file-skip').click(function(){ FILE.process_upload('', 'mystyle.css'); });

    $('html').keydown(function(e){
        if (e.key == 'Escape' && CSSLOAD == true) {
            FILE.set(false);
            if ($('#iris-form-input').autocomplete('instance').menu.active != null) PANEL.set(false);
        }

        if (e.key == 'Control') CTRL_K = true;
        else if (e.key == 'F1') WORK.set('toggle');

        if (CTRL_K) {
            if (e.key == 's') {
                e.preventDefault();
                if (CSSLOAD == true) FILE.set('toggle');
            }
        }
    });

    $('html').keyup(function(e){
        if (e.key == 'Control') CTRL_K = false;
    });

    $('html').click(function(e){
        if (e.target.tagName == 'HTML') {
            PANEL.set(false);
            TEXT.set(false);
        }
        else if (e.target.tagName != 'IRIS' && $(e.target).attr('iris-ctrl') != 'true') {
            TARGET = e.target;
            PANEL.set(true);
            TEXT.set(true);
        }
    });

    $('#iris-content-close').click(function(){ PANEL.set(false); });

    $('#iris-head').click(function(e){
        var $this = $(e.target);
        if ($this.hasClass('iris-head')) {
            var val = $this.text();
            $('#iris-form-input').val(val + ' ').focus();
        }
    });

    $('#iris-form-input').keyup(function(e){
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown') 
            COMPLETE.nav(e.key);
        else if (e.key != 'Enter') {
            var input = $(this).val();
            if (input) COMPLETE.process(input);
        }
    });

    $('#iris-form').submit(function(e){
        e.preventDefault();
        var input = $('#iris-form-input').val();
        if ($('#iris-autocomplete').hasClass('active')) COMPLETE.select();
        else PANEL.process_input(input);
    });

    $('#iris-autocomplete').mousemove(function(e){
        if ($(e.target).hasClass('iris-autocomplete-item')) {
            $('.iris-autocomplete-item').removeClass('focus');
            $(e.target).addClass('focus');
        }
    });

    $('#iris-autocomplete').click(function(e){
        if ($(e.target).hasClass('iris-autocomplete-item')) {
            COMPLETE.select();
        }
    });

    /*
    $('.iris-autocomplete-item').mouseleave(function(){
        $(this).removeClass('focus');
    });
    */

    $('#iris-form-delete').click(function(){ $('#iris-form-input').val('').focus(); });

    $('#iris-details-head .tab').click(function(){
        var target = $(this).attr('target');
        PANEL.set_details(target);
    });

    $('#iris-delete-target').click(function(){
        if (TARGET.nodeName == 'BODY') {
            $(TARGET).append('<img id="iris-cage" src="https://iscfc.files.wordpress.com/2014/01/vampires-kiss.jpg" title="Deleting the body?">');
            setTimeout(function(){ $('#iris-cage').remove(); }, 3000);
        } else {
            if (confirm('Are you sure you want to delete this thing? That gonna remove all childrens thing too.')) {
                $(TARGET).remove();
            }
        }
    });

    $('#iris-text').keydown(function(e){
        if (e.key == 'Enter')  {
            var text = $(this).val();
            if (text != '') {
                $(TARGET).text(text);
                $(this).val('').hide();
            }
        }
    });
}

var HTML = ['a','abbr','acronym','address','applet','area','article','aside','audio','b','base','basefont','bdi','bdo','big','blockquote','br','button','canvas','caption','center','cite','code','col','colgroup','data','datalist','dd','del','details','dfn','dialog','dir','div','dl','dt','em','embed','fieldset','figcaption','figure','font','footer','form','frame','frameset','h1','h2','h3','h4','h5','h6','header','hr','html','i','iframe','img','input','ins','kbd','label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','param','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','strong','style','sub','summary','sup','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var','video','wbr'];
var CSS = ['align-content','align-items','align-self','all','animation','animation-delay','animation-direction','animation-duration','animation-fill-mode','animation-iteration-count','animation-name','animation-play-state','animation-timing-function','backface-visibility','background','background-attachment','background-blend-mode','background-clip','background-color','background-image','background-origin','background-position','background-repeat','background-size','border','border-bottom','border-bottom-color','border-bottom-left-radius','border-bottom-right-radius','border-bottom-style','border-bottom-width','border-collapse','border-color','border-image','border-image-outset','border-image-repeat','border-image-slice','border-image-source','border-image-width','border-left','border-left-color','border-left-style','border-left-width','border-radius','border-right','border-right-color','border-right-style','border-right-width','border-spacing','border-style','border-top','border-top-color','border-top-left-radius','border-top-right-radius','border-top-style','border-top-width','border-width','bottom','box-decoration-break','box-shadow','box-sizing','caption-side','caret-color','@charset','clear','clip','color','column-count','column-fill','column-gap','column-rule','column-rule-color','column-rule-style','column-rule-width','column-span','column-width','columns','content','counter-increment','counter-reset','cursor','direction','display','empty-cells','filter','flex','flex-basis','flex-direction','flex-flow','flex-grow','flex-shrink','flex-wrap','float','font','@font-face','font-family','font-kerning','font-size','font-size-adjust','font-stretch','font-style','font-variant','font-weight','grid','grid-area','grid-auto-columns','grid-auto-flow','grid-auto-rows','grid-column','grid-column-end','grid-column-gap','grid-column-start','grid-gap','grid-row','grid-row-end','grid-row-gap','grid-row-start','grid-template','grid-template-areas','grid-template-columns','grid-template-rows','hanging-punctuation','height','@import','justify-content','@keyframes','left','letter-spacing','line-height','list-style','list-style-image','list-style-position','list-style-type','margin','margin-bottom','margin-left','margin-right','margin-top','max-height','max-width','@media','min-height','min-width','object-fit','opacity','order','outline','outline-color','outline-offset','outline-style','outline-width','overflow','overflow-x','overflow-y','padding','padding-bottom','padding-left','padding-right','padding-top','page-break-after','page-break-before','page-break-inside','perspective','perspective-origin','position','quotes','resize','right','tab-size','table-layout','text-align','text-align-last','text-decoration','text-decoration-color','text-decoration-line','text-decoration-style','text-indent','text-justify','text-overflow','text-shadow','text-transform','top','transform','transform-origin','transform-style','transition','transition-delay','transition-duration','transition-property','transition-timing-function','unicode-bidi','user-select','vertical-align','visibility','white-space','width','word-break','word-spacing','word-wrap','z-index'];
var HTML_TEXT = ['a', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong'];
var jAUTOCOMPLETE = HTML.concat(CSS);
var COMPLETE_PERSO = [];

var CSSLOAD = false;
var CSSNAME;
var STYLE;
var CTRL_K = false;
var PANEL = new Panel();
var WORK = new Work_view();
var FILE = new File_modal();
var TEXT = new Text();
var COMPLETE = new Complete();

PANEL.init();
WORK.init();
FILE.init();
TEXT.init();
COMPLETE.init();
events();
(function ($, chrome, document) {

    var allResponseData = new ResponseDataCollection();

    chrome.devtools.network.onRequestFinished.addListener(function(data) {
        var id = 0;
        data.getContent(function (responseContent) {
             allResponseData.addItem(new responseData(data.request.url, data.request.method, data.response.status, responseContent));
        });
    });

    $('#clear').click(function () {
        allResponseData.allResponses = [];
        allResponseData.drawAll();
    });

    $('#updateRegex').click(function () {
        allResponseData.setUrlFilter(new RegExp($('#urlRegex').val()));
    });

    document.getElementById('content').innerHTML = 'You haven\'t made any requests you big dummy';
    
    function responseData(url, method, status, body) {
        this.id = allResponseData.allResponses.length;
        this.url = url;
        this.method = method;
        this.status = status;
        this.body = {
            "httpMethod": method,
            "statusCode": status,
            "uri": url,
            "response": JSON.parse(body)
        };
    };

    function ResponseDataCollection() {
        this.allResponses = [];
        this.regex = /.*/;
    };

    ResponseDataCollection.prototype.addItem = function(responseData) {
        this.allResponses.push(responseData);
        this.drawAll();
    };

    ResponseDataCollection.prototype.setUrlFilter = function(regex) {
        this.regex = regex;
        this.drawAll();
    };

    ResponseDataCollection.prototype.drawAll = function() {
        var content = '', self = this;

        this.allResponses.forEach(function(fixture) {

            if(fixture.url.match(self.regex)) {
                content += '<tr class="fixturemeta">';
                content += '<td>' + fixture.id + '</td>';
                content += '<td>' + fixture.url + '</td>';
                content += '<td>' + fixture.method + '</td>';
                content += '<td>' + fixture.status + '</td>';
                content += '</tr>';
                content += '<tr class="fixturebody" style="display: none;"><td colspan="4"><pre>' + JSON.stringify(fixture.body) + '</pre></td></tr>';
            }
        });

        document.getElementById('content').innerHTML = content;

        this.rebind();
    }

    ResponseDataCollection.prototype.rebind = function() {
        // Show hide response body
        $('tr.fixturemeta').click(function () {
            $(this).next(".fixturebody").toggle();
        });

        // Highlight response body on click
        $('table pre').on('click', function(){
            var range = document.createRange();
            var selection = window.getSelection();
            range.selectNodeContents(this);
            
            selection.removeAllRanges();
            selection.addRange(range);
        });
    }
})($, chrome, document);
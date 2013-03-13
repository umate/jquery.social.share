/**
 * jQuery social share plugin v.0.1
 * @author Artem Litvinov
 * @date 02/05/2013
 */
;(function($) {

    // Supported services URLs
    var _services = {
        'vkontakte' : {
             baseUrl : 'http://vk.com/share.php'
            ,params: ['url', 'title', 'description', 'image']
            ,requiredParams: ['url']
            ,popupSize: [600, 600]
        }
        ,'twitter'  :    'https://twitter.com/intent/tweet?url={{url}}&text={{title}}'
        ,'facebook' :    {
             baseUrl : 'https://www.facebook.com/dialog/feed'
            ,params: ['app_id', 'link', 'picture', 'name', 'caption', 'description', 'redirect_uri']
            ,requiredParams: ['app_id', 'redirect_uri']
            ,popupSize: [1000, 600]
        }
    };

    // Prepare share URL
    function _prepareData(serviceId, obj) {
        var serviceConfig = _services[serviceId];

        $obj = $(obj);

        // Should specify serviceId
        if (!serviceId) { throw new Error('SocialShare Plugin: Unsupported specify service'); }

        // ServiceId should exist
        if (!serviceConfig) { throw new Error('SocialShare Plugin: "' + serviceId + '" do not exist'); }

        // replace template
        var urlParts = [];

        $.each(serviceConfig.params,function(index, paramName){
            var objParamValue = $obj.data(paramName);
            if (objParamValue) {
                urlParts.push([[paramName, encodeURIComponent(objParamValue)].join('=')])
            }
        });

        var returnData = {
             shareUrl: serviceConfig.baseUrl + '?' + urlParts.join('&')
            ,popupSize: serviceConfig.popupSize
        };

        return returnData;
    }

    /**
     * Native browser popup
     */
    var NativePopup = Class.extend({
        /**
         * Constructor
         * @param url popup source URL
         * @param title popup title
         * @param width width
         * @param height height
         */
        init: function(url, title, width, height) {

            this.url     =   url;
            this.title   =   title   || document.title;
            this.width   =   width   || 600;
            this.height  =   height  || 450;

            this.leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
            //Allow for title and status bars.
            this.topPosition = (window.screen.height / 2) - ((height / 2) + 50);
            this.windowFeatures = "status=no,height=" + this.height + ",width=" + this.width + ",resizable=yes,left=" +
                this.leftPosition + ",top=" + this.topPosition + ",screenX=" + this.leftPosition +
                ",screenY=" + this.topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
        }

        ,open: function() {
            window.open(
                 this.url
                ,this.title
                ,this.windowFeatures
            );
            return false;
        }
    });

    // Return if the plugin has been already defined
    if ($.fn.SocialShare) return;

    $.fn.SocialShare = function() {

        $(this).each(function(index, obj) {
            var $obj = $(obj);
            var params = _prepareData($obj.data('social-service'), $obj);

            $obj.on('click', function() {
                var popup = new NativePopup(
                    params.shareUrl,
                    document.title,
                    params.popupSize[0],
                    params.popupSize[1]
                );
                popup.open();
            });
        });
    }

})(jQuery);
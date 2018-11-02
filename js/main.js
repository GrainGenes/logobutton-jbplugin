/* 
 */

define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/Deferred',
           'JBrowse/Plugin',
           'JBrowse/Util'
       ],
       function(
           declare,
           lang,
           Deferred,
           JBrowsePlugin,
           Util        
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        console.log("plugin: LogoButton",args);

        let thisB = this;
        let browser = this.browser;
        let conf = browser.config;
        let dataRoot = conf.baseUrl + conf.dataRoot;

        let dialogTitle = args.dialogTitle || "Information";
        let logoFile = args.logoFile || "plugins/LogoButton/GG3-2.png";
        let logoURL = "http://github.com/nuggetry/logobutton-jbplugin";
        let hasInfoButton = args.hasInfoButton || false;
        let showInfoDialog = args.showInfoDialog || false;

        console.log("showInfoDialog",typeof showInfoDialog,"hasInfoButton",typeof hasInfoButton);

        // if arg.logo is defined, reference the logo in the data directory
        if (args.logo) logoFile = conf.dataRoot + '/' + args.logo;

        if (args.logoURL) {
            logoURL = args.logoURL;
            logoText = args.logoUrl;
        }
        let logoText = args.logoText || "Plugin on Github";

        // create function intercept after view initialization (because the view object doesn't exist before that)
        browser.afterMilestone( 'initView', function() {

        //console.log("initView");
        let logoImg = '<span class="dijit dijitReset dijitInline menu"><img title="'+logoText+'" id="logoInfoImage" src="'+logoFile+'" /></span>';
            
        let infoBtn = '<button id="infoButton" class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="'+dialogTitle+'">'+
        '  <span class="ui-icon ui-icon-info"></span> i '+
        '</button>'+
        '<div id="infoDialog" title="'+dialogTitle+'"></div>';

        $('div.menuBar').prepend(logoImg);
        
        if (hasInfoButton){
            if ($('div.dataset-name'))
                $(infoBtn).insertAfter('div.dataset-name');
            else
                $('div.menuBar').prepend(infoBtn);
        }

        if (hasInfoButton)
            $('div.dataset-name').prop('title',dialogTitle);

        $( function() {
            $( "#infoDialog" ).dialog({
                modal: true,
                dialogClass: "no-titlebar",
                autoOpen: showInfoDialog,
                position:{my:"top right", at:"top right", of:".trackContainer"},
                width: 1000,
                show: {
                effect: "scale",
                duration: 1000
                },
                hide: {
                effect: "scale",
                duration: 1000
                },
                open: function () {
                    $(this).load(dataRoot+'/pageinfo.html',function( response, status, xhr) {
                        if ( status == "error" ) {
                            let msg = "<p>pageinfo.html: " + xhr.status + " " + xhr.statusText + "</p>";
                            if (xhr.status===404)
                                msg += "<p>Place pageinfo.html in the data root.  This will be displayed in the this dialog box upon launch.";

                            $( "#infoDialog" ).html( msg );

                            $("#infoDialogClose").on( "click", function() {
                                $( "#infoDialog" ).dialog( "close" );
                            });
                    });
                }          
            });
        });
        
        // setup click handling
        $("#logoInfoImage").on( "click", function() {
            window.parent.location = logoURL;
        });
        if (hasInfoButton) {
                $("#infoButton").on( "click", function() {
                    console.log("Info Button click");
                    $( "#infoDialog" ).dialog( "open" );
                });
                $("div.dataset-name").on( "click", function() {
                    $( "#infoDialog" ).dialog( "open" );
                });
            }
        }); 
        
        function getPluginConf() {
            let plugins = conf.plugins;
            let hasPlugin = false;
            plugins.forEach(function(item) {
                console.log(item,typeof item);
                if (item==="LogoButton" || item.name==="LogoButton") hasPlugin = item;
            });
            return hasPlugin;
        };
    }
    
});
});


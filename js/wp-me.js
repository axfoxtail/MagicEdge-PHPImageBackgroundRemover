/*
 Name: Magic Edge - Image Background Remover for WordPress
 Description: Image Background Remover provide easy way to remove background from complex photo.
 Author: Srdjan Arsic
 Version: 1.1.2
 Author URI: http://www.awssoft.com/magic-edge/
 */

if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", BR_onPageLoaded);
else if (window.attachEvent)
    window.attachEvent("onload", BR_onPageLoaded);
else if (window.onLoad)
    window.onload = BR_onPageLoaded;


function BR_onPageLoaded() {
    var a = new WPBRApplication();
    a.init();
}

var WPBRApplication = function () {

    this.addHandlers = function () {

        var self = this;
        var downloadImageHandler = function (event) {

            self.brApplication.createTransparentImageCanvas();

            var outputCanvas = self.brApplication.getOutputImageCanvas();
            self.brApplication.latestTransparentBase64 = outputCanvas.toDataURL();

            var imgB64 = self.brApplication.getTransparentBase64();

            if (!imgB64) {
                self.brApplication.addMessage("No image to save.");
                return;
            }

            var orgImageFullPath;
            if (self.brApplication.canvasImageName) {
                orgImageFullPath = self.brApplication.canvasImageName;
            } else {
                orgImageFullPath = jQuery('#upload_image').attr('value');
            }

            orgImageFullPath = orgImageFullPath.substr(0, orgImageFullPath.lastIndexOf('.')) + ".png";

            try {
                saveAs(window.dataURLtoBlob(self.brApplication.latestTransparentBase64), "transparent-" + orgImageFullPath);
            } catch (e) {
                self.brApplication.addMessage("Unexpected error: " + e);
            }

        }
        this.brApplication.setImageDownloadHandler(downloadImageHandler);

        var saveImageHandler = function () {

            self.brApplication.disableInput(self.brApplication.rootHolder, "Loading...");

            self.brApplication.createTransparentImageCanvas();

            var outputCanvas = self.brApplication.getOutputImageCanvas();
            self.brApplication.latestTransparentBase64 = outputCanvas.toDataURL();

            var imgB64 = self.brApplication.getTransparentBase64();

            if (!imgB64) {
                self.brApplication.addMessage("No image to save.");
                return;
            }

            var data = {}
            if (self.brApplication.canvasImageName) {
                data.orgImageFullPath = self.brApplication.canvasImageName;
            } else {
                data.orgImageFullPath = jQuery('#upload_image').attr('value');
            }

            data.imageBase64 = imgB64;

            var reqObj = {action: "save_image", data: data};


            BRUtilStatic.makeRequest(self.brApplication.config.ajaxUrl, reqObj, function (resData) {

                self.brApplication.enableInput(self.brApplication.rootHolder);

                try {
                    var resData = JSON.parse(resData);
                } catch (ex) {
                    self.brApplication.addMessage("Error 3221 - Process response parse error");
                    return;
                }

                if (resData.success == true) {
                    self.brApplication.addMessage(resData.message);
                } else if (resData.error == true) {
                    self.brApplication.addMessage(resData.errorMessage);
                } else {
                    self.brApplication.addMessage("Unknown error - 0001");
                }

            });

        }
        this.brApplication.setImageSaveHandler(saveImageHandler);


        var imageSelectHandler = function () {

            self.brApplication.canvasImageName = null;

            formfield = jQuery('#upload_image').attr('name');
            tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true');
            return false;
        }

        this.brApplication.setImageSelectHandler(imageSelectHandler);

    }

    this.init = function () {

        this.brApplication = new BRApplication();
        this.brApplication.setHolder(document.getElementById("BR-rootHolder"));

        if (typeof frontendMagicEdgeConfig != 'undefined') {
            this.brApplication.setConfig({saveAction: "download", width: frontendMagicEdgeConfig.width, height: frontendMagicEdgeConfig.height});
        }
        else if (ajaxurl) {
            this.brApplication.setConfig({
                "ajaxUrl": ajaxurl,
                saveAction: "both"
            });
        }

        //this.brApplication.workerPath = BG_REM_GLOBAL.pluginUrl+"/magic-edge/js/me-worker.js";
        this.brApplication.transparentBgPatern = BG_REM_GLOBAL.pluginUrl + "/magic-edge-lite-image-background-remover/images/transparentBackground.png";
        this.brApplication.loaderIcon = BG_REM_GLOBAL.pluginUrl + "/magic-edge-lite-image-background-remover/images/spinner.gif";

        this.addHandlers();
        this.addWPCode();

        this.brApplication.init();

        this.inject();

        this.brApplication.setPreviewBackgroundColor("transparent");

    }

    this.inject = function () {

        var self = this;

        var $customColor = jQuery('<div id="BR-commandPreviewCustom" class="BR-commandBtn BR-commandPreviewCustom" title="Preview background color" value="#FFFFFF"></div> <div class="BR-colorPickerHolder"><div style="position: absolute;" class="BR-colorPicker" ></div></div>');
        $customColor.insertAfter(jQuery(".BR-commandPreviewTransparent"));

        jQuery('#BR-commandPreviewCustom').click(function () {
            jQuery('.BR-colorPicker').fadeIn(100);
        });

        jQuery('.BR-colorPicker').hide();
        var $cp = jQuery('.BR-colorPicker').farbtastic(function (color) {
            jQuery('#BR-commandPreviewCustom').css("background-color", color);
            self.brApplication.setPreviewBackgroundColor(color);
            self.brApplication.previewMode = "transparent";

        });

        $cp.get(0).farbtastic.setColor('#FFFFFF')

        jQuery(document).mousedown(function () {
            jQuery('.BR-colorPicker').each(function () {
                var display = jQuery(this).css('display');
                if (display == 'block')
                    jQuery(this).fadeOut(100);
            });
        });

    }

    this.addWPCode = function () {
        var self = this;
        window.send_to_editor = function (html) {

            imgurl = jQuery('img', html).attr('src');
            jQuery('#upload_image').val(imgurl);
            tb_remove();

            self.brApplication.loadImage.apply(self.brApplication, [imgurl]);

        }

    }

}

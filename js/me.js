/*
 Name: Magic Edge - Image Background Remover
 Description: Image Background Remover provide easy way to remove background from complex photo.
 Author: Srdjan Arsic
 Version: 1.1.2
 Author URI: http://www.awssoft.com/magic-edge/
 */

var BRApplicationLangDefault = {
    _ibr_select_magic_edge_tooltip: "Select magic edge tool",
    _ibr_select_magic_wand_tooltip: "Select magic wand tool",
    _ibr_select_extra_magic_wand_tooltip: "Select extra magic wand tool",
    _ibr_edge_mover_tool_tooltip: "Edge mover tool",
    _ibr_resize_horizontal_tooltip: "Resize horizontal this view",
    _ibr_resize_horizontal_oposite_tooltip: "Return to normal view",
    _ibr_eraser_tooltip: "Erase drawing tool",
    _ibr_undo_tooltip: "Undo",
    _ibr_redo_tooltip: "Redo",
    _ibr_select_foreground_poly_tooltip: "Select foreground tool",
    _ibr_select_background_poly_tooltip: "Select background tool",
    _ibr_select_foreground_line_tooltip: "Select foreground tool",
    _ibr_select_background_line_tooltip: "Select background tool",
    _ibr_clear_selection_tooltip: "Clear selection",
    _ibr_move_tooltip: "Move tool",
    _ibr_zoomin_tooltip: "Zoom In",
    _ibr_zoomout_tooltip: "Zoom Out",
    _ibr_select_image_btn: "Select",
    _ibr_select_image_tooltip: "Select image",
    _ibr_convert_image_btn: "Convert",
    _ibr_convert_image_tooltip: "Make the image transparent",
    _ibr_convert_engine_settings_tooltip: "Convert engine settings",
    _ibr_save_image_tooltip: "Save transparent image",
    _ibr_save_image_btn: "Save",
    _ibr_download_image_tooltip: "Download transparent image",
    _ibr_download_image_btn: "Download",
    _ibr_preview_background_tooltip: "Preview background color",
    _ibr_settings_tooltip: "Settings",
    _ibr_drop_image_text: "Drop an image into this field",
    _ibr_es_title: "Cutter engine settings",
    _ibr_es_filter_title: "Filter",
    _ibr_es_filter_description: "Edge detection filter",
    _ibr_es_filter_intensity_title: "Filter intensity",
    _ibr_es_filter_intensity_description: "Increase filter intensity (recommended only for large images)",
    _ibr_es_edge_recognition_title: "Edge recognition depth",
    _ibr_es_edge_recognition_description: "Lower value - greater transparency; Higher value - less transparency",
    _ibr_es_smooth_edge_title: "Smooth edge",
    _ibr_es_smooth_edge_description: "",
    _ibr_es_blur_edge_title: "Blur edges",
    _ibr_es_blur_edge_description: "",
    _ibr_es_edge_strength_title: "Edge strength",
    _ibr_es_edge_strength_description: "",
    _ibr_settings_title: "General Settings",
    _ibr_settings_url_title: "URL",
    _ibr_settings_url_description: "URL to the conversion server(e.g. http://subtractbackground.com/api/v1/YOUR-API-KEY )",
    _ibr_save_btn: "Save",
    _ibr_cancel_btn: "Cancel",
    _ibr_close_btn: "Close",
    _ibr_alert_title: "Alert",
    _ibr_msg_image_not_selected: "Image is not selected",
    _ibr_msg_image_not_converted: "Image is not converted"
}

var BRApplication = function () {

    this.isDevelop = true;
    this.isLite = true;
    
    this.viewType = "DUPLEX"

    this.previewMode = "transparent"; // "transparent",  "edge", "edgemask"
    this.edgeColor4 = [255, 0, 0, 255];
    this.showDarkMask = true;

    this.sizesArr = [];
    this.sizesArr["ERASER"] = 4;
    this.sizesArr["MAGICEDGE"] = 2;
    
    this.blurFilters = {
        "0": {
            blurEdges: false,
            blurStrength: 0
        },
        "1": {
            blurEdges: true,
            blurStrength: 1
        },
        "2": {
            blurEdges: true,
            blurStrength: 2
        },
        "3": {
            blurEdges: true,
            blurStrength: 3
        },
        "4": {
            blurEdges: true,
            blurStrength: 4
        },
        "5": {
            blurEdges: true,
            blurStrength: 5,
        },
        "6": {
            blurEdges: true,
            blurStrength: 6
        },
        "7": {
            blurEdges: true,
            blurStrength: 7
        },
        "8": {
            blurEdges: true,
            blurStrength: 8
        },
        "9": {
            blurEdges: true,
            blurStrength: 9
        },
        "10": {
            blurEdges: true,
            blurStrength: 10
        }
    }

    this.edgeMoverIncrease = 2;
    this.edgeMoverIncreaseMax = 300;
    this.edgeMoverIncreaseMin = 100;

    this.allowDropFile = true;

    this.globalPanMoveX = 0;
    this.globalPanMoveY = 0;
    this.currentPanMoveX = 0;
    this.currentPanMoveY = 0;
    this.panMoveEmptyX = 0;
    this.panMoveEmptyY = 0;
    this.currentZoom = 1;

    this.drawArr = {};
    this.drawArrAll = {};
    this.drawArrAllUndo = {};
    this.currentDrawArr = {};

    this.canvasCursorsArr = ["MAGICEDGE", "EDGEMOVER", "ERASER"];
    this.edgeDrawingTools = ["MAGICEDGE", "ERASER", "BGLINE", "FGLINE", "MAGICWAND", "EXTRAMAGICWAND"];

    this.fgDrawingTools = ["FGPOLY", "FGLINE"];
    this.bgDrawingTools = ["BGPOLY", "BGLINE"];
    this.drawingTools = ["BGPOLY", "BGLINE", "FGPOLY", "FGLINE", "MAGICEDGE", "EDGEMOVER", "ERASER", "MAGICWAND", "EXTRAMAGICWAND"];

    this.previewBackgroundColor = "transparent";

    this.bre = new BREngine();

    this.drawingToolsSettings = {
        CROP: {
            lineColor: "rgba(0, 0, 0, 0)",
            fillStyle: "rgba(0, 0, 0, 1)",
            lineWidth: 0,
            closed: true
        },
        FGPOLY: {
            lineColor: "rgba(0, 200, 0, 0.7)",
            fillStyle: "rgba(0, 200, 0, 0.4)",
            lineWidth: 10,
            closed: true
        },
        FGLINE: {
            lineColor: "rgba(0, 200, 0, 0.7)",
            fillStyle: "rgba(0, 200, 0, 0)",
            lineWidth: 10,
            closed: false
        },
        BGPOLY: {
            lineColor: "rgba(200, 0, 0, 0.7)",
            fillStyle: "rgba(200, 0, 0, 0.4)",
            lineWidth: 10,
            closed: true
        },
        BGLINE: {
            lineColor: "rgba(200, 0, 0, 0.7)",
            fillStyle: "rgba(200, 0, 0, 0)",
            lineWidth: 10,
            closed: false
        },
        MAGICEDGE: {
            lineColor: "rgba(255, 255, 0, 0.6)",
            fillStyle: "rgba(200, 200, 200, 0)",
            lineWidth: 15,
            closed: false
        },
        MAGICWAND: {
            lineColor: "rgba(255, 255, 0, 0)",
            fillStyle: "rgba(200, 200, 200, 0)",
            lineWidth: 30,
            closed: false
        },
        /*EXTRAMAGICWAND:{
         lineColor: "rgba(255, 255, 0, 0)",
         fillStyle: "rgba(200, 200, 200, 0)",
         lineWidth: 30,
         closed: false
         },*/
        EDGEMOVER: {
            lineColor: "rgba(255, 255, 255, 0.7)",
            fillStyle: "rgba(200, 200, 200, 0)",
            lineWidth: 20,
            closed: false
        },
        ERASER: {
            lineColor: "rgba(0, 0, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 10,
            composite: "destination-out",
            closed: false
        }
    }

    this.maskDrawingToolsSettings = {
        FGPOLY: {
            lineColor: "black",
            fillStyle: "black",
            lineWidth: 10,
            closed: true
        },
        FGLINE: {
            lineColor: "rgba(0, 255, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 10,
            closed: false
        },
        BGPOLY: {
            lineColor: "black",
            fillStyle: "black",
            lineWidth: 10,
            closed: true
        },
        BGLINE: {
            lineColor: "rgba(255, 0, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 10,
            closed: false
        },
        MAGICEDGE: {
            lineColor: "rgba(255, 255, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 15,
            closed: false
        },
        MAGICWAND: {
            lineColor: "rgba(255, 255, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 30,
            closed: false
        },
        /*EXTRAMAGICWAND:{
         lineColor: "rgba(255, 255, 0, 1)",
         fillStyle: "rgba(0, 0, 0, 0)",
         lineWidth: 30,
         closed: false
         },*/
        EDGEMOVER: {
            lineColor: "rgba(0, 255, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 30,
            closed: false
        },
        EDGEMOVER_ALLOWED: {
            lineColor: "rgba(255, 255, 255, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 60,
            closed: false
        },
        ERASER: {
            lineColor: "rgba(0, 0, 0, 1)",
            fillStyle: "rgba(0, 0, 0, 0)",
            lineWidth: 10,
            composite: "destination-out",
            closed: false
        }
    }

    this.clearDrawingArr = function () {

        for (var i = 0; i < this.drawingTools.length; i++)
            this.drawArr[this.drawingTools[i]] = [];

        this.drawArrAll = [];
        this.drawArrAllUndo = [];

    }

    this.setConfig = function (config) {
        for (var name in config) {
            this.config[name] = config[name];
        }
    }

    this.setHolder = function (holder) {
        this.rootHolder = holder;
    }

    this.config = {
        width: "full",
        height: "full",
        zoomMultipliers: [0.1, 0.2, 0.4, 0.7, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 14, 20],
        panInBounds: true,
        magicWandTolerance: 5,
        magicWandBorderWidth: 10,
        saveNamePrefix: "transparent-",
        saveAction: "download",
        ajaxUrl: "ajax.php",
        useWebWorker: false,
        blurFilter: 0,
        featherFilter: 0,
        autoCrop: false
    }


    /* >> EXTERNAL HANDLERS >> */

    this._imageSelectHandler = function () {
    };
    this._imageDropHandler = function () {
    };
    this._imageSaveHandler = function () {
    };
    this._imageDownloadHandler = function () {
    };

    this.initializeImageSaveAndDownload = function () {

        var self = this;

        if (this.config.saveAction == "ajax" || this.config.saveAction == "both") {

            var saveImageBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandSaveImage");
            saveImageBtn.style.display = "inline-block";

            var _h = function (event) {

                if (!self.converted) {
                    self.addMessage(self.getLang("msg_image_not_converted"));
                    return;
                }

                self._imageSaveHandler(event);
            }
            BRUtilStatic.addEvent(saveImageBtn, "click", _h, false);

        }

        if (this.config.saveAction == "download" || this.config.saveAction == "both") {

            var downloadImageBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandDownloadImage");
            downloadImageBtn.style.display = "inline-block";

            var _h = function (event) {

                if (!self.converted) {
                    self.addMessage(self.getLang("msg_image_not_converted"));
                    return;
                }

                self._imageDownloadHandler(event);
            }
            BRUtilStatic.addEvent(downloadImageBtn, "click", _h, false);

        }

    }

    this.initializeImageSelect = function () {

        var self = this;

        var selectImageBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandSelectImage");
        var _h = function (event) {
            self._imageSelectHandler();
        }
        BRUtilStatic.addEvent(selectImageBtn, "click", _h, false);

    }

    this.setImageSelectHandler = function (handler) {
        this._imageSelectHandler = handler;
    }
    this.setImageDropHandler = function (handler) {
        this._imageDropHandler = handler;
    }
    this.setImageSaveHandler = function (handler) {
        this._imageSaveHandler = handler;
    }
    this.setImageDownloadHandler = function (handler) {
        this._imageDownloadHandler = handler;
    }

    /* << EXTERNAL HANDLERS << */

    this.getMainHtml = function () {

        this.mainHtml = '';

        this.mainHtml += '<div class="BR-mainHolder">';

        this.mainHtml += '<div class="BR-commandHolder1">';

        this.mainHtml += '  <div class="BR-commandBtn BR-commandText BR-commandSelectImage"  title="' + this.getLang("select_image_tooltip") + '">' + this.getLang("select_image_btn") + '</div>';
        this.mainHtml += '  <a class="BR-commandBtn BR-commandText BR-commandSaveImage"  title="' + this.getLang("save_image_tooltip") + '">' + this.getLang("save_image_btn") + '</a>';
        this.mainHtml += '  <a class="BR-commandBtn BR-commandText BR-commandDownloadImage"  title="' + this.getLang("download_image_tooltip") + '">' + this.getLang("download_image_btn") + '</a>';

        this.mainHtml += '  <div class="BR-commandBtn BR-commandMove"  title="' + this.getLang("move_tooltip") + '"></div>';
        this.mainHtml += '  <div class="BR-commandBtn BR-commandZoomIn" title="' + this.getLang("zoomin_tooltip") + '"></div>';
        this.mainHtml += '  <div class="BR-commandBtn BR-commandZoomOut"  title="' + this.getLang("zoomout_tooltip") + '"></div>';

        this.mainHtml += '  <div class="BR-commandBtn BR-commandRemoveDrawing"  title="' + this.getLang("clear_selection_tooltip") + '"></div>';

        this.mainHtml += '  <div class="BR-commandBtn BR-commandUndo"  title="' + this.getLang("undo_tooltip") + '"></div>';
        this.mainHtml += '  <div class="BR-commandBtn BR-commandRedo"  title="' + this.getLang("redo_tooltip") + '"></div>';

        this.mainHtml += '  <div class="BR-commandBtn BR-commandText BR-commandConvert"  title="' + this.getLang("convert_image_tooltip") + '">Convert</div>';

        this.mainHtml += '    <div style="position:absolute; right:0px; top:0px;">';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandPreviewEdge"  title=""></div>';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandPreviewEdgeMask"  title=""></div>';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandPreviewTransparent"  title="' + this.getLang("preview_background_tooltip") + '"></div>';
        this.mainHtml += '    </div>';

        this.mainHtml += '</div>';

        this.mainHtml += '<div class="BR-commandHolder2">';
        this.mainHtml += '  <div class="BR-commandHolder2Left">';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandMagicEdge"  title="' + this.getLang("select_magic_edge_tooltip") + '"><div class="BR-magicEdgeSizeLabel BR-magicEdgeSizeLabelMain">2</div></div>';
        this.mainHtml += '<div class="BR-commandBtnArrow BR-commandMagicEdgeSub"  title=""></div>';

        this.mainHtml += '<div class="BR-magicEdgeOptionsHolder" style="display:none;">';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandMagicEdgeSubBtn BR-commandMagicEdge3" data-size="3" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-magicEdgeSizeLabel">3</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandMagicEdgeSubBtn BR-commandMagicEdge2" data-size="2" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-magicEdgeSizeLabel">2</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandMagicEdgeSubBtn BR-commandMagicEdge1" data-size="1" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-magicEdgeSizeLabel">1</div></div>';
        this.mainHtml += '</div>';

        this.mainHtml += '     <div class="BR-commandBtn BR-commandMagicWand"  title="' + this.getLang("select_magic_wand_tooltip") + '"></div>';

        this.mainHtml += '<div class="BR-commandMagicWandPropsHolder">';
        this.mainHtml += '<div class="BR-commandMagicWandPropLabel1">Tol</div><input type="number" min="0" max="99" class="BR-commandMagicWandPropTolerance" value="' + this.config.magicWandTolerance + '" />';
        this.mainHtml += '<div class="BR-commandMagicWandPropLabel2">Bor</div><input type="number" min="1" max="99" class="BR-commandMagicWandPropBorderWidth" value="' + this.config.magicWandBorderWidth + '" />';
        this.mainHtml += '</div>';

        //this.mainHtml += '     <div class="BR-commandBtn BR-commandExtraMagicWand"  title="'+this.getLang("select_magic_wand_filter_tooltip")+'"></div>';

        this.mainHtml += '     <div class="BR-commandBtn BR-commandSelectForegroundLine"  title="' + this.getLang("select_foreground_line_tooltip") + '"></div>';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandSelectBackgroundLine"  title="' + this.getLang("select_background_line_tooltip") + '"></div>';

        this.mainHtml += '     <div class="BR-commandBtn BR-commandEraser"  title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel BR-eraserSizeLabelMain">2</div></div>';
        this.mainHtml += '<div class="BR-commandBtnArrow BR-commandEraserSub"  title=""></div>';

        this.mainHtml += '<div class="BR-eraserOptionsHolder" style="display:none;">';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser10" data-size="10" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">10</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser5" data-size="5" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">5</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser4" data-size="4" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">4</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser3" data-size="3" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">3</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser2" data-size="2" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">2</div></div>';
        this.mainHtml += '<div class="BR-commandBtn BR-commandSubBtn BR-commandEraserSubBtn BR-commandEraser1" data-size="1" title="' + this.getLang("eraser_tooltip") + '"><div class="BR-eraserSizeLabel">1</div></div>';
        this.mainHtml += '</div>';

        this.mainHtml += '    <div style="position:absolute; right:0px; top:0px;">';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandResizeHorizontalLeft"  title="' + this.getLang("resize_horizontal_tooltip") + '"></div>';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandResizeHorizontalOpositeLeft"  title="' + this.getLang("resize_horizontal_oposite_tooltip") + '"></div>';
        this.mainHtml += '    </div>';

        this.mainHtml += '  </div>';

        this.mainHtml += '  <div class="BR-commandHolder2Right">';

        this.mainHtml += '  <div class="BR-commandEdgeHolder"><div class="BR-edgeLabel">Feather</div>';
        this.mainHtml += '    <select class="BR-commandBtn BR-commandText BR-commandFeatherSelect"  title="Edge">';
        this.mainHtml += '      <option value="0" label="0">0</option>';
        this.mainHtml += '      <option value="1" label="1">1</option>';
        this.mainHtml += '      <option value="2" label="2">2</option>';
        this.mainHtml += '      <option value="3" label="3">3</option>';
        this.mainHtml += '      <option value="4" label="4">4</option>';
        this.mainHtml += '      <option value="5" label="5">5</option>';
        this.mainHtml += '      <option value="6" label="6">6</option>';
        this.mainHtml += '      <option value="7" label="7">7</option>';
        this.mainHtml += '      <option value="8" label="8">8</option>';
        this.mainHtml += '      <option value="9" label="9">9</option>';
        this.mainHtml += '      <option value="10" label="10">10</option>';
        this.mainHtml += '    </select></div>';

        this.mainHtml += '  <div class="BR-commandEdgeHolder"><div class="BR-edgeLabel">shadow</div>';
        this.mainHtml += '    <select class="BR-commandBtn BR-commandText BR-commandEdgeSelect"  title="Edge">';
        this.mainHtml += '      <option value="0" label="0">0</option>';
        this.mainHtml += '      <option value="1" label="1">1</option>';
        this.mainHtml += '      <option value="2" label="2">2</option>';
        this.mainHtml += '      <option value="3" label="3">3</option>';
        this.mainHtml += '      <option value="4" label="4">4</option>';
        this.mainHtml += '      <option value="5" label="5">5</option>';
        this.mainHtml += '      <option value="6" label="6">6</option>';
        this.mainHtml += '      <option value="7" label="7">7</option>';
        this.mainHtml += '      <option value="8" label="8">8</option>';
        this.mainHtml += '      <option value="9" label="9">9</option>';
        this.mainHtml += '      <option value="10" label="10">10</option>';
        this.mainHtml += '    </select></div>';

        this.mainHtml += '     <label class="BR-commandInfoLabel BR-commandInfoCrop"><div class="BR-commandInfoBtn BR-commandCrop"  title="' + this.getLang("crop_tooltip") + '"></div>';
        this.mainHtml += '<div class="BR-commandAutoCrop"  title=""><div class="BR-commandSubInner">Auto <br/><input type="checkbox" class="BR-autoCropCB"></input></div></div></label>';
        //this.mainHtml += '<div class="BR-commandManualCrop"  title=""><div class="BR-commandSubInner">Cord <br/><input type="checkbox"></input></div></div>'; 

        this.mainHtml += '<div class="BR-commandManualCropPropsHolder">';
        this.mainHtml += '<div class="BR-commandManualCropPropLabel1">X</div><input type="number" min="0" max="9999" class="BR-commandManualCropPropX" value="' + this.config.commandManualCropPropX + '" />';
        this.mainHtml += '<div class="BR-commandManualCropPropLabel2">Y</div><input type="number" min="0" max="9999" class="BR-commandManualCropPropY" value="' + this.config.commandManualCropPropY + '" />';
        this.mainHtml += '<div class="BR-commandManualCropPropLabel3">W</div><input type="number" min="1" max="9999" class="BR-commandManualCropPropW" value="' + this.config.commandManualCropPropW + '" />';
        this.mainHtml += '<div class="BR-commandManualCropPropLabel4">H</div><input type="number" min="1" max="9999" class="BR-commandManualCropPropH" value="' + this.config.commandManualCropPropH + '" />';
        this.mainHtml += '</div>';

        this.mainHtml += '    <div style="position:absolute; right:0px; top:0px;">';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandResizeHorizontalRight"  title="' + this.getLang("resize_horizontal_tooltip") + '"></div>';
        this.mainHtml += '     <div class="BR-commandBtn BR-commandResizeHorizontalOpositeRight"  title="' + this.getLang("resize_horizontal_oposite_tooltip") + '"></div>';
        this.mainHtml += '    </div>';

        this.mainHtml += '  </div>';
        this.mainHtml += '</div>';

        this.mainHtml += '<div class="BR-settingsHolder"></div>';
        this.mainHtml += '<div class="BR-messagesHolder"></div>';

        this.mainHtml += '<div class="BR-imagesHolder">';
        this.mainHtml += '<div class="BR-leftImageHolder" ><canvas class="BR-leftCanvasImage"></canvas><canvas class="BR-leftCanvasDraw"></canvas><canvas class="BR-leftCanvasCursor" tabindex="1" autofocus ></canvas><div class="BR-dropInfo">' + this.getLang("drop_image_text") + '</div></div>';
        this.mainHtml += '<div class="BR-rightImageHolder"><canvas class="BR-rightCanvas"></canvas><canvas class="BR-rightCanvasDraw"></canvas><canvas class="BR-rightCanvasCursor" tabindex="2"></canvas></div>';
        this.mainHtml += '</div>';

        this.mainHtml += '</div>';

        return this.mainHtml;

    }

    this.getMessagesHtml = function () {

        var html = '<table width="100%"><tr><td>'
        html += '<h2>' + this.getLang("alert_title") + '</h2>';
        html += '<p class="BR-messageHolder"></p>';
        html += '<p><input type="button" class="BR-cancelMessagesBtn button" value=" ' + this.getLang("close_btn") + ' "></p>'
        html += '</td><tr></table>'

        return html;

    }

    this.updateHorizontalResizersButtons = function () {

        var commandResizeHorizontalLeft = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalLeft");
        var commandResizeHorizontalOpositeLeft = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalOpositeLeft");
        var commandResizeHorizontalRight = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalRight");
        var commandResizeHorizontalOpositeRight = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalOpositeRight");

        if (this.viewType == "DUPLEX") {
            commandResizeHorizontalLeft.style.display = "block";
            commandResizeHorizontalOpositeLeft.style.display = "none";
            commandResizeHorizontalRight.style.display = "block";
            commandResizeHorizontalOpositeRight.style.display = "none";
        } else if (this.viewType == "LEFTFULL") {
            commandResizeHorizontalLeft.style.display = "none";
            commandResizeHorizontalOpositeLeft.style.display = "block";
        } else if (this.viewType == "RIGHTFULL") {
            commandResizeHorizontalRight.style.display = "none";
            commandResizeHorizontalOpositeRight.style.display = "block";
        }

    }

    this.addMessage = function (msg) {
        this.messagesHolder.style.display = "block";
        this.messageHolder.innerHTML += msg + "<br/>";
    }

    this.clearMessage = function () {
        this.messagesHolder.style.display = "none";
        this.messageHolder.innerHTML = "";
    }

    this.applyLanguage = function () {

        this._lang = BRApplicationLangDefault;

        if (typeof BRApplicationLangCustom == "object" && BRApplicationLangCustom != null) {
            for (var name in BRApplicationLangCustom) {
                this._lang [name] = BRApplicationLangCustom[name];
            }
        }

    }

    this.getLang = function (alias) {
        return this._lang["_ibr_" + alias] !== undefined ? this._lang["_ibr_" + alias] : "Missing language definition for variable: " + alias;
    }

    this.init = function () {

        this.applyLanguage();

        this.leftImage = new Image();
        this.rightImage = new Image();

        this.clearDrawingArr();

        this.initializeInterface();
        this.initializeLeftEvents();
        this.initializeRightEvents();
        this.updateHorizontalResizersButtons();
        this.initializeFileDrop();
        this.initializeImageSelect();
        this.initializeImageSaveAndDownload();

        this.resetRedo();
        this.updateUndoRedoBtn();


        var self = this;
        this.windowResizeHandler = function () {
            self.resizeInterface();
        }
        BRUtilStatic.addEvent(window, 'resize', this.windowResizeHandler, false);

        this.loadTransparentBackground();

        this.setLeftTool("MAGICEDGE");
        this.setRightTool("PAN"); //EDGEMOVER
    }

    this.drawRightCursor = function (toolName, x, y) {

        if (this.canvasCursorsArr.indexOf(toolName) == -1) {
            return;
        }

        var canvas = this.rightCanvasCursor;

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!this.mouseOnRight)
            return;

    }

    this.drawCursor = function (toolName, side, x, y) {

        this.latestCursorPos = {x: x, y: y};

        var canvas = side == "LEFT" ? this.leftCanvasCursor : this.rightCanvasCursor;

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.canvasCursorsArr.indexOf(toolName) == -1) {
            return;
        }

        if (side == "LEFT" && !this.mouseOnLeft)
            return;
        if (side == "RIGHT" && !this.mouseOnRight)
            return;

        if (toolName == "MAGICEDGE") {

            var size = this.sizesArr["MAGICEDGE"];
            var d = size * 15
            // get image part 
            var ctxFrom = this.leftCanvas.getContext("2d");
            var imgData = ctxFrom.getImageData(parseInt(x - d / 2), parseInt(y - d / 2), d, d);

            ctx.putImageData(imgData, parseInt(x - d / 2), parseInt(y - d / 2));

            ctx.beginPath();
            ctx.arc(x, y, d / 2 + 4 /*19*/, 0, 2 * Math.PI, false);
            ctx.lineWidth = 8;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();

        } else if (toolName == "ERASER") {

            var size = this.sizesArr["ERASER"];
            ctx.beginPath();
            ctx.arc(x, y, (size * 10 / 2) + 2 /*12*/, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, (size * 10 / 2) + 3 /*13*/, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000';
            ctx.stroke();

        } else if (toolName == "EDGEMOVER") {

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
            ctx.lineWidth = 12;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#777777';
            ctx.stroke();

        }

    }

    this.loadTransparentBackground = function () {

        var self = this;
        this.transparentBackgroundImage = new Image();
        this.transparentBackgroundImage.onload = function () {
            self.drawTransparentBackground(self.rightCanvas);
        };
        this.transparentBackgroundImage.src = this.transparentBgPatern;

    }


    this.clearRightData = function () {

        this.transparentImageCanvasEdgeEffect = null;
        this.transparentImageCanvas = null;

    }

    this.loadImage = function (url) {

        this.dropInfo.style.display = "none";

        this.currentZoom = 1;
        this.clearDrawingArr();
        this.currentDrawArr = {};

        this.resetRedo();
        this.updateUndoRedoBtn();

        this.converted = false;
        this.clearRightData();


        this.latestTransparentBase64 = null;

        this.rightImage.src = '';


        var self = this;

        this.leftImage.onload = function () {

            self.leftImageLoaded = true;
            self.fitImages();

            self.setInitialCropSize();
        }

        this.leftImage.src = url;

    }

    this.setInitialCropSize = function () {
        this.setCropSize(0, 0, this.leftImage.width, this.leftImage.height);
    }


    this.setCropSize = function (x, y, w, h) {

        jQuery(".BR-commandManualCropPropX").val(x);
        jQuery(".BR-commandManualCropPropY").val(y);
        jQuery(".BR-commandManualCropPropW").val(w);
        jQuery(".BR-commandManualCropPropH").val(h);

    }
    this.getCropSize = function () {

        return {
            x: jQuery(".BR-commandManualCropPropX").val() || 0,
            y: jQuery(".BR-commandManualCropPropY").val() || 0,
            width: jQuery(".BR-commandManualCropPropW").val() || 0,
            height: jQuery(".BR-commandManualCropPropH").val() || 0
        }

    }
    this.draw = function (canvas) {

        for (var i = 0; i < this.drawArrAll.length; i++) {

            var drawObj = this.drawArrAll[i];
            var settings = this.drawingToolsSettings[drawObj.tool];

            this.drawLineOrPoly(null, drawObj, settings, true);

        }

        for (var _tool in this.currentDrawArr) {

            var settings = this.drawingToolsSettings[_tool];
            var drawObj = this.currentDrawArr[_tool];

            this.drawLineOrPoly(null, drawObj, settings, false);

        }

    }

    this.pointToCanvas = function (_p, maskCreation) {

        var p = {x: _p.x, y: _p.y};

        if (maskCreation)
            return p;

        p.x *= this.totalZoom;
        p.y *= this.totalZoom;

        p.x += this.renderImageBounds.x
        p.y += this.renderImageBounds.y

        return p;

    }

    this.drawLineOrPoly = function (canvas, drawObj, settings, currentDrawing, maskCreation, forceLineStyle) {

        if (!canvas) {
            canvas = drawObj.side == "LEFT" ? this.leftCanvasDraw : this.rightCanvasDraw;
        }

        if (drawObj.tool == "MAGICWAND") {

            if (!this.leftImageLoaded)
                return;

            var selCanvas = drawObj.points[0].canvas;

            if (maskCreation) {
                canvas.getContext("2d").drawImage(selCanvas, 0, 0);
            } else {
                var _r = this.renderImageBounds
                canvas.getContext("2d").drawImage(selCanvas, _r.x, _r.y, _r.width, _r.height);
            }

            return;
        }


        /*if(drawObj.tool=="EXTRAMAGICWAND"){
         
         var selCanvas = drawObj.points[0].canvas;
         
         if(maskCreation){
         canvas.getContext("2d").drawImage(selCanvas, 0, 0 );
         }else{
         var _r = this.renderImageBounds
         canvas.getContext("2d").drawImage(selCanvas, _r.x, _r.y, _r.width , _r.height );
         }
         
         return;
         }*/


        var points = drawObj.points;

        if (points.length == 0)
            return;


        var ctx = canvas.getContext("2d");
        ctx.save();

        if (settings.composite)
            ctx.globalCompositeOperation = settings.composite;

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.strokeStyle = forceLineStyle ? forceLineStyle : settings.lineColor;
        ctx.fillStyle = settings.fillStyle;


        var size = drawObj.size ? drawObj.size : 1;
        if (maskCreation) {
            ctx.lineWidth = settings.lineWidth * size / drawObj.zoom;
        } else {
            ctx.lineWidth = settings.lineWidth * size * (this.totalZoom / drawObj.zoom);
        }

        var p;
        p = this.pointToCanvas(points[0], maskCreation)
        ctx.moveTo(p.x, p.y);

        for (var i = 0; i < points.length; i++) {
            p = this.pointToCanvas(points[i], maskCreation)
            ctx.lineTo(p.x, p.y);
        }

        if (settings.closed == true && (this.mouseDown == false || currentDrawing)) {
            p = this.pointToCanvas(points[0], maskCreation)
            ctx.lineTo(p.x, p.y);
        }

        ctx.fill();

        ctx.stroke();

        ctx.restore();

    }

    this.drawPreviewBackground = function (canvas) {

        if (this.previewBackgroundColor == "transparent") {
            this.drawTransparentBackground(canvas);
        } else {
            var ctx = canvas.getContext("2d");
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = this.previewBackgroundColor;
            ctx.fill();
        }

    }

    this.drawTransparentBackground = function (canvas) {

        try {

            var ctx = canvas.getContext("2d");
            var pattern = ctx.createPattern(this.transparentBackgroundImage, 'repeat');

            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pattern;
            ctx.fill();

        } catch (ex) {
        }

    }

    this.fitImages = function (renderRight) {

        this.clearCanvas(this.leftCanvas);
        this.fitImageOn(this.leftCanvas, this.leftImage, true);

        this.clearCanvas(this.leftCanvasDraw);
        this.clearCanvas(this.rightCanvasDraw);

        this.draw(this.leftCanvasDraw)

        if (renderRight && this.mainMaskData) {

            // MASKA
            if (this.previewMode == "edgemask") {

                this.rightCanvasMask = this.bre.getCanvas(this.leftImage.width, this.leftImage.height);
                var ctx = this.rightCanvasMask.getContext("2d");
                var imageData = ctx.createImageData(this.leftImage.width, this.leftImage.height);

                for (var i = 0; i < imageData.data.length; i++) {
                    imageData.data[i] = this.mainMaskData[i];
                }

                ctx.putImageData(imageData, 0, 0);

            }

            //EDGE
            if (this.previewMode == "edge" || this.previewMode == "edgemask") {
                this.rightCanvasMaskEdge = this.bre.getCanvas(this.leftImage.width, this.leftImage.height)
                var ctx = this.rightCanvasMaskEdge.getContext("2d");
                var imageData = ctx.createImageData(this.leftImage.width, this.leftImage.height);

                for (var i = 0; i < imageData.data.length; i++) {
                    imageData.data[i] = this.edgeData[i];
                }
                ctx.putImageData(imageData, 0, 0);
            }

        }

        this.clearCanvas(this.rightCanvas);
        this.drawPreviewBackground(this.rightCanvas);

        var _r = this.renderImageBounds

        if (this.previewMode == "edge" || this.previewMode == "edgemask") {
            this.fitImageOn(this.rightCanvas, this.leftImage, true);
            if (this.rightCanvasMask && this.previewMode == "edgemask")
                this.rightCanvas.getContext("2d").drawImage(this.rightCanvasMask, _r.x, _r.y, _r.width, _r.height);
            if (this.rightCanvasMaskEdge)
                this.rightCanvas.getContext("2d").drawImage(this.rightCanvasMaskEdge, _r.x, _r.y, _r.width, _r.height);
        }

        if (this.mainMaskData && this.previewMode == "transparent") {
            if (this.transparentImageCanvasEdgeEffect)
                this.rightCanvas.getContext("2d").drawImage(this.transparentImageCanvasEdgeEffect, _r.x, _r.y, _r.width, _r.height);
            if (this.transparentImageCanvas)
                this.rightCanvas.getContext("2d").drawImage(this.transparentImageCanvas, _r.x, _r.y, _r.width, _r.height);
        }

        // if(renderRight && this.transparentImageCanvas )

        try {
            this.drawCrop();
        } catch (ex) {
            console.log("ex1: " + ex)
        }

    }

    this.drawCrop = function () {

    }

    this.getOutputImageCanvas = function () {

        //var cropR = this.getCropSize();

        var outputCanvas = document.createElement("canvas");
        outputCanvas.width = this.leftImage.width;
        outputCanvas.height =  this.leftImage.height;

        if (this.transparentImageCanvasEdgeEffect)
            outputCanvas.getContext("2d").drawImage(this.transparentImageCanvasEdgeEffect, 0, 0, this.leftImage.width, this.leftImage.height);
        if (this.transparentImageCanvas)
            outputCanvas.getContext("2d").drawImage(this.transparentImageCanvas, 0, 0,  this.leftImage.width, this.leftImage.height);

        // this._drawImage(outputCanvas);
        
        return outputCanvas;
    }

    this.clearCanvas = function (canvas) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.fitImageOn = function (canvas, iobj, setGlobals) {

        var imageAspectRatio = iobj.width / iobj.height;
        var canvasAspectRatio = canvas.width / canvas.height;
        var renH, renW, xStart, yStart;

        var fitScale = 1;
        if (imageAspectRatio < canvasAspectRatio) {

            renH = canvas.height;
            fitScale = (renH / iobj.height);
            renW = iobj.width * fitScale;
            xStart = (canvas.width - renW) / 2;
            yStart = 0;

        }
        else if (imageAspectRatio > canvasAspectRatio) {

            renW = canvas.width
            fitScale = (renW / iobj.width);
            renH = iobj.height * fitScale;
            xStart = 0;
            yStart = (canvas.height - renH) / 2;

        }
        else {

            renH = canvas.height;
            renW = canvas.width;
            xStart = 0;
            yStart = 0;

        }


        var zoomedRenW = renW * this.currentZoom;
        var zoomedRenH = renH * this.currentZoom;

        var zoomedXPos = xStart - (zoomedRenW - renW) / 2;
        var zoomedYPos = yStart - (zoomedRenH - renH) / 2;

        this.zoomedXPosCentered = zoomedXPos;
        this.zoomedYPosCentered = zoomedYPos;

        if (zoomedRenW >= canvas.width) {
            var fullscreenZoom = 1;
            zoomedXPos -= this.currentPanMoveX + (this.globalPanMoveX * this.currentZoom * fullscreenZoom);
            this.zoomedXPosMoved = zoomedXPos;
        } else {
            this.currentPanMoveX = 0;
            this.globalPanMoveX = 0;
        }


        if (zoomedRenH >= canvas.height) {
            var fullscreenZoom = 1
            zoomedYPos -= this.currentPanMoveY + (this.globalPanMoveY * this.currentZoom * fullscreenZoom);
            this.zoomedYPosMoved = zoomedYPos;
        } else {
            this.currentPanMoveY = 0;
            this.globalPanMoveY = 0;
        }


        /*if(this.zoomChanged ){
         this.zoomChanged = false;
         
         this.globalPanMoveX =  - ( ( this.zoomedXPosMoved -  this.zoomedXPosCentered ) / this.currentZoom ) ;
         this.globalPanMoveY =  - ( ( this.zoomedYPosMoved -  this.zoomedYPosCentered ) / this.currentZoom );
         }*/

        //var ctx = canvas.getContext( "2d" );
        //ctx.clearRect ( 0 , 0 , canvas.width , canvas.height  );

        if (this.config.panInBounds && zoomedRenW >= canvas.width) {
            if (zoomedXPos > 0) {
                this.panMoveEmptyX = zoomedXPos;
                zoomedXPos = 0;
            }

            if (zoomedRenW + zoomedXPos < canvas.width) {
                this.panMoveEmptyX = zoomedXPos;
                zoomedXPos = -(zoomedRenW - canvas.width);
                this.panMoveEmptyX -= zoomedXPos;
            }

        }


        if (this.config.panInBounds && zoomedRenH >= canvas.height) {

            if (zoomedYPos > 0) {
                this.panMoveEmptyY = zoomedYPos;
                zoomedYPos = 0;
            }

            if (zoomedRenH + zoomedYPos < canvas.height) {
                this.panMoveEmptyY = zoomedYPos;
                zoomedYPos = -(zoomedRenH - canvas.height);
                this.panMoveEmptyY -= zoomedYPos;
            }

        }

        if (setGlobals) {
            this.fitScale = fitScale;
            this.totalZoom = this.fitScale * this.currentZoom;
            this.renderImageBounds = {x: zoomedXPos, y: zoomedYPos, width: zoomedRenW, height: zoomedRenH};
        }

        var ctx = canvas.getContext("2d");

        ctx.save( );

        try {
            ctx.drawImage(iobj, zoomedXPos, zoomedYPos, zoomedRenW, zoomedRenH);
        } catch (ex) {
        }

        ctx.restore( );

    }


    this.imgToBase64 = function (img, outputHandler, format) {

        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(format);
        outputHandler.call(this, dataURL);
        canvas = null;

    }

    this.initializeRightEvents = function () {

        var self = this;

        this.rightClickableAreaObj = this.rightCanvasCursor;


        //MOUSEWHEEL
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "mousewheel", function (event) {

            event.preventDefault();

            var delta = event.detail ? event.detail * (-120) : event.wheelDelta

            if (delta > 0) {
                self.zoomIn();
            }
            if (delta < 0) {
                self.zoomOut();
            }

        }, false);


        /* BRUtilStatic.removeEvent(clickableAreaObj, "touchmove",  this.touchMoveHandlerListener_Cursor);
         this.touchMoveHandlerListener_Cursor = function(event) {
         
         if(event.touches.length>1){
         return;
         }
         
         event.preventDefault();
         self.mouseMoveHandler_Cursor(event.touches[0].pageX , event.touches[0].pageY);
         
         }
         BRUtilStatic.addEvent(clickableAreaObj, "touchmove",  this.touchMoveHandlerListener_Cursor, false);*/

        //KEYDOWN
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "keydown", function (event) {

            if (event.which == 32) {
                event.preventDefault();
            }

        }, false);


        BRUtilStatic.addEvent(this.rightClickableAreaObj, "mousemove", function (event) {
            self.mouseMoveHandler_Right_Cursor(event.pageX, event.pageY);
        }, false);


        BRUtilStatic.addEvent(this.rightClickableAreaObj, "mouseenter", function (event) {
            self.mouseOnRight = true;
        }, false);
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "mouseleave", function (event) {
            self.mouseOnRight = false;
            self.drawCursor(self.rightTool, "RIGHT");
        }, false);


        //right mousedown
        this.rightMouseDownHandlerListener = function (event) {
            event.stopPropagation();
            self.rightMouseDownHandler(event.pageX, event.pageY);
        }
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "mousedown", this.rightMouseDownHandlerListener, false);
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "click", function (evt) {
            evt.stopPropagation();
            self.hideSubOptions();
        }, false);

        //touchstart
        this.rightTouchStartHandlerListener = function (event) {
            self.rightMouseDownHandler(event.touches[0].pageX, event.touches[0].pageY);
        }
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "touchstart", this.rightTouchStartHandlerListener, false);

    }

    this.initializeLeftEvents = function () {

        var self = this;

        this.clickableAreaObj = this.leftCanvasCursor;

        //MOUSEWHEEL
        BRUtilStatic.addEvent(this.clickableAreaObj, "mousewheel", function (event) {

            event.preventDefault();

            var delta = event.detail ? event.detail * (-120) : event.wheelDelta

            var reqMouseDown = false;
            if (self.mouseDown) {
                self.mouseUpHandler(event);
                reqMouseDown = true;
            }

            if (delta > 0) {
                self.zoomIn();
            }
            if (delta < 0) {
                self.zoomOut();
            }

            if (reqMouseDown) {
                self.mouseDownHandler(self.latestMousePosition.x, self.latestMousePosition.y);
            }

            self.drawCursor(self.leftTool, "LEFT", self.latestCursorPos.x, self.latestCursorPos.y);


        }, false);

        //KEYDOWN
        BRUtilStatic.addEvent(this.clickableAreaObj, "keydown", function (event) {

            if (event.which == 32) {
                event.preventDefault();
            }

            if (event.which == 32 && !self.oldLeftTool) {

                if (self.mouseDown) {
                    self.mouseUpHandler(event);
                    self.oldLeftTool = self.leftTool
                    self.setLeftTool("PAN")
                    self.mouseDownHandler(self.latestMousePosition.x, self.latestMousePosition.y);
                } else {
                    self.oldLeftTool = self.leftTool
                    self.setLeftTool("PAN")
                }

                self.drawCursor(self.leftTool, "LEFT", self.latestCursorPos.x, self.latestCursorPos.y);

            }

        }, false);

        //KEYUP
        BRUtilStatic.addEvent(this.clickableAreaObj, "keyup", function (event) {

            if (event.which == 32) {

                event.preventDefault();

                if (self.mouseDown) {
                    self.mouseUpHandler(event);
                    self.setLeftTool(self.oldLeftTool);
                    self.mouseDownHandler(self.latestMousePosition.x, self.latestMousePosition.y);
                    self.oldLeftTool = undefined;
                } else {
                    self.setLeftTool(self.oldLeftTool);
                    self.oldLeftTool = undefined;
                }

                self.drawCursor(self.leftTool, "LEFT", self.latestCursorPos.x, self.latestCursorPos.y);

            }

        }, false);

        // resize H Left
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalLeft");
        BRUtilStatic.addEvent(btn, "click", function () {
            self.resizeInterface("LEFTFULL");
            self.updateHorizontalResizersButtons();
        }, false);
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalOpositeLeft");
        BRUtilStatic.addEvent(btn, "click", function () {
            self.resizeInterface("DUPLEX");
            self.updateHorizontalResizersButtons();
        }, false);

        // resize H Right
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalRight");
        BRUtilStatic.addEvent(btn, "click", function () {
            self.resizeInterface("RIGHTFULL");
            self.updateHorizontalResizersButtons();
        }, false);
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandResizeHorizontalOpositeRight");
        BRUtilStatic.addEvent(btn, "click", function () {
            self.resizeInterface("DUPLEX");
            self.updateHorizontalResizersButtons();

        }, false);

        BRUtilStatic.removeEvent(this.leftCanvasCursor, "touchmove", this.touchMoveHandlerListener_Cursor);
        this.touchMoveHandlerListener_Cursor = function (event) {

            if (event.touches.length > 1) {
                return;
            }

            event.preventDefault();
            self.mouseMoveHandler_Left_Cursor(event.touches[0].pageX, event.touches[0].pageY);

        }
        BRUtilStatic.addEvent(this.leftCanvasCursor, "touchmove", this.touchMoveHandlerListener_Cursor, false);

        BRUtilStatic.removeEvent(this.leftCanvasCursor, "mousemove", this.mouseMoveHandlerListener_Cursor);
        this.mouseMoveHandlerListener_Cursor = function (event) {
            self.mouseMoveHandler_Left_Cursor(event.pageX, event.pageY);
        }
        BRUtilStatic.addEvent(this.leftCanvasCursor, "mousemove", this.mouseMoveHandlerListener_Cursor, false);


        BRUtilStatic.addEvent(this.clickableAreaObj, "mouseenter", function (event) {
            self.mouseOnLeft = true;
            self.clickableAreaObj.focus();
        }, false);
        BRUtilStatic.addEvent(this.clickableAreaObj, "mouseleave", function (event) {
            self.mouseOnLeft = false;
            self.drawCursor(self.leftTool, "LEFT");
        }, false);

        //mousedown
        this.mouseDownHandlerListener = function (event) {
            event.stopPropagation();
            self.mouseDownHandler(event.pageX, event.pageY);
        }
        BRUtilStatic.addEvent(this.clickableAreaObj, "mousedown", this.mouseDownHandlerListener, false);
        BRUtilStatic.addEvent(this.clickableAreaObj, "click", function (evt) {
            evt.stopPropagation();
            self.hideSubOptions();
        }, false);

        //touchstart
        this.touchStartHandlerListener = function (event) {
            self.mouseDownHandler(event.touches[0].pageX, event.touches[0].pageY);
        }
        BRUtilStatic.addEvent(this.clickableAreaObj, "touchstart", this.touchStartHandlerListener, false);

        // CLOSE MESSAGES
        var cancelMessagesBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-cancelMessagesBtn");
        this.cancelMessagesBtnHandler = function (event) {
            self.clearMessage();
        }
        BRUtilStatic.addEvent(cancelMessagesBtn, "click", this.cancelMessagesBtnHandler, false);

        //ZOOM IN
        var zoomInBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandZoomIn");
        this.navigationZoomInHandlerListener = function (event) {
            self.zoomIn();
        }
        BRUtilStatic.addEvent(zoomInBtn, "click", this.navigationZoomInHandlerListener, false);

        //ZOOM OUT
        var zoomOutBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandZoomOut");
        this.navigationZoomOutHandlerListener = function (event) {
            self.zoomOut();
        }
        BRUtilStatic.addEvent(zoomOutBtn, "click", this.navigationZoomOutHandlerListener, false);

        //TOOL HAND
        var handBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMove");
        this.navigationHandHandlerListener = function (event) {
            self.setLeftTool("PAN");
            self.setRightTool("PAN");
        }
        BRUtilStatic.addEvent(handBtn, "click", this.navigationHandHandlerListener, false);

        // ERASER
        var eraserBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandEraser");
        this.eraserHandlerListener = function (event) {
            self.setLeftTool("ERASER");
            //self.setRightTool("ERASER");
        }
        BRUtilStatic.addEvent(eraserBtn, "click", this.eraserHandlerListener, false);

        // ERASER OPEN SUB
        var eraserSubBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandEraserSub");
        this.eraserSubHandlerListener = function (event) {

            event.stopPropagation();
            var offset = jQuery(".BR-commandEraser").position();
            jQuery(".BR-eraserOptionsHolder").css({left: (offset.left + 11) + "px", top: /* (offset.top+30)*/ 35 + "px"}).show();
            jQuery(document).unbind("click", self.hideSubOptions);
            jQuery(document).bind("click", self.hideSubOptions);
        }
        BRUtilStatic.addEvent(eraserSubBtn, "click", this.eraserSubHandlerListener, false);

        // ERASER SUB BTNS
        jQuery(".BR-commandEraserSubBtn").click(function (event) {
            self.setLeftTool("ERASER");
            self.sizesArr["ERASER"] = parseInt(jQuery(event.currentTarget).attr("data-size"));
            jQuery(".BR-eraserSizeLabelMain").text(self.sizesArr["ERASER"]);
        });

        //CONVERT
        BRUtilStatic.addEvent(BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandConvert"), "click", function () {
            self.convertImage_Client();
        }, false);

        //UNDO
        BRUtilStatic.addEvent(BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandUndo"), "click", function () {
            self.undo();
        }, false);

        //REDO
        BRUtilStatic.addEvent(BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandRedo"), "click", function () {
            self.redo();
        }, false);



        // MAGIC EDGE TOOL
        var magicEdgeBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMagicEdge");
        this.magicEdgeHandlerListener = function (event) {
            self.setLeftTool("MAGICEDGE");
        }
        BRUtilStatic.addEvent(magicEdgeBtn, "click", this.magicEdgeHandlerListener, false);

        // MAGIC EDGE TOOL
        var magicEdgeBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMagicWand");
        this.magicEdgeHandlerListener = function (event) {
            self.setLeftTool("MAGICWAND");
        }
        BRUtilStatic.addEvent(magicEdgeBtn, "click", this.magicEdgeHandlerListener, false);

        // MAGIC EDGE OPEN SUB
        var magicEdgeSubBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMagicEdgeSub");
        this.magicEdgeSubHandlerListener = function (event) {
            event.stopPropagation();
            var offset = jQuery(".BR-commandMagicEdge").position();
            jQuery(".BR-magicEdgeOptionsHolder").css({left: (offset.left + 0) + "px", top: /* (offset.top+30)*/ 35 + "px"}).show();
            jQuery(document).unbind("click", self.hideSubOptions);
            jQuery(document).bind("click", self.hideSubOptions);
        }
        BRUtilStatic.addEvent(magicEdgeSubBtn, "click", this.magicEdgeSubHandlerListener, false);

        // MAGICWAND SUB BTNS
        jQuery(".BR-commandMagicEdgeSubBtn").click(function (event) {
            self.setLeftTool("MAGICEDGE");
            self.sizesArr["MAGICEDGE"] = parseInt(jQuery(event.currentTarget).attr("data-size"));
            jQuery(".BR-magicEdgeSizeLabelMain").text(self.sizesArr["MAGICEDGE"]);
        });



        // EXTRA MAGIC WAND TOOL
        /*var extraMagicWandBtn = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandExtraMagicWand" );
         this.extraMagicWandHandlerListener = function(event) {
         self.setLeftTool("EXTRAMAGICWAND");
         }
         BRUtilStatic.addEvent(extraMagicWandBtn, "click", this.extraMagicWandHandlerListener, false);*/

        // BORDER MOVE
        /*var edgeMoverBtn = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandBorderMover" );
         this.borderMoveHandlerListener = function(event) {
         self.setRightTool("EDGEMOVER");
         }
         BRUtilStatic.addEvent(edgeMoverBtn, "click", this.borderMoveHandlerListener, false);*/

        // GREEN TOOL
        /*var greenBtn = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandSelectForeground" );
         this.navigationGreenHandlerListener = function(event) {
         self.setLeftTool("FGPOLY");
         }
         BRUtilStatic.addEvent(greenBtn, "click", this.navigationGreenHandlerListener, false);
         
         // RED TOOL
         var redBtn = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandSelectBackground" );
         this.navigationRedHandlerListener = function(event) {
         self.setLeftTool("BGPOLY");
         }
         BRUtilStatic.addEvent(redBtn, "click", this.navigationRedHandlerListener, false);
         */

        // GREEN LINE TOOL
        var greenLineBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandSelectForegroundLine");
        this.navigationGreenLineHandlerListener = function (event) {
            self.setLeftTool("FGLINE");
        }
        BRUtilStatic.addEvent(greenLineBtn, "click", this.navigationGreenLineHandlerListener, false);

        // RED LINE TOOL
        var redLineBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandSelectBackgroundLine");
        this.navigationRedLineHandlerListener = function (event) {
            self.setLeftTool("BGLINE");
        }
        BRUtilStatic.addEvent(redLineBtn, "click", this.navigationRedLineHandlerListener, false);

        // REMOVE DRAWING
        var removeDrawingBtn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandRemoveDrawing");
        this.removeDrawingBtnHandlerListener = function (event) {
            self.clearDrawing();
        }
        BRUtilStatic.addEvent(removeDrawingBtn, "click", this.removeDrawingBtnHandlerListener, false);

        // PREVIEW TRANSPARENT
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandPreviewTransparent");
        BRUtilStatic.addEvent(btn, "click", function (event) {
            self.setPreviewBackgroundColor("transparent");
            self.setPreviewMode("transparent");
        }, false);

        // PREVIEW EDGE
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandPreviewEdge");
        BRUtilStatic.addEvent(btn, "click", function (event) {
            self.setPreviewMode("edge");
        }, false);

        // PREVIEW EDGE+MASK
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandPreviewEdgeMask");
        BRUtilStatic.addEvent(btn, "click", function (event) {
            self.setPreviewMode("edgemask");
        }, false);

        // EDGE FILTER
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandEdgeSelect");
        jQuery(btn).val(this.config.blurFilter);
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.setBlurFilter(event.currentTarget.value);
        }, false);

        // feather FILTER
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandFeatherSelect");
        jQuery(btn).val(this.config.featherFilter);
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.setFeatherFilter(event.currentTarget.value);
        }, false);

        // feather autoCropCB
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-autoCropCB");
        if (this.config.autoCrop){
            jQuery(btn).attr("checked", "checked");
        }
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.setAutoCrop(jQuery(event.currentTarget).is(":checked"));
        }, false);

        //*****************
        // BR-commandManualCropPropX
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandManualCropPropX");
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.autoCropCBChanged( );
        }, false);
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandManualCropPropY");
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.autoCropCBChanged( );
        }, false);
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandManualCropPropW");
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.autoCropCBChanged( );
        }, false);
        var btn = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandManualCropPropH");
        BRUtilStatic.addEvent(btn, "change", function (event) {
            self.autoCropCBChanged( );
        }, false);
        
        if(this.isLite){
            jQuery(".BR-commandInfoCrop, .BR-commandManualCropPropsHolder, .BR-magicEdgeSizeLabel, .BR-commandMagicEdgeSub, .BR-commandEraserSub").hide();
            jQuery(".BR-eraserSizeLabelMain, .BR-commandMagicWand, .BR-commandMagicWandPropsHolder").hide();
            jQuery(".BR-commandUndo, .BR-commandRedo, .BR-commandFeatherHolder, .BR-commandEdgeHolder").hide();
            var html = '<h3><a href="http://www.awssoft.com/magic-edge/" target="_blank"><strong>Try or buy fully featured version!</strong></a></h3>';
            /*html+='<a href="http://www.awssoft.com/magic-edge/" target="_blank">Homepage &amp; Support</a>';*/
            jQuery(".BR-rightLinksHolder").html(html);
            this.sizesArr["ERASER"] = 2;
            jQuery(".BR-magicEdgeTitle").html("Magic Edge Lite");
           
        }
    }

    this.hideSubOptions = function () {
        jQuery(".BR-magicEdgeOptionsHolder").hide();
        jQuery(".BR-eraserOptionsHolder").hide();
    }

    this.resetRedo = function () {
        this.drawArrAllUndo = []
        this.updateUndoRedoBtn();
    }

    this.updateUndoRedoBtn = function () {
        //isLite?
    }


    this.undo = function () {
        //isLite?
    }

    this.redo = function () {
       //isLite?
    }

    this.autoCropCBChanged = function () {
        // isLite?
    }

    this.setAutoCrop = function (autoCrop) {
        // isLite?
    }

    this.setFeatherFilter = function (featherFilter) {
       // isLite?
    }

    this.setBlurFilter = function (blurFilter) {
         // isLite?
    }

    this.getBlurFilterProperties = function () {
        return this.blurFilters[this.config.blurFilter +""];
    }

    this.setPreviewMode = function (previewMode) {

        this.previewMode = previewMode;
        this.fitImages(true);

    }

    this.initializeFileDrop = function () {

        if (!this.allowDropFile)
            return;
        if (typeof FileReader === "undefined")
            return;

        this.dropInfo.style.display = "block";

        var self = this;

        BRUtilStatic.addEvent(this.leftCanvasCursor, "dragover", function (event) {
            event.preventDefault();
        }, false);

        BRUtilStatic.addEvent(this.leftCanvasCursor, "dragenter", function (event) {
            self.dropInfo.style.display = "block";
            self.dropInfo.style.borderColor = "#00DD00";
            self.dropInfo.style.color = "#00DD00";
        }, false);

        BRUtilStatic.addEvent(this.leftCanvasCursor, "dragleave", function (event) {
            self.dropInfo.style.borderColor = "lightgray";
            self.dropInfo.style.color = "gray";
        }, false);


        BRUtilStatic.addEvent(this.leftCanvasCursor, "drop", function (evt) {
            var files = evt.dataTransfer.files;
            if (files.length > 0) {
                var file = files[0];
                if (file.type.indexOf("image") != -1) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        self.canvasImageName = file.name;
                        self.loadImage(evt.target.result);
                        self._imageDropHandler(evt.targe);
                    };
                    reader.readAsDataURL(file);
                }
            }
            evt.preventDefault();
        }, false);


    }

    this.setPreviewBackgroundColor = function (color) {
        this.previewBackgroundColor = color;
        this.fitImages();
    }

    this.clearDrawing = function () {

        this.clearDrawingArr();
        this.currentDrawArr = {};

        this.fitImages();
    }

    this.tryInitPath = function (tool, side) {
        if (this.drawingTools.indexOf(tool) != -1) {
            this.currentDrawArr[tool] = {points: [], zoom: this.totalZoom, side: side, tool: tool, size: this.sizesArr[tool]};
        }
    }

    this.tryAddToPath = function (cord, tool) {

        cord.x -= this.renderImageBounds.x
        cord.y -= this.renderImageBounds.y

        cord.x /= this.totalZoom;
        cord.y /= this.totalZoom;

        this.pointToCanvas(cord);

        if (this.drawingTools.indexOf(tool) != -1) {
            this.currentDrawArr[tool].points.push(cord);
        }

        return cord;
    }

    this.rightMouseDownHandler = function (x, y) {

        var rect = this.rightImageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;

        var self = this;

        this.refMouseX = x;
        this.refMouseY = y;

        if (this.rightMouseDown)
            return;

        this.rightMouseDown = true;

        this.tryInitPath(this.rightTool, "RIGHT");
        this.tryAddToPath({x: x, y: y}, this.rightTool);


        BRUtilStatic.removeEvent(document, "touchmove", this.rightTouchMoveHandlerListener);
        this.rightTouchMoveHandlerListener = function (event) {

            if (event.touches.length > 1) {
                return;
            }

            event.preventDefault();
            self.rightMouseMoveHandler(event.touches[0].pageX, event.touches[0].pageY);

        }
        BRUtilStatic.addEvent(document, "touchmove", this.rightTouchMoveHandlerListener, false);

        BRUtilStatic.removeEvent(document, "mousemove", this.rightMouseMoveHandlerListener);
        this.rightMouseMoveHandlerListener = function (event) {
            self.rightMouseMoveHandler(event.pageX, event.pageY);
        }
        BRUtilStatic.addEvent(document, "mousemove", this.rightMouseMoveHandlerListener, false);

        // mouseup
        BRUtilStatic.removeEvent(document, "mouseup", this.rightMouseUpHandlerListener);
        BRUtilStatic.removeEvent(this.rightClickableAreaObj, "touchend", this.rightMouseUpHandlerListener);
        this.rightMouseUpHandlerListener = function (event) {
            self.rightMouseUpHandler(event);
        }
        BRUtilStatic.addEvent(document, "mouseup", this.rightMouseUpHandlerListener, false);
        BRUtilStatic.addEvent(this.rightClickableAreaObj, "touchend", this.rightMouseUpHandlerListener, false);

    }

    this.mouseDownHandler = function (x, y) {

        var rect = this.imageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;

        var self = this;

        this.refMouseX = x;
        this.refMouseY = y;

        if (this.mouseDown)
            return;

        this.mouseDown = true;

        this.tryInitPath(this.leftTool, "LEFT");
        var realPoint = this.tryAddToPath({x: x, y: y}, this.leftTool);

        if (this.leftTool == "MAGICWAND" && this.leftImageLoaded) {

            var orgImageCanvas = this.bre.getCanvas(this.leftImage.width, this.leftImage.height);
            orgImageCanvas.getContext("2d").drawImage(this.leftImage, 0, 0, this.leftImage.width, this.leftImage.height);

            var elTolerance = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMagicWandPropTolerance");
            var tolerance = elTolerance.value;

            var elBorderWidth = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandMagicWandPropBorderWidth");
            var borderSize = elBorderWidth.value;

            var selCanvas = this.brUtil.getMagicWandSelectionCanvas(orgImageCanvas, parseInt(realPoint.x), parseInt(realPoint.y), tolerance);

            var extendedSelCanvas = this.brUtil.extendBorder(selCanvas, [255, 0, 0, 255], [255, 255, 0, 153], borderSize);

            realPoint.canvas = extendedSelCanvas;
        }

        /*if(this.leftTool=="EXTRAMAGICWAND"){
         
         var orgImageCanvas = this.bre.getCanvas(this.leftImage.width, this.leftImage.height);
         orgImageCanvas.getContext("2d").drawImage(this.leftImage, 0, 0, this.leftImage.width, this.leftImage.height);
         
         var iData =  orgImageCanvas.getContext("2d").getImageData(0,0,this.leftImage.width, this.leftImage.height);
         var levelData = Filters.levels(iData, 0, 255);		
         var invertData = Filters.invert(levelData);
         var sobelData = Filters.sobel(invertData);
         var blurData = Filters.gaussianBlur(sobelData, 3);
         var levelData2 = Filters.levels(blurData, 10, 255);
         var thresholdData = Filters.threshold(levelData2, 5)
         
         orgImageCanvas.getContext("2d").putImageData(levelData2,0,0);
         
         document.documentElement.appendChild(orgImageCanvas);
         
         var elTolerance = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandMagicWandPropTolerance" );
         var tolerance =  elTolerance.value;
         
         var elBorderWidth = BRUtilStatic.getFirstElementByClassName( this.rootHolder, "BR-commandMagicWandPropBorderWidth" );
         var borderSize =  elBorderWidth.value;
         
         var selCanvas = this.brUtil.getMagicWandSelectionCanvas(orgImageCanvas, parseInt(realPoint.x), parseInt(realPoint.y), tolerance );
         
         var extendedSelCanvas = this.brUtil.extendBorder(selCanvas, [255,0,0,255], [255, 255, 0, 153], borderSize); 
         
         document.documentElement.appendChild(selCanvas);
         document.documentElement.appendChild(extendedSelCanvas);
         
         realPoint.canvas = extendedSelCanvas;
         
         }*/

        this.fitImages();

        BRUtilStatic.removeEvent(document, "touchmove", this.touchMoveHandlerListener);
        this.touchMoveHandlerListener = function (event) {

            if (event.touches.length > 1) {
                return;
            }

            event.preventDefault();
            self.mouseMoveHandler(event.touches[0].pageX, event.touches[0].pageY);

        }
        BRUtilStatic.addEvent(document, "touchmove", this.touchMoveHandlerListener, false);

        BRUtilStatic.removeEvent(document, "mousemove", this.mouseMoveHandlerListener);
        this.mouseMoveHandlerListener = function (event) {
            self.mouseMoveHandler(event.pageX, event.pageY);
        }
        BRUtilStatic.addEvent(document, "mousemove", this.mouseMoveHandlerListener, false);

        // mouseup
        BRUtilStatic.removeEvent(document, "mouseup", this.mouseUpHandlerListener);
        BRUtilStatic.removeEvent(this.clickableAreaObj, "touchend", this.mouseUpHandlerListener);
        this.mouseUpHandlerListener = function (event) {
            self.mouseUpHandler(event);
        }
        BRUtilStatic.addEvent(document, "mouseup", this.mouseUpHandlerListener, false);
        BRUtilStatic.addEvent(this.clickableAreaObj, "touchend", this.mouseUpHandlerListener, false);

    }

    this.mouseMoveHandler_Right_Cursor = function (x, y) {

        if (this.rightMouseDown == true)
            return;

        var rect = this.rightImageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;
        x = Math.round(x);
        y = Math.round(y);

        this.drawCursor(this.rightTool, "RIGHT", x, y);

    }

    this.mouseMoveHandler_Left_Cursor = function (x, y) {

        if (this.mouseDown == true)
            return;

        var rect = this.imageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;
        x = Math.round(x);
        y = Math.round(y);

        this.drawCursor(this.leftTool, "LEFT", x, y);

    }

    this.rightMouseMoveHandler = function (x, y) {

        var rect = this.rightImageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;

        this.drawCursor(this.rightTool, "RIGHT", Math.round(x), Math.round(y));

        this.tryAddToPath({x: x, y: y}, this.rightTool);

        if (this.rightTool == "PAN") {

            this.currentPanMoveX = this.refMouseX - x;
            this.currentPanMoveY = this.refMouseY - y;
            this.fitImages();
            return;

        }

        this.fitImages();

    }


    this.mouseMoveHandler = function (x, y) {

        this.latestMousePosition = {x: x, y: y};

        if (this.leftTool == "MAGICWAND") {
            return;
        }

        var rect = this.imageHolder.getBoundingClientRect();

        x -= rect.left + window.pageXOffset;
        y -= rect.top + window.pageYOffset;

        this.drawCursor(this.leftTool, "LEFT", Math.round(x), Math.round(y));

        this.tryAddToPath({x: x, y: y}, this.leftTool);

        if (this.leftTool == "PAN") {

            this.currentPanMoveX = this.refMouseX - x;
            this.currentPanMoveY = this.refMouseY - y;
            this.fitImages();
            return;

        }

        this.fitImages();

    }

    this.rightMouseUpHandler = function (evt) {

        evt.stopPropagation();

        this.rightMouseDown = false;

        this.currentPanMoveX = 0;
        this.currentPanMoveY = 0;


        //if(this.isPanMode()){
        this.globalPanMoveX = -((this.zoomedXPosMoved - this.zoomedXPosCentered - this.panMoveEmptyX) / this.currentZoom) //fullscreenZoom
        this.globalPanMoveY = -((this.zoomedYPosMoved - this.zoomedYPosCentered - this.panMoveEmptyY) / this.currentZoom) //fullscreenZoom
        this.panMoveEmptyX = 0;
        this.panMoveEmptyY = 0;
        //}

        BRUtilStatic.removeEvent(document, "mousemove", this.rightMouseMoveHandlerListener);
        BRUtilStatic.removeEvent(document, "touchmove", this.rightTouchMoveHandlerListener);
        BRUtilStatic.removeEvent(document, "mouseup", this.rightMouseUpHandlerListener);
        BRUtilStatic.removeEvent(this.rightClickableAreaObj, "touchend", this.rightMouseUpHandlerListener);


        for (var _tool in this.currentDrawArr) {
            var drawObj = this.currentDrawArr[this.rightTool];
            drawObj.zoom = this.totalZoom
            drawObj.tool = this.rightTool
            drawObj.size = this.sizesArr[_tool];
            this.drawArr[this.rightTool].push(drawObj);

            this.drawArrAll.push(drawObj);
        }

        if (this.currentDrawArr["EDGEMOVER"]) {
            var drawObj = this.currentDrawArr[this.rightTool];
            drawObj.zoom = this.totalZoom
            this.processEdgeMover(drawObj);
            this.fitImages(true);
        }

        this.currentDrawArr = {};

        this.fitImages();

    }

    this.processEdgeMover = function (drawObj) {

        var rectLeft = 100000,
                rectTop = 100000,
                rectRight = 0,
                rectBottom = 0;
        var len = drawObj.points.length,
                ps = drawObj.points,
                p;

        for (var i = 0; i < len; i++) {
            p = ps[i];
            rectLeft = Math.min(rectLeft, p.x);
            rectTop = Math.min(rectTop, p.y);
            rectRight = Math.max(rectRight, p.x);
            rectBottom = Math.max(rectBottom, p.y);
        }

        var x = rectLeft,
                y = rectTop,
                w = rectRight - rectLeft,
                h = rectBottom - rectTop;

        var incH = w * this.edgeMoverIncrease - w;
        incH = Math.min(incH, this.edgeMoverIncreaseMax);
        incH = Math.max(incH, this.edgeMoverIncreaseMin);

        var incV = h * this.edgeMoverIncrease - h;
        incV = Math.min(incV, this.edgeMoverIncreaseMax);
        incV = Math.max(incV, this.edgeMoverIncreaseMin);

        x -= incH / 2;
        y -= incV / 2;
        w += incH;
        h += incV;

        x = parseInt(x),
                y = parseInt(y),
                w = parseInt(w),
                h = parseInt(h);

        var ctx = this.rightCanvasDraw.getContext("2d");
        ctx.rect(x, y, w, h);
        ctx.stroke();

        this.executeEdgeMover(x, y, w, h, drawObj);

    }

    this.getEdgeMoverLineStyle = function (drawObj) {

        if (!this.mainMaskData)
            return "rgba(0,255,0,1)"; // TODO: remove this row

        var p = drawObj.points[0]
        var pos = parseInt((parseInt(p.y) * this.leftImage.width + parseInt(p.x)) * 4);
        var firstPixel = [this.mainMaskData[pos], this.mainMaskData[pos + 1], this.mainMaskData[pos + 2], this.mainMaskData[pos + 3]]

        var forceLineStyle = firstPixel[3] == 0 ? "rgba(255,0,0,1)" : "rgba(0,255,0,1)";

        return forceLineStyle;

    }

    this.executeEdgeMover = function (x, y, w, h, drawObj) {

        var canvas = document.createElement("canvas");
        canvas.width = this.leftImage.width;
        canvas.height = this.leftImage.height;

        //1. edge mask
        this.drawMask(canvas, this.edgeDrawingTools);

        //2. edge mover
        this.drawMask(canvas, ["EDGEMOVER"], true);


        var fgHoles = this.getHoles(this.fgDrawingTools);
        for (var i = 0; i < fgHoles.length; i++) {
            var p = fgHoles[i];
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 255, 0, 255], [0, 0, 0, 0]);
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 0, 0, 0], [0, 255, 0, 255]);
        }

        var bgHoles = this.getHoles(this.bgDrawingTools);
        for (var i = 0; i < bgHoles.length; i++) {
            var p = bgHoles[i];
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [255, 0, 0, 255], [0, 0, 0, 0]);
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 0, 0, 0], [255, 0, 0, 255]);
        }


        // >> create allowed area >>
        var attackOnlyCanvas = document.createElement("canvas");
        attackOnlyCanvas.width = this.leftImage.width;
        attackOnlyCanvas.height = this.leftImage.height;

        var settings = this.maskDrawingToolsSettings["EDGEMOVER_ALLOWED"];
        var drawObj = this.drawArr["EDGEMOVER"][this.drawArr["EDGEMOVER"].length - 1];
        this.drawLineOrPoly(attackOnlyCanvas, drawObj, settings, false, true);

        var attackOnlyImageData = attackOnlyCanvas.getContext("2d").getImageData(0, 0, this.leftImage.width, this.leftImage.height);
        var allowedData = attackOnlyImageData.data;
        // << create allowed area <<

        var imgData = this.bre.getImageData(this.leftImage, x, y, w, h);
        var fgBgImageData = canvas.getContext("2d").getImageData(x, y, w, h);

        var partialMaskData = this.bre.convert(imgData, fgBgImageData);

        var _width = this.leftImage.width;

        var xP, yP, realX, realY;

        for (var i = 0; i < partialMaskData.length; i += 4) {

            p = i / 4;
            yP = Math.floor(p / w);
            xP = p - yP * w;

            realX = xP + x;
            realY = yP + y;

            pos = (realY * _width + realX) * 4;


            if (allowedData[pos] != 255)
                continue;

            this.mainMaskData[pos] = partialMaskData[i];
            this.mainMaskData[pos + 1] = partialMaskData[i + 1];
            this.mainMaskData[pos + 2] = partialMaskData[i + 2];
            this.mainMaskData[pos + 3] = partialMaskData[i + 3];

        }


        var _colorArr = new Uint8Array(this.edgeColor4);

        this.edgeData = this.bre.makeEdgeFromMaskData(this.mainMaskData, this.leftImage.width, this.leftImage.height, 1, _colorArr)

        this.createTransparentImageCanvas();

        this.fitImages(true);

    }

    this.createTransparentImageCanvas = function () {

        this.transparentImageCanvas = document.createElement("canvas");
        this.transparentImageCanvas.width = this.leftImage.width;
        this.transparentImageCanvas.height = this.leftImage.height;

        var orgImageData = this.bre.getImageData(this.leftImage);
        var d = orgImageData.data;

        for (var i = 0; i < this.mainMaskData.length; i += 4) {

            if (this.mainMaskData[i + 3] != 0) {
                continue;
            }

            d[i] = 0;
            d[i + 1] = 0;
            d[i + 2] = 0;
            d[i + 3] = 0;

        }

        var imgData = this.bre.getImageData(this.leftImage);

        var orgImageData_Blured = Filters.gaussianBlur(orgImageData, this.config.featherFilter);
        var imageData_Blured = Filters.gaussianBlur(imgData, this.config.featherFilter);

        this.bre.copySemiTransparentPixels(orgImageData_Blured, imageData_Blured, imgData)

        this.transparentImageCanvas.getContext("2d").putImageData(orgImageData_Blured, 0, 0);

        this.executeBlurFilter();

    }

    this.executeBlurFilter = function () {

        if (!this.transparentImageCanvas)
            return;

        this.transparentImageCanvasEdgeEffect = document.createElement("canvas");
        this.transparentImageCanvasEdgeEffect.width = this.leftImage.width;
        this.transparentImageCanvasEdgeEffect.height = this.leftImage.height;

        var edgeProperties = this.getBlurFilterProperties();
        if (edgeProperties.blurEdges) {


            var _r = this.renderImageBounds

            var iData = this.transparentImageCanvas.getContext("2d").getImageData(0, 0, this.leftImage.width, this.leftImage.height);
            var blurData = Filters.gaussianBlur(iData, edgeProperties.blurStrength);
            var tmpCanvas = Filters.getCanvas(this.leftImage.width, this.leftImage.height);

            tmpCanvas.getContext("2d").putImageData(blurData, 0, 0);
            this.transparentImageCanvasEdgeEffect.getContext("2d").drawImage(tmpCanvas, 0, 0, this.leftImage.width, this.leftImage.height);
        }


    }

    this.mouseUpHandler = function (evt) {

        evt.stopPropagation();

        this.mouseDown = false;

        this.currentPanMoveX = 0;
        this.currentPanMoveY = 0;


        //if(this.isPanMode()){
        this.globalPanMoveX = -((this.zoomedXPosMoved - this.zoomedXPosCentered - this.panMoveEmptyX) / this.currentZoom) //fullscreenZoom
        this.globalPanMoveY = -((this.zoomedYPosMoved - this.zoomedYPosCentered - this.panMoveEmptyY) / this.currentZoom) //fullscreenZoom
        this.panMoveEmptyX = 0;
        this.panMoveEmptyY = 0;
        //}

        BRUtilStatic.removeEvent(document, "mousemove", this.mouseMoveHandlerListener);
        BRUtilStatic.removeEvent(document, "touchmove", this.touchMoveHandlerListener);
        BRUtilStatic.removeEvent(document, "mouseup", this.mouseUpHandlerListener);
        BRUtilStatic.removeEvent(this.clickableAreaObj, "touchend", this.mouseUpHandlerListener);


        for (var _tool in this.currentDrawArr) {
            var drawObj = this.currentDrawArr[this.leftTool];
            drawObj.zoom = this.totalZoom;
            drawObj.tool = this.leftTool;
            drawObj.size = this.sizesArr[_tool];
            this.drawArr[this.leftTool].push(drawObj);

            this.drawArrAll.push(drawObj);

            this.resetRedo();
            //isLite?
        }

        this.currentDrawArr = {};

        this.fitImages()
    }

    this.setLeftTool = function (tool) {
        this.leftTool = tool;
        this.setCursor();
    }
    this.setRightTool = function (tool) {
        this.rightTool = tool;
        this.setCursor();
    }
    this.setCursor = function () {
        var el = this.febc(this.rootHolder, "BR-leftCanvasCursor");
        el.className = "BR-leftCanvasCursor BR-cursor" + this.leftTool;

        var el = this.febc(this.rootHolder, "BR-rightCanvasCursor");
        el.className = "BR-rightCanvasCursor BR-cursor" + this.rightTool;
    }

    this.isPanTool = function () {
        return this.leftTool == "PAN";
    }

    this.zoomIn = function () {
        for (var i = 0; i < this.config.zoomMultipliers.length; i++) {
            if (this.config.zoomMultipliers[i] > this.currentZoom) {
                this.setZoom(this.config.zoomMultipliers[i]);
                break;
            }
        }
    }

    this.zoomOut = function () {
        for (var i = this.config.zoomMultipliers.length - 1; i >= 0; i--) {
            if (this.config.zoomMultipliers[i] < this.currentZoom) {
                this.setZoom(this.config.zoomMultipliers[i]);
                break;
            }
        }
    }

    this.setZoom = function (zoom, withoutRefresh) {

        this.currentZoom = zoom;

        this.fitImages();

    }

    this.cloneObj = function (o) {
        return JSON.parse(JSON.stringify(o));
    }

    this.drawMask = function (canvas, tools, skipClear) {

        var forceLineStyle;

        var ctx = canvas.getContext("2d");
        if (!skipClear)
            ctx.clearRect(0, 0, canvas.width, canvas.height)


        for (var i = 0; i < this.drawArrAll.length; i++) {


            var drawObj = this.drawArrAll[i];

            if (tools.indexOf(drawObj.tool) == -1)
                continue;

            var settings = this.maskDrawingToolsSettings[drawObj.tool];

            forceLineStyle = null;

            if (drawObj.tool == "EDGEMOVER") {
                forceLineStyle = this.getEdgeMoverLineStyle(drawObj)
            }

            this.drawLineOrPoly(canvas, drawObj, settings, false, true, forceLineStyle);

        }

    }

    this.getHoles = function (tools, allAsArray) {

        var holes = [];
        for (var _tool in this.drawArr) {

            if (tools.indexOf(_tool) == -1)
                continue;

            for (var k = 0; k < this.drawArr[_tool].length; k++)
                if (this.drawArr[_tool] && this.drawArr[_tool][k]) {
                    if (this.drawArr[_tool][k].points && this.drawArr[_tool][k].points[0]) {

                        if (allAsArray) {
                            holes = holes.concat(this.drawArr[_tool][k].points);
                        }
                        else {
                            holes.push(this.drawArr[_tool][k].points[0]);
                        }

                    }
                }
        }

        return holes;

    }

    this.brUtil = new BRUtil();

    this.convertImage_Client = function () {

        var self = this;

        this.disableInput(this.rootHolder, "Converting...");

        setTimeout(function () {

            self._convertImage_Client();


        }, 100);

    }

    this.getCurrentTime = function () {
        return (new Date()).getTime();
    }

    this._convertImage_Client = function () {

        var self = this;

        if (!this.leftImage.src) {
            this.addMessage(this.getLang("msg_image_not_selected"));
            this.enableInput(this.rootHolder);
            return;
        }

        var canvas = document.createElement("canvas");
        canvas.width = this.leftImage.width;
        canvas.height = this.leftImage.height;


        //edge mask
        this.drawMask(canvas, this.edgeDrawingTools);

        var fgHoles = this.getHoles(this.fgDrawingTools, true);

        for (var i = fgHoles.length - 1; i >= 0; i--) {
            var p = fgHoles[i];
            var count = this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 255, 0, 255], [0, 0, 0, 0]);
            if (count == 1)
                fgHoles.splice(i, 1);
        }
        for (var i = 0; i < fgHoles.length; i++) {
            var p = fgHoles[i];
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 0, 0, 0], [0, 255, 0, 255]);
        }


        var bgHoles = this.getHoles(this.bgDrawingTools, true);

        for (var i = 0; i < bgHoles.length; i++) {
            var p = bgHoles[i];
            var count = this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [255, 0, 0, 255], [0, 0, 0, 0]);
            if (count == 1)
                bgHoles.splice(i, 1);
        }
        for (var i = 0; i < bgHoles.length; i++) {
            var p = bgHoles[i];
            this.brUtil.floodFill(canvas, Math.round(p.x), Math.round(p.y), [0, 0, 0, 0], [255, 0, 0, 255]);
        }

        var imgData = this.bre.getImageData(this.leftImage);
        var fgBgImageData = canvas.getContext("2d").getImageData(0, 0, this.leftImage.width, this.leftImage.height);

        if (typeof (Worker) !== "undefined" && this.workerPath && this.config.useWebWorker) {

            var myWorker = new Worker(this.workerPath);

            myWorker.addEventListener("message", function (oEvent) {

                var retObj = JSON.parse(oEvent.data);

                var mmd = retObj.mainMaskData;
                var mainMaskData = self.bre.getUint8ClampedArray(mmd.length);
                for (var i = 0; i < mmd.length; i++)
                    mainMaskData[i] = mmd[i];

                self.mainMaskData = mainMaskData;

                self.finishAfterConvert();

                self.enableInput(self.rootHolder);

            }, false);

            var reqObj = {action: "convert", width: imgData.width, height: imgData.height, data: Array.prototype.slice.call(imgData.data), fgBgData: Array.prototype.slice.call(fgBgImageData.data)};

            myWorker.postMessage(JSON.stringify(reqObj));

        }
        else {

            this.mainMaskData = this.bre.convert(imgData, fgBgImageData);
            this.finishAfterConvert();

            this.enableInput(this.rootHolder);

        }

    }

    this.finishAfterConvert = function () {

        var _colorArr = new Uint8Array(this.edgeColor4);
        this.edgeData = this.bre.makeEdgeFromMaskData(this.mainMaskData, this.leftImage.width, this.leftImage.height, 1, _colorArr);

        this.createTransparentImageCanvas();

        this.fitImages(true);

        this.resizeInterface("DUPLEX");
        this.updateHorizontalResizersButtons();

        this.converted = true;
    }


    this.processResponse = function (response) {

        this.enableInput(this.rootHolder);

        var self = this;

        try {
            var resObj = JSON.parse(response);
        } catch (ex) {
            this.addMessage("Error 3220 - JSON parse error [BRApplication::processResponse()]");
            return;
        }

        if (resObj.error == true) {
            this.addMessage(resObj.errorMessage);
            return;
        }

        this.latestTransparentBase64 = resObj.transparentBase64;
        this.rightImage.src = resObj.transparentBase64;
        this.rightImage.onload = function () {
            self.fitImages();
        };

    }

    this.getTransparentBase64 = function () {
        return this.latestTransparentBase64;
    }


    this.saveSettings = function () {

        this.disableInput(this.settingsHolder, "Loading...");

        var _data = this.getSettingsData();
        var reqObj = {action: "save_settings", data: _data};

        var self = this;

        BRUtilStatic.makeRequest(this.config.ajaxUrl, reqObj, function (resData) {

            self.saveSettingsDone(resData)

            try {
                var resObj = JSON.parse(resData);
            } catch (ex) {
                self.addMessage("Error 3220 - JSON parse error [BRApplication::saveSettings()]");
                return;
            }

            if (resObj.error == true) {
                self.addMessage(resObj.errorMessage);
                return;
            }

            self._allData.settings = _data;

        });

    }

    this.disableInput = function (holder, msg) {

        if (this.disableInputEl)
            BRUtilStatic.removeElement(this.disableInputEl);

        this.disableInputEl = document.createElement("div");
        this.disableInputEl.className = "BR-modalDiv";
        holder.appendChild(this.disableInputEl);

        this.disableInputEl.innerHTML = "<img src='" + this.loaderIcon + "'></img> " + msg;

    }

    this.enableInput = function (holder) {

        var el = this.febc(holder, "BR-modalDiv");
        BRUtilStatic.removeElement(el);

    }

    this.initializeInterface = function () {

        if (this.config.width != "full") {
            this.rootHolder.style.width = this.config.width;
        }
        if (this.config.height != "full") {
            this.rootHolder.style.height = this.config.height;
        }

        this.rootHolder.className += " BR-rootHolder";

        this.rootHolder.innerHTML = this.getMainHtml();


        this.imageHolder = this.febc(this.rootHolder, "BR-imagesHolder");
        this.leftImageHolder = this.febc(this.imageHolder, "BR-leftImageHolder");
        this.rightImageHolder = this.febc(this.imageHolder, "BR-rightImageHolder");

        this.leftCanvas = this.febc(this.imageHolder, "BR-leftCanvasImage");
        this.leftCanvasDraw = this.febc(this.imageHolder, "BR-leftCanvasDraw");
        this.leftCanvasCursor = this.febc(this.imageHolder, "BR-leftCanvasCursor");

        this.rightCanvas = this.febc(this.imageHolder, "BR-rightCanvas");
        this.rightCanvasDraw = this.febc(this.imageHolder, "BR-rightCanvasDraw");
        this.rightCanvasCursor = this.febc(this.imageHolder, "BR-rightCanvasCursor");

        this.dropInfo = this.febc(this.imageHolder, "BR-dropInfo");

        this.messagesHolder = this.febc(this.rootHolder, "BR-messagesHolder");

        this.messagesHolder.innerHTML = this.getMessagesHtml();

        this.messageHolder = this.febc(this.rootHolder, "BR-messageHolder");

        this.resizeInterface();

        jQuery(".BR-eraserSizeLabelMain").text(this.sizesArr["ERASER"]);
        jQuery(".BR-magicEdgeSizeLabelMain").text(this.sizesArr["MAGICEDGE"]);
    }

    this.febcv = function (p, cn) {
        return  this.febc(p, cn).value;
    }

    this.febc = function (p, cn) {
        return BRUtilStatic.getFirstElementByClassName(p, cn);
    }

    this.resizeInterface = function (viewType) {

        var self = this;

        if (viewType)
            this.viewType = viewType;

        if (this.viewType == "DUPLEX") {

            var gap = 20;

            var _w = Math.floor(((this.imageHolder.offsetWidth - gap) / 2));
            var _h = Math.floor(((this.imageHolder.offsetWidth - gap) / 3));

            try {
                var rec = this.imageHolder.getBoundingClientRect();
                _h = Math.round(window.innerHeight - rec.top - 15 - window.pageYOffset);

            } catch (ex) {
            }

            if (this.config.height != "full")
                _h = parseInt(this.config.height);

            this.imageHolder.style.height = this.leftImageHolder.style.height = this.rightImageHolder.style.height = _h + "px";

            var _w = Math.floor(((this.imageHolder.offsetWidth - gap) / 2));

            this.leftImageHolder.style.width = this.rightImageHolder.style.width = _w + "px";

            this.leftCanvas.width = this.leftCanvasDraw.width = this.leftCanvasCursor.width = this.rightCanvas.width = this.rightCanvasDraw.width = this.rightCanvasCursor.width = _w;
            this.leftCanvas.height = this.leftCanvasDraw.height = this.leftCanvasCursor.height = this.rightCanvas.height = this.rightCanvasDraw.height = this.rightCanvasCursor.height = _h;

            this.dropInfo.style.width = (_w - 70) + "px";
            this.dropInfo.style.height = (_h - 70) + "px";

            var commandHolder2Right = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Right");
            commandHolder2Right.style.left = (_w + gap) + "px"
            commandHolder2Right.style.width = _w + "px"

            var commandHolder2Right = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Left");
            commandHolder2Right.style.left = "0px";
            commandHolder2Right.style.width = _w + "px"

            this.rightImageHolder.style.display = "block";
            this.leftImageHolder.style.display = "block";

            var commandHolder2Right = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Right");
            commandHolder2Right.style.display = "block";


            var commandHolder2Left = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Left");
            commandHolder2Left.style.display = "block";


        } else if (this.viewType == "LEFTFULL") {

            this.rightImageHolder.style.display = "none";

            var _w = Math.floor(((this.imageHolder.offsetWidth)));
            var _h = Math.floor(((this.imageHolder.offsetWidth) / 3));

            try {
                var rec = this.imageHolder.getBoundingClientRect();
                _h = Math.round(window.innerHeight - rec.top - 15 - window.pageYOffset);

            } catch (ex) {
            }

            if (this.config.height != "full")
                _h = parseInt(this.config.height);

            this.imageHolder.style.height = this.leftImageHolder.style.height = this.rightImageHolder.style.height = _h + "px";

            var _w = Math.floor(this.imageHolder.offsetWidth);


            this.leftImageHolder.style.width = _w + "px";

            this.leftCanvas.width = this.leftCanvasDraw.width = this.leftCanvasCursor.width = _w;
            this.rightCanvas.width = this.rightCanvasDraw.width = this.rightCanvasCursor.width = _h;
            this.leftCanvas.height = this.leftCanvasDraw.height = this.leftCanvasCursor.height = _h;
            this.rightCanvas.height = this.rightCanvasDraw.height = this.rightCanvasCursor.height = _h;

            this.dropInfo.style.width = (_w - 70) + "px";
            this.dropInfo.style.height = (_h - 70) + "px";

            var commandHolder2Right = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Right");
            commandHolder2Right.style.display = "none";

            var commandHolder2Left = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Left");
            commandHolder2Left.style.left = "0px";
            commandHolder2Left.style.width = _w + "px"


        } else if (this.viewType == "RIGHTFULL") {

            this.leftImageHolder.style.display = "none";

            var _w = Math.floor(((this.imageHolder.offsetWidth)));
            var _h = Math.floor(((this.imageHolder.offsetWidth) / 3));

            try {
                var rec = this.imageHolder.getBoundingClientRect();
                _h = Math.round(window.innerHeight - rec.top - 15 - window.pageYOffset);

            } catch (ex) {
            }

            if (this.config.height != "full")
                _h = parseInt(this.config.height);

            this.imageHolder.style.height = this.leftImageHolder.style.height = this.rightImageHolder.style.height = _h + "px";

            var _w = Math.floor(this.imageHolder.offsetWidth);

            this.rightImageHolder.style.width = _w + "px";

            this.leftCanvas.width = this.leftCanvasDraw.width = this.leftCanvasCursor.width = _w;
            this.rightCanvas.width = this.rightCanvasDraw.width = this.rightCanvasCursor.width = _w;
            this.leftCanvas.height = this.leftCanvasDraw.height = this.leftCanvasCursor.height = _h;
            this.rightCanvas.height = this.rightCanvasDraw.height = this.rightCanvasCursor.height = _h;

            this.dropInfo.style.width = (_w - 70) + "px";
            this.dropInfo.style.height = (_h - 70) + "px";

            var commandHolder2Right = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Right");
            commandHolder2Right.style.left = "0px"
            commandHolder2Right.style.width = _w + "px"

            var commandHolder2Left = BRUtilStatic.getFirstElementByClassName(this.rootHolder, "BR-commandHolder2Left");
            commandHolder2Left.style.display = "none";

        }

        if (this.resizeInterfaceExternalHandler)
            this.resizeInterfaceExternalHandler();


        setTimeout(function () {
            self.fitImages();
        }, 100)


    }

}

function BRUtilStaticClass() {

    this.addClass = function (el, className) {
        if (el.className.indexOf(className) == -1) {
            el.className += " " + className;
        }
    }
    this.removeClass = function (el, className) {
        el.className = el.className.replace(className, "");
        el.className = el.className.replace("  ", " ");
        el.className = el.className.trim();
    }
    this.removeElement = function (element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }
    this.getFirstElementByClassName = function (parent, className) {
        var els = this.getElementsByClassName(parent, className);
        return els[0];
    }
    this.getElementsByClassName = function (parent, className) {
        if (parent.getElementsByClassName)
            return parent.getElementsByClassName(className);
        else if (parent.querySelectorAll) {
            return parent.querySelectorAll("." + className);
        } else if (document.querySelectorAll) {
            return document.querySelectorAll("." + className);
        }
    }
    this.addEvent = function (el, e, f, c) {
        if (el.addEventListener) {
            return el.addEventListener(e, f, c);
        }
        else if (el.attachEvent) {
            return el.attachEvent('on' + e, f);
        }
    }
    this.removeEvent = function (el, e, f) {
        if (el.removeEventListener) {
            return el.removeEventListener(e, f);
        }
        else if (el.detachEvent) {
            return el.detachEvent('on' + e, f);
        }
    }

    this.setAttribute = function (el, n, v) {
        if (el.setAttribute) {
            el.setAttribute(n, v);
        } else {
            el[n] = v;
        }
    }

    this.makeRequest = function (url, data, handler) {

        jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            success: handler,
            timeout: 600000,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }

        });

    }

    this.setAttribute = function (el, n, v) {
        if (el.setAttribute) {
            el.setAttribute(n, v);
        } else {
            el[n] = v;
        }
    }

    this.getAttribute = function (el, n) {
        if (el.getAttribute) {
            return el.getAttribute(n);
        } else {
            return el[n];
        }
    }

}

var BRUtilStatic = new BRUtilStaticClass();



var BREngine = function () {

    this.convert = function (imgData, fgBgMaskImgData) {

        this.skipStrength = 1;

        this.applyStrength = 1;

        var sideArr = this.createSideArrFromRG(fgBgMaskImgData);

        var time = (new Date()).getTime();
        var arr = this.separate(imgData, sideArr, 1, 100);

        return this.getMask(arr);

    }

    this.getAutoCropBounds = function (imageData) {

        var d = imageData.data;
        var width = imageData.width;
        var height = imageData.height;

        var retObj = {};

        outer_loop:
                for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (d[(y * width + x) * 4 + 3] != 0) {
                    retObj.x = x;
                    break outer_loop;
                }
            }
        }

        outer_loop2:
                for (var x = width - 1; x >= 0; x--) {
            for (var y = 0; y < height; y++) {
                if (d[(y * width + x) * 4 + 3] != 0) {
                    retObj.width = x - retObj.x;
                    break outer_loop2;
                }
            }
        }

        outer_loop3:
                for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (d[(y * width + x) * 4 + 3] != 0) {
                    retObj.y = y;
                    break outer_loop3;
                }
            }
        }

        outer_loop4:
                for (var y = height - 1; y < height; y--) {
            for (var x = 0; x < width; x++) {
                if (d[(y * width + x) * 4 + 3] != 0) {
                    retObj.height = y - retObj.y;
                    break outer_loop4;
                }
            }
        }

        return retObj;
    }

    this.copySemiTransparentPixels = function (orgImageData_Blured, imageData_Blured, imgData) {
        var id = imageData_Blured.data;
        var sd = orgImageData_Blured.data;
        var d = imgData.data;
        for (var i = 0, len = sd.length; i < len; i += 4) {
            if (sd[i + 3] > 0) {
                sd[i] = d[i];
                sd[i + 1] = d[i + 1];
                sd[i + 2] = d[i + 2];
            }
        }
        orgImageData_Blured.data = sd;
    }

    this.getEdge = function () {
        return this.edge;
    }

    this.makeEdgeFromMaskData = function (maskDataArr, width, height, ws, colorArr) {

        var retArr = new Uint8Array(maskDataArr.length);
        var pos;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                if (maskDataArr[(y * width + x) * 4 + 3] == 0)
                    continue;

                for (var xx = Math.max(0, x - ws), xxTo = Math.min(x + ws + 1, width); xx < xxTo; xx++) {
                    for (var yy = Math.max(0, y - ws), yyTo = Math.min(y + ws + 1, height); yy < yyTo; yy++) {
                        if (maskDataArr[(yy * width + xx) * 4 + 3] == 0) {
                            pos = (yy * width + xx) * 4;
                            retArr[pos] = colorArr[0];
                            retArr[pos + 1] = colorArr[1];
                            retArr[pos + 2] = colorArr[2];
                            retArr[pos + 3] = colorArr[3];
                        }
                    }
                }
            }
        }

        for (var i = 0; i < retArr.length; i++) {
            if (!retArr[i])
                retArr[i] = 0;
        }

        return retArr;

    }

    this.featherEdge = function (maskDataArr, width, height, ws, opacity) {

        var retArr = new Uint8Array(maskDataArr.length);
        var pos;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                if (maskDataArr[(y * width + x) * 4 + 3 ] != 0)
                    continue;

                for (var xx = Math.max(0, x - ws), xxTo = Math.min(x + ws + 1, width); xx < xxTo; xx++) {
                    for (var yy = Math.max(0, y - ws), yyTo = Math.min(y + ws + 1, height); yy < yyTo; yy++) {
                        if (maskDataArr[(yy * width + xx) * 4 + 3] != 0) {
                            pos = (yy * width + xx) * 4;
                            retArr[pos] = maskDataArr[pos];//colorArr[0];
                            retArr[pos + 1] = maskDataArr[pos + 1];//colorArr[1];
                            retArr[pos + 2] = maskDataArr[pos + 2];//colorArr[2];
                            retArr[pos + 3] = opacity;//colorArr[3];
                        }
                    }
                }
            }
        }

        for (var i = 0; i < retArr.length; i++) {
            if (!retArr[i])
                retArr[i] = maskDataArr[i];
        }

        return retArr;

    }


    this.makeEdge = function (stateArr, width, height, ws, colorArr) {

        var retArr = new Uint8Array(stateArr.length * 4);
        var pos;

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {

                if (stateArr[y * width + x] != 1)
                    continue;

                for (var xx = Math.max(0, x - ws), xxTo = Math.min(x + ws + 1, width); xx < xxTo; xx++) {
                    for (var yy = Math.max(0, y - ws), yyTo = Math.min(y + ws + 1, height); yy < yyTo; yy++) {

                        if (stateArr[yy * width + xx] != 1) {
                            pos = (yy * width + xx) * 4;
                            retArr[pos] = colorArr[0];
                            retArr[pos + 1] = colorArr[1];
                            retArr[pos + 2] = colorArr[2];
                            retArr[pos + 3] = colorArr[3];

                        }

                    }
                }
            }
        }

        for (var i = 0; i < retArr.length; i++) {
            if (!retArr[i])
                retArr[i] = 0;
        }

        return retArr;

    }

    this.getMonoData = function () {
        return this.monoData;
    }

    this.getImageFormMono = function (arr) {

        var retArr = this.getUint8ClampedArray();

        for (var i = 0; i < arr.length; i++) {

            retArr[i * 4] = Math.floor(arr[i] * 255);
            retArr[i * 4 + 1] = Math.floor(arr[i] * 255);
            retArr[i * 4 + 2] = Math.floor(arr[i] * 255);
            retArr[i * 4 + 3] = 255;

        }

        return retArr;

    }

    this.getImageFormMonoRGB = function (arr) {

        var retArr = this.getUint8ClampedArray();

        for (var i = 0; i < arr.length; i++) {

            retArr[i] = Math.round(arr[i] * 255);

        }

        return retArr;

    }

    this.getMask = function (arr) {

        var retArr = this.getUint8ClampedArray(arr.length * 4);

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] > 0) {
                retArr[i * 4] = 0;
                retArr[i * 4 + 1] = 0;
                retArr[i * 4 + 2] = 0;
                retArr[i * 4 + 3] = 125;
            } else {
                retArr[i * 4] = 0;
                retArr[i * 4 + 1] = 0;
                retArr[i * 4 + 2] = 0;
                retArr[i * 4 + 3] = 0;
            }
        }

        return retArr;

    }



    this.separate = function (imgData, stateArr, dis, maxIteration) {

        var strengthArr = new Float32Array(stateArr.length);
        for (var i = 0, len = stateArr.length; i < len; i++) {
            stateArr[i] != 0 ? strengthArr[i] = 1 : strengthArr[i] = 0;

        }

        var imgDataF = this.convertToFloatNative(imgData.data);
        this.imgDataF = new Float32Array(imgDataF.length);
        this.imgDataF.set(imgDataF);

        var changes = 1;
        var n = 0;

        var stateNextArr = new Float32Array(stateArr.length);
        var strengthNextArr = new Float32Array(strengthArr.length);

        stateNextArr.set(stateArr);
        strengthNextArr.set(strengthArr);

        var diff;
        var width = imgData.width
        var height = imgData.height;

        while (changes > 0 && n < maxIteration) {

            changes = 0;
            n += 1;

            for (var j = 0; j < width; j++) {
                for (var i = 0; i < height; i++) {

                    var Strength_p = strengthArr[i * width + j];

                    if (this.skipStrength && Strength_p == 1)
                        continue;

                    var C_p = imgDataF[i * width + j];
                    var S_p = stateArr[i * width + j];

                    for (var jj = Math.max(0, j - dis), jjTO = Math.min(j + dis + 1, width); jj < jjTO; jj++) {
                        for (var ii = Math.max(0, i - dis), iiTO = Math.min(i + dis + 1, height); ii < iiTO; ii++) {

                            C_q = imgDataF[ii * width + jj];
                            S_q = stateArr[ii * width + jj];
                            Strength_q = strengthArr[ii * width + jj];

                            diff = 1 - Math.abs(C_q - C_p);

                            if (diff * Strength_q > Strength_p) {

                                if (this.applyStrength)
                                    Strength_p = diff * Strength_q

                                stateNextArr[i * width + j] = S_q;
                                strengthNextArr[i * width + j] = diff * Strength_q;

                                changes += 1;

                            }

                        }
                    }
                }
            }

            stateArr.set(stateNextArr);
            strengthArr.set(strengthNextArr);

        }

        return stateArr;

    }

    this.createSideArrFromRG = function (fgBgMaskImgData) {

        var d = fgBgMaskImgData.data;
        var retArr = new Int8Array(d.length / 4);

        for (var i = 0; i < d.length; i += 4) {
            if (d[i] == 255 && d[i + 1] == 0 && d[i + 2] == 0) {
                retArr[i / 4] = -1;
            } else if (d[i] == 0 && d[i + 1] == 255 && d[i + 2] == 0) {
                retArr[i / 4] = 1;
            } else {
                retArr[i / 4] = 0;
            }
        }

        return retArr;

    }

    this.createSideArr = function (fgImgData, bgImgData) {

        var fgD = fgImgData.data;
        var bgD = bgImgData.data;
        var retArr = [];
        for (var i = 0; i < fgD.length; i += 4) {
            if (fgD[i + 3] > 0) {
                retArr.push(1);
            } else if (bgD[i + 3] > 0) {
                retArr.push(-1);
            } else {
                retArr.push(0);
            }
        }

        return retArr;

    }

    this.convertToFloat = function (d) {

        var retArr = new Float32Array(d.length / 4);
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = (r + g + b) / 3;
            retArr[i / 4] = (v / 256);
        }

        return retArr;

    }

    this.convertToFloatRGB = function (d) {

        var retArr = [];
        for (var i = 0, len = d.length; i < len; i += 4) {
            retArr.push(d[i] / 255);
            retArr.push(d[i + 1] / 255);
            retArr.push(d[i + 2] / 255);
            retArr.push(d[i + 3] / 255);
        }

        return retArr;

    }

    this.convertToFloatNative = function (d) {

        var retArr = [];
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            retArr.push(v / 255);
        }

        return retArr;

    }

    this.getImageData = function (img, x, y, w, h) {

        var c = this.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        if (h) {
            return ctx.getImageData(x, y, w, h);
        }

        return ctx.getImageData(0, 0, img.width, img.height);

    }

    this.getCanvas = function (w, h) {

        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;

        return c;

    }
    this.getUint8ClampedArray = function (size) {
        if (typeof (Uint8ClampedArray) !== "undefined") {
            return new Uint8ClampedArray(size);
        } else {
            return new Array(size);
        }

    }
}




function BRUtil() {
}

BRUtil.prototype.floodFill = function (canvas, x, y, oldVal, newVal) {

    if (!oldVal)
        oldVal = [0, 0, 0, 0];
    if (!newVal)
        newVal = [255, 0, 0, 255];

    var w = canvas.width
    var h = canvas.height

    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    var count = 0;
    var stack = [{x: x, y: y}];

    while (stack.length > 0) {

        var p = stack.pop();

        var x = p.x;
        var y = p.y;

        count++;
        if (count > 100000000)
            break;

        var pos = (y * w + x) * 4;

        if (data[pos] != oldVal[0] || data[pos + 1] != oldVal[1] || data[pos + 2] != oldVal[2]) {
            continue;
        }

        data[pos] = newVal[0];
        data[pos + 1] = newVal[1];
        data[pos + 2] = newVal[2];
        data[pos + 3] = newVal[3];

        if (x > 0) { // left
            stack.push({x: x - 1, y: y});
        }
        if (y > 0) { // up
            stack.push({x: x, y: y - 1});
        }
        if (x < w - 1) { // right
            stack.push({x: x + 1, y: y});
        }
        if (y < h - 1) { // down
            stack.push({x: x, y: y + 1});
        }
    }

    imageData.data = data;
    ctx.putImageData(imageData, 0, 0);


    return count;
}

BRUtil.prototype.rgbToFloat = function (r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

BRUtil.prototype.getMagicWandSelectionCanvas = function (canvas, x, y, tolerance) {

    var tol = tolerance / 100;

    var w = canvas.width
    var h = canvas.height

    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    var selCanvas = document.createElement("canvas");
    selCanvas.width = w;
    selCanvas.height = h;

    var selCtx = selCanvas.getContext("2d");
    var selectionImageData = selCtx.getImageData(0, 0, w, h);
    var sData = selectionImageData.data;

    var refColorPos = (y * w + x) * 4;
    var refColor = [data[refColorPos], data[refColorPos + 1], data[refColorPos + 2], data[refColorPos + 3]];
    var refColorGray = this.rgbToFloat(data[refColorPos], data[refColorPos + 1], data[refColorPos + 2]);

    var count = 0;
    var stack = [{x: x, y: y}];

    while (stack.length > 0) {

        var p = stack.pop();

        var x = p.x;
        var y = p.y;

        count++;
        if (count > 100000000)
            break;

        var pos = (y * w + x) * 4;

        if (sData[pos] != 0 || sData[pos + 1] != 0) {
            continue;
        }

        var newColorGray = this.rgbToFloat(data[pos], data[pos + 1], data[pos + 2]);

        if (refColorGray < newColorGray + tol && refColorGray > newColorGray - tol) {
            sData[pos + 1] = 255;
            sData[pos + 3] = 255;
        } else {
            sData[pos] = 255;
            sData[pos + 3] = 255;
            continue;
        }

        if (x > 0) { // left
            stack.push({x: x - 1, y: y});
        }
        if (y > 0) { // up
            stack.push({x: x, y: y - 1});
        }
        if (x < w - 1) { // right
            stack.push({x: x + 1, y: y});
        }
        if (y < h - 1) { // down
            stack.push({x: x, y: y + 1});
        }
    }

    selectionImageData.data = sData;
    selCtx.putImageData(selectionImageData, 0, 0);

    this.latestCount = count;

    return selCanvas;

}

BRUtil.prototype.extendBorder = function (canvas, targetColor, selColor, borderSize) {

    var dif = parseInt(borderSize / 2);
    var width = canvas.width;
    var height = canvas.height;

    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var selCanvas = document.createElement("canvas");
    selCanvas.width = width;
    selCanvas.height = height;

    var selCtx = selCanvas.getContext("2d");
    var selectionImageData = selCtx.getImageData(0, 0, width, height);
    var sData = selectionImageData.data;

    var pos;

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            pos = (y * width + x) * 4;

            if (data[pos] != targetColor[0] || data[pos + 1] != targetColor[1] || data[pos + 2] != targetColor[2]) {
                continue;
            }

            for (var xx = Math.max(0, x - dif), xxTo = Math.min(x + dif + 1, width); xx < xxTo; xx++) {
                for (var yy = Math.max(0, y - dif), yyTo = Math.min(y + dif + 1, height); yy < yyTo; yy++) {

                    pos = (yy * width + xx) * 4;
                    sData[pos] = selColor[0];
                    sData[pos + 1] = selColor[1];
                    sData[pos + 2] = selColor[2];
                    sData[pos + 3] = selColor[3];

                }
            }
        }
    }

    selectionImageData.data = sData;
    selCtx.putImageData(selectionImageData, 0, 0);

    return selCanvas;

}

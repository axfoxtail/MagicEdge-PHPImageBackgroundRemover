<?php

class AWSSOFT_MagicEdgeLite_Backend{

    function __construct() {

        add_action('admin_menu', array($this, 'addMenu'));
        add_action('init', array($this, 'initHook'));

        if (isset($_GET['page']) && $_GET['page'] == "awssoft-magic-edge-lite") {
            add_action('admin_init', array($this, 'enqueueJSCSS'));
        }

        add_action('wp_ajax_save_image', array($this, 'ajaxSaveImage'));
		
    }
 
    function ajaxSaveImage() {

        $d = $_POST['data'];

        $uploads = wp_upload_dir();

        $parts = pathinfo($d["orgImageFullPath"]);
        $newFilename = $parts['filename'] . "-transparent.png";
        for ($i = 1; $i < 100; $i++) {
            if (!is_file($uploads["path"] . "/" . $newFilename)) {
                break;
            }
            $newFilename = $parts['filename'] . "-transparent-" . $i . ".png";
        }

        // full path
        $filename = $uploads["path"] . "/" . $newFilename;

        //PNG content
        list(, $data) = explode(',', $d["imageBase64"]);
        $iData = base64_decode($data);

        if (!file_put_contents($filename, $iData)) {
            $this->outputError("Error 2422 - Cannot save new image file");
            die();
        }

        $attachment = array(
            'guid' => $uploads["path"] . '/' . basename($filename),
            'post_mime_type' => 'image/png',
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
            'post_content' => '',
            'post_status' => 'inherit'
        );

        $attach_id = wp_insert_attachment($attachment, $filename);

        if (!$attach_id) {
            $this->outputError("Error 2423 - Failed to save record into database");
            die();
        }

        require_once( ABSPATH . 'wp-admin/includes/image.php' );

        $attach_data = wp_generate_attachment_metadata($attach_id, $filename);
        wp_update_attachment_metadata($attach_id, $attach_data);

        $this->outputSuccessMessage("Image has been saved. Image name: " . $newFilename);

        die();
        
    }

    function initHook() {
        
    }

    function enqueueJSCSS() {
        
        wp_enqueue_style('farbtastic');
        wp_enqueue_script('farbtastic');
        wp_enqueue_style('me-css', plugins_url('/css/me.css', __FILE__));
        wp_enqueue_style('wp-me-css', plugins_url('/css/wp-me.css', __FILE__));
        wp_enqueue_script('me-js', plugins_url('/js/me.js', __FILE__), array('jquery'), '', true);
		wp_enqueue_script('filters-js', plugins_url('/js/filters.js', __FILE__), array('me-js'), '', true);
        wp_enqueue_script('me-includes-js', plugins_url('/js/me-includes.js', __FILE__), array('me-js'), '', true);

        wp_enqueue_script('wp-me-js', plugins_url('/js/wp-me.js', __FILE__), array('jquery', 'me-js'), '', true);

        wp_enqueue_script('media-upload');
        wp_enqueue_script('thickbox');
        wp_enqueue_script('my-upload');
        wp_enqueue_style('thickbox');
        
        $BG_REM_GLOBAL  = array( 'pluginUrl' => plugins_url( )  );
        wp_localize_script( 'wp-me-js', 'BG_REM_GLOBAL', $BG_REM_GLOBAL );

    }

    function addMenu() {
	
        add_media_page('Magic Edge Lite', 'Magic Edge Lite', 'upload_files', 'awssoft-magic-edge-lite', array($this, 'addPageContentHandler'));
		
    }

    function addPageContentHandler() {

        echo '<div class="wrap">';

        echo '<h3 class="BR-magicEdgeTitle">Magic Edge Lite</h3>';
        echo '<div style="float:right;position: absolute;top: 10px;right: 10px;" class="BR-rightLinksHolder"><a href="http://www.awssoft.com/magic-edge/" target="_blank">Homepage &amp; Support</a></div>';
        echo '<div id="BR-rootHolder" class="BR-rootHolder"></div>';
        echo '<input id="upload_image" type="text" size="36" name="upload_image" value="" style="display:none" />';
        echo '</div>';
        
    }

    public function outputError($msq) {
	
        $retObj = (object) array();
        $retObj->error = true;
        $retObj->errorMessage = $msq;
        echo json_encode($retObj);
		
    }

    public function outputSuccessMessage($msq) {
	
        $retObj = (object) array();
        $retObj->success = true;
        $retObj->message = $msq;
        echo json_encode($retObj);
		
    }

}

?>
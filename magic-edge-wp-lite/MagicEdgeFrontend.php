<?php

class AWSSOFT_MagicEdgeLite_Frontend {

    function __construct() {

        add_shortcode('magicedge', array($this, 'shortCodeHandler'));
        
    }

    function shortCodeHandler($attr) {

        $this->attr = shortcode_atts(array(
            'width' => 'full',
            'height' => 'full',
                ), $attr);

        wp_enqueue_style('farbtastic');
        wp_enqueue_script('farbtastic');

        wp_enqueue_style('farbtastic-css', plugins_url('/css/farbtastic.css', __FILE__));
        wp_enqueue_script('farbtastic-js', plugins_url('/js/farbtastic.js', __FILE__), array('jquery'), '', true);

        wp_enqueue_style('me-css', plugins_url('/css/me.css', __FILE__));
        wp_enqueue_style('wp-me-css', plugins_url('/css/wp-me.css', __FILE__));
        wp_enqueue_script('me-js', plugins_url('/js/me.js', __FILE__), array('jquery'), '', true);
        wp_enqueue_script('filters-js', plugins_url('/js/filters.js', __FILE__), array('me-js'), '', true);
        wp_enqueue_script('wp-me-js', plugins_url('/js/wp-me.js', __FILE__), array('jquery', 'me-js'), '', true);
        wp_enqueue_script('me-includes-js', plugins_url('/js/me-includes.js', __FILE__), array('me-js'), '', true);

        $BG_REM_GLOBAL = array('pluginUrl' => plugins_url());
        wp_localize_script('wp-me-js', 'BG_REM_GLOBAL', $BG_REM_GLOBAL);

        return $this->getPageContentHandler();
        
    }

    function getPageContentHandler() {

        $s .= '<div id="BR-rootHolder" class="BR-rootHolder"></div>';
        $s .= '<input id="upload_image" type="text" size="36" name="upload_image" value="" style="display:none" />';
        $s .= "<script> var frontendMagicEdgeConfig = { width:'" . $this->attr["width"] . "', height:'" . $this->attr["height"] . "' }; </script>";

        return $s;
    }

}

?>
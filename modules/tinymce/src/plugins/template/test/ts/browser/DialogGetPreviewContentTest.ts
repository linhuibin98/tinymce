/* eslint-disable max-len */
import { Log, Pipeline, Step } from '@ephox/agar';
import { UnitTest, Assert } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import TemplatePlugin from 'tinymce/plugins/template/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';
import { getPreviewContent } from 'tinymce/plugins/template/ui/Dialog';

const noCorsNoStyle = '<!DOCTYPE html><html><head><base href="http://localhost:8000/"><link type="text/css" rel="stylesheet" href="http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/content.min.css"><link type="text/css" rel="stylesheet" href="http://localhost:8000/project/tinymce/js/tinymce/skins/content/default/content.css"><script>document.addEventListener && document.addEventListener("click", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === "A" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script> </head><body class=""></body></html>';

const CorsNoStyle = '<!DOCTYPE html><html><head><base href=\"http://localhost:8000/\"><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/content.min.css\" crossorigin=\"anonymous\"><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/content/default/content.css\" crossorigin=\"anonymous\"><script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script> </head><body class=\"\"></body></html>';

const NoCorsStyle = '<!DOCTYPE html><html><head><base href=\"http://localhost:8000/\"><style type=\"text/css\">This is the style inserted into the document</style><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/content.min.css\"><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/content/default/content.css\"><script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script> </head><body class=\"\"></body></html>';

const CorsStyle = '<!DOCTYPE html><html><head><base href=\"http://localhost:8000/\"><style type=\"text/css\">This is the style inserted into the document</style><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/content.min.css\" crossorigin=\"anonymous\"><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/content/default/content.css\" crossorigin=\"anonymous\"><script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script> </head><body class=\"\"></body></html>';

const CorsStyleAndContent = '<!DOCTYPE html><html><head><base href=\"http://localhost:8000/\"><style type=\"text/css\">This is the style inserted into the document</style><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/ui/oxide/content.min.css\" crossorigin=\"anonymous\"><link type=\"text/css\" rel=\"stylesheet\" href=\"http://localhost:8000/project/tinymce/js/tinymce/skins/content/default/content.css\" crossorigin=\"anonymous\"><script>document.addEventListener && document.addEventListener(\"click\", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === \"A\" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);</script> </head><body class=\"\">Custom content which was provided</body></html>';

UnitTest.asynctest('browser.tinymce.plugins.template.Dialog.getPreviewContent', (success, failure) => {
  TemplatePlugin();
  SilverTheme();

  TinyLoader.setupLight((editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);

    const sCheckPreview = (expected: string, html?: string) =>
      Step.sync(() =>
        Assert.eq('', expected, getPreviewContent(editor, html ? html : '')));

    Pipeline.async({}, [
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: No CORS or content style, no previous HTML', [
        sCheckPreview(noCorsNoStyle)
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: CORS but no content style, no previous HTML', [
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(CorsNoStyle),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: No CORS but content style, no previous HTML', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        sCheckPreview(NoCorsStyle),
        tinyApis.sDeleteSetting('content_style')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: CORS and content style, no previous HTML', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(CorsStyle),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: with provided content', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview(CorsStyleAndContent, 'Custom content which was provided'),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ]),
      Log.stepsAsStep('TINY-6115', 'Dialog.getPreviewcontent: with provided html', [
        tinyApis.sSetSetting('content_style', 'This is the style inserted into the document'),
        tinyApis.sSetSetting('content_css_cors', true),
        sCheckPreview('<html>Custom content here', '<html>Custom content here'),
        tinyApis.sDeleteSetting('content_style'),
        tinyApis.sDeleteSetting('content_css_cors')
      ])
    ], onSuccess, onFailure);
  }, {
    theme: 'silver',
    plugins: 'template',
    toolbar: 'template',
    indent: false,
    base_url: '/project/tinymce/js/tinymce'
  }, success, failure);
});

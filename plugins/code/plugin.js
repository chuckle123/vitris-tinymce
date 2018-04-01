(function () {
var code = (function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var getMinWidth = function (editor) {
    return editor.getParam('code_dialog_width', 600);
  };
  var getMinHeight = function (editor) {
    return editor.getParam('code_dialog_height', Math.min(global$1.DOM.getViewPort().h - 200, 500));
  };
  var $_2sgqx59cjfh9qace = {
    getMinWidth: getMinWidth,
    getMinHeight: getMinHeight
  };

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var $_83j50d9ejfh9qacg = {
    setContent: setContent,
    getContent: getContent
  };

  var open = function (editor) {
    var minWidth = $_2sgqx59cjfh9qace.getMinWidth(editor);
    var minHeight = $_2sgqx59cjfh9qace.getMinHeight(editor);
    var win = editor.windowManager.open({
      title: 'Source code',
      body: {
        type: 'textbox',
        name: 'code',
        multiline: true,
        minWidth: minWidth,
        minHeight: minHeight,
        spellcheck: false,
        style: 'direction: ltr; text-align: left'
      },
      onSubmit: function (e) {
        $_83j50d9ejfh9qacg.setContent(editor, e.data.code);
      }
    });
    win.find('#code').value($_83j50d9ejfh9qacg.getContent(editor));
  };
  var $_84bk7v9bjfh9qacc = { open: open };

  var register = function (editor) {
    editor.addCommand('mceCodeEditor', function () {
      $_84bk7v9bjfh9qacc.open(editor);
    });
  };
  var $_9lbo7i9ajfh9qacb = { register: register };

  var register$1 = function (editor) {
    editor.addButton('code', {
      icon: 'code',
      tooltip: 'Source code',
      onclick: function () {
        $_84bk7v9bjfh9qacc.open(editor);
      }
    });
    editor.addMenuItem('code', {
      icon: 'code',
      text: 'Source code',
      onclick: function () {
        $_84bk7v9bjfh9qacc.open(editor);
      }
    });
  };
  var $_eqmfkw9fjfh9qach = { register: register$1 };

  global.add('code', function (editor) {
    $_9lbo7i9ajfh9qacb.register(editor);
    $_eqmfkw9fjfh9qach.register(editor);
    return {};
  });
  function Plugin () {
  }

  return Plugin;

}());
})();

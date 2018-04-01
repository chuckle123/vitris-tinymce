(function () {
var hr = (function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var register = function (editor) {
    editor.addCommand('InsertHorizontalRule', function () {
      editor.execCommand('mceInsertContent', false, '<hr />');
    });
  };
  var $_827mh4bujfh9qapq = { register: register };

  var register$1 = function (editor) {
    editor.addButton('hr', {
      icon: 'hr',
      tooltip: 'Horizontal line',
      cmd: 'InsertHorizontalRule'
    });
    editor.addMenuItem('hr', {
      icon: 'hr',
      text: 'Horizontal line',
      cmd: 'InsertHorizontalRule',
      context: 'insert'
    });
  };
  var $_7wu9yfbvjfh9qaps = { register: register$1 };

  global.add('hr', function (editor) {
    $_827mh4bujfh9qapq.register(editor);
    $_7wu9yfbvjfh9qaps.register(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();

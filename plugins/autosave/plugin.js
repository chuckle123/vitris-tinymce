(function () {
var autosave = (function () {
  'use strict';

  var Cell = function (initial) {
    var value = initial;
    var get = function () {
      return value;
    };
    var set = function (v) {
      value = v;
    };
    var clone = function () {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

  var global$1 = tinymce.util.Tools.resolve('tinymce.util.LocalStorage');

  var global$2 = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var fireRestoreDraft = function (editor) {
    return editor.fire('RestoreDraft');
  };
  var fireStoreDraft = function (editor) {
    return editor.fire('StoreDraft');
  };
  var fireRemoveDraft = function (editor) {
    return editor.fire('RemoveDraft');
  };
  var $_51mfhb8mjfh9qa9o = {
    fireRestoreDraft: fireRestoreDraft,
    fireStoreDraft: fireStoreDraft,
    fireRemoveDraft: fireRemoveDraft
  };

  var parse = function (time, defaultTime) {
    var multiples = {
      s: 1000,
      m: 60000
    };
    time = /^(\d+)([ms]?)$/.exec('' + (time || defaultTime));
    return (time[2] ? multiples[time[2]] : 1) * parseInt(time, 10);
  };
  var $_1zs6lm8ojfh9qa9s = { parse: parse };

  var shouldAskBeforeUnload = function (editor) {
    return editor.getParam('autosave_ask_before_unload', true);
  };
  var getAutoSavePrefix = function (editor) {
    var prefix = editor.getParam('autosave_prefix', 'tinymce-autosave-{path}{query}{hash}-{id}-');
    prefix = prefix.replace(/\{path\}/g, document.location.pathname);
    prefix = prefix.replace(/\{query\}/g, document.location.search);
    prefix = prefix.replace(/\{hash\}/g, document.location.hash);
    prefix = prefix.replace(/\{id\}/g, editor.id);
    return prefix;
  };
  var shouldRestoreWhenEmpty = function (editor) {
    return editor.getParam('autosave_restore_when_empty', false);
  };
  var getAutoSaveInterval = function (editor) {
    return $_1zs6lm8ojfh9qa9s.parse(editor.settings.autosave_interval, '30s');
  };
  var getAutoSaveRetention = function (editor) {
    return $_1zs6lm8ojfh9qa9s.parse(editor.settings.autosave_retention, '20m');
  };
  var $_g54n9c8njfh9qa9p = {
    shouldAskBeforeUnload: shouldAskBeforeUnload,
    getAutoSavePrefix: getAutoSavePrefix,
    shouldRestoreWhenEmpty: shouldRestoreWhenEmpty,
    getAutoSaveInterval: getAutoSaveInterval,
    getAutoSaveRetention: getAutoSaveRetention
  };

  var isEmpty = function (editor, html) {
    var forcedRootBlockName = editor.settings.forced_root_block;
    html = global$2.trim(typeof html === 'undefined' ? editor.getBody().innerHTML : html);
    return html === '' || new RegExp('^<' + forcedRootBlockName + '[^>]*>((\xA0|&nbsp;|[ \t]|<br[^>]*>)+?|)</' + forcedRootBlockName + '>|<br>$', 'i').test(html);
  };
  var hasDraft = function (editor) {
    var time = parseInt(global$1.getItem($_g54n9c8njfh9qa9p.getAutoSavePrefix(editor) + 'time'), 10) || 0;
    if (new Date().getTime() - time > $_g54n9c8njfh9qa9p.getAutoSaveRetention(editor)) {
      removeDraft(editor, false);
      return false;
    }
    return true;
  };
  var removeDraft = function (editor, fire) {
    var prefix = $_g54n9c8njfh9qa9p.getAutoSavePrefix(editor);
    global$1.removeItem(prefix + 'draft');
    global$1.removeItem(prefix + 'time');
    if (fire !== false) {
      $_51mfhb8mjfh9qa9o.fireRemoveDraft(editor);
    }
  };
  var storeDraft = function (editor) {
    var prefix = $_g54n9c8njfh9qa9p.getAutoSavePrefix(editor);
    if (!isEmpty(editor) && editor.isDirty()) {
      global$1.setItem(prefix + 'draft', editor.getContent({
        format: 'raw',
        no_events: true
      }));
      global$1.setItem(prefix + 'time', new Date().getTime().toString());
      $_51mfhb8mjfh9qa9o.fireStoreDraft(editor);
    }
  };
  var restoreDraft = function (editor) {
    var prefix = $_g54n9c8njfh9qa9p.getAutoSavePrefix(editor);
    if (hasDraft(editor)) {
      editor.setContent(global$1.getItem(prefix + 'draft'), { format: 'raw' });
      $_51mfhb8mjfh9qa9o.fireRestoreDraft(editor);
    }
  };
  var startStoreDraft = function (editor, started) {
    var interval = $_g54n9c8njfh9qa9p.getAutoSaveInterval(editor);
    if (!started.get()) {
      setInterval(function () {
        if (!editor.removed) {
          storeDraft(editor);
        }
      }, interval);
      started.set(true);
    }
  };
  var restoreLastDraft = function (editor) {
    editor.undoManager.transact(function () {
      restoreDraft(editor);
      removeDraft(editor);
    });
    editor.focus();
  };
  var $_cv4l7d8jjfh9qa9k = {
    isEmpty: isEmpty,
    hasDraft: hasDraft,
    removeDraft: removeDraft,
    storeDraft: storeDraft,
    restoreDraft: restoreDraft,
    startStoreDraft: startStoreDraft,
    restoreLastDraft: restoreLastDraft
  };

  var curry = function (f, editor) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      return f.apply(null, [editor].concat(args));
    };
  };
  var get = function (editor) {
    return {
      hasDraft: curry($_cv4l7d8jjfh9qa9k.hasDraft, editor),
      storeDraft: curry($_cv4l7d8jjfh9qa9k.storeDraft, editor),
      restoreDraft: curry($_cv4l7d8jjfh9qa9k.restoreDraft, editor),
      removeDraft: curry($_cv4l7d8jjfh9qa9k.removeDraft, editor),
      isEmpty: curry($_cv4l7d8jjfh9qa9k.isEmpty, editor)
    };
  };
  var $_4p4vd68ijfh9qa9i = { get: get };

  var global$3 = tinymce.util.Tools.resolve('tinymce.EditorManager');

  global$3._beforeUnloadHandler = function () {
    var msg;
    global$2.each(global$3.get(), function (editor) {
      if (editor.plugins.autosave) {
        editor.plugins.autosave.storeDraft();
      }
      if (!msg && editor.isDirty() && $_g54n9c8njfh9qa9p.shouldAskBeforeUnload(editor)) {
        msg = editor.translate('You have unsaved changes are you sure you want to navigate away?');
      }
    });
    return msg;
  };
  var setup = function (editor) {
    window.onbeforeunload = global$3._beforeUnloadHandler;
  };
  var $_18s5pv8pjfh9qa9t = { setup: setup };

  var postRender = function (editor, started) {
    return function (e) {
      var ctrl = e.control;
      ctrl.disabled(!$_cv4l7d8jjfh9qa9k.hasDraft(editor));
      editor.on('StoreDraft RestoreDraft RemoveDraft', function () {
        ctrl.disabled(!$_cv4l7d8jjfh9qa9k.hasDraft(editor));
      });
      $_cv4l7d8jjfh9qa9k.startStoreDraft(editor, started);
    };
  };
  var register = function (editor, started) {
    editor.addButton('restoredraft', {
      title: 'Restore last draft',
      onclick: function () {
        $_cv4l7d8jjfh9qa9k.restoreLastDraft(editor);
      },
      onPostRender: postRender(editor, started)
    });
    editor.addMenuItem('restoredraft', {
      text: 'Restore last draft',
      onclick: function () {
        $_cv4l7d8jjfh9qa9k.restoreLastDraft(editor);
      },
      onPostRender: postRender(editor, started),
      context: 'file'
    });
  };
  var $_323zbf8rjfh9qa9v = { register: register };

  global.add('autosave', function (editor) {
    var started = Cell(false);
    $_18s5pv8pjfh9qa9t.setup(editor);
    $_323zbf8rjfh9qa9v.register(editor, started);
    return $_4p4vd68ijfh9qa9i.get(editor);
  });
  function Plugin () {
  }

  return Plugin;

}());
})();

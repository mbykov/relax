//
(function($) {
  $.couch = $.couch || {};
  /**   * @private   */
  function encodeDocId(docID) {
    var parts = docID.split("/");
    if (parts[0] == "_design") {
      parts.shift();
      return "_design/" + encodeURIComponent(parts.join('/'));
    }
    return encodeURIComponent(docID);
  }

    $.extend($.couch, {
      urlPrefix: '',
      db: function(name, db_opts) {
        db_opts = db_opts || {};
        return /** @lends $.couch.db */{
          name: name,
          uri: this.urlPrefix + "/" + encodeURIComponent(name) + "/",

          create: function(options) {
              $.extend(options, {successStatus: 201});
              ajax({
                  type: "PUT", url: this.uri, contentType: "application/json",
                  data: "", processData: false
              },
                   options,
                   "The database could not be created"
                  );
          },

      };
    },

    encodeDocId: encodeDocId
  });

  // Convert a options object to an url query string.
  // ex: {key:'value',key2:'value2'} becomes '?key="value"&key2="value2"'
  function encodeOptions(options) {
    var buf = [];
    if (typeof(options) === "object" && options !== null) {
      for (var name in options) {
        if ($.inArray(name,
                      ["error", "success", "beforeSuccess", "ajaxStart"]) >= 0)
          continue;
        var value = options[name];
        if ($.inArray(name, ["key", "startkey", "endkey"]) >= 0) {
          value = toJSON(value);
        }
        buf.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
      }
    }
    return buf.length ? "?" + buf.join("&") : "";
  }

  /**   * @private   */
  function toJSON(obj) {
    return obj !== null ? JSON.stringify(obj) : null;
  }
})(jQuery);

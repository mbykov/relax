//

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
}

utils.prototype.makeDocs = function(start, stop) {
    var docs = [];
    if (!stop) stop = start, start = 0;
    for (var i = start; i < stop; i++) {
        var doc = {};
        doc._id = i.toString();
        doc.count = i;
        doc.text = 'some text';
        docs.push(doc);
    }
    return docs;
};

utils.prototype.bareDocs = function(num) {
    var docs = [];
    for (var i = 0; i < num; i++) {
        var doc = {};
        doc.count = i;
        docs.push(doc);
    }
    return docs;
};

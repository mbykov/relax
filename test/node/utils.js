//

module.exports = utils();

function utils() {
    if (!(this instanceof utils)) return new utils();
}

utils.prototype.makeDocs = function(num) {
    var docs = [];
    for (var i = 0; i < num; i++) {
        var doc = {};
        doc._id = i.toString();
        doc.count = i;
        docs.push(doc);
    }
    return docs;
};

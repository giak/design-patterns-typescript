"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickEventHandler = void 0;
var ClickEventHandler = /** @class */ (function () {
    function ClickEventHandler() {
    }
    ClickEventHandler.prototype.handleEvent = function (elementId, callback) {
        var element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', callback);
        }
    };
    return ClickEventHandler;
}());
exports.ClickEventHandler = ClickEventHandler;

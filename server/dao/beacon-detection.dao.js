'use strict';

var BeaconDetection = require('./../models/beacon-detection.model.js');
var mongoose = require('mongoose');

//[Lindsay Thurmond:10/8/14] TODO: finish pulling dao related code from beacon-detection.service

exports.createDetectionsPromise = function (detections) {
    var promise = new mongoose.Promise;

    // Depending on how many we are trying to insert at once, we may want to change to insert
    // (draw back is that it bypasses the mongoose schema validation).  For now
    // I'm sticking with create() until it becomes a problem.
    // BeaconDetection.collection.insert(beaconDetections, callback);
    BeaconDetection.create(detections, function () {

        // wrap up results in an array to make easier to use
        var err = arguments[0];
        if (err) {
            return promise.reject(err);
        }

        var savedDetections = [];
        for (var i = 1; i < arguments.length; i++) {
            var savedDetection = arguments[i];
            savedDetections.push(savedDetection);
        }
        promise.complete(savedDetections);
    });
    return promise;
}

exports.deleteDetectionByIdPromise = function (id) {
    return BeaconDetection.findById(id).remove().exec();
}

exports.deleteAllDetections = function() {
    return BeaconDetection.find({}).remove().exec();
}
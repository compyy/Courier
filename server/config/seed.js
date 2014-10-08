/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var beaconService = require('../service/beacon.service.js');
var beaconDetectionService = require('../service/beacon-detection.service.js');
var agentService = require('../service/agent.service.js');

var userDao = require('../dao/user.dao.js');
var beaconDao = require('../dao/beacon.dao.js');
var agentDao = require('../dao/agent.dao.js');
var beaconDetectionDao = require('../dao/beacon-detection.dao.js');

module.exports = function (complete) {

    var savedAgents;
    var savedBeacons;

    // delete users
    userDao.deleteAllUsers()
        // then populate users
        .then(function () {
            var createPromise = userDao.createUsers([{
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test'
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin'
            }]);

            createPromise.then(function() {
                console.log('finished populating users');
            });

            return createPromise;
        })
        // then delete beacons
        .then(function () {
            return beaconDao.deleteAllBeacons();
        })
        // then populate beacons
        .then(function () {
            var createPromise = beaconService.createBeacons([
                {
                    name: 'Beacon 55',
                    uuid: '6fdg76hdf',
                    major: 89,
                    minor: 90987,
                    active: true
                },
                {
                    name: 'Beacon 900',
                    uuid: 'fgh8dfhdf09',
                    major: 466,
                    minor: 77,
                    active: true
                },
                {
                    name: 'Beacon 8798797',
                    uuid: 'sd098fdg0sd98f',
                    major: 6554,
                    minor: 232,
                    active: true
                }
            ]);
            createPromise.then(function (beacons) {
                savedBeacons = beacons;
                console.log('finished populating beacons');
            });
            return createPromise;
        })
        // then delete agents
        .then(function () {
            return agentDao.deleteAllAgents();
        })
        // then populate agents
        .then(function () {
            var createPromise = agentService.createAgentsPromise([
                {
                    name: 'Agent 1',
                    location: 'entry way',
                    capabilities: ['audio'],
                    approvedStatus: 'Pending',
                    operationalStatus: 'Success',
                    lastSeenBy: savedBeacons[0].uuid,
                    lastSeen: Date.now()
                },
                {
                    name: 'Agent 2',
                    location: 'great room',
                    capabilities: ['audio'],
                    approvedStatus: 'Approved',
                    operationalStatus: 'Success'
                },
                {
                    name: 'Agent 3',
                    location: 'situation room',
                    capabilities: ['audio'],
                    approvedStatus: 'Denied',
                    operationalStatus: 'Failure'
                }
            ]);
            createPromise.then(function (agents) {
                savedAgents = agents;
                console.log('finished populating agents');
            });
            return createPromise;
        })
        // then delete detections
        .then(function () {
            return beaconDetectionDao.deleteAllDetections();
        })
        // then populate detections
        .then(function () {
            var createPromise = beaconDetectionService.createDetections([
                {
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11111,
                    minor: 22222,
                    tx: 3,
                    rssi: 1,
                    distance: 1.2,
                    agentId: savedAgents[0]._id
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[0].uuid,
                    major: 11112,
                    minor: 22223,
                    tx: 4,
                    rssi: 2,
                    distance: 2.2,
                    agentId: savedAgents[1]._id
                },
                {
                    time: Date.now(),
                    uuid: savedBeacons[1].uuid,
                    major: 1,
                    minor: 1,
                    tx: -65,
                    rssi: -75,
                    distance: 3.7,
                    agentId: savedAgents[2]._id
                }
            ]);

            createPromise.then(function () {
                console.log('finished populating beacon detections');
            });
            return createPromise;
        }
    )
        .then(function () {
            console.log('Seed data complete!');
            complete();
        }, function (err) {
            console.log('Error loading seed data: ' + err);
        });
}


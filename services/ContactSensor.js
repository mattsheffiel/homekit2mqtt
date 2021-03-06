/* eslint unicorn/filename-case: "off", func-names: "off", camelcase: "off", no-unused-vars: "off", no-negated-condition: "off" */

module.exports = function (iface) {
    const {mqttPub, mqttSub, mqttStatus, log, Service, Characteristic} = iface;

    return function createService_ContactSensor(acc, settings) {
        acc.addService(Service.ContactSensor)
            .getCharacteristic(Characteristic.ContactSensorState)
            .on('get', callback => {
                log.debug('< hap get', settings.name, 'ContactSensorState');
                const contact = mqttStatus[settings.topic.statusContactSensorState] === settings.payload.onContactDetected ?
                    Characteristic.ContactSensorState.CONTACT_DETECTED :
                    Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

                log.debug('> hap re_get', settings.name, 'ContactSensorState', contact);
                callback(null, contact);
            });

        mqttSub(settings.topic.statusContactSensorState, val => {
            const contact = val === settings.payload.onContactDetected ?
                Characteristic.ContactSensorState.CONTACT_DETECTED :
                Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
            log.debug('> hap update', settings.name, 'ContactSensorState', contact);
            acc.getService(Service.ContactSensor)
                .updateCharacteristic(Characteristic.ContactSensorState, contact);
        });

        /* istanbul ignore else */
        /* Optional: Low Battery Status */
        if (settings.topic.statusLowBattery) {
            acc.getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.StatusLowBattery)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'StatusLowBattery');
                    const bat = mqttStatus[settings.topic.statusLowBattery] !== settings.payload.onLowBattery ?
                        Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL :
                        Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
                    log.debug('> hap re_get', settings.name, 'StatusLowBattery', bat);
                    callback(null, bat);
                });

            mqttSub(settings.topic.statusLowBattery, val => {
                const bat = val !== settings.payload.onLowBattery ?
                    Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL :
                    Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
                log.debug('> hap update', settings.name, 'StatusLowBattery', bat);
                acc.getService(Service.ContactSensor)
                    .updateCharacteristic(Characteristic.StatusLowBattery, bat);
            });
        }

        /* istanbul ignore else */
        /* Optional: Status Active */
        if (settings.topic.statusActive) {
            acc.getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.StatusActive)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'StatusActive');
                    const act = mqttStatus[settings.topic.statusActive] === settings.payload.onActive;
                    log.debug('> hap re_get', settings.name, 'StatusActive', act);
                    callback(null, act);
                });

            mqttSub(settings.topic.statusActive, val => {
                const act = val === settings.payload.onActive;
                log.debug('> hap update', settings.name, 'StatusActive', act);
                acc.getService(Service.ContactSensor)
                    .updateCharacteristic(Characteristic.StatusActive, act);
            });
        }

        /* istanbul ignore else */
        /* Optional: Status Fault */
        if (settings.topic.statusFault) {
            acc.getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.StatusFault)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'StatusFault');
                    const fault = mqttStatus[settings.topic.statusFault] !== settings.payload.onFault ?
                        Characteristic.StatusFault.NO_FAULT :
                        Characteristic.StatusFault.GENERAL_FAULT;
                    log.debug('> hap re_get', settings.name, 'StatusFault', fault);
                    callback(null, fault);
                });

            mqttSub(settings.topic.statusFault, val => {
                const fault = val !== settings.payload.onFault ?
                    Characteristic.StatusFault.NO_FAULT :
                    Characteristic.StatusFault.GENERAL_FAULT;
                log.debug('> hap update', settings.name, 'StatusFault', fault);
                acc.getService(Service.ContactSensor)
                    .updateCharacteristic(Characteristic.StatusFault, fault);
            });
        }

        /* istanbul ignore else */
        /* Optional: Status Tampered */
        if (settings.topic.statusTampered) {
            acc.getService(Service.ContactSensor)
                .getCharacteristic(Characteristic.StatusTampered)
                .on('get', callback => {
                    log.debug('< hap get', settings.name, 'StatusTampered');
                    const tampered = mqttStatus[settings.topic.statusTampered] !== settings.payload.onTampered ?
                        Characteristic.StatusTampered.NOT_TAMPERED :
                        Characteristic.StatusTampered.TAMPERED;
                    log.debug('> hap re_get', settings.name, 'StatusTampered', tampered);
                    callback(null, tampered);
                });

            mqttSub(settings.topic.statusTampered, val => {
                const tampered = val !== settings.payload.onTampered ?
                    Characteristic.StatusTampered.NOT_TAMPERED :
                    Characteristic.StatusTampered.TAMPERED;
                log.debug('> hap update', settings.name, 'StatusTampered', tampered);
                acc.getService(Service.ContactSensor)
                    .updateCharacteristic(Characteristic.StatusTampered, tampered);
            });
        }
    };
};

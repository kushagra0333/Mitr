const MITR_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const SETTINGS_CHAR_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

const BluetoothService = {
  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [MITR_SERVICE_UUID] }],
      optionalServices: [MITR_SERVICE_UUID]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(MITR_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(SETTINGS_CHAR_UUID);

    return { device, characteristic };
  },

  async sendJson(characteristic, json) {
    const payload = JSON.stringify(json);
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(payload));
    console.log('✅ JSON sent:', payload);
  }
};

export default BluetoothService;

export const connectBluetoothDevice = async () => {
  try {
    // Note: Replace '123e4567-e89b-12d3-a456-426614174000' with your device's actual service UUID
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['123e4567-e89b-12d3-a456-426614174000'] }],
    });
    const server = await device.gatt.connect();
    // Note: Replace 'device_information' with your device's actual characteristic UUID
    const service = await server.getPrimaryService('123e4567-e89b-12d3-a456-426614174000');
    return [{ name: device.name || 'MITR Device', id: device.id, server, service }];
  } catch (error) {
    console.error('Bluetooth connection error:', error);
    throw new Error('Failed to connect to Bluetooth device');
  }
};

export const sendDataToDevice = async (device, data) => {
  try {
    // Note: Replace 'characteristic_uuid' with your device's actual writable characteristic UUID
    const characteristic = await device.service.getCharacteristic('characteristic_uuid');
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(data));
    console.log('Data sent to device:', data);
  } catch (error) {
    console.error('Bluetooth send error:', error);
    throw new Error('Failed to send data to device');
  }
};
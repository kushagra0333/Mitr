// Check if browser supports Web Bluetooth API
export const isBluetoothSupported = () => {
  return navigator.bluetooth && navigator.bluetooth.requestDevice;
};

// Connect to MITR device via Bluetooth
export const connectBluetoothDevice = async () => {
  try {
    if (!isBluetoothSupported()) {
      throw new Error('Web Bluetooth API not supported in this browser');
    }

    console.log('Requesting Bluetooth device...');
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ 
        services: ['0000180a-0000-1000-8000-00805f9b34fb'], // Device Information Service
        name: 'MITR Device' 
      }],
      optionalServices: [
        '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
        '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
        '0000ffe0-0000-1000-8000-00805f9b34fb'  // MITR Custom Service
      ]
    });

    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    // Get MITR Custom Service
    console.log('Getting MITR Service...');
    const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');

    // Get characteristics
    const characteristics = {
      settings: await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'), // Write settings
      status: await service.getCharacteristic('0000ffe2-0000-1000-8000-00805f9b34fb')    // Read status
    };

    return {
      device,
      server,
      service,
      characteristics,
      name: device.name || 'MITR Device'
    };
  } catch (error) {
    console.error('Bluetooth connection error:', error);
    throw new Error(`Failed to connect to device: ${error.message}`);
  }
};

// Send data to MITR device
export const sendDataToDevice = async (deviceConnection, data) => {
  try {
    if (!deviceConnection || !deviceConnection.characteristics.settings) {
      throw new Error('Device not properly connected');
    }

    console.log('Sending data to device:', data);
    const encoder = new TextEncoder();
    const value = encoder.encode(data); // Send as JSON string
    await deviceConnection.characteristics.settings.writeValue(value);
    console.log('Data sent successfully');
    
    return true;
  } catch (error) {
    console.error('Bluetooth send error:', error);
    throw new Error(`Failed to send data: ${error.message}`);
  }
};

// Read data from MITR device
export const readDeviceData = async (deviceConnection) => {
  try {
    if (!deviceConnection || !deviceConnection.characteristics.status) {
      throw new Error('Device not properly connected');
    }

    console.log('Reading data from device...');
    const value = await deviceConnection.characteristics.status.readValue();
    const decoder = new TextDecoder();
    const data = decoder.decode(value);
    
    console.log('Received data:', data);
    return JSON.parse(data);
  } catch (error) {
    console.error('Bluetooth read error:', error);
    throw new Error(`Failed to read data: ${error.message}`);
  }
};

// Disconnect from device
export const disconnectDevice = async (deviceConnection) => {
  try {
    if (deviceConnection && deviceConnection.server) {
      console.log('Disconnecting from device...');
      await deviceConnection.server.disconnect();
      console.log('Disconnected successfully');
    }
  } catch (error) {
    console.error('Bluetooth disconnect error:', error);
    throw new Error(`Failed to disconnect: ${error.message}`);
  }
};

// Monitor device connection state
export const monitorConnection = (deviceConnection, callback) => {
  if (!deviceConnection || !deviceConnection.device) {
    throw new Error('Invalid device connection');
  }

  deviceConnection.device.addEventListener('gattserverdisconnected', () => {
    console.log('Device disconnected');
    callback(false);
  });

  return () => {
    deviceConnection.device.removeEventListener('gattserverdisconnected');
  };
};

// Named export object
const bluetoothService = {
  isBluetoothSupported,
  connectBluetoothDevice,
  sendDataToDevice,
  readDeviceData,
  disconnectDevice,
  monitorConnection
};

export default bluetoothService;

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export class CapacitorService {
  static async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      return image;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw error;
    }
  }

  static async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  static async saveFile(data: string, fileName: string) {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents
      });
      return result;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  static async setStatusBarStyle(dark: boolean = false) {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({
        style: dark ? Style.Dark : Style.Light
      });
    }
  }

  static isNative() {
    return Capacitor.isNativePlatform();
  }

  static getPlatform() {
    return Capacitor.getPlatform();
  }
}
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bossmans.chatterbox',
  appName: 'Chatterbox',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;

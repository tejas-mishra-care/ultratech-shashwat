import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f78e4eeb52474966a33e1dc1c3a526d3',
  appName: 'UltraCertify',
  webDir: 'dist',
  server: {
    url: 'https://f78e4eeb-5247-4966-a33e-1dc1c3a526d3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
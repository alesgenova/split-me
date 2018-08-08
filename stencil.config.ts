import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'split-me',
  outputTargets:[
    { 
      type: 'dist' 
    },
    { 
      type: 'www',
      serviceWorker: null
    }
  ]
};

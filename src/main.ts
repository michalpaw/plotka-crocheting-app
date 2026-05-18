import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';

import App from './App.vue';
import router from './app/router';

// Ionic core CSS
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

// App theme
import './theme/variables.css';
import './theme/app.css';

import { useAuthStore } from './stores/authStore';
import { useSettingsStore } from './stores/settingsStore';

async function start() {
  const pinia = createPinia();
  const app = createApp(App).use(IonicVue).use(pinia);

  // Bootstrap auth *before* installing the router so the initial navigation
  // guard sees the real session state and lands authenticated users on /dashboard.
  const auth = useAuthStore();
  await auth.bootstrap();
  if (auth.isAuthenticated) {
    const settings = useSettingsStore();
    await settings.load();
  }

  app.use(router);
  await router.isReady();
  app.mount('#app');
}

start();

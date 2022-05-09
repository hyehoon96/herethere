import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
		themes: {
			light: {
				primary: '#039BE5',
				secondary: '#2196F3',
				accent: '#EF5350',
			},
		},
	},
});

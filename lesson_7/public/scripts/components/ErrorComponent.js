Vue.component('error', {
  data() {
    return {
      isErrorShown: false,
      error: ''
    }
  },

  methods: {
   showError(error) {
     this.error += error;
     this.isErrorShown = true;
   },
  },

  template: `
    <div v-show="isErrorShown">
      <div class="error">{{ error }}</div>
      <button type="button" class="error-btn" @click="isErrorShown = !isErrorShown">X</button> 
    </div>
    
`
});
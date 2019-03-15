const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue(
  {
    el: '#app',

    methods: {
      getJson(url) {
       return fetch(url)
         .then(result => {
           if (result.ok) {
             return result.json()
           } else {
             this.$refs.error.showError('Ошибка: ' + url + '\n' + result.statusText);
           }
         })
         .catch(error => console.log(error))
      },
    },
  }
);
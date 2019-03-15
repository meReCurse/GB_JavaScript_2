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

      postJson(url, data) {
       return fetch(url, {
         method: 'POST',
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify(data, ["id_product", "product_name", "price", "quantity"])
       })
         .then(result => {
           if (result.ok) {
             return result.json()
           } else {
             this.$refs.error.showError('Ошибка: ' + url + '\n' + result.statusText);
           }
         })
         .catch(error => console.log(error))
      },

      putJson(url, data) {
        return fetch(url, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(result => {
            if (result.ok) {
              return result.json()
            } else {
              this.$refs.error.showError('Ошибка: ' + url + '\n' + result.statusText);
            }
          })
          .catch(error => console.log(error))
      },

      deleteJson(url=`/api/cart`, data=['all']) {
        return fetch(url, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
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
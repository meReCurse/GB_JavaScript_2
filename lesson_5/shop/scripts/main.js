const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue(
  {
    el: '#app',

    data: {
      catalogUrl: '/catalogData.json',
      basketUrl: '/getBasket.json',
      products: [],
      imgProduct: 'https://placehold.it/400x300',
      basket: {
        "amount": 0,
        "countGoods": 0,
        "contents": []
      },
      isVisibleCart: false,
      searchLine: ''
    },

    computed: {},

    methods: {
      getJson(url) {
       return fetch(url)
         .then(result => result.json())
         .then(data => {
           if (Array.isArray(data)) {
             for(let item of data) {
               item.shown = true;
               this.products.push(item); // this указывает на data
             }
           } else {
             this.basket = {...data};
           }
         })
         .catch(error => console.log(error))
      },

      addProduct(product) {
        // console.log(this.basket);
        this.basket.amount += product.price;
        this.basket.countGoods += 1;

        /*
        * Такая проверка необходима для избегания дублирования товара
        * в корзине, в случае если имеется полученный по API товар.
        * Проблема в типе данных, при изменении quantity теряется
        * __ob__: Observer
        */
        for (let item of this.basket.contents) {
          if (item.id_product === product.id_product) {
            return item.quantity += 1;
            }
          }

        // let idx = this.basket.contents.indexOf(product);
        // if (idx >= 0) {
        //   return this.basket.contents[idx].quantity += 1;
        // }

        product.quantity = 1;
        return this.basket.contents.push(product);
      },

      removeProduct(product) {
        let idx = this.basket.contents.indexOf(product);

        if(idx >= 0) {
          this.basket.amount -= product.price;
          this.basket.countGoods -= 1;

          if (product.quantity > 1) {
            product.quantity -= 1;
          } else {
            this.basket.contents.splice(idx, 1);
          }
        }
      },

      nullifyBasket() {
        this.basket = {
          "amount": 0,
          "countGoods": 0,
          "contents": []
        }
      },

      makeOrder() {
        console.log(JSON.stringify(this.basket));
      },

      isCartFill() {
        return !!this.basket.contents.length;
      },

      filterGoods() {
        const regexp = new RegExp(`^${this.searchLine}`, 'i');
        let filtered = this.products.filter(product => regexp.test(product.product_name));
        this.products.forEach(product => {
          product.shown = filtered.includes(product);
        })
      }
    },

    mounted() {
      this.getJson(`${API + this.basketUrl}`);
      this.getJson(`${API + this.catalogUrl}`); // this указывает на Vue
      this.getJson('JSON/getProducts.json');
    }
  }
);
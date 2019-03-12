Vue.component('cart', {
  data() {
    return {
      basketUrl: '/getBasket.jso',
      imgBasketProducts: 'https://placehold.it/100x100',
      basket: {
        "amount": 0,
        "countGoods": 0,
        "contents": []
      },
      isVisibleCart: false,
    }
  },

  methods: {
    addProduct(product) {
      this.$parent.getJson(`${API}/addToBasket.json`)
        .then(data => {
          if (data.result === 1) {
            this.basket.amount += product.price;
            this.basket.countGoods += 1;

            let find = this.basket.contents.find(el => el.id_product === product.id_product);
            if (find) {
              find.quantity++;
            } else {
              const prod = Object.assign({quantity: 1}, product);
              this.basket.contents.push(prod);
            }
          } else {
            throw 'Нет доступа'
          }
        })
        .catch(error => {
          this.$parent.$refs.error.showError('Ошибка: ' + error + '\n')
        });
    },

    removeProduct(product) {
      this.$parent.getJson(`${API}/deleteFromBasket.json`)
        .then(data => {
          if (data.result === 1) {
            let find = this.basket.contents.find(el => el.id_product === product.id_product);
            if(find) {
              this.basket.amount -= product.price;
              this.basket.countGoods--;

              if (find.quantity > 1) {
                find.quantity--;
              } else {
                this.basket.contents.splice(this.basket.contents.indexOf(find), 1);
              }
            }
          } else {
            throw 'Нет доступа'
          }
        })
        .catch(error => {
          this.$parent.$refs.error.showError('Ошибка: ' + error + '\n')
        });
    },

    nullifyBasket() {
      this.$parent.getJson(`${API}/deleteFromBasket.json`)
        .then(data => {
          if (data.result === 1) {
            this.basket = {
              "amount": 0,
              "countGoods": 0,
              "contents": []
            }
          } else {
            throw 'Нет доступа'
          }
        })
        .catch(error => {
          console.log(error);
          this.$parent.$refs.error.showError('Ошибка: ' + error + '\n')
        });
    },

    makeOrder() {
      console.log(JSON.stringify(this.basket));
    },

    isCartFill() {
      return !!this.basket.contents.length;
    },
  },

  mounted() {
    this.$parent.getJson(`${API + this.basketUrl}`)
      .then(data => {
        if (data) {
          this.basket = {...data};
        }
      });
  },

  template: `
        <div class="cart">
          <button class="btn-cart" type="button" @click="isVisibleCart = !isVisibleCart">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <div class="cart-info">
            <span>{{basket.countGoods}} ед.</span>
            <span>{{basket.amount}} руб.</span>
          </div>

          <div class="cart-block" v-show="isVisibleCart">
            <div class='scroll' v-if="isCartFill()">
              <table class="cart-products">
                <tr>
                  <th></th>
                  <th>Наименование</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th></th>
                </tr>
                <cart-item v-for="product of basket.contents" 
                           :key="product.id_product"
                           :product="product"
                           :img="imgBasketProducts"
                           @remove="removeProduct"> 
                </cart-item>
              </table>
              <div class="cart-desc">
                <button type="button" class="btn-buy" @click="makeOrder()">Заказать</button>
                <button type="button" class="btn-clear-cart" @click="nullifyBasket()">Очистить корзину</button>
              </div>
            </div>

            <span class="no-data" v-else>Нет данных</span>
          </div>

        </div>`
});

Vue.component('cart-item', {
  props: ['product', 'img'],

  template: `<tr class="cart-product">
                <td><img :src="img" alt=""></td>
                <td>{{product.product_name}}</td>
                <td>{{product.price}}&nbspруб.</td>
                <td>x {{product.quantity}}</td>
                <td>
                  <button type="button" class="btn-remove-from-cart" @click="$emit('remove', product)">
                    <i class="fas fa-ban"></i>
                  </button>
                </td>
              </tr>`
});

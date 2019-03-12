

Vue.component('products', {
  data() {
    return {
      catalogUrl: '/catalogData.json',
      products: [],
      imgProduct: 'https://placehold.it/200x150',
    }
  },

  mounted() {
    this.$parent.getJson(`${API + this.catalogUrl}`)
      .then(data => {
        for(let item of data) {
          const prod = Object.assign({shown: true}, item);
          this.products.push(prod);
        }
      });

    this.$parent.getJson('JSON/getProducts.json')
      .then(data => {
        for(let item of data) {
          const prod = Object.assign({shown: true}, item);
          this.products.push(prod);
        }
      });
  },

  template: `
    <div class="container">
      <div class="products">
        <product v-for="product of products" 
                 :key="product.id_product" 
                 v-show="product.shown"
                 :product="product"
                 :img="imgProduct"
                 @add="$parent.$refs.cart.addProduct"
                 >
        </product>
      </div>
    </div>
  `
});

Vue.component('product', {
  props: ['product', 'img'],

  template: `
    <div class="product-card">
      <img :src="img" alt="" class="product-img">
      <h2 class="product-title">{{product.product_name}}</h2>
      <div class="product-price">{{product.price}}&nbsp руб.</div>
      <button class="btn-add-to-cart" @click="$emit('add', product)">Добавить</button>
    </div>
  `
});
Vue.component('product-filter', {
  data() {
    return {
      searchLine: ''
    }
  },

  methods: {
    filterGoods() {
      const regexp = new RegExp(`^${this.searchLine}`, 'i');
      let filtered = this.$parent.$refs.prods.products.filter(product => regexp.test(product.product_name));
      this.$parent.$refs.prods.products.forEach(product => {
        product.shown = filtered.includes(product);
      })
    }
  },

  template: `
        <div>
          <input type="text" class="search-field" placeholder="Filter" v-model="searchLine" @input="filterGoods()">
          <button type="button" class="btn-search" @click="filterGoods()"><i class="fas fa-search"></i></button>
        </div>`
});
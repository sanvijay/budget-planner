<template>
  <div>
    <p>
      This is Category page.
    </p>

    <div>
      <table border="1">
        <thead>
          <th>Super Category</th>
          <th>Category</th>
          <th>Goal</th>
          <th>Benefits</th>
        </thead>

        <tbody v-for="(subCategories, category) in categories" :key="category">
          <tr v-if="subCategories.length == 0">
            <td rowspan="3">
              {{ category }}
            </td>
            <td> - </td>
            <td> - </td>
            <td> - </td>
          </tr>
          <tr v-for="(subCategory, idx) in subCategories" :key="subCategory.id">
            <td :rowspan="subCategories.length + 2" v-if="idx == 0">
              {{ category }}
            </td>
            <td @dblclick="toggleEditingCategory(subCategory, 'title')">
              <div v-if="!showInput(subCategory, 'title')">
                {{ subCategory.title }}
              </div>
              <div v-if="showInput(subCategory, 'title')">
                <input v-focus type="text" v-model="subCategory.title" @blur="updateCategory(subCategory)" @keyup.enter="updateCategory(subCategory)" @keyup.esc="cancelEdit(subCategory, 'title')">
              </div>
            </td>
            <td> - </td>
            <td @dblclick="toggleEditingCategory(subCategory, 'benefit')">
              <div v-if="!showInput(subCategory, 'benefit')">
                {{ subCategory.benefit ? subCategory.benefit.title : '-' }}
              </div>
              <div v-if="showInput(subCategory, 'benefit')">
              <select v-model="subCategory.benefit_id" @blur="updateCategory(subCategory)" @keyup.enter="updateCategory(subCategory)" @keyup.esc="cancelEdit(subCategory, 'benefit')">
                <option value=""> - none - </option>
                <option v-for="benefit in benefits" :key="benefit._id.$oid" :value="benefit._id.$oid">{{ benefit.title }}</option>
              </select>
              </div>
            </td>
          </tr>
          <tr>
            <td><input type="text" v-model="newCategory[category]" @keyup.enter="addCategory(category)"></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data: function() {
    return {
      categories: [],
      benefits: [],
      previousValue: null,
      newCategory: {
        "Income": '',
        "Expense": '',
        "EMI": '',
        "EquityInvestment": '',
        "DebtInvestment": ''
      }
    }
  },
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    addCategory: function(category) {
      this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories', {
          "category": {
            "title": this.newCategory[category],
            "type": category
          },
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.categories[category].push(response.data);
          this.newCategory[category] = '';
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    cancelEdit: function(category, field) {
      category[field] = this.previousValue;
      category.editing = null;
    },
    loadCategories: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.categories = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    loadBenefits: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/benefits', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.benefits = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    toggleEditingCategory: function(category, field) {
      this.previousValue = category[field];
      this.$set(category, 'editing', field)
    },
    showInput: function(category, field) {
      return (category.editing == field);
    },
    updateCategory: function(category) {
      this.$http.put(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories/' + category.id, {
          category: category,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          category.benefit_id = null;
          if(response.data.benefit_id != null) {
            category.benefit_id = response.data.benefit_id.$oid;
          }
          category.benefit = response.data.benefit;
          category.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadCategories();
          console.error(error.response);
        });
    },
    saveNewCategory: function() {
      this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories', {
          category: this.newCategory,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.categories.push(response.data);
          this.newCategory = {
            "Income": '',
            "Expense": '',
            "EMI": '',
            "EquityInvestment": '',
            "DebtInvestment": ''
          }
        })
        .catch(function (error) {
          console.error(error.response);
        });
    }
  },
  mounted: function () {
    this.loadCategories();
    this.loadBenefits();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

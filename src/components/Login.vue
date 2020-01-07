<template>
    <div>
        <h4>Login</h4>
        <form>
            <label for="email" >E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" >Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <button type="submit" @click="handleSubmit">
                    Login
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email : "",
                password : ""
            }
        },
        methods: {
            handleSubmit(e){
                e.preventDefault()
                if (this.password.length > 0) {
                    this.$http.post(process.env.VUE_APP_API_URL + 'login', {
                        email: this.email,
                        password: this.password
                    }, {
                      headers: {
                        // https://github.com/axios/axios/issues/475
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
                      }
                    })
                    .then(response => {
                        localStorage.setItem('user', response.data.user)
                        localStorage.setItem('jwt', response.data.token)

                        if (localStorage.getItem('jwt') != null){
                            // this.$emit('loggedIn')
                            if(this.$route.params.nextUrl != null){
                                this.$router.push(this.$route.params.nextUrl)
                            }
                            else {
                                this.$router.push('dashboard')
                            }
                        }
                    });
                    // .catch(function (error) {
                    //     // console.error(error.response);
                    // });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

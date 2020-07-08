<template>
<div>

  <header class="site-navbar py-3 js-sticky-header site-navbar-target top-sticky" role="banner">
    <div class="container">
      <div class="row align-items-center">
        
        <div class="col-6 col-md-3 col-xl-4  d-block">
          <h1 class="mb-0 site-logo"><a href="#" class="text-black h2 mb-0">finsey<span class="text-primary">.</span> </a></h1>
          <h1 style="display: none">Budget Planner & Expense Manager</h1>
        </div>
      </div>
    </div>
  </header>

  <div class="site-wrap"  id="home-section">
    <div class="site-blocks-cover" style="overflow: hidden;">
      <div class="container">
        <div class="row align-items-center justify-content-center">
          <div class="col-md-12" style="position: relative;" data-aos="fade-up" data-aos-delay="200">
            <img src="img/undraw_investing_7u74.svg" alt="Image" class="img-fluid img-absolute">
            <div class="row mb-4">
              <div class="col-lg-6 mr-auto">
                <h1>A full stop to financial worries</h1>
                <p class="mb-5">When you are looking for an expense manager, you actually need a budget planner. Managing without a plan will make life harder. Finsey helps you to solve this problem seamlessly.</p>
                <div>
                  <router-link :to="{ name: 'login' }" style="margin-right: 20px;color: white;">Sign In</router-link>
                  <router-link :to="{ name: 'register' }" class="btn btn-primary mr-2 mb-2">Create an account</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  

    <div class="feature-big">
      <div class="container">
        <div class="row mb-5 site-section">
          <div class="col-lg-7" data-aos="fade-right">
            <img src="img/undraw_multitasking_hqg3.svg" alt="Image" class="img-fluid">
          </div>
          <div class="col-lg-5 pl-lg-5 ml-auto mt-md-5">
            <h2 class="text-black">See the big picture</h2>
            <p class="mb-4">Keep track of your yearly budget in excel view.</p>
          </div>
        </div>

        <div class="mt-5 row mb-5 site-section ">
          <div class="col-lg-7 order-1 order-lg-2" data-aos="fade-left">
            <img src="img/undraw_metrics_gtu7.svg" alt="Image" class="img-fluid">
          </div>
          <div class="col-lg-5 pr-lg-5 mr-auto mt-5 order-2 order-lg-1">
            <h2 class="text-black">Know what's safe to spend</h2>
            <p class="mb-4">Understand about your assets and liabilities.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="site-section overlay">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="section-title mb-3">Download our mobile app</h2>
            <p class="mb-4">We want to make sure that you are served well. We are trying to build our app across platforms. Click to download our alpha version.</p>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-7 mb-5">
            <div class="row form-group">
              <div class="col-md-12">
                <a class="btn btn-primary mr-2 mb-2" style="border-radius: 3px" href="https://play.google.com/store/apps/details?id=com.fireflies.finsey" target="blank">
                  <font-awesome-icon :icon="['fab', 'google-play']" /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="site-section overlay">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="section-title mb-3">Are you a personal financial advisor?</h2>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-7 mb-5">
            <form action="#" class="p-5 bg-white">
              <div v-if="submit_request_message">Thanks for your request. We will get back to you soon.<br></div>

              <h2 class="h4 text-black mb-5">Contact Form</h2> 

              <div class="row form-group">
                <div class="col-md-6 mb-3 mb-md-0">
                  <label class="text-black" for="fname">First Name</label>
                  <input type="text" id="fname" class="form-control rounded-0" required="" v-model="newPersonalAdvisory.first_name">
                </div>
                <div class="col-md-6">
                  <label class="text-black" for="lname">Last Name</label>
                  <input type="text" id="lname" class="form-control rounded-0" required="" v-model="newPersonalAdvisory.last_name">
                </div>
              </div>

              <div class="row form-group">                
                <div class="col-md-12">
                  <label class="text-black" for="email">Email</label> 
                  <input type="email" id="email" class="form-control rounded-0" required="" v-model="newPersonalAdvisory.email">
                </div>
              </div>

              <div class="row form-group">                
                <div class="col-md-12">
                  <label class="text-black" for="email">Mobile number</label>
                  <input type="text" pattern="[789][0-9]{9}" class="form-control rounded-0" required="" v-model="newPersonalAdvisory.phone_number">
                </div>
              </div>

              <div class="row form-group">
                <div class="col-md-12">
                  <input type="submit" value="Send Message" class="btn btn-primary mr-2 mb-2" @click.prevent="saveNewPersonalAdvisory()">
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="site-section" id="features-section">
      <div class="container">
        <div class="row mb-5 justify-content-center text-center"  data-aos="fade-up">
          <div class="col-7 text-center  mb-5">
            <h2 class="section-title">Pricing</h2>
            <p class="lead" style="display: none;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga quos quaerat sapiente nam, id vero.</p>
          </div>
        </div>
        <div class="row align-items-stretch">
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-4" data-aos="fade-up">
            <div class="unit-4 d-block">
              <div class="unit-4-icon mb-3">
                <span class="icon-wrap"><span>Free</span></span>
              </div>
              <div>
                <p style="text-align: center; font-weight: bold;">&#8377; 0</p><hr>
                <ul>
                  <li>Maintain 3 Accounts</li>
                  <li>Overall 15 Categories</li>
                  <li>1 year of history</li>
                  <li>Plan up to 2 years</li>
                  <li>Set up to 3 goals</li>
                  <li>Track 3 of your assets/liabilities/debts/benefits</li>
                  <li>Community Support</li>
                </ul>
                <br>
                <p>
                  <router-link :to="{ name: 'register' }">Get your account for free</router-link>
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div class="unit-4 d-block">
              <div class="unit-4-icon mb-3">
                <span class="icon-wrap"><span>Plus</span></span>
              </div>
              <div>
                <p style="text-align: center; font-weight: bold;">&#8377; 75 / mo (or) &#8377; 600 / yr</p><hr>
                <ul>
                  <li>Maintain 5 Accounts</li>
                  <li>Overall 25 Categories</li>
                  <li>7 years of history</li>
                  <li>Plan up to 7 years</li>
                  <li>Set up to 7 goals</li>
                  <li>Track 7 of your assets/liabilities/debts/benefits</li>
                  <li>Community Support</li>
                </ul>
                <br>
                <p>
                  <a href="#" @click.prevent="clickBuyNow">Buy now</a>
                  <router-link :to="{ name: 'need-help' }" style="float: right;">Refer and Earn</router-link>
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4 mb-4 mb-lg-4" data-aos="fade-up"  data-aos-delay="200">
            <div class="unit-4 d-block">
              <div class="unit-4-icon mb-3">
                <span class="icon-wrap"><span>Prime</span></span>
              </div>
              <div>
                <p style="text-align: center; font-weight: bold;">&#8377; 150 / mo (or) &#8377; 1200 / yr</p><hr>
                <ul>
                  <li>No Ads</li>
                  <li>Maintain 50 Accounts</li>
                  <li>Overall 250 Categories</li>
                  <li>Unlimited history</li>
                  <li>Plan up to your 100th birthday</li>
                  <li>Set 100 goals</li>
                  <li>Track 100 assets/liabilities/debts/benefits</li>
                  <li>Personalized Support</li>
                </ul>
                <p><a href="#" @click.prevent="clickBuyNow">Buy now</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="site-section">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="section-title mb-3">Contact Us</h2>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-lg-6" data-aos="fade-right">
            <img src="img/undraw_bookmarks_r6up.svg" alt="Image" class="img-fluid">
          </div>
          <div class="col-lg-5 ml-auto pl-lg-5">
            <h2 class="text-black mb-4 h3 font-weight-bold"></h2>
            <p class="mb-4">Mail us at <a href="mailto:team.finsey@gmail.com">team.finsey@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'Home',
  data: function() {
    return {
      newPersonalAdvisory: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null
      },
      submit_request_message: false
    }
  },
  methods: {
    saveNewPersonalAdvisory: function() {
      this.$http.post('/personal_advisor_requests', {
          personal_advisor_request: this.newPersonalAdvisory
        })
        .then(response => {
          this.submit_request_message = true;
        })
        .catch(error => {
          this.$parent.toast("Some error occurred. Reach out to us: team.finsey@gmail.com");
        });
    },
    clickBuyNow: function() {
      this.$http.post('/buy_now')
        .then(response => {
          this.$parent.toast("Success! Now you are an prime user");
        })
        .catch(error => {
          this.$parent.toast("Error occurred accessing payment portal. Reach out to us: team.finsey@gmail.com");
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Base */
body {
  line-height: 1.7;
  color: gray;
  font-weight: 400;
  font-size: 1rem; }

::-moz-selection {
  background: #000;
  color: #fff; }

::selection {
  background: #000;
  color: #fff; }

a {
  -webkit-transition: .3s all ease;
  -o-transition: .3s all ease;
  transition: .3s all ease; }
  a:hover {
    text-decoration: none; }

h1, h2, h3, h4, h5,
.h1, .h2, .h3, .h4, .h5 {
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }

.text-black {
  color: #000 !important; }

.site-wrap:before {
  -webkit-transition: .3s all ease-in-out;
  -o-transition: .3s all ease-in-out;
  transition: .3s all ease-in-out;
  background: rgba(0, 0, 0, 0.6);
  content: "";
  position: absolute;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden; }

.btn {
  font-size: 16px;
  border-radius: 30px;
  padding: 10px 30px; }
  .btn:hover, .btn:active, .btn:focus {
    outline: none;
    -webkit-box-shadow: none !important;
    box-shadow: none !important; }
  .btn.btn-primary {
    border-width: 2px;
    background: #4285f4;
    border-color: #4285f4;
    color: #fff;
    position: relative;
    top: 0;
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
    -webkit-box-shadow: 0 4px 20px -5px rgba(66, 133, 244, 0.4);
    box-shadow: 0 4px 20px -5px rgba(66, 133, 244, 0.4); }
    .btn.btn-primary:hover {
      top: -2px;
      background: #4285f4;
      border-color: #4285f4;
      color: #fff;
      -webkit-box-shadow: 0 5px 30px -5px rgba(66, 133, 244, 0.7) !important;
      box-shadow: 0 5px 30px -5px rgba(66, 133, 244, 0.7) !important; }

.form-control {
  height: 43px;
  border-radius: 30px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }

.site-section {
  padding: 2.5em 0; }
  @media (min-width: 768px) {
    .site-section {
      padding: 5em 0; } }
  .site-section.site-section-sm {
    padding: 4em 0; }

/* Navbar */
.site-navbar {
  margin-bottom: 0px;
  z-index: 1999;
  position: absolute;
  width: 100%;
  background: #fff; }
  .site-navbar .site-logo {
    position: relative;
    left: 0;
    top: -5px; }
  .site-navbar .site-navigation.border-bottom {
    border-bottom: 1px solid #f3f3f4 !important; }
  .site-navbar .site-navigation .site-menu {
    margin-bottom: 0; }
    .site-navbar .site-navigation .site-menu .active {
      color: #4285f4;
      display: inline-block;
      padding: 15px 20px; }
    .site-navbar .site-navigation .site-menu a {
      text-decoration: none !important;
      display: inline-block; }
    .site-navbar .site-navigation .site-menu > li {
      display: inline-block; }
      .site-navbar .site-navigation .site-menu > li > a {
        padding: 15px 20px;
        color: #000;
        display: inline-block;
        text-decoration: none !important; }
        .site-navbar .site-navigation .site-menu > li > a:hover {
          color: #4285f4; }
    .site-navbar .site-navigation .site-menu .has-children {
      position: relative; }
      .site-navbar .site-navigation .site-menu .has-children > a {
        position: relative;
        padding-right: 20px; }
        .site-navbar .site-navigation .site-menu .has-children > a:before {
          position: absolute;
          content: "\e313";
          font-size: 16px;
          top: 50%;
          right: 0;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
          font-family: 'icomoon'; }
      .site-navbar .site-navigation .site-menu .has-children .dropdown {
        visibility: hidden;
        opacity: 0;
        top: 100%;
        position: absolute;
        text-align: left;
        border-top: 2px solid #4285f4;
        -webkit-box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.1);
        border-left: 1px solid #edf0f5;
        border-right: 1px solid #edf0f5;
        border-bottom: 1px solid #edf0f5;
        padding: 0px 0;
        margin-top: 20px;
        margin-left: 0px;
        background: #fff;
        -webkit-transition: 0.2s 0s;
        -o-transition: 0.2s 0s;
        transition: 0.2s 0s; }
        .site-navbar .site-navigation .site-menu .has-children .dropdown.arrow-top {
          position: absolute; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown.arrow-top:before {
            bottom: 100%;
            display: none;
            left: 20%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown.arrow-top:before {
            border-color: rgba(136, 183, 213, 0);
            border-bottom-color: #fff;
            border-width: 10px;
            margin-left: -10px; }
        .site-navbar .site-navigation .site-menu .has-children .dropdown a {
          text-transform: none;
          letter-spacing: normal;
          -webkit-transition: 0s all;
          -o-transition: 0s all;
          transition: 0s all;
          color: #343a40; }
        .site-navbar .site-navigation .site-menu .has-children .dropdown .active > a {
          color: #4285f4 !important; }
        .site-navbar .site-navigation .site-menu .has-children .dropdown > li {
          list-style: none;
          padding: 0;
          margin: 0;
          min-width: 200px; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown > li > a {
            padding: 9px 20px;
            display: block; }
            .site-navbar .site-navigation .site-menu .has-children .dropdown > li > a:hover {
              background: #f4f5f9;
              color: #25262a; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children > a:before {
            content: "\e315";
            right: 20px; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children > .dropdown, .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children > ul {
            left: 100%;
            top: 0; }
          .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children:hover > a, .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children:active > a, .site-navbar .site-navigation .site-menu .has-children .dropdown > li.has-children:focus > a {
            background: #f4f5f9;
            color: #25262a; }
      .site-navbar .site-navigation .site-menu .has-children:hover > a, .site-navbar .site-navigation .site-menu .has-children:focus > a, .site-navbar .site-navigation .site-menu .has-children:active > a {
        color: #4285f4; }
      .site-navbar .site-navigation .site-menu .has-children:hover, .site-navbar .site-navigation .site-menu .has-children:focus, .site-navbar .site-navigation .site-menu .has-children:active {
        cursor: pointer; }
        .site-navbar .site-navigation .site-menu .has-children:hover > .dropdown, .site-navbar .site-navigation .site-menu .has-children:focus > .dropdown, .site-navbar .site-navigation .site-menu .has-children:active > .dropdown {
          -webkit-transition-delay: 0s;
          -o-transition-delay: 0s;
          transition-delay: 0s;
          margin-top: 0px;
          visibility: visible;
          opacity: 1; }

.site-blocks-cover {
  background-size: cover;
  background-size: 120% 200%;
  background-repeat: no-repeat;
  background-position: top;
  position: relative; }
  .site-blocks-cover:after {
    position: absolute;
    /*background-image: url("/img/svg_1.svg");*/
    content: "";
    right: 0; }
  .site-blocks-cover.overlay {
    position: relative; }
    .site-blocks-cover.overlay:before {
      position: absolute;
      content: "";
      left: 0;
      bottom: 0;
      right: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.2); }
  .site-blocks-cover .player {
    position: absolute;
    bottom: -250px;
    width: 100%; }
  .site-blocks-cover, .site-blocks-cover > .container > .row {
    min-height: 600px;
    height: calc(100vh); }
  .site-blocks-cover.inner-page-cover, .site-blocks-cover.inner-page-cover > .container > .row {
    min-height: 400px;
    height: calc(20vh); }
  .site-blocks-cover h1 {
    font-size: 3.5rem;
    font-weight: 400;
    color: #000;
    font-weight: 900; }
    @media (max-width: 991.98px) {
      .site-blocks-cover h1 {
        font-size: 2rem; } }
  .site-blocks-cover p {
    /*color: #6c757d;*/
    font-size: 1rem;
    font-weight: 300; }
  .site-blocks-cover .intro-text {
    font-size: 16px;
    line-height: 1.5; }
  @media (max-width: 991.98px) {
    .site-blocks-cover .display-1 {
      font-size: 3rem; } }

.img-absolute {
  position: absolute;
  bottom: 0;
  right: 0;
  top: 60%;
  -webkit-transform: translateY(-50%) translateX(30%);
  -ms-transform: translateY(-50%) translateX(30%);
  transform: translateY(-50%) translateX(30%); }
  .img-absolute img {
    max-width: 100%; }
  @media (max-width: 991.98px) {
    .img-absolute {
      position: relative;
      top: auto;
      -webkit-transform: translateY(0%) translateX(0%);
      -ms-transform: translateY(0%) translateX(0%);
      transform: translateY(0%) translateX(0%);
      margin-bottom: 30px; } }

.section-title {
  color: #000;
  font-size: 40px;
  font-weight: 900; }
  @media (max-width: 991.98px) {
    .section-title {
      font-size: 30px; } }

.position-relative {
  position: relative; }

.feature-big h2 {
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 30px; }

.top-sticky {
  position: sticky;
  top: 0px;
}
p {
  color: #000;
}

.unit-4 {
  min-height: 425px;
  padding: 30px;
  background: #f1f1f1;
  border-radius: 5px;
  -webkit-transition: .3s all ease;
  -o-transition: .3s all ease;
  transition: .3s all ease;
  position: relative;
  top: 0;
  margin-bottom: 4em;
  text-align: left;
  padding-top: 50px; }
  .unit-4 .unit-4-icon {
    position: absolute;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    left: 50%;
    top: -50px; }
    .unit-4 .unit-4-icon .icon-wrap {
      width: 80px;
      height: 80px;
      position: relative;
      border-radius: 50%;
      display: inline-block;
      background-color: #4285f4;
      -webkit-box-shadow: 0 4px 20px -5px rgba(66, 133, 244, 0.4);
      box-shadow: 0 4px 20px -5px rgba(66, 133, 244, 0.4); }
      .unit-4 .unit-4-icon .icon-wrap span {
        font-size: 1.5rem;
        position: absolute;
        top: 50%;
        color: #fff !important;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%); }
  .unit-4 h3 {
    font-size: 18px;
    color: #000;
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease; }
  .unit-4 p {
    font-weight: 300;
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease; }
  .unit-4 *:last-child {
    margin-bottom: 0; }
</style>

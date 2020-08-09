<template>
<div>
    <header class="header">
      
        <div class="branding">
            
            <div class="container position-relative">

        <nav class="navbar navbar-expand-lg" >
                    <h1 class="site-logo"><a class="navbar-brand" href="/"><img class="logo-icon" src="assets/images/logo-icon.svg" alt="logo"> <span class="logo-text">finsey.</span></a></h1>
        </nav>
        
        <!-- // Free Version ONLY -->
        <ul class="social-list list-inline mb-0 position-absolute">
                  <li class="list-inline-item"><a class="text-dark" href="https://fb.me/team.finsey"><i class="fab fa-facebook-f fa-fw"></i></a></li>
                  <li class="list-inline-item"><a class="text-dark" href="https://www.instagram.com/team.finsey"><i class="fab fa-instagram fa-fw"></i></a></li>
              </ul><!--//social-list-->
              
            </div><!--//container-->
            
        </div><!--//branding-->
        
        
    </header><!--//header-->
    
    
    <section class="hero-section">
      <div class="container">
        <div class="row figure-holder">
          <div class="col-12 col-md-6 pt-3 pt-md-4">
            <h2 class="site-headline font-weight-bold mt-lg-5 pt-lg-5">A full stop to financial worries.</h2>
            <div class="site-tagline mb-3">When you are looking for an expense manager, you actually need a budget planner. Managing without a plan will make life harder. Finsey helps you to solve this problem seamlessly.</div>
            <div class="cta-btns">
              <div class="mb-4">
                <router-link :to="{ name: 'register' }" class="btn btn-primary font-weight-bold theme-btn">Register for FREE</router-link>
              </div>
              <ul class="app-stores list-unstyled list-inline mx-auto mx-md-0 d-inline-block">
                <li class="list-inline-item"><a href="https://play.google.com/store/apps/details?id=com.fireflies.finsey"><img class="android" src="assets/images/appstore-android.svg" alt="google play"></a></li>
              </ul>
            </div>
          </div>
        </div><!--//row-->
      </div>
    </section><!--//hero-section-->
    
    <section class="logos-section theme-bg-primary py-5 text-center">
      <div class="container">
        <h3 class="mb-5">Trusted by hundreds of software businesses</h3>
        <div class="logos-row row mx-auto"> 
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-1.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-2.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-3.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-4.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-5.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              <div class="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                <div class="item-inner">
                    <img src="assets/images/logos/logo-6.svg" alt="logo">
                </div><!--//item-inner-->
              </div><!--//item-->
              
          </div>
          
      </div><!--//container-->
    </section><!--//logo-section-->
    
    <section class="benefits-section py-5">
      
      <div class="container py-lg-5">
        <h3 class="mb-5 text-center font-weight-bold">Market your mobile app effectively with Nova</h3>
        <div class="row">
            <div class="item col-12 col-lg-4">
            <div class="item-inner text-center p-3 p-lg-5">
              <img class="mb-3" src="assets/images/icon-target.svg" alt="" />
              <h5>Focused on UX</h5>
              <div>Use this area to list your app's key benefits. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. </div>
            </div><!--//item-inner-->
          </div><!--//item-->
          <div class="item col-12 col-lg-4">
            <div class="item-inner text-center p-3 p-lg-5">
              <img class="mb-3" src="assets/images/icon-rocket.svg" alt="" />
              <h5>Convert Users</h5>
              <div>Use this area to list your app's key benefits. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. </div>
            </div><!--//item-inner-->
          </div><!--//item-->
          <div class="item col-12 col-lg-4">
            <div class="item-inner text-center p-3 p-lg-5">
              <img class="mb-3" src="assets/images/icon-cogs.svg" alt="" />
              <h5>Easy Customisations</h5>
              <div>Use this area to list your app's key benefits. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. </div>
            </div><!--//item-inner-->
          </div><!--//item-->
        </div><!--//row-->
        <div class="pt-3 text-center">
          <a class="btn btn-primary theme-btn theme-btn-ghost font-weight-bold" href="https://themes.3rdwavemedia.com/bootstrap-templates/free/nova-bootstrap-landing-page-template-for-mobile-apps/">Learn More</a>
        </div>
      </div>
      
    </section><!--//benefits-section-->
    
    <section class="features-section py-5">
      <div class="container py-lg-5">
        <h3 class="mb-3 text-center font-weight-bold section-heading">Feature Highlights</h3>
        <div class="row pt-5 mb-5">
          
          <div class="col-12 col-md-6 col-xl-5 offset-xl-1 d-none d-md-block">
            <img class="product-figure product-figure-1 img-fluid" src="assets/images/product-figure-1.png" alt="" />
          </div>
          
            <div class="col-12 col-md-6 col-xl-5 pr-xl-3 pt-md-3">
            <div class="card rounded border-0 shadow-lg  mb-5">
              <div class="card-body p-4">
              <h5 class="card-title"><i class="far fa-chart-bar mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Lorem Ipsum</h5>
              <p class="card-text">List one of your product's main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank">Bootstrap 4 admin template Appify</a>. </p>
              <a href="#" >Learn more <span class="more-arrow">&rarr;</span></a>
            </div>
            </div><!--//card-->
            
            <div class="card rounded border-0 shadow-lg mb-5">
              <div class="card-body p-4">
              <h5 class="card-title"><i class="fas fa-laptop-code mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Consectetuer</h5>
              <p class="card-text">List one of your product's main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank">Bootstrap 4 admin template Appify</a>.</p>
              <a href="#" >Learn more <span class="more-arrow">&rarr;</span></a>
            </div>
            </div><!--//card-->
            <div class="card rounded border-0 shadow-lg">
              <div class="card-body p-4">
              <h5 class="card-title"><i class="far fa-calendar-alt mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Lorem Ipsum</h5>
              <p class="card-text">List one of your product's main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank">Bootstrap 4 admin template Appify</a>.</p>
              <a href="#" >Learn more <span class="more-arrow">&rarr;</span></a>
            </div>
            </div><!--//card-->
          </div>
          
          
        </div>
        
        <div class="row">
          <div class="col-12 col-md-6 col-xl-5 order-md-2 pr-xl-3 d-none d-md-block">
            <img class="product-figure product-figure-2 img-fluid" src="assets/images/product-figure-2.png" alt="" />
          </div>
          <div class="col-12 col-md-6 col-xl-5 order-md-1 offset-xl-1 pt-xl-5">
            <div class="card rounded border-0 shadow-lg  mb-5">
              <div class="card-body p-4">
              <h5 class="card-title"><i class="fas fa-microphone-alt mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Commodo</h5>
              <p class="card-text">List one of your product's main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank">Bootstrap 4 admin template Appify</a>. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. </p>
              <a href="#" >Learn more <span class="more-arrow">&rarr;</span></a>
            </div>
            </div><!--//card-->
            
            <div class="card rounded border-0 shadow-lg">
              <div class="card-body p-4">
              <h5 class="card-title"><i class="far fa-comments mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature  Ligula Eget</h5>
              <p class="card-text">List one of your product's main features here. Lorem ipsum dolor sit amet. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank">Bootstrap 4 admin template Appify</a>.</p>
              <a href="#" >Learn more <span class="more-arrow">&rarr;</span></a>
            </div>
            </div><!--//card-->
          </div>
         
        </div>
        
        <div class="pt-5 text-center">
          <a class="btn btn-primary theme-btn theme-btn-ghost font-weight-bold" href="#">View all features</a>
        </div>
      </div><!--//container-->
      
    </section><!--//features-section-->

    <section class="cta-section py-5 theme-bg-secondary text-center">
      <div class="container">
        <h3 class="text-white font-weight-bold mb-3">Ready to turn your visitors to app users?</h3>
        <div class="text-white mx-auto single-col-max-width section-intro">Try Nova Free Today. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
        <a class="btn theme-btn theme-btn-ghost theme-btn-on-bg mt-4" href="https://themes.3rdwavemedia.com/bootstrap-templates/free/nova-bootstrap-landing-page-template-for-mobile-apps/">Download  Now - It's FREE</a>
      </div>
    </section><!--//cta-section-->
    
    
    <section id="quote" class="testimonial-section py-5">
      <div class="container py-lg-5">
        <h3 class="mb-1 mb-md-5 text-center">Loved by thousands of app developers like you</h3>
        
        <div id="flipster-carousel" class="flipster-carousel pt-md-3">
          <div class="flip-items pb-5">
            <div class="flip-item text-center text-md-left">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Amazing App!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media flex-column flex-md-row">
                  <img class="source-profile rounded-circle mr-md-3 mx-auto mx-md-0" src="assets/images/users/user-1.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Tony Carter</div>
                    <div>London, UK</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Marvellous!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media ">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-2.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Helen Owens</div>
                    <div>New York, US</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Actually Impressive!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-3.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Scott Rivera</div>
                    <div>Florida, US</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Total Game Changer!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-4.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Charles Brewer</div>
                    <div>San Francisco, US</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Just Perfect!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-5.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Deborah Reed</div>
                    <div>Paris, France</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Great App!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-6.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Tony Cheng</div>
                    <div>San Francisco, US</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->
            
            <div class="flip-item">
              <div class="item-inner shadow-lg rounded">
                <h5 class="mb-2">Exceptional!</h5>
                <div class="ratings text-primary mb-3"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
                </div>
                <div class="source media">
                  <img class="source-profile rounded-circle mr-3" src="assets/images/users/user-7.jpg" alt="" />
                  <div class="source-info media-body pt-3">
                    <div>Kimberly Wells</div>
                    <div>London, UK</div>
                  </div>
                </div>
              </div><!--//item-inner-->
            </div><!--//flip-item-->

          </div><!--//items-wrapper-->    
          <div class="pt-5 text-center">
            <a class="btn btn-primary theme-btn font-weight-bold" href="https://themes.3rdwavemedia.com/bootstrap-templates/free/nova-bootstrap-landing-page-template-for-mobile-apps/">Try Nova Now</a>
          </div>
          
        </div>
      </div><!--//container-->
      
    </section><!--//testimonial-section-->
           
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

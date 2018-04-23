routes = [
  {
    path: '/',
    componentUrl: './pages/planningweek.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/planning/week/',
    componentUrl: './pages/planningweek.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      console.log('./pages/planningweek.html');
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader 
      app.preloader.show();

      // User ID from request
      //var userId = routeTo.params.userId;

      // Ajax Request
      app.request.json('/api/effectivetime?day=' + (new Date()).toISOString(), function (json) {
        console.log('JSON Result : ' + json);
        // Insert rendered template
        //$$('#lstChildren').html(compiledTemplate(json));
        var times = json;
        app.preloader.hide(); 

        resolve(
          {
            componentUrl: './pages/planningweek.html'
          },
          {
            context: {
              times: getSyntheticTrailingComments,
            }
          }
        )
      }); 
    },      
  },
  {
    path: '/planning/month/',
    componentUrl: './pages/planningmonth.html',
  },
  {
    path: '/children/',
    async: function (routeTo, routeFrom, resolve, reject) {
        console.log('./pages/children.html');
        // Router instance
        var router = this;
  
        // App instance
        var app = router.app;
  
        // Show Preloader 
        app.preloader.show();
  
        // User ID from request
        //var userId = routeTo.params.userId;
  
        // Ajax Request
        app.request.json('/api/Children', function (json) {
          console.log('JSON Result : ' + json);
          // Insert rendered template
          //$$('#lstChildren').html(compiledTemplate(json));
          var children = json;
          app.preloader.hide(); 

          resolve(
            {
              componentUrl: './pages/children.html'
            },
            {
              context: {
                children: children,
              }
            }
          )
        });       
    }, 
  },
  {
    path: '/child/',
    componentUrl: './pages/child.html'
  },
  {
    path: '/child/:childId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      console.log('./pages/child.html');
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var childId = routeTo.params.childId;

      // Ajax Request
      app.request.json('/api/child?id=' + childId, function (json) {
        console.log('Child JSON Result : ' + json);
        app.preloader.hide(); 

        resolve(
          {
            componentUrl: './pages/child.html'
          },
          {
            context: {
              child: json,
            }
          }
        )
      }); 
    }
  },
  {
    path: '/child/:childid/timeslot/',
    options: {
      context:{/*VERY IMPORTANT Else page.route.context does not work!!!!!!!!! keep it empty*/} 
    },
    componentUrl: './pages/timeslot.html',
  },
  {
    path: '/child/:childid/timeslot/:timeslotId/',
    options: {
      context:{/*VERY IMPORTANT Else page.route.context does not work!!!!!!!!! keep it empty*/} 
    },
    async: function (routeTo, routeFrom, resolve, reject) {
      console.log('./pages/timeslot.html');
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var timeslotId = routeTo.params.timeslotId;

      // Ajax Request
      app.request.json('/api/timeslot?id=' + timeslotId, function (json) {
        console.log('TimeSlot JSON Result : ' + json);
        app.preloader.hide(); 

        resolve(
          {
            componentUrl: './pages/timeslot.html'
          },
          {
            context: {
              timeslot: json,
            }
          }
        )
      }); 
    }
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];

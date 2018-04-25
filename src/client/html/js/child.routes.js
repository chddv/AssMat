childroutes = 
[
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
    }
]
;

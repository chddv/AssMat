homeroutes = [
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
    //componentUrl: './pages/planningweek.html',
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
      app.request.json('/api/effectivetime?day=' + (new Date()).getTime(), function (json) {
        console.log('/api/effectivetime JSON Result : ' + json);
        // Insert rendered template
        //$$('#lstChildren').html(compiledTemplate(json));
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var times = json;
        console.log(' JSON Result Length: ' + times.length);
        var prevDay = -1;
        var prevMonth = -1;
        var prevYear = -1; 
        var prevChild = -1;
        var vueDays = [];
        var vueDay = {};
        var vueChild = {};
        var vueTime = {};
        var indexDay = -1;
        // mettre en forme pour la form
        for(var i = 0; i < times.length; i++)
        {
          var dtDay = new Date(times[i].dtstart);
          var dtEnd = new Date(times[i].dtend);
          if(dtDay.getDate() == prevDay && dtDay.getMonth() == prevMonth && dtDay.getFullYear() == prevYear)
          {
            if(prevChild == times[i].child.id)
            {
              vueTime = {};
              vueTime.startHour = dtDay.getHours();
              vueTime.startMinute = dtDay.getMinutes();
              vueTime.endHour = dtEnd.getHours();
              vueTime.endMinute = dtEnd.getMinutes();
              vueChild.times.push(vueTime);
            }
            else
            {
              vueChild = {};
              vueChild.nom = times[i].child.firstname + ' ' + times[i].child.familyname;
              vueChild.times = [];
              vueTime = {};
              vueTime.startHour = dtDay.getHours();
              vueTime.startMinute = dtDay.getMinutes();
              vueTime.endHour = dtEnd.getHours();
              vueTime.endMinute = dtEnd.getMinutes();
              vueChild.times.push(vueTime);
              vueDay.children.push(vueChild);
            }
            prevChild = times[i].child.id
          }          
          else 
          {  
            vueDay = {};
            vueDay.nom = days[dtDay.getDay()];
            vueDay.children = [];
            vueDays.push(vueDay);
          }
          prevDay = dtDay.getDate();
          prevMonth = dtDay.getMonth();
          prevYear = dtDay.getFullYear();
        }
        app.preloader.hide(); 

        resolve(
          {
            componentUrl: './pages/planningweek.html'
          },
          {
            context: {
              vueDays: vueDays,
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

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

      var nowDay = new Date();
      nowDay.setToMidnight();
      // Ajax Request
      app.request.json('/api/effectivetime?day=' + nowDay.getTime(), function (json) {
        var times = json;
        var monday = nowDay.getMonday();
        var currentDay = monday.clone();
        var vueDays = [];
        for(var i = 0; i < 7; i++) // pour la semaine
        {
          // creation du jour
          var vueDay = {}; var vueChild = {};
          vueDay.nom = currentDay.getDayName() + ' ' + currentDay.getDate() + ' ' + currentDay.getMonthName() + ' ' + currentDay.getFullYear();
          vueDay.children = []; 
          vueDays.push(vueDay);
          var currentChildId = -1;
          // recupération des horaires pour ce jour
          for(var j = 0; j < times.length; j++)
          {            
            var dtDay = new Date(times[j].dtstart);
            var dtEnd = new Date(times[i].dtend);
            if(dtDay.isSameDay(currentDay)) // si horaire du jour en cour
            {
              if(currentChildId == times[j].child.id)
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
                vueChild.nom = times[j].child.firstname + ' ' + times[j].child.familyname;
                vueChild.times = [];
                vueDay.children.push(vueChild);
                vueTime = {};
                vueTime.startHour = dtDay.getHours();
                vueTime.startMinute = dtDay.getMinutes();
                vueTime.endHour = dtEnd.getHours();
                vueTime.endMinute = dtEnd.getMinutes();
                vueChild.times.push(vueTime);
              }
              currentChildId = times[j].child.id;
            }
          }
          currentDay.addDays(1);
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

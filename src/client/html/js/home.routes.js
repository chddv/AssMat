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
      moment.locale('fr');
      var  DefaultTimeZone = 'Europe/Paris';

      var nowDay = new Date();
      var nowDayM = moment.tz(nowDay, DefaultTimeZone).startOf('day');
      // Ajax Request
      app.request.json('/api/effectivetime?day=' + nowDayM.toDate().toISOString(), function (json) {        
        var times = json;
        var monday = nowDayM.clone().startOf('week');
        console.log("monday: " + monday.format());
        var currentDay = monday.clone();
        var vueDays = [];
        for(var i = 0; i < 7; i++) // pour la semaine
        {
          // creation du jour
          var vueDay = {}; var vueChild = {};
          vueDay.nom = currentDay.format('dddd D MMMM YYYY');
          console.log(vueDay.nom);
          vueDay.children = []; 
          vueDays.push(vueDay);
          var currentChildId = -1;
          // recupération des horaires pour ce jour
          for(var j = 0; j < times.length; j++)
          {  
            console.log("jsondtStart : "+times[j].dtstart + ", " + typeof times[j].dtstart);          
            var dtDay = moment.tz(times[j].dtstart, DefaultTimeZone);
            var dtEnd = moment.tz(times[i].dtend, DefaultTimeZone);
            if(dtDay.isSame(currentDay, 'day')) // si horaire du jour en cour
            {              
              if(currentChildId == times[j].child.id)
              {
                vueTime = {};
                vueTime.startHour = dtDay.get('hour');
                vueTime.startMinute = dtDay.get('minute');
                vueTime.endHour = dtEnd.get('hour');
                vueTime.endMinute = dtEnd.get('minute');
                vueChild.times.push(vueTime);
              }
              else 
              {
                vueChild = {};
                vueChild.nom = times[j].child.firstname + ' ' + times[j].child.familyname;                
                vueChild.times = [];
                vueDay.children.push(vueChild);
                vueTime = {};
                vueTime.startHour = dtDay.get('hour');
                vueTime.startMinute = dtDay.get('minute');
                vueTime.endHour = dtEnd.get('hour');
                vueTime.endMinute = dtEnd.get('minute');
                vueChild.times.push(vueTime);
              }
              currentChildId = times[j].child.id;
            }
          }
          currentDay.add(1, 'days');
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

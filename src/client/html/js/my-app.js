// Export selectors engine (jQuery ish )
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Ass Mat App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/',
            url: './index.html',
            name: 'home'
        },
        {
        path: '/about/',
        url: 'about.html',
        },
    ] 
    // ... other parameters
});

var mainView = app.views.create('.view-main');

// Select Template
var template = $$('#childrenItem-template').html();

// Compile and render
var compiledTemplate = Template7.compile(template);

function getChildren() {
    // Get JSON Data from UrbanDictionary API 
    app.request.json('http://192.168.1.2:3000/api/Children', function (json) {
        console.log(json);
        // Insert rendered template
        $$('#lstChildren').html(compiledTemplate(json))
    });
};

getChildren();


$$('#btnGetChildren').on('click', function(event) {
                //event.stopPropagation();
                console.log('btnGetChildren Onclick');
                getChildren();
            }); 
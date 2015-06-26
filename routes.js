Router.configure({
  routerTemplate: 'layout'
});

Router.map(function() {
  this.route('Home', {
    path: '/',
    template: 'home'
  });
});

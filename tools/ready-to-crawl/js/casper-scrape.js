/**
 * variables setup
 */
var BaseUrl = 'http://dev.tekkie.ro/tools/ready-to-crawl/index.html'; // 'http://localhost:8080/tools/ready-to-crawl/index.html';
var TestUser = {
  'email': 'patricia_hjieuwo_mockingbird@tfbnw.net',
  'pass': '1234'
};
var screenshotDefaults = { top: 0, left: 0, width: 1000, height: 1000 };
var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  pageSettings: {
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0'
  }
});

/*
 * utility methods for popup events
 */
casper.on('popup.created', function() {
    this.echo(">> url popup created: " + this.getCurrentUrl(), "INFO");
});

casper.on('popup.loaded', function() {
    this.echo(">> url popup loaded: " + this.getCurrentUrl(), "INFO");
});

/**
 * ----- SCRAPE SCENARIO -----
 */
casper.start(BaseUrl);

casper.then(function() {
  this.echo('Loaded homepage with title: ' + this.getTitle());

  this.echo('Taking picture 10.png of homepage', 'INFO_BAR');
  this.capture('10.png', screenshotDefaults);

  this.echo('Opening popup', 'INFO');
  this.clickLabel('Open Popup', 'a');
});

casper.waitForPopup(/popup\.html$/, function() {
  this.echo('Popups count: ' + this.popups.length);
}, function() {
  this.echo('failed to load popup', 'ERROR').exit();
}, 10000);

casper.withPopup(/popup\.html$/, function() {
  this.echo('Taking picture 20.png of the popup page', 'INFO_BAR');
  this.capture('20.png', screenshotDefaults);
});

casper.then(function() {
  this.echo("Current location is: " + this.getCurrentUrl());
  this.echo('Taking picture 30.png of homepage after returning to it', 'INFO_BAR');
  this.capture('30.png', screenshotDefaults);
});

casper.then(function() {
  // this.clickLabel('Login with Facebook', 'a');
  this.click('a[id="loginWithFb"]');
});

casper.waitForPopup(/facebook/, function() {
    console.log('clicked ok, new location is ' + this.getCurrentUrl());
    this.echo('Popups count: ' + this.popups.length);
}, 1000);

//PHANTOMJS WILL RUN THORUGH EVERYTHING VERY QUICKLY SO LET'S MAKE SURE WE GIVE THE APP SERVER TIME TO PROVIDE EVERYTHING
casper.wait(8000, function() {
  this.echo("Casper waited for 10 seconds to allow Facebook to redirect etc.");
});

casper.withPopup(/facebook/, function() {
  this.fill("form#login_form", {
    'email': TestUser.email,
    'pass': TestUser.pass
  }, false);

  this.capture('40-before-login-submit.png', screenshotDefaults);
  this.click("#u_0_2");

  this.capture('41-after-login-submit.png', screenshotDefaults);
});

casper.wait(10000, function() {
  this.echo("Casper waited for 10 seconds to allow Facebook to redirect etc.");
  this.echo("Current location is:" + this.getCurrentUrl());

  //TAKE A SCREENSHOT FOR DEBUG
  this.capture('50.png', screenshotDefaults);
});

casper.run();

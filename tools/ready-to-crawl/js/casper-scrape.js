/**
 * variables setup
 */
var BaseUrl = 'http://dev.tekkie.ro/tools/ready-to-crawl/index.html';
var screenshotDefaults = { top: 0, left: 0, width: 1000, height: 1000 };
var casper = require('casper').create({
  // verbose: true,
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

casper.run();

var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 };
page.open('http://localhost:3000/product/rkfO-N3JAof', function() {
    setTimeout(function() {
        page.render('mappes.png', {format: 'png', quality: '100'});
        phantom.exit();
    }, 200)
});

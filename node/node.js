var util   = require('util'),
    exec  = require('child_process').exec,
    child;

child = exec('growlnotify -m "Hello world"',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
const fs = require('node:fs');
const versionPath = "/" + process.argv[2]
console.log("New Path:", versionPath)
fs.readFile('/tmp/cf_dist_old.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const config = JSON.parse(data)
    process.env.CF_TEST = config.ETag
    fs.writeFile('/tmp/etag.txt', config.ETag, err => {
        if (err) {
          console.error(err);
        }
    })
    //update config originPath to latest version
    config.DistributionConfig.Origins.Items[0].OriginPath = versionPath;

    fs.writeFile('/tmp/cf_dist_new.json', JSON.stringify(config.DistributionConfig, null, 2), err => {
        if (err) {
          console.error(err);
        }
    })

  });
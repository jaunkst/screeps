const path = require('path');
const gitPullOrClone = require('git-pull-or-clone')
const vendorPath = path.resolve(__dirname, '..', 'vendor');

gitPullOrClone(
    'git@github.com:cazala/synaptic.git', path.resolve(vendorPath, 'synaptic'), (err) => {
  if (err) throw err
  console.log('SUCCESS!')
})

include apt

apt::ppa { 'ppa:chris-lea/node.js': }
->
package { 'nodejs':
    ensure => latest
}
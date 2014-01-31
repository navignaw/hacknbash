#!/usr/bin/env python

import base64
import getpass
import os
import socket
import sys
import traceback

import paramiko

# get hostname
hostname = 'unix.andrew.cmu.edu'

"""
if len(sys.argv) > 1:
    hostname = sys.argv[1]
    if hostname.find('@') >= 0:
        username, hostname = hostname.split('@')
else:
    hostname = raw_input('Hostname: ')
if len(hostname) == 0:
    print '*** Hostname required.'
    sys.exit(1)
port = 22
if hostname.find(':') >= 0:
    hostname, portstr = hostname.split(':')
    port = int(portstr)
"""
port = 22

# get username
username = ''
if len(sys.argv) > 1:
    username = sys.argv[1]
else:
    print 'usage is paramikoTest.py <username>'
    exit(1)

password = getpass.getpass('Password for %s@%s: ' % (username, hostname))

# now, connect and use paramiko Transport to negotiate SSH2 across the connection
try:
    t = paramiko.Transport((hostname, port))
    t.connect(username=username, password=password) 
    sftp = paramiko.SFTPClient.from_transport(t)

    # dirlist on remote host
    dirlist = sftp.listdir('.')
    print "Dirlist:", dirlist
    t.close()

except Exception, e:
    print '*** Caught exception: %s: %s' % (e.__class__, e)
    traceback.print_exc()
    try:
        t.close()
    except:
        pass
    sys.exit(1)
"""
if username == '':
    default_username = getpass.getuser()
    username = raw_input('Username [%s]: ' % default_username)
    if len(username) == 0:
        username = default_username
"""

"""
# get host key, if we know one
hostkeytype = None
hostkey = None
try:
    host_keys = paramiko.util.load_host_keys(os.path.expanduser('~/.ssh/known_hosts'))
except IOError:
    try:
        # try ~/ssh/ too, because windows can't have a folder named ~/.ssh/
        host_keys = paramiko.util.load_host_keys(os.path.expanduser('~/ssh/known_hosts'))
    except IOError:
        print '*** Unable to open host keys file'
        host_keys = {}

if host_keys.has_key(hostname):
    hostkeytype = host_keys[hostname].keys()[0]
    hostkey = host_keys[hostname][hostkeytype]
    print 'Using host key of type %s' % hostkeytype
"""

"""
    # copy the README back here
    data = sftp.open('demo_sftp_folder/README', 'r').read()
    open('README_demo_sftp', 'w').write(data)
    print 'copied README back here'

    # BETTER: use the get() and put() methods
    sftp.put('demo_sftp.py', 'demo_sftp_folder/demo_sftp.py')
    sftp.get('demo_sftp_folder/README', 'README_demo_sftp')
"""

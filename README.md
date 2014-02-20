hacknbash
=========

TartanHacks 2014 Project - Hack 'n Bash, the RPFTG (Role-Playing File Transfer Game)


Activating Virtual Env
-------------------------
Run *./setup* from a bash shell

or you can manually run these setup commands needed each time a new terminal session is started:
Linux:
```
. venv/bin/activate
```

Windows:
```
venv/scripts/activate
```


Running development server
--------------------------
To run the development server, simply run `python server.py`, then navigate to http://localhost:5000 on a web browser.


Installing packages
-------------------
From the command line, run the following once:
```
pip install Flask
pip install pyfstp
```

On Windows, *pyfstp* requires a compiler. [Visual Studio C++ 2008](http://go.microsoft.com/?linkid=7729279) is recommended.

For Heroku access, an additional package *gunicorn* is required, and can be installed with
```
pip install gunicorn
```


Pushing to Heroku
-----------------
First, ensure that debug mode is disabled in *server.py*. If any new packages have been installed, run:
```
pip freeze > requirements.txt
```

After committing, ensure that a remote to Heroku exists. Otherwise, run:
```
heroku git:remote -a aqueous-fjord-6745
```

Finally, the code can be deployed using the command
```
git push heroku master
```

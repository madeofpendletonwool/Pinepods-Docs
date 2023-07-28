# Using Clients in Pinepods

### Linux Client Install :computer:

Any of the client additions are super easy to get going. First head over to the releases page on Github

https://github.com/madeofpendletonwool/PinePods/releases

Grab the pinepods.tar file from the newest release. 

Extract, and then within the extracted folder you'll find an install.sh file. This file simply drops the icon file, and binary in place then installs a .desktop file so your computer will pick up on the app. Ensure the install file has executable permission

```
cd /pinepods/folder/location
chmod +x ./install.sh
```

Then run
```
./install.sh
```

From there, you should be able to search your computer for pinepods and find the client installed as long as your desktop environment supports .desktop files. Otherwise, you can also just run the 'pinepods' file from within the folder directory.

Once started you'll need to connect to your server and provide an api key. You can create an api key from the web version of the app. Go to settings and then scroll to the bottom. You'll see where you can generate a new key. Copy that, and put it in the api key textfield. 

Your server name is where the api server port comes in. 
```
    # API Server Port - Needed for Client Connections
      - "8032:8032"
```

So in my case running on my local computer I could enter http://localhost:8032

If you create a reverse proxy to that port you might enter https://api.mysite.com

### Windows Client Install :computer:

Any of the client additions are super easy to get going. First head over to the releases page on Github

https://github.com/madeofpendletonwool/PinePods/releases

Grab the Pinepods-Windows.zip file from the newest release. 

Simply extract, and then run.



Once started you'll need to connect to your server and provide an api key. You can create an api key from the web version of the app. Go to settings and then scroll to the bottom. You'll see where you can generate a new key. Copy that, and put it in the api key textfield. 

Your server name is where the api server port comes in. 
```
    # API Server Port - Needed for Client Connections
      - "8032:8032"
```

So in my case running on my local computer I could enter http://localhost:8032

If you create a reverse proxy to that port you might enter https://api.mysite.com

### Mac Client Install :computer:

Any of the client additions are super easy to get going. First head over to the releases page on Github

https://github.com/madeofpendletonwool/PinePods/releases

Grab the Pinepods-Mac.zip file from the newest release. 

Simply extract, and then go into Contents/MacOS. From there you can run the app.

You can also place the pinepods app right into your application folder on your mac. Just drag 'pinepods' right in. 

Once started you'll need to connect to your server and provide an api key. You can create an api key from the web version of the app. Go to settings and then scroll to the bottom. You'll see where you can generate a new key. Copy that, and put it in the api key textfield. 

Your server name is where the api server port comes in. 
```
    # API Server Port - Needed for Client Connections
      - "8032:8032"
```

So in my case running on my local computer I could enter http://localhost:8032

If you create a reverse proxy to that port you might enter https://api.mysite.com

### Android Install :iphone:

Coming Soon

### ios Install :iphone:

Coming Soon
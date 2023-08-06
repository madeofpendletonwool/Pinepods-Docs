# Pinepods-Docs

<img src="https://discordapp.com/api/guilds/1134490753012334592/widget.png?style=shield" alt="Pinepods Discord"/>

This is the documentation site for PinePods. Built with Docusaurus 2.

Run with 

```
sudo docker run -d --name=docusaurus \
-p 80:80 \
-v /home/myuser/docusaurus/config:/docusaurus \
-e TARGET_UID=1000 \
-e TARGET_GID=1000 \
-e AUTO_UPDATE=true \
-e WEBSITE_NAME="pinepods-docs" \
-e TEMPLATE=classic \
awesometic/docusaurus
```
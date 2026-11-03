# API Keys

An API key signs a program in to Pinepods as you, with the same access your account has. Use one for scripts, for the [API](../API/api_intro.md), or for apps that ask for a key instead of a password.

Manage them under **Settings → API Keys**.

## Creating a key

Click **Request API Key**. The new key is shown once, in **New Api Key Created**. Copy it somewhere safe; you can't view it again. If you lose it, create a new one and delete the old.

## The key list

The table shows each key's **API ID**, **Last 4 Digits**, **Date Created** and **User**. You see your own keys; admins see every user's keys.

Signing in to the web, desktop or mobile app uses one of your existing keys, or creates one if you have none, and the app keeps using it. Deleting a key an app is using signs that app out.

## Deleting a key

Click a key, then **Delete**. Anything using it stops working at once. This can't be undone.

:::tip
Apps that sync through the [PinePods gpodder server](../tutorial-extras/gpodder-sync.md) (AntennaPod, Kasts and others) use app passwords, not API keys.
:::

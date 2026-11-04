# PodPeopleDB

[PodPeopleDB](https://podpeopledb.com) is a community database of podcast hosts and guests. It fills in people for podcasts whose feeds don't use the Podcasting 2.0 `<podcast:person>` tag. Pinepods syncs credits from it in the background and shows them next to the ones from feeds. See [People](../Features/Person.md) for how they appear in the app.

## Adding people

You don't need to leave Pinepods. On a podcast or episode page, click **Add people**, enter the names and roles, and click **Add**. Your additions go to PodPeopleDB, show up for every Pinepods user, and are marked as unverified until someone reviews them.

Podcasts whose feeds already list their people with `<podcast:person>` get them from the feed:

```xml
<podcast:person role="host" img="http://example.com/host.jpg">Jane Smith</podcast:person>
```

## Your own instance

Pinepods uses the PodPeopleDB at `PEOPLE_API_URL` (`https://people.pinepods.online` in the example compose files). PodPeopleDB is open source; to run your own, see [its self-hosting docs](https://podpeopledb.com/docs/self-host) and point `PEOPLE_API_URL` at it. The Helm chart can deploy one for you (`podpeople.enabled`).

To stop syncing credits from PodPeopleDB altogether, set `PEOPLE_SYNC_ENABLED=false`. Credits from feeds keep working.
